# 📧 Email Scheduler API

A job-queue-based Email Scheduler built with **Node.js**, **Express**, **Prisma**, **PostgreSQL**, and **Redis**. Allows users to schedule emails for future delivery, with retry logic and status tracking.

---

## 🚀 Features

- 📬 Schedule emails via `POST /email`
- 🔁 Retries failed emails (up to 3 times)
- ✅ View task status via `GET /email/:id`
- 🧑‍💻 Admin endpoint to list all emails
- 🐳 Docker support for PostgreSQL, Redis, and App
- 📅 Supports human-readable dates ("tomorrow at 10am")

---

## 🛠 Tech Stack

- Node.js + Express
- PostgreSQL with Prisma ORM
- BullMQ + Redis for job queue
- Nodemailer with Gmail SMTP

---

## 📦 Local Setup (Without Docker)

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/email-scheduler-api.git
cd email-scheduler-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set up PostgreSQL and Redis
Ensure you have both services running locally:
- PostgreSQL on port `5432`
- Redis on port `6379`

Create a database called `emailscheduler` in Postgres.

### 4. Create `.env` File
```env
PORT=3000
DATABASE_URL="postgresql://postgres:admin@localhost:5432/emailscheduler"
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_app_password
```

### 5. Push Prisma Schema
```bash
npx prisma db push
```

### 6. Start the App
```bash
node src/index.js
```

### 7. Test with Postman
- POST `/email`
- GET `/email/:id`
- GET `/email/admin/emails`

---

## 🐳 Docker Setup (Recommended)

### 1. Clone the Repo
```bash
git clone https://github.com/yourusername/email-scheduler-api.git
cd email-scheduler-api
```

### 2. Create `.env` File
Same as above (place in root).

### 3. Build and Run with Docker Compose
```bash
docker-compose up --build
```

### 4. Access
- API: [http://localhost:3000](http://localhost:3000)

---

## 📮 API Endpoints

### `POST /email`
Schedule a new email.
```json
{
  "to": "example@gmail.com",
  "subject": "Hello",
  "body": "This is a test",
  "sendAt": "in 2 minutes"
}
```

### `GET /email/:id`
Get the status of a specific email task.

### `GET /email/admin/emails`
List all email tasks.

---

## 👨‍💻 Developer Notes
- Email times can be human-readable ("tomorrow at 10am")
- Queue uses BullMQ with Redis
- Email transport via Gmail SMTP
- Retry logic handled by BullMQ attempts

---
