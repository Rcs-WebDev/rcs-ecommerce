package services

import (
	"context"
	"errors"
	"go-grpc-react-ecommerce/backend/internal/database"
	"go-grpc-react-ecommerce/backend/internal/utils"
	"go-grpc-react-ecommerce/backend/pb"

	"golang.org/x/crypto/bcrypt"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"gorm.io/gorm"
)

type AuthService struct{}

func (s *AuthService) Register(ctx context.Context, req *pb.RegisterRequest) (*pb.RegisterResponse, error) {
	if req.Email == "" || req.Password == "" || req.Name == "" {
		return nil, status.Error(codes.InvalidArgument, "Name, email, and password are required")
	}

	// Check if user already exists
	var existingUser database.User
	err := database.DB.Where("email = ?", req.Email).First(&existingUser).Error
	if err == nil {
		return nil, status.Error(codes.AlreadyExists, "Email already registered")
	} else if !errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, status.Errorf(codes.Internal, "Database error: %v", err)
	}

	// Hash password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to hash password: %v", err)
	}

	// Save user
	newUser := database.User{
		Name:     req.Name,
		Email:    req.Email,
		Password: string(hashedPassword),
	}
	if err := database.DB.Create(&newUser).Error; err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to create user: %v", err)
	}

	return &pb.RegisterResponse{
		UserId:  int64(newUser.ID),
		Message: "User registered successfully",
	}, nil
}

func (s *AuthService) Login(ctx context.Context, req *pb.LoginRequest) (*pb.LoginResponse, error) {
	if req.Email == "" || req.Password == "" {
		return nil, status.Error(codes.InvalidArgument, "Email and password are required")
	}

	// Find user
	var user database.User
	err := database.DB.Where("email = ?", req.Email).First(&user).Error
	if errors.Is(err, gorm.ErrRecordNotFound) {
		return nil, status.Error(codes.NotFound, "User not found")
	} else if err != nil {
		return nil, status.Errorf(codes.Internal, "Database error: %v", err)
	}

	// Verify password
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password))
	if err != nil {
		return nil, status.Error(codes.Unauthenticated, "Invalid password")
	}

	// Generate JWT
	token, err := utils.GenerateToken(user.ID, user.Email, user.Name)
	if err != nil {
		return nil, status.Errorf(codes.Internal, "Failed to generate token: %v", err)
	}

	return &pb.LoginResponse{
		Token:  token,
		UserId: int64(user.ID),
		Name:   user.Name,
		Email:  user.Email,
	}, nil
}

func (s *AuthService) ValidateToken(ctx context.Context, req *pb.ValidateTokenRequest) (*pb.ValidateTokenResponse, error) {
	if req.Token == "" {
		return nil, status.Error(codes.InvalidArgument, "Token is required")
	}

	claims, err := utils.ValidateToken(req.Token)
	if err != nil {
		return &pb.ValidateTokenResponse{Valid: false}, nil
	}

	return &pb.ValidateTokenResponse{
		Valid:  true,
		UserId: int64(claims.UserID),
		Name:   claims.Name,
		Email:  claims.Email,
	}, nil
}
