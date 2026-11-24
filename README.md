# ExamHub — Online Examination System

A full-stack capstone starter built with React, Node.js, Express, MongoDB and Mongoose.

## Features
- Role-based accounts: admin, teacher and student
- JWT access tokens, bcrypt password hashing and protected APIs
- Exam and question CRUD; answer keys are not returned to students
- Server-side exam start/submit flow and automatic objective grading
- Result history and basic analytics aggregation
- Centralized validation/errors, Helmet, CORS and rate limiting
- Socket.IO exam-room updates and EventEmitter audit events
- Seed script, Postman collection and project documentation

## Requirements
Node.js 20+, MongoDB Atlas/local MongoDB, npm.

## Run locally
1. Copy `backend/.env.example` to `backend/.env` and fill in `MONGODB_URI` plus long random JWT secrets.
2. In a terminal: `cd backend && npm install && npm run seed && npm run dev`.
3. In another terminal: `cd frontend && npm install && npm run dev`.
4. Open http://localhost:5173. API health: http://localhost:5000/api/v1/health

Seed login (change after first login): `admin@examhub.test` / `ChangeMe123!`.

## Deployment
Deploy `backend` as a Render Node web service (build: `npm install`, start: `npm start`). Set environment variables from `.env.example`. Deploy `frontend` to Vercel with `VITE_API_URL` set to the deployed API URL. Configure backend `CLIENT_ORIGIN` to the Vercel URL. Never commit `.env`.

## Important capstone note
This is a working foundation, not proof of a completed deployment or evaluation. Configure your own Atlas database, rotate secrets, run tests, verify all rubric requirements, and be prepared to explain every module in your viva. See `docs/`.
