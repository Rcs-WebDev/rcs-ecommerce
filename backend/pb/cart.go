package pb

import (
	"context"

	"google.golang.org/grpc"
)

type CartItem struct {
	Id           int64   `json:"id"`
	ProductId    int64   `json:"product_id"`
	ProductName  string  `json:"product_name"`
	ProductPrice float64 `json:"product_price"`
	ProductImage string  `json:"product_image"`
	Quantity     int32   `json:"quantity"`
}

type GetCartRequest struct {
	UserId int64 `json:"user_id"`
}

type AddToCartRequest struct {
	UserId    int64 `json:"user_id"`
	ProductId int64 `json:"product_id"`
	Quantity  int32 `json:"quantity"`
}

type UpdateCartItemRequest struct {
	UserId    int64 `json:"user_id"`
	ProductId int64 `json:"product_id"`
	Quantity  int32 `json:"quantity"`
}

type RemoveFromCartRequest struct {
	UserId    int64 `json:"user_id"`
	ProductId int64 `json:"product_id"`
}

type ClearCartRequest struct {
	UserId int64 `json:"user_id"`
}

type CartResponse struct {
	Items      []*CartItem `json:"items"`
	TotalPrice float64     `json:"total_price"`
}

type ClearCartResponse struct {
	Message string `json:"message"`
}

// Client API

type CartServiceClient interface {
	GetCart(ctx context.Context, in *GetCartRequest, opts ...grpc.CallOption) (*CartResponse, error)
	AddToCart(ctx context.Context, in *AddToCartRequest, opts ...grpc.CallOption) (*CartResponse, error)
	UpdateCartItem(ctx context.Context, in *UpdateCartItemRequest, opts ...grpc.CallOption) (*CartResponse, error)
	RemoveFromCart(ctx context.Context, in *RemoveFromCartRequest, opts ...grpc.CallOption) (*CartResponse, error)
	ClearCart(ctx context.Context, in *ClearCartRequest, opts ...grpc.CallOption) (*ClearCartResponse, error)
}

type cartServiceClient struct {
	cc grpc.ClientConnInterface
}

func NewCartServiceClient(cc grpc.ClientConnInterface) CartServiceClient {
	return &cartServiceClient{cc}
}

func (c *cartServiceClient) GetCart(ctx context.Context, in *GetCartRequest, opts ...grpc.CallOption) (*CartResponse, error) {
	out := new(CartResponse)
	err := c.cc.Invoke(ctx, "/pb.CartService/GetCart", in, out, append(opts, grpc.CallContentSubtype("json"))...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *cartServiceClient) AddToCart(ctx context.Context, in *AddToCartRequest, opts ...grpc.CallOption) (*CartResponse, error) {
	out := new(CartResponse)
	err := c.cc.Invoke(ctx, "/pb.CartService/AddToCart", in, out, append(opts, grpc.CallContentSubtype("json"))...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *cartServiceClient) UpdateCartItem(ctx context.Context, in *UpdateCartItemRequest, opts ...grpc.CallOption) (*CartResponse, error) {
	out := new(CartResponse)
	err := c.cc.Invoke(ctx, "/pb.CartService/UpdateCartItem", in, out, append(opts, grpc.CallContentSubtype("json"))...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *cartServiceClient) RemoveFromCart(ctx context.Context, in *RemoveFromCartRequest, opts ...grpc.CallOption) (*CartResponse, error) {
	out := new(CartResponse)
	err := c.cc.Invoke(ctx, "/pb.CartService/RemoveFromCart", in, out, append(opts, grpc.CallContentSubtype("json"))...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

func (c *cartServiceClient) ClearCart(ctx context.Context, in *ClearCartRequest, opts ...grpc.CallOption) (*ClearCartResponse, error) {
	out := new(ClearCartResponse)
	err := c.cc.Invoke(ctx, "/pb.CartService/ClearCart", in, out, append(opts, grpc.CallContentSubtype("json"))...)
	if err != nil {
		return nil, err
	}
	return out, nil
}

// Server API

type CartServiceServer interface {
	GetCart(context.Context, *GetCartRequest) (*CartResponse, error)
	AddToCart(context.Context, *AddToCartRequest) (*CartResponse, error)
	UpdateCartItem(context.Context, *UpdateCartItemRequest) (*CartResponse, error)
	RemoveFromCart(context.Context, *RemoveFromCartRequest) (*CartResponse, error)
	ClearCart(context.Context, *ClearCartRequest) (*ClearCartResponse, error)
}

func RegisterCartServiceServer(s grpc.ServiceRegistrar, srv CartServiceServer) {
	s.RegisterService(&CartService_ServiceDesc, srv)
}

func _CartService_GetCart_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(GetCartRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CartServiceServer).GetCart(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/pb.CartService/GetCart",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CartServiceServer).GetCart(ctx, req.(*GetCartRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _CartService_AddToCart_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(AddToCartRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CartServiceServer).AddToCart(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/pb.CartService/AddToCart",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CartServiceServer).AddToCart(ctx, req.(*AddToCartRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _CartService_UpdateCartItem_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(UpdateCartItemRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CartServiceServer).UpdateCartItem(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/pb.CartService/UpdateCartItem",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CartServiceServer).UpdateCartItem(ctx, req.(*UpdateCartItemRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _CartService_RemoveFromCart_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(RemoveFromCartRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CartServiceServer).RemoveFromCart(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/pb.CartService/RemoveFromCart",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CartServiceServer).RemoveFromCart(ctx, req.(*RemoveFromCartRequest))
	}
	return interceptor(ctx, in, info, handler)
}

func _CartService_ClearCart_Handler(srv interface{}, ctx context.Context, dec func(interface{}) error, interceptor grpc.UnaryServerInterceptor) (interface{}, error) {
	in := new(ClearCartRequest)
	if err := dec(in); err != nil {
		return nil, err
	}
	if interceptor == nil {
		return srv.(CartServiceServer).ClearCart(ctx, in)
	}
	info := &grpc.UnaryServerInfo{
		Server:     srv,
		FullMethod: "/pb.CartService/ClearCart",
	}
	handler := func(ctx context.Context, req interface{}) (interface{}, error) {
		return srv.(CartServiceServer).ClearCart(ctx, req.(*ClearCartRequest))
	}
	return interceptor(ctx, in, info, handler)
}

var CartService_ServiceDesc = grpc.ServiceDesc{
	ServiceName: "pb.CartService",
	HandlerType: (*CartServiceServer)(nil),
	Methods: []grpc.MethodDesc{
		{
			MethodName: "GetCart",
			Handler:    _CartService_GetCart_Handler,
		},
		{
			MethodName: "AddToCart",
			Handler:    _CartService_AddToCart_Handler,
		},
		{
			MethodName: "UpdateCartItem",
			Handler:    _CartService_UpdateCartItem_Handler,
		},
		{
			MethodName: "RemoveFromCart",
			Handler:    _CartService_RemoveFromCart_Handler,
		},
		{
			MethodName: "ClearCart",
			Handler:    _CartService_ClearCart_Handler,
		},
	},
	Streams:  []grpc.StreamDesc{},
	Metadata: "cart.proto",
}
