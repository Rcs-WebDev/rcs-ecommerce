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

type ProductService struct{}

func (s *ProductService) ListProducts(ctx context.Context, req *pb.ListProductsRequest) (*pb.ListProductsResponse, error) {
	var dbProducts []database.Product
	if err := database.DB.Find(&dbProducts).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to fetch products: %v", err)
	}

	var pbProducts []*pb.Product
	for _, dp := range dbProducts {
		pbProducts = append(pbProducts, &pb.Product{
			Id:          int64(dp.ID),
			Name:        dp.Name,
			Description: dp.Description,
			Price:       dp.Price,
			Stock:       dp.Stock,
			ImageUrl:    dp.ImageURL,
			Category:    dp.Category,
		})
	}

	return &pb.ListProductsResponse{
		Products: pbProducts,
	}, nil
}

func (s *ProductService) GetProduct(ctx context.Context, req *pb.GetProductRequest) (*pb.Product, error) {
	if req.Id <= 0 {
		return nil, status.Error(codes.InvalidArgument, "Invalid product ID")
	}

	var dp database.Product
	err := database.DB.First(&dp, req.Id).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, status.Error(codes.NotFound, "Product not found")
	} else if err != nil {
		return nil, status.Errorf(codes.Internal, "Database error: %v", err)
	}

	return &pb.Product{
		Id:          int64(dp.ID),
		Name:        dp.Name,
		Description: dp.Description,
		Price:       dp.Price,
		Stock:       dp.Stock,
		ImageUrl:    dp.ImageURL,
		Category:    dp.Category,
	}, nil
}
