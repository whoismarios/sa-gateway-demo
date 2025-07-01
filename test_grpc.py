#!/usr/bin/env python3
"""
gRPC Service Test Script
Tests the OrderService.GetOrders functionality
"""

import grpc
import service_pb2
import service_pb2_grpc
import sys
import os

def test_grpc_service():
    """Test the gRPC OrderService"""
    
    # Connect to the gRPC service via Envoy proxy
    channel = grpc.insecure_channel('localhost:9090')
    stub = service_pb2_grpc.OrderServiceStub(channel)
    
    print("🚀 Testing gRPC OrderService via Envoy Gateway")
    print("=" * 50)
    
    # Test different user IDs
    test_user_ids = [1, 2, 3, 4, 5]
    
    for user_id in test_user_ids:
        try:
            print(f"\n📋 Testing GetOrders for user_id: {user_id}")
            
            # Create request
            request = service_pb2.UserIdRequest(user_id=user_id)
            
            # Call the gRPC service
            response = stub.GetOrders(request)
            
            if response.orders:
                print(f"✅ Found {len(response.orders)} orders for user {user_id}:")
                for order in response.orders:
                    print(f"   - Order ID: {order.id}, Product: {order.product}, Quantity: {order.quantity}")
            else:
                print(f"ℹ️  No orders found for user {user_id}")
                
        except grpc.RpcError as e:
            print(f"❌ Error for user {user_id}: {e.code()} - {e.details()}")
        except Exception as e:
            print(f"❌ Unexpected error for user {user_id}: {e}")
    
    print("\n" + "=" * 50)
    print("🎉 gRPC Service Test Complete!")
    
    # Close the channel
    channel.close()

if __name__ == "__main__":
    # Check if we're in the right directory
    if not os.path.exists('services/grpc/service.proto'):
        print("❌ Error: Please run this script from the project root directory")
        print("   Expected: services/grpc/service.proto")
        sys.exit(1)
    
    # Add the grpc service directory to Python path
    sys.path.append('services/grpc')
    
    try:
        test_grpc_service()
    except ImportError as e:
        print(f"❌ Import Error: {e}")
        print("💡 Make sure the gRPC service is running and the proto files are compiled")
        print("   Run: docker compose up -d")
    except Exception as e:
        print(f"❌ Error: {e}")
        print("💡 Make sure the gRPC service is running")
        print("   Run: docker compose up -d") 