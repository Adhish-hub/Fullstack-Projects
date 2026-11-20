# Product Catalog & Search

A full-stack product catalog application
built using NestJS, React, TypeScript,
MongoDB and Tailwind CSS.

## Features

- Product CRUD operations
- Search by product information
- Category filtering
- Price range filtering
- Stock availability filtering
- Sorting and pagination
- Admin product management
- Form validation
- Automated backend and frontend tests

## Tech Stack

### Backend
- NestJS
- TypeScript
- MongoDB
- Mongoose
- class-validator

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- React Router
- Axios

## Installation

Clone the repository and install
backend and frontend dependencies.

## Environment Variables

Configure backend/.env using
backend/.env.example as a reference.

Never commit real credentials.

## Run the Backend

cd backend
npm install
npm run start:dev

## Run the Frontend

cd frontend
npm install
npm run dev

## Testing

Backend:
npm test
npm run test:e2e
npm run test:cov

Frontend:
npm test
npm run test:coverage

## Known Limitations

Product write endpoints do not yet
implement authentication or role-based
authorization. This project is a
learning application.