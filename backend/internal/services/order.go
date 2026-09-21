package services

import (
	"context"
	"errors"
	"fmt"
	"go-grpc-react-ecommerce/backend/internal/database"
	"go-grpc-react-ecommerce/backend/pb"
	"log"
	"os"
	"time"

	"github.com/google/uuid"
	"github.com/midtrans/midtrans-go"
	"github.com/midtrans/midtrans-go/snap"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
)

type OrderService struct {
	MidtransServerKey string
	snapClient        snap.Client
}

func NewOrderService() *OrderService {
	// Fallback sandbox server key if environment variable is not set
	serverKey := os.Getenv("MIDTRANS_SERVER_KEY")
	if serverKey == "" {
		serverKey = "Mid-server-yxxxxxxxxxxxxxxx" // Example sandbox key
		log.Println("[WARNING] MIDTRANS_SERVER_KEY is not set. Using sandbox mock server key.")
	}

	sc := snap.Client{}
	sc.New(serverKey, midtrans.Sandbox)

	return &OrderService{
		MidtransServerKey: serverKey,
		snapClient:        sc,
	}
}

func (s *OrderService) CreateOrder(ctx context.Context, req *pb.CreateOrderRequest) (*pb.CreateOrderResponse, error) {
	if req.UserId <= 0 {
		return nil, status.Error(codes.InvalidArgument, "Invalid user ID")
	}

	var user database.User
	if err := database.DB.First(&user, req.UserId).Error; err != nil {
		return nil, status.Errorf(codes.NotFound, "User not found")
	}

	// 1. Fetch Cart Items
	var cartItems []database.CartItem
	err := database.DB.Preload("Product").Where("user_id = ?", req.UserId).Find(&cartItems).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to load cart items: %v", err)
	}

	if len(cartItems) == 0 {
		return nil, status.Error(codes.FailedPrecondition, "Cart is empty")
	}

	// 2. Start Database Transaction
	var orderID string
	var totalAmount float64 = 0.0
	var snapToken string
	var redirectURL string

	err = database.DB.Transaction(func(tx *gorm.DB) error {
		orderID = fmt.Sprintf("ORDER-%d-%s", req.UserId, uuid.New().String()[:8])

		// Calculate total and deduct stock
		var orderItems []database.OrderItem
		var midtransItems []midtrans.ItemDetails

		for _, ci := range cartItems {
			if ci.Product.Stock < ci.Quantity {
				return fmt.Errorf("insufficient stock for product %s (requested: %d, available: %d)",
					ci.Product.Name, ci.Quantity, ci.Product.Stock)
			}

			// Deduct stock
			newStock := ci.Product.Stock - ci.Quantity
			if err := tx.Model(&ci.Product).Update("stock", newStock).Error; err != nil {
				return fmt.Errorf("failed to update stock: %w", err)
			}

			itemPrice := ci.Product.Price
			totalAmount += itemPrice * float64(ci.Quantity)

			orderItems = append(orderItems, database.OrderItem{
				OrderID:   orderID,
				ProductID: ci.ProductID,
				Quantity:  ci.Quantity,
				Price:     itemPrice,
			})

			midtransItems = append(midtransItems, midtrans.ItemDetails{
				ID:    fmt.Sprintf("PROD-%d", ci.ProductID),
				Name:  ci.Product.Name,
				Price: int64(itemPrice),
				Qty:   int32(ci.Quantity),
			})
		}

		// Save Order
		newOrder := database.Order{
			ID:          orderID,
			UserID:      uint(req.UserId),
			TotalAmount: totalAmount,
			Status:      "pending",
			CreatedAt:   time.Now(),
		}
		if err := tx.Create(&newOrder).Error; err != nil {
			return fmt.Errorf("failed to create order record: %w", err)
		}

		// Save Order Items
		for i := range orderItems {
			if err := tx.Create(&orderItems[i]).Error; err != nil {
				return fmt.Errorf("failed to save order item: %w", err)
			}
		}

		// Clear Cart
		if err := tx.Where("user_id = ?", req.UserId).Delete(&database.CartItem{}).Error; err != nil {
			return fmt.Errorf("failed to clear cart: %w", err)
		}

		// 3. Request Midtrans Snap Token
		snapReq := &snap.Request{
			TransactionDetails: midtrans.TransactionDetails{
				OrderID:  orderID,
				GrossAmt: int64(totalAmount),
			},
			CustomerDetail: &midtrans.CustomerDetails{
				FName: user.Name,
				Email: user.Email,
			},
			Items: &midtransItems,
		}

		snapResp, midtransErr := s.snapClient.CreateTransaction(snapReq)
		if midtransErr != nil {
			log.Printf("[Midtrans Error] Failed to generate snap token: %v", midtransErr)
			// We won't roll back DB transaction if Midtrans fails, but we'll flag it.
			// Actually, to keep database consistency, if Midtrans fails, we return error so the transaction rolls back.
			return fmt.Errorf("midtrans error: %v", midtransErr.Message)
		}

		snapToken = snapResp.Token
		redirectURL = snapResp.RedirectURL

		// Update snap token in order
		if err := tx.Model(&newOrder).Update("snap_token", snapToken).Error; err != nil {
			return fmt.Errorf("failed to save snap token: %w", err)
		}

		return nil
	})

	if err != nil {
		return nil, status.Errorf(codes.Internal, "Checkout failed: %v", err)
	}

	return &pb.CreateOrderResponse{
		OrderId:     orderID,
		TotalAmount: totalAmount,
		Status:      "pending",
		SnapToken:   snapToken,
		RedirectUrl: redirectURL,
	}, nil
}

func (s *OrderService) GetOrder(ctx context.Context, req *pb.GetOrderRequest) (*pb.OrderResponse, error) {
	if req.OrderId == "" {
		return nil, status.Error(codes.InvalidArgument, "Order ID is required")
	}

	var dbOrder database.Order
	err := database.DB.Preload("OrderItems.Product").First(&dbOrder, "id = ?", req.OrderId).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, status.Error(codes.NotFound, "Order not found")
	} else if err != nil {
		return nil, status.Errorf(codes.Internal, "Database error: %v", err)
	}

	var pbItems []*pb.OrderItem
	for _, item := range dbOrder.OrderItems {
		pbItems = append(pbItems, &pb.OrderItem{
			ProductId:   int64(item.ProductID),
			ProductName: item.Product.Name,
			Quantity:    item.Quantity,
			Price:       item.Price,
		})
	}

	return &pb.OrderResponse{
		OrderId:     dbOrder.ID,
		UserId:      int64(dbOrder.UserID),
		TotalAmount: dbOrder.TotalAmount,
		Status:      dbOrder.Status,
		SnapToken:   dbOrder.SnapToken,
		Items:       pbItems,
		CreatedAt:   dbOrder.CreatedAt.Format(time.RFC3339),
	}, nil
}

func (s *OrderService) UpdateOrderStatus(ctx context.Context, req *pb.UpdateOrderStatusRequest) (*pb.UpdateOrderStatusResponse, error) {
	if req.OrderId == "" || req.Status == "" {
		return nil, status.Error(codes.InvalidArgument, "Order ID and status are required")
	}

	var dbOrder database.Order
	err := database.DB.First(&dbOrder, "id = ?", req.OrderId).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, status.Error(codes.NotFound, "Order not found")
	} else if err != nil {
		return nil, status.Errorf(codes.Internal, "Database error: %v", err)
	}

	// Update order status
	dbOrder.Status = req.Status
	if err := database.DB.Save(&dbOrder).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to update order: %v", err)
	}

	// Restore stock if order is expired, canceled, or failed
	if req.Status == "expire" || req.Status == "cancel" || req.Status == "deny" {
		var items []database.OrderItem
		database.DB.Where("order_id = ?", req.OrderId).Find(&items)
		for _, item := range items {
			var prod database.Product
			if err := database.DB.First(&prod, item.ProductID).Error; err == nil {
				database.DB.Model(&prod).Update("stock", prod.Stock+item.Quantity)
			}
		}
	}

	return &pb.UpdateOrderStatusResponse{
		Message: fmt.Sprintf("Order %s updated to status %s", req.OrderId, req.Status),
	}, nil
}
