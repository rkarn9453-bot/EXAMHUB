# Project Plan & Milestones

## Scope
Online Examination System with admin, teacher and student roles. The backend is the assessed core; React is the demonstration client.

## Architecture
React/Vite client → Express REST API → Mongoose models → MongoDB. JWT protects REST and Socket.IO. EventEmitter records submission audit events.

## Milestones
1. Planning and design: requirements, ERD, API contract.
2. Core CRUD: users, exams, questions and attempts.
3. Security: bcrypt, JWT, role checks, validation and error handling.
4. Advanced features: server-side timing, auto-grading, aggregations, indexes, Socket.IO and audit events.
5. Verification and demo: Postman, automated tests, seed data, README and deployment.

## Risks
- Client clock manipulation: server calculates deadline from stored startedAt.
- Answer-key leakage: student response mapper excludes correctOption.
- Unauthorized access: role checks enforced in API middleware.
- Duplicate submissions: unique exam/student attempt index and submitted status check.
- Secret exposure: .env ignored; only .env.example committed.

## Viva checklist
Explain middleware order, JWT verification, bcrypt, schema indexes, aggregation stages, deadline calculation, answer-key filtering, EventEmitter and Socket.IO authentication.
