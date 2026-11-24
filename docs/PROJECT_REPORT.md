# ExamHub — Online Examination System

## 1. Introduction
ExamHub is a web-based objective examination platform designed to organize assessments, manage roles and evaluate submitted answers.

## 2. Objectives
- Provide separate admin, teacher and student access.
- Manage objective exams and questions.
- Enforce server-side exam availability and duration.
- Automatically evaluate objective answers.
- Provide result and performance summaries.

## 3. Technology Stack
React, Vite, Node.js, Express, MongoDB, Mongoose, JWT, bcrypt and Socket.IO.

## 4. System Design
The frontend communicates with a REST API. The API applies authentication, authorization and validation before accessing MongoDB through Mongoose models. See DATABASE_DESIGN.md.

## 5. Implementation
Describe authentication, exam CRUD, attempt lifecycle, auto-grading, analytics, real-time notifications and audit events. Replace this paragraph with details you personally verified in your implementation.

## 6. Testing and Results
[Insert actual Postman screenshots, test output, deployment URLs and measured results. Do not invent results.]

## 7. Conclusion and Future Scope
ExamHub demonstrates a role-based examination workflow. Future work includes descriptive answers, proctoring integrations, email notifications, refresh-token rotation and persistent audit trails.

## 8. References
Official Node.js, Express, MongoDB, Mongoose, React and Socket.IO documentation.
