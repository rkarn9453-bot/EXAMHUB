# API Contract
Base URL: `/api/v1`

| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | `/auth/register` | Public | Student registration |
| POST | `/auth/login` | Public | Login and issue tokens |
| GET | `/auth/me` | Authenticated | Current account |
| GET | `/exams` | Authenticated | List exams |
| POST | `/exams` | Admin/Teacher | Create exam |
| GET | `/exams/:id` | Authenticated | Exam details (no answer key) |
| PATCH | `/exams/:id` | Admin/Teacher | Update exam |
| DELETE | `/exams/:id` | Admin | Delete exam |
| POST | `/exams/:id/start` | Student | Start/resume attempt |
| POST | `/exams/:id/submit` | Student | Submit answers and grade |
| GET | `/exams/results/me` | Student | Own results |
| GET | `/exams/analytics` | Admin/Teacher | Aggregated performance |
| GET | `/health` | Public | API health at `/api/v1/health` |

## Socket.IO
Connect with `auth: { token: accessToken }`. Join a room with `exam:join` and an exam ObjectId. Server emits `exam:submission-count` after a submission.

## EventEmitter
`exam:submitted` is emitted after grading and logs a small audit event. A persistent audit collection should be added if durable audit history is required by the faculty rubric.

## Test plan
See `../postman/ExamHub.postman_collection.json`. Cover successful login, invalid password, missing token, role denial, exam creation, student answer-key filtering, start, submission, duplicate submission and analytics.
