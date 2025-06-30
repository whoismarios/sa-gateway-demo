# API Gateway Demo

**Autor:** Marios Tzialidis  
**Modul:** Software Architecture  
**Dozent:** Prof. Dr. Jürgen Münch

Eine vollständige Demonstration verschiedener API-Protokolle (REST, GraphQL, gRPC) über einen Envoy API Gateway mit interaktivem Frontend.

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

| Komponente | Technologie | Port | Beschreibung |
|------------|-------------|------|--------------|
| **Frontend** | Next.js + React | 3001 | Interaktive UI für API-Tests |
| **Envoy Gateway** | Envoy Proxy | 8080 | API Gateway mit Routing |
| **REST Service** | Node.js + Express | 3000 | REST API Endpoints |
| **GraphQL Service** | Node.js + Apollo | 4000 | GraphQL Server |
| **gRPC Service** | Python + gRPC | 50051 | gRPC Microservice |
| **Database** | PostgreSQL | 5432 | Zentraler Datenspeicher |

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
   -- Tabelle erstellen
   CREATE TABLE users (
       id SERIAL PRIMARY KEY,
       name TEXT NOT NULL,
       email TEXT UNIQUE NOT NULL,
       created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   -- Beispieldaten einfügen
   INSERT INTO users (name, email) VALUES 
       ('Max Mustermann', 'max@example.com'),
       ('Anna Schmidt', 'anna@example.com'),
       ('Tom Weber', 'tom@example.com'),
       ('Lisa Müller', 'lisa@example.com'),
       ('Paul Fischer', 'paul@example.com');
   ```

5. **Frontend starten:**
   ```bash
   cd frontend/sa-gateway-frontend
   npm install
   npm run dev
   ```

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

## 📁 Projektstruktur

```
sa-gateway-demo/
├── compose.yml                 # Docker Compose Konfiguration
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

Dieses Projekt wurde für das Modul "Software Architecture" an der Universität Stuttgart erstellt.

---

**Kontakt:** Marios Tzialidis  
**Datum:** 2025 