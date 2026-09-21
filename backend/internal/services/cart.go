package services

import (
	"context"
	"errors"
	"go-grpc-react-ecommerce/backend/internal/database"
	"go-grpc-react-ecommerce/backend/pb"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
)

type CartService struct{}

func (s *CartService) getCartResponse(userID int64) (*pb.CartResponse, error) {
	var items []database.CartItem
	err := database.DB.Preload("Product").Where("user_id = ?", userID).Find(&items).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to load cart items: %v", err)
	}

	var pbItems []*pb.CartItem
	var totalPrice float64 = 0.0

	for _, item := range items {
		itemTotal := item.Product.Price * float64(item.Quantity)
		totalPrice += itemTotal

		pbItems = append(pbItems, &pb.CartItem{
			Id:           int64(item.ID),
			ProductId:    int64(item.ProductID),
			ProductName:  item.Product.Name,
			ProductPrice: item.Product.Price,
			ProductImage: item.Product.ImageURL,
			Quantity:     item.Quantity,
		})
	}

	return &pb.CartResponse{
		Items:      pbItems,
		TotalPrice: totalPrice,
	}, nil
}

func (s *CartService) GetCart(ctx context.Context, req *pb.GetCartRequest) (*pb.CartResponse, error) {
	if req.UserId <= 0 {
		return nil, status.Error(codes.InvalidArgument, "Invalid user ID")
	}
	return s.getCartResponse(req.UserId)
}

func (s *CartService) AddToCart(ctx context.Context, req *pb.AddToCartRequest) (*pb.CartResponse, error) {
	if req.UserId <= 0 || req.ProductId <= 0 || req.Quantity <= 0 {
		return nil, status.Error(codes.InvalidArgument, "Invalid inputs")
	}

	// Verify product exists and has stock
	var prod database.Product
	err := database.DB.First(&prod, req.ProductId).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, status.Error(codes.NotFound, "Product not found")
	} else if err != nil {
		return nil, status.Errorf(codes.Internal, "Database error: %v", err)
	}

	if prod.Stock < req.Quantity {
		return nil, status.Errorf(codes.FailedPrecondition, "Insufficient product stock. Available: %d", prod.Stock)
	}

	// Check if item already in cart
	var cartItem database.CartItem
	err = database.DB.Where("user_id = ? AND product_id = ?", req.UserId, req.ProductId).First(&cartItem).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		cartItem = database.CartItem{
			UserID:    uint(req.UserId),
			ProductID: uint(req.ProductId),
			Quantity:  req.Quantity,
		}
		if err := database.DB.Create(&cartItem).Error; err != nil {
			return nil, status.Errorf(codes.Internal, "Failed to add to cart: %v", err)
		}
	} else if err == nil {
		newQty := cartItem.Quantity + req.Quantity
		if prod.Stock < newQty {
			return nil, status.Errorf(codes.FailedPrecondition, "Insufficient product stock. Available: %d, in cart: %d", prod.Stock, cartItem.Quantity)
		}
		cartItem.Quantity = newQty
		if err := database.DB.Save(&cartItem).Error; err != nil {
			return nil, status.Errorf(codes.Internal, "Failed to update quantity: %v", err)
		}
	} else {
		return nil, status.Errorf(codes.Internal, "Database error: %v", err)
	}

	return s.getCartResponse(req.UserId)
}

func (s *CartService) UpdateCartItem(ctx context.Context, req *pb.UpdateCartItemRequest) (*pb.CartResponse, error) {
	if req.UserId <= 0 || req.ProductId <= 0 {
		return nil, status.Error(codes.InvalidArgument, "Invalid inputs")
	}

	var cartItem database.CartItem
	err := database.DB.Where("user_id = ? AND product_id = ?", req.UserId, req.ProductId).First(&cartItem).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, status.Error(codes.NotFound, "Item not found in cart")
	} else if err != nil {
		return nil, status.Errorf(codes.Internal, "Database error: %v", err)
	}

	if req.Quantity <= 0 {
		// Remove item if quantity set to 0 or less
		if err := database.DB.Delete(&cartItem).Error; err != nil {
			return nil, status.Errorf(codes.Internal, "Failed to remove item: %v", err)
		}
	} else {
		// Verify product stock
		var prod database.Product
		if err := database.DB.First(&prod, req.ProductId).Error; err != nil {
			return nil, status.Errorf(codes.Internal, "Failed to verify product: %v", err)
		}
		if prod.Stock < req.Quantity {
			return nil, status.Errorf(codes.FailedPrecondition, "Insufficient stock. Available: %d", prod.Stock)
		}

		cartItem.Quantity = req.Quantity
		if err := database.DB.Save(&cartItem).Error; err != nil {
			return nil, status.Errorf(codes.Internal, "Failed to update quantity: %v", err)
		}
	}

	return s.getCartResponse(req.UserId)
}

func (s *CartService) RemoveFromCart(ctx context.Context, req *pb.RemoveFromCartRequest) (*pb.CartResponse, error) {
	if req.UserId <= 0 || req.ProductId <= 0 {
		return nil, status.Error(codes.InvalidArgument, "Invalid inputs")
	}

	err := database.DB.Where("user_id = ? AND product_id = ?", req.UserId, req.ProductId).Delete(&database.CartItem{}).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to delete item from cart: %v", err)
	}

	return s.getCartResponse(req.UserId)
}

func (s *CartService) ClearCart(ctx context.Context, req *pb.ClearCartRequest) (*pb.ClearCartResponse, error) {
	if req.UserId <= 0 {
		return nil, status.Error(codes.InvalidArgument, "Invalid user ID")
	}

	err := database.DB.Where("user_id = ?", req.UserId).Delete(&database.CartItem{}).Error
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to clear cart: %v", err)
	}

	return &pb.ClearCartResponse{
		Message: "Cart cleared successfully",
	}, nil
}
