FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "server.py"]
RUN python -m grpc_tools.protoc -I. --python_out=. --grpc_python_out=. service.proto
