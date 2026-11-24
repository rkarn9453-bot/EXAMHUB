# Database Design

## Collections
- **User**: name, email (unique), password hash, role, refresh-token hash placeholder.
- **Exam**: title, subject, duration, availability window, creator, published flag, embedded questions.
- **Attempt**: exam reference, student reference, submitted answers, score, total marks, status and timestamps.

## Relationships
One teacher/admin creates many exams. One exam embeds many questions. One student has at most one attempt per exam in this starter implementation. An attempt references one exam and one student.

## Indexes
- User email unique; role index.
- Exam published and availability index.
- Attempt exam+student unique; separate exam and student indexes.

## Aggregations
1. Attempt summary grouped by exam: count, average and highest score.
2. Overall submitted-attempt count and average score.

For a full production system, add refresh-token rotation/revocation, attempt resumption policy, pagination, immutable exam snapshots and audit-log persistence.
