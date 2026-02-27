# Outreach Web App

A modern web application for managing company outreach workflows, including data handling and email-related operations through a clean dashboard interface.

## Technologies Used

- React
- TypeScript
- Vite
- TanStack Router
- TanStack Query
- Tailwind CSS
- Shadcn UI (Radix UI based components)
- Supabase (auth, database, functions integration)
- Docker + Docker Compose
- Nginx (production static serving)

## Run Without Docker

### Prerequisites

- Node.js 22+
- pnpm

### Setup

```bash
git clone <your-repository-url>
cd Outreach_repo
cp .env.example .env
pnpm install
```

### Start Development Server

```bash
pnpm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
pnpm run build
pnpm run preview
```

## Run With Docker

### Setup

```bash
cp .env.example .env
```

### Build and Start

```bash
docker compose up --build
```

The app will be available at `http://localhost:8080`.
