# API Gateway Demo Frontend

Ein interaktives Frontend zur Demonstration verschiedener API-Protokolle (REST und GraphQL) über einen Envoy API Gateway.

## 🚀 Schnellstart

### Voraussetzungen

- Node.js 18+ 
- npm oder yarn
- Docker und Docker Compose (für das Backend)

### Installation und Start

1. **Backend starten:**
   ```bash
   # Im Hauptverzeichnis des Projekts
   docker compose up -d
   ```

2. **Frontend-Abhängigkeiten installieren:**
   ```bash
   cd frontend/sa-gateway-frontend
   npm install
   ```

3. **Frontend starten:**
   ```bash
   npm run dev
   ```

4. **Anwendung öffnen:**
   Öffne [http://localhost:3001](http://localhost:3001) in deinem Browser

## 🏗️ Projektstruktur

```
src/
├── app/
│   └── page.tsx                # Hauptseite der Anwendung
├── components/                 # React-Komponenten
│   ├── Header.tsx             # App-Header mit Titel und Status
│   ├── RequestCard.tsx        # Wiederverwendbare API-Request-Karte
│   ├── RestCard.tsx           # REST-spezifischer Inhalt
│   ├── GraphQLCard.tsx        # GraphQL-Interface mit Queries
│   └── ProtocolComparison.tsx # Vergleich REST vs GraphQL
└── types/
    └── api.ts                 # TypeScript-Interfaces
```

## 🧩 Komponenten

### Header
- **Datei:** `components/Header.tsx`
- **Beschreibung:** Zeigt den Titel der Anwendung und den Gateway-Status an
- **Features:** Gradient-Titel, Online-Status-Indikator

### RequestCard
- **Datei:** `components/RequestCard.tsx`
- **Beschreibung:** Wiederverwendbare Komponente für API-Requests
- **Features:** 
  - Dynamische Farbgebung je nach API-Typ
  - Loading-States mit Spinner
  - Copy-to-Clipboard Funktionalität
  - Error-Handling mit visueller Darstellung
  - HTTP-Status-Code Anzeige
  - Timestamp für abgeschlossene Requests

### RestCard
- **Datei:** `components/RestCard.tsx`
- **Beschreibung:** Spezifischer Inhalt für REST-API-Demonstration
- **Features:** Erklärung der REST-Architektur mit visuellen Elementen

### GraphQLCard
- **Datei:** `components/GraphQLCard.tsx`
- **Beschreibung:** Komplexe Komponente für GraphQL-Interaktionen
- **Features:**
  - Radio-Button-Auswahl für verschiedene Query-Typen
  - Dynamische Eingabefelder (User-ID, Suchbegriff)
  - Live Query-Preview
  - Stabile Input-Felder ohne Fokus-Verlust

### ProtocolComparison
- **Datei:** `components/ProtocolComparison.tsx`
- **Beschreibung:** Vergleichsbereich für API-Protokolle
- **Features:** 
  - Bewertungsmatrix für Performance, Einfachheit und Flexibilität
  - Erklärung zu gRPC (warum nicht enthalten)

## 🔍 GraphQL Queries

### 1. Alle Benutzer
```graphql
{
  users {
    id
    name
    email
    createdAt
  }
}
```
**Beschreibung:** Ruft alle Benutzer aus der Datenbank ab mit grundlegenden Informationen.

### 2. Benutzer nach ID
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    name
    email
    profile {
      avatar
      bio
    }
  }
}
```
**Beschreibung:** Sucht einen spezifischen Benutzer nach ID und inkludiert Profilinformationen.
**Variablen:** `id` (Number) - Die Benutzer-ID

### 3. Benutzer suchen
```graphql
query SearchUsers($term: String!) {
  searchUsers(term: $term) {
    id
    name
    email
    matchScore
  }
}
```
**Beschreibung:** Durchsucht Benutzer nach Namen oder E-Mail-Adresse.
**Variablen:** `term` (String) - Der Suchbegriff
**Features:** Zeigt Match-Score für Suchergebnisse an

## 🔧 Technische Details

### API-Endpoints
- **REST:** `GET http://localhost:8080/api/hello`
- **GraphQL:** `POST http://localhost:8080/graphql`

### State Management
- Lokaler React State mit `useState`
- Getrennte States für Loading, Results und Copy-Status
- Stabile Komponenten-Referenzen für bessere Performance

### Styling
- Tailwind CSS für responsive Design
- Gradient-Hintergründe und moderne UI-Elemente
- Hover-Effekte und Transitionen

## 🐛 Bekannte Probleme

- gRPC wurde aus der Demo entfernt, da Browser kein gRPC nativ unterstützen
- Das Backend muss über Docker Compose laufen, damit die APIs erreichbar sind

## 🚀 Deployment

Für Production-Deployment:

```bash
npm run build
npm start
```

## 📝 Entwicklung

### Neue Komponenten hinzufügen
1. Erstelle neue Datei in `src/components/`
2. Exportiere die Komponente als default
3. Importiere und verwende sie in `page.tsx`

### Neue GraphQL Queries
1. Füge Query zur `graphqlFields` Array in `page.tsx` hinzu
2. Implementiere entsprechende Resolver im Backend
3. Aktualisiere die Variable-Logik in `fetchGraphQL`

## 🤝 Beitragen

1. Fork das Repository
2. Erstelle einen Feature-Branch
3. Committe deine Änderungen
4. Erstelle einen Pull Request
