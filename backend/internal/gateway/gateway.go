package gateway

import (
	"context"
	"encoding/json"
	"go-grpc-react-ecommerce/backend/pb"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"
)

type Gateway struct {
	authClient    pb.AuthServiceClient
	productClient pb.ProductServiceClient
	cartClient    pb.CartServiceClient
	orderClient   pb.OrderServiceClient
	grpcConn      *grpc.ClientConn
}

type contextKey string

const userContextKey contextKey = "user"

type UserContext struct {
	UserID int64
	Email  string
	Name   string
}

func NewGateway(grpcAddr string) *Gateway {
	conn, err := grpc.Dial(grpcAddr,
		grpc.WithTransportCredentials(insecure.NewCredentials()),
	)
	if err != nil {
		log.Fatalf("Gateway failed to connect to gRPC server: %v", err)
	}

	return &Gateway{
		authClient:    pb.NewAuthServiceClient(conn),
		productClient: pb.NewProductServiceClient(conn),
		cartClient:    pb.NewCartServiceClient(conn),
		orderClient:   pb.NewOrderServiceClient(conn),
		grpcConn:      conn,
	}
}

func (g *Gateway) Close() {
	if g.grpcConn != nil {
		g.grpcConn.Close()
	}
}

// Router sets up Chi HTTP router with middleware and handlers
func (g *Gateway) Router() http.Handler {
	r := chi.NewRouter()

	r.Use(middleware.RequestID)
	r.Use(middleware.RealIP)
	r.Use(middleware.Logger)
	r.Use(middleware.Recoverer)

	// Configure CORS
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:5173", "http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type", "X-CSRF-Token"},
		ExposedHeaders:   []string{"Link"},
		AllowCredentials: true,
		MaxAge:           300,
	}))

	r.Route("/api", func(r chi.Router) {
		// Public Auth
		r.Post("/auth/register", g.handleRegister)
		r.Post("/auth/login", g.handleLogin)

		// Public Products
		r.Get("/products", g.handleListProducts)
		r.Get("/products/{id}", g.handleGetProduct)

		// Midtrans Webhook (Unauthenticated)
		r.Post("/payment/notification", g.handleMidtransNotification)

		// Authenticated Routes
		r.Group(func(r chi.Router) {
			r.Use(g.authMiddleware)

			// Cart
			r.Get("/cart", g.handleGetCart)
			r.Post("/cart", g.handleAddToCart)
			r.Put("/cart", g.handleUpdateCartItem)
			r.Delete("/cart/{productId}", g.handleRemoveFromCart)

			// Order
			r.Post("/checkout", g.handleCheckout)
			r.Get("/orders/{id}", g.handleGetOrder)
		})
	})

	return r
}

// Middleware to authorize JWT tokens
func (g *Gateway) authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, `{"error": "Authorization header required"}`, http.StatusUnauthorized)
			return
		}

		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, `{"error": "Authorization format must be Bearer <token>"}`, http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		resp, err := g.authClient.ValidateToken(ctx, &pb.ValidateTokenRequest{Token: tokenString})
		if err != nil || !resp.Valid {
			http.Error(w, `{"error": "Invalid or expired token"}`, http.StatusUnauthorized)
			return
		}

		userCtx := UserContext{
			UserID: resp.UserId,
			Email:  resp.Email,
			Name:   resp.Name,
		}

		r = r.WithContext(context.WithValue(r.Context(), userContextKey, userCtx))
		next.ServeHTTP(w, r)
	})
}

func getUserFromContext(ctx context.Context) (UserContext, bool) {
	u, ok := ctx.Value(userContextKey).(UserContext)
	return u, ok
}

// Handlers

func (g *Gateway) handleRegister(w http.ResponseWriter, r *http.Request) {
	var body pb.RegisterRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	resp, err := g.authClient.Register(ctx, &body)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusCreated, resp)
}

func (g *Gateway) handleLogin(w http.ResponseWriter, r *http.Request) {
	var body pb.LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	resp, err := g.authClient.Login(ctx, &body)
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func (g *Gateway) handleListProducts(w http.ResponseWriter, r *http.Request) {
	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	resp, err := g.productClient.ListProducts(ctx, &pb.ListProductsRequest{})
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, resp.Products)
}

func (g *Gateway) handleGetProduct(w http.ResponseWriter, r *http.Request) {
	idStr := chi.URLParam(r, "id")
	id, err := strconv.ParseInt(idStr, 10, 64)
	if err != nil {
		http.Error(w, `{"error": "Invalid product ID"}`, http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	resp, err := g.productClient.GetProduct(ctx, &pb.GetProductRequest{Id: id})
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func (g *Gateway) handleGetCart(w http.ResponseWriter, r *http.Request) {
	user, _ := getUserFromContext(r.Context())

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	resp, err := g.cartClient.GetCart(ctx, &pb.GetCartRequest{UserId: user.UserID})
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func (g *Gateway) handleAddToCart(w http.ResponseWriter, r *http.Request) {
	user, _ := getUserFromContext(r.Context())

	var body struct {
		ProductID int64 `json:"product_id"`
		Quantity  int32 `json:"quantity"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	resp, err := g.cartClient.AddToCart(ctx, &pb.AddToCartRequest{
		UserId:    user.UserID,
		ProductId: body.ProductID,
		Quantity:  body.Quantity,
	})
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func (g *Gateway) handleUpdateCartItem(w http.ResponseWriter, r *http.Request) {
	user, _ := getUserFromContext(r.Context())

	var body struct {
		ProductID int64 `json:"product_id"`
		Quantity  int32 `json:"quantity"`
	}
	if err := json.NewDecoder(r.Body).Decode(&body); err != nil {
		http.Error(w, `{"error": "Invalid request body"}`, http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	resp, err := g.cartClient.UpdateCartItem(ctx, &pb.UpdateCartItemRequest{
		UserId:    user.UserID,
		ProductId: body.ProductID,
		Quantity:  body.Quantity,
	})
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func (g *Gateway) handleRemoveFromCart(w http.ResponseWriter, r *http.Request) {
	user, _ := getUserFromContext(r.Context())
	prodIDStr := chi.URLParam(r, "productId")
	prodID, err := strconv.ParseInt(prodIDStr, 10, 64)
	if err != nil {
		http.Error(w, `{"error": "Invalid product ID"}`, http.StatusBadRequest)
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	resp, err := g.cartClient.RemoveFromCart(ctx, &pb.RemoveFromCartRequest{
		UserId:    user.UserID,
		ProductId: prodID,
	})
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

func (g *Gateway) handleCheckout(w http.ResponseWriter, r *http.Request) {
	user, _ := getUserFromContext(r.Context())

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	resp, err := g.orderClient.CreateOrder(ctx, &pb.CreateOrderRequest{UserId: user.UserID})
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusCreated, resp)
}

func (g *Gateway) handleGetOrder(w http.ResponseWriter, r *http.Request) {
	orderID := chi.URLParam(r, "id")

	ctx, cancel := context.WithTimeout(r.Context(), 5*time.Second)
	defer cancel()

	resp, err := g.orderClient.GetOrder(ctx, &pb.GetOrderRequest{OrderId: orderID})
	if err != nil {
		writeError(w, err)
		return
	}

	writeJSON(w, http.StatusOK, resp)
}

// handleMidtransNotification acts as the callback webhook for Midtrans sandbox to update payments
func (g *Gateway) handleMidtransNotification(w http.ResponseWriter, r *http.Request) {
	var notificationPayload map[string]interface{}
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, `{"error": "Failed to read request body"}`, http.StatusBadRequest)
		return
	}
	defer r.Body.Close()

	if err := json.Unmarshal(body, &notificationPayload); err != nil {
		http.Error(w, `{"error": "Invalid notification JSON"}`, http.StatusBadRequest)
		return
	}

	orderID, ok := notificationPayload["order_id"].(string)
	if !ok || orderID == "" {
		http.Error(w, `{"error": "Missing order_id in notification"}`, http.StatusBadRequest)
		return
	}

	transactionStatus, ok := notificationPayload["transaction_status"].(string)
	if !ok {
		http.Error(w, `{"error": "Missing transaction_status"}`, http.StatusBadRequest)
		return
	}

	log.Printf("[Midtrans Webhook] Received notification for Order %s: status = %s", orderID, transactionStatus)

	// Map Midtrans status values to simple database-friendly status strings
	// capture: paid (for card), settlement: paid, pending: pending, deny/expire/cancel: canceled
	mappedStatus := "pending"
	switch transactionStatus {
	case "capture":
		fraudStatus, _ := notificationPayload["fraud_status"].(string)
		if fraudStatus == "accept" {
			mappedStatus = "paid"
		} else {
			mappedStatus = "deny"
		}
	case "settlement":
		mappedStatus = "paid"
	case "pending":
		mappedStatus = "pending"
	case "deny", "expire", "cancel":
		mappedStatus = transactionStatus
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err = g.orderClient.UpdateOrderStatus(ctx, &pb.UpdateOrderStatusRequest{
		OrderId: orderID,
		Status:  mappedStatus,
	})
	if err != nil {
		log.Printf("[Midtrans Webhook Error] Failed to update status in DB: %v", err)
		http.Error(w, `{"error": "Failed to update status"}`, http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write([]byte(`{"message": "Webhook processed successfully"}`))
}

// Helper write utilities

func writeJSON(w http.ResponseWriter, status int, data interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(data)
}

func writeError(w http.ResponseWriter, err error) {
	w.Header().Set("Content-Type", "application/json")
	// Translate gRPC status to HTTP status code
	w.WriteHeader(http.StatusInternalServerError)
	json.NewEncoder(w).Encode(map[string]string{"error": err.Error()})
}
