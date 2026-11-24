ExamHub – Online Examination Management System

ExamHub is a web-based online examination management system developed to simplify the process of creating, managing, and attempting online exams.

Features

* User authentication and role-based access
* Admin and Teacher exam management
* Student exam participation
* Create and manage multiple-choice questions (MCQs)
* Automatic result calculation
* Negative marking support
* Exam analytics and performance tracking
* MongoDB database integration

Tech Stack

Frontend

* React.js
* Vite
* JavaScript
* CSS

Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication

Project Structure

ExamHub/
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md

Installation and Setup

1. Clone the Repository

git clone YOUR_GITHUB_REPOSITORY_URL
cd ExamHub

2. Setup Frontend

cd frontend
npm install
npm run dev

3. Setup Backend

Open another terminal:

cd backend
npm install

Configure your environment variables in a .env file using the variables required by the backend.

Then run the backend using the development script configured in backend/package.json.

User Roles

* Admin: Manage exams and access analytics.
* Teacher: Create and manage examinations.
* Student: Attempt published exams and view results.

Database

MongoDB Atlas is used for storing user accounts, examinations, questions, and results.

Project Status

Developed as a BTech CSE (AI & ML) academic capstone project.

Author

Aman Karn
BTech CSE – Artificial Intelligence & Machine Learning