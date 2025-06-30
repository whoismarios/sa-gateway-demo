import grpc
from concurrent import futures
import service_pb2
import service_pb2_grpc
import psycopg2
import os

class OrderService(service_pb2_grpc.OrderServiceServicer):
    def GetOrders(self, request, context):
        conn = psycopg2.connect(os.environ['DATABASE_URL'])
        cur = conn.cursor()
        cur.execute("CREATE TABLE IF NOT EXISTS orders (id SERIAL PRIMARY KEY, user_id INTEGER, product TEXT, quantity INTEGER);")
        cur.execute("SELECT id, product, quantity FROM orders WHERE user_id = %s;", (request.user_id,))
        orders = [service_pb2.Order(id=row[0], product=row[1], quantity=row[2]) for row in cur.fetchall()]
        conn.close()
        return service_pb2.OrderList(orders=orders)

def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    service_pb2_grpc.add_OrderServiceServicer_to_server(OrderService(), server)
    server.add_insecure_port('[::]:50051')
    server.start()
    server.wait_for_termination()

if __name__ == '__main__':
    import service_pb2_grpc
    import service_pb2
    serve()