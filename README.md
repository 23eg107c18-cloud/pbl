# WPM Week 10 — Smart Task Scheduler

This folder contains a small Express + Mongoose app implementing a task scheduler with CRUD operations.

Key points:
- Uses a local MongoDB by default (mongodb://127.0.0.1:27017/wpm_scheduler). You can also set `MONGO_URI` in a `.env` file.
- Designed for use with MongoDB Compass — connect to the same address and inspect the `tasks` collection.

Quick start (Windows PowerShell):

```powershell
cd .\week_10
npm install
# optional: create .env with MONGO_URI or MONGO_LOCAL
npm run seed
npm run dev
```

Open http://localhost:3001 in your browser. The API endpoints are under http://localhost:3001/api/tasks

Notes:
- This is a minimal scheduler data model. No background job runner is included here — only the data and CRUD/UI. Integrate a worker (node-cron, bull, agenda) later to execute tasks.
