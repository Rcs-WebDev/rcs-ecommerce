package pb

import (
	"encoding/json"
	"google.golang.org/grpc/encoding"
)

// jsonCodec implements gRPC encoding.Codec using standard Go JSON.
// This allows us to use standard Go structs for gRPC communication,
// bypassing the need for protoc compiler toolchains in local environments.
type jsonCodec struct{}

func (jsonCodec) Marshal(v interface{}) ([]byte, error) {
	return json.Marshal(v)
}

func (jsonCodec) Unmarshal(data []byte, v interface{}) error {
	return json.Unmarshal(data, v)
}

func (jsonCodec) Name() string {
	return "json"
}

func init() {
	encoding.RegisterCodec(jsonCodec{})
}
