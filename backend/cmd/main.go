package main

import (
	"context"
	"go-grpc-react-ecommerce/backend/internal/database"
	"go-grpc-react-ecommerce/backend/internal/gateway"
	"go-grpc-react-ecommerce/backend/internal/services"
	"go-grpc-react-ecommerce/backend/pb"
	"log"
	"net"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"

	"google.golang.org/grpc"
)

func main() {
	log.Println("Starting Full-Stack Go + gRPC + ReactJS E-Commerce Server...")

	// 1. Initialize SQLite Database
	dbPath := "ecommerce.db"
	log.Printf("Connecting to SQLite database: %s", dbPath)
	database.InitDB(dbPath)

	// 2. Start gRPC Server on port 50051
	grpcListener, err := net.Listen("tcp", ":50051")
	if err != nil {
		log.Fatalf("Failed to listen on port 50051: %v", err)
	}

	grpcServer := grpc.NewServer()

	// Register Services
	pb.RegisterAuthServiceServer(grpcServer, &services.AuthService{})
	pb.RegisterProductServiceServer(grpcServer, &services.ProductService{})
	pb.RegisterCartServiceServer(grpcServer, &services.CartService{})
	pb.RegisterOrderServiceServer(grpcServer, services.NewOrderService())

	go func() {
		log.Println("gRPC Server listening on port :50051...")
		if err := grpcServer.Serve(grpcListener); err != nil {
			log.Printf("gRPC server error: %v", err)
		}
	}()

	// Give the gRPC server a moment to start up
	time.Sleep(500 * time.Millisecond)

	// 3. Start REST API Gateway on port 8080
	gw := gateway.NewGateway("localhost:50051")
	defer gw.Close()

	httpServer := &http.Server{
		Addr:    ":8080",
		Handler: gw.Router(),
	}

	go func() {
		log.Println("HTTP API Gateway listening on port :8080...")
		if err := httpServer.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatalf("Failed to start HTTP gateway: %v", err)
		}
	}()

	// 4. Graceful Shutdown
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
	<-quit
	log.Println("Shutting down servers...")

	// Shutdown HTTP gateway
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()
	if err := httpServer.Shutdown(ctx); err != nil {
		log.Printf("HTTP Gateway shutdown error: %v", err)
	}

	// Shutdown gRPC server
	grpcServer.GracefulStop()
	log.Println("Server stopped successfully.")
}
