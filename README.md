# API Gateway Demo

**Autor:** Marios Tzialidis  
**Modul:** Software Architecture  
**Dozent:** Prof. Dr. Jürgen Münch

Eine vollständige Demonstration verschiedener API-Protokolle (REST, GraphQL, gRPC) über einen Envoy API Gateway mit interaktivem Frontend.

## 🎯 **gRPC Service Demonstration**

Dieses Projekt demonstriert einen vollständigen **gRPC Microservice** mit:

- **OrderService**: Bestellungen nach User-ID abrufen
- **Protocol Buffers**: Typsichere Service-Definition
- **Envoy Gateway**: gRPC-Routing über Port 9090
- **PostgreSQL**: Persistente Datenspeicherung
- **Test-Skripte**: Automatisierte gRPC-Tests

**Schnelltest:**
```bash
docker compose up -d
./test_grpc.sh
```

## 🏗️ Systemarchitektur

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Envoy         │    │   Backend       │
│   (Next.js)     │───▶│   Gateway       │───▶│   Services      │
│   Port: 3001    │    │   Port: 8080    │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   PostgreSQL    │
                       │   Database      │
                       │   Port: 5432    │
                       └─────────────────┘
```

### Systemkomponenten

| Komponente          | Technologie       | Port  | Beschreibung                 |
| ------------------- | ----------------- | ----- | ---------------------------- |
| **Frontend**        | Next.js + React   | 3001  | Interaktive UI für API-Tests |
| **Envoy Gateway**   | Envoy Proxy       | 8080  | API Gateway mit Routing      |
| **REST Service**    | Node.js + Express | 3000  | REST API Endpoints           |
| **GraphQL Service** | Node.js + Apollo  | 4000  | GraphQL Server               |
| **gRPC Service**    | Python + gRPC     | 50051 | gRPC Microservice            |
| **Database**        | PostgreSQL        | 5432  | Zentraler Datenspeicher      |

## 🚀 Schnellstart

### Voraussetzungen

- Docker & Docker Compose
- Node.js 18+ (für Frontend-Entwicklung)

### Installation

1. **Repository klonen:**

   ```bash
   git clone https://github.com/whoismarios/sa-gateway-demo.git
   cd sa-gateway-demo
   ```

2. **Backend starten:**

   ```bash
   docker compose up -d
   ```

3. **Datenbank initialisieren:**

   ```bash
   # In den PostgreSQL Container wechseln
   docker compose exec postgres psql -U user -d sa-demo
   ```

4. **SQL-Setup ausführen:**
   ```sql
   -- Drop existing table if it exists
   DROP TABLE IF EXISTS users;
   DROP TABLE IF EXISTS orders;

   -- Create users table with correct schema
   CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   name TEXT NOT NULL,
   email TEXT UNIQUE NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Create orders table for gRPC service
   CREATE TABLE orders (
   id SERIAL PRIMARY KEY,
   user_id INTEGER NOT NULL,
   product TEXT NOT NULL,
   quantity INTEGER NOT NULL,
   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
   FOREIGN KEY (user_id) REFERENCES users(id)
   );

   -- Insert sample data for users
   INSERT INTO users (name, email) VALUES
   ('Max Mustermann', 'max@example.com'),
   ('Anna Schmidt', 'anna@example.com'),
   ('Tom Weber', 'tom@example.com'),
   ('Lisa Müller', 'lisa@example.com'),
   ('Paul Fischer', 'paul@example.com'),
   ('Sarah Wagner', 'sarah@example.com'),
   ('Michael Schulz', 'michael@example.com'),
   ('Julia Becker', 'julia@example.com');

   -- Insert sample data for orders
   INSERT INTO orders (user_id, product, quantity) VALUES
   (1, 'Laptop', 1),
   (1, 'Mouse', 2),
   (2, 'Keyboard', 1),
   (2, 'Monitor', 1),
   (3, 'Headphones', 1),
   (4, 'USB Cable', 5),
   (5, 'Webcam', 1),
   (6, 'Tablet', 1),
   (7, 'Printer', 1),
   (8, 'Speakers', 2);

   -- Verify the data
   SELECT _ FROM users ORDER BY id;
   SELECT _ FROM orders ORDER BY id;

```

5. **Frontend starten:**
```bash
cd frontend/sa-gateway-frontend
npm install
npm run dev
````

6. **Anwendung öffnen:**
   Öffne [http://localhost:3001](http://localhost:3001) im Browser

## 🔧 API-Endpoints

### REST API

- **GET** `/api/hello` - Begrüßungsnachricht mit Benutzerdaten

### GraphQL

- **POST** `/graphql` - GraphQL Endpoint
- **Queries:**
  - `users` - Alle Benutzer abrufen
  - `user(id: ID!)` - Benutzer nach ID
  - `searchUsers(term: String!)` - Benutzer suchen

### gRPC

- **Service:** `OrderService.GetOrders`
- **Port:** 9090 (über Envoy)
- **Proto-Datei:** `services/grpc/service.proto`

## 📁 Projektstruktur

```
sa-gateway-demo/
├── compose.yml                 # Docker Compose Konfiguration
├── setup_database.sql          # Datenbank-Initialisierung
├── test_grpc.sh               # gRPC Test-Script (Shell)
├── test_grpc.py               # gRPC Test-Script (Python)
├── envoy/
│   └── envoy.yaml             # Envoy Gateway Konfiguration
├── services/
│   ├── rest/
│   │   ├── Dockerfile
│   │   ├── index.js           # REST API Service
│   │   └── package.json
│   ├── graphql/
│   │   ├── Dockerfile
│   │   ├── index.js           # GraphQL Service
│   │   └── package.json
│   └── grpc/
│       ├── Dockerfile
│       ├── server.py          # gRPC Service
│       ├── service.proto      # Protocol Buffer Schema
│       └── requirements.txt
└── frontend/
    └── sa-gateway-frontend/   # Next.js Frontend
        ├── src/
        │   ├── components/    # React Komponenten
        │   ├── types/         # TypeScript Interfaces
        │   └── app/           # Next.js App Router
        └── README.md          # Frontend-spezifische Dokumentation
```

## 🧪 Testing

### REST API Test

```bash
curl -X GET http://localhost:8080/api/hello
```

### GraphQL Test

```bash
curl -X POST http://localhost:8080/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ users { id name email } }"}'
```

### Service-Status prüfen

```bash
docker compose ps
```

### gRPC Service Test

#### **Automatisierte Tests**

**Shell-Script (empfohlen):**
```bash
# Test-Script ausführbar machen
chmod +x test_grpc.sh

# gRPC Service testen
./test_grpc.sh
```

**Python-Script:**
```bash
# Python-Abhängigkeiten installieren
pip install grpcio grpcio-tools

# gRPC Service testen
python test_grpc.py
```

#### **Manuelle Tests**

**Direkt über gRPC Service:**
```bash
# Verfügbare Services anzeigen
grpcurl -plaintext -proto services/grpc/service.proto localhost:50051 list

# Einzelne Anfrage testen
grpcurl -plaintext -proto services/grpc/service.proto \
  -d '{"user_id": 1}' localhost:50051 OrderService.GetOrders
```

**Über Envoy Gateway:**
```bash
# Verfügbare Services anzeigen
grpcurl -plaintext -proto services/grpc/service.proto localhost:9090 list

# Einzelne Anfrage testen
grpcurl -plaintext -proto services/grpc/service.proto \
  -d '{"user_id": 1}' localhost:9090 OrderService.GetOrders
```

#### **Erwartete Ergebnisse**

Das gRPC Service sollte folgende Testdaten zurückgeben:

- **User 1**: Laptop (1x), Mouse (2x)
- **User 2**: Keyboard (1x), Monitor (1x)
- **User 3**: Headphones (1x)
- **User 4**: USB Cable (5x)
- **User 5**: Webcam (1x)

#### **gRPC Service Details**

**Service-Definition:**
```protobuf
service OrderService {
  rpc GetOrders (UserIdRequest) returns (OrderList);
}

message UserIdRequest {
  int32 user_id = 1;
}

message Order {
  int32 id = 1;
  string product = 2;
  int32 quantity = 3;
}

message OrderList {
  repeated Order orders = 1;
}
```

**Datenfluss:**
1. **Client** → `localhost:9090` (Envoy Gateway)
2. **Envoy** → `grpc-service:50051` (gRPC Service)
3. **gRPC Service** → `postgres:5432` (Datenbank)
4. **Response** → Client (über Envoy)

## 🔍 Monitoring

- **Envoy Admin:** [http://localhost:9901](http://localhost:9901)
- **Envoy Stats:** [http://localhost:9901/stats](http://localhost:9901/stats)
- **Envoy Config:** [http://localhost:9901/config_dump](http://localhost:9901/config_dump)
- **Envoy Clusters:** [http://localhost:9901/clusters](http://localhost:9901/clusters)
- **Service Logs:** `docker compose logs -f [service-name]`

## 🛠️ Entwicklung

### Backend Services erweitern

1. Service-Code in `services/[service-type]/` bearbeiten
2. Container neu bauen: `docker compose build [service-name]`
3. Service neu starten: `docker compose up -d [service-name]`

### Frontend erweitern

Siehe [Frontend README](frontend/sa-gateway-frontend/README.md)

## 🐛 Troubleshooting

### Häufige Probleme

**Services starten nicht:**

```bash
docker compose down
docker compose up -d
```

**Datenbank-Verbindung fehlschlägt:**

```bash
docker compose restart postgres
```

**Frontend kann Backend nicht erreichen:**

- Prüfe ob alle Services laufen: `docker compose ps`
- Prüfe Envoy-Logs: `docker compose logs envoy`

**gRPC Service funktioniert nicht:**

```bash
# Prüfe gRPC Service Status
docker compose logs grpc-service

# Teste direkte Verbindung
grpcurl -plaintext -proto services/grpc/service.proto localhost:50051 list

# Prüfe Envoy Gateway
grpcurl -plaintext -proto services/grpc/service.proto localhost:9090 list

# Prüfe Datenbank-Verbindung
docker compose exec postgres psql -U user -d sa-demo -c "SELECT * FROM orders LIMIT 5;"
```

**grpcurl nicht gefunden:**
```bash
# macOS
brew install grpcurl

# Ubuntu/Debian
sudo apt-get install grpcurl

# Windows
# Download von: https://github.com/fullstorydev/grpcurl/releases
```

## 📚 Technische Details

### Envoy Gateway

- **Routing:** REST → Port 3000, GraphQL → Port 4000, gRPC → Port 50051
- **Load Balancing:** Round-robin zwischen Service-Instanzen
- **Health Checks:** Automatische Service-Überwachung

### Datenbank

- **Schema:** Einfache Users-Tabelle mit Timestamps
- **Backup:** Persistente Daten über Docker Volumes
- **Connection Pooling:** Optimiert für Microservices

### Security

- **CORS:** Konfiguriert für Frontend-Zugriff
- **Rate Limiting:** Über Envoy konfigurierbar
- **Authentication:** Für Demo deaktiviert

## 🚀 Deployment

### Production Setup

```bash
# Environment-Variablen setzen
export NODE_ENV=production

# Services bauen und starten
docker compose -f compose.prod.yml up -d

# Frontend bauen
cd frontend/sa-gateway-frontend
npm run build
npm start
```

## 📄 Lizenz

Dieses Projekt wurde für das Modul "Software Architecture" von Prof. Dr. Münch an der Hochschule Reutlingen erstellt.

---

**Kontakt:** Marios Tzialidis  
**Datum:** 2025
