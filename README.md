# Bello – Kanban Board

A modern Trello‑style Kanban board built with Next.js, TailwindCSS, dnd‑kit, Express, and Prisma. Bello supports boards, lists, cards, labels, due dates, and checklists with smooth drag‑and‑drop.

## Live Demo
https://trelloclone-three-rho.vercel.app

## Features
- Create and view boards
- Create and delete lists
- Create, edit, and move cards
- Reorder cards with drag‑and‑drop
- Card details: description, due date, labels, checklist items
- Search cards by title

## Tech Stack
- Frontend: Next.js + TailwindCSS + dnd‑kit
- Backend: Node.js + Express
- Database: MySQL + Prisma

## Local Development

### 1) Backend
```bash
cd server
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run seed
npm run dev
```

### 2) Frontend
```bash
cd client
npm install
npm run dev
```

Open:
- Frontend: http://localhost:3000
- Backend: http://localhost:4000

## Environment Variables

### Server (`server/.env`)
```
DATABASE_URL="mysql://root:password@localhost:3306/kanban"
PORT=4000
```

### Client (`client/.env.local`)
```
NEXT_PUBLIC_API_URL="http://localhost:4000"
```

## Project Structure
```
kanban-app/
  client/   # Next.js frontend
  server/   # Express + Prisma backend
```

## Deployment Notes
- Frontend deployed on Vercel
- Backend and database should be hosted separately
- Set `NEXT_PUBLIC_API_URL` to your backend URL in production
