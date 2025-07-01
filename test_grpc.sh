#!/bin/bash

# gRPC Service Test Script using grpcurl
# Tests the OrderService.GetOrders functionality

echo "🚀 Testing gRPC OrderService via Envoy Gateway"
echo "=================================================="

# Check if grpcurl is installed
if ! command -v grpcurl &> /dev/null; then
    echo "❌ grpcurl is not installed. Please install it first:"
    echo "   brew install grpcurl"
    exit 1
fi

# Check if services are running
if ! docker compose ps | grep -q "grpc-service.*Up"; then
    echo "❌ gRPC service is not running. Please start the services first:"
    echo "   docker compose up -d"
    exit 1
fi

# Test different user IDs
for user_id in 1 2 3 4 5; do
    echo ""
    echo "📋 Testing GetOrders for user_id: $user_id"
    echo "----------------------------------------"
    
    # Create JSON payload
    json_payload="{\"user_id\": $user_id}"
    
    # Call the gRPC service via Envoy
    response=$(grpcurl -plaintext -proto services/grpc/service.proto -d "$json_payload" \
        localhost:9090 OrderService.GetOrders 2>/dev/null)
    
    if [ $? -eq 0 ]; then
        if [ -n "$response" ]; then
            echo "✅ Response for user $user_id:"
            echo "$response" | jq '.' 2>/dev/null || echo "$response"
        else
            echo "ℹ️  No orders found for user $user_id"
        fi
    else
        echo "❌ Error calling gRPC service for user $user_id"
    fi
done

echo ""
echo "=================================================="
echo "🎉 gRPC Service Test Complete!"

# Optional: Show service info
echo ""
echo "📊 Service Information:"
echo "   - gRPC Service: localhost:50051"
echo "   - Envoy Gateway: localhost:9090"
echo "   - Envoy Admin: http://localhost:9901" 