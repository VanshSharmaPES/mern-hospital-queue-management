# Scalability Analysis of a Real-Time Hospital Queue Management System

![Next.js](https://img.shields.io/badge/Next.js-16.1-black) ![MongoDB](https://img.shields.io/badge/MongoDB-9.0-green) ![React](https://img.shields.io/badge/React-19-blue) ![License](https://img.shields.io/badge/License-MIT-yellow)

## 📌 Project Overview
This repository contains the source code and research data for the paper **"Scalability Analysis of a Real-Time Hospital Queue Management System using MERN Stack Architecture."**

The project addresses the critical challenge of patient overcrowding in public healthcare facilities (OPDs). By replacing physical token systems with a **"Virtual Queue"** web application, this system allows patients to book slots remotely and track their status in real-time.

The architecture is built on the **MERN Stack (Next.js App Router)** and is optimized for high concurrency, capable of handling **500+ concurrent users with 0% error rate** and sub-20ms latency.

---

## 🚀 Key Features
* **Real-Time Queue Tracking:** Dynamic updates using Next.js client-side rendering.
* **High-Performance Backend:** Utilizes Node.js non-blocking I/O and a Singleton Database Connection pattern to handle traffic spikes.
* **Department Management:** Supports multiple departments (Radiology, Cardiology, Neurology, OPD, ENT).
* **Priority System:** Built-in logic for handling different patient priority levels (0, 1, 2).
* **Scalable Architecture:** Tested and validated using Apache JMeter.

---

## 🛠️ Tech Stack
* **Frontend:** Next.js 16 (React 19), Tailwind CSS
* **Backend:** Next.js App Router (Serverless/Node.js)
* **Database:** MongoDB (via Mongoose v9)
* **Testing Tool:** Apache JMeter (v5.6.3)

---

## 📊 Performance Benchmarks
As detailed in the research paper, the system was stress-tested to simulate "OPD Rush Hour" scenarios.

| Metric | Scenario A (100 Users) | Scenario B (500 Users) |
| :--- | :--- | :--- |
| **Average Latency** | 18 ms | 16 ms |
| **Throughput** | 10.1 req/sec | 50.1 req/sec |
| **Error Rate** | 0.00% | 0.00% |
| **Max Response Time** | 236 ms | 119 ms |

*Key Insight:* The system maintained **linear scalability** (5x load resulted in 5x throughput) without connection leaks, thanks to the optimized database connection pool.

---

## 📂 Project Structure
```bash
├── src
│   ├── app            # Next.js App Router (Pages & API Routes)
│   │   ├── api        # Backend endpoints (e.g., /api/patients)
│   │   └── page.tsx   # Frontend Dashboard
│   ├── lib            # Utility functions
│   │   └── dbConnect.ts  # Singleton MongoDB connection pattern
│   ├── models         # Mongoose Schemas
│   │   └── Patient.ts    # Patient data model
│   └── types          # TypeScript interfaces
├── public             # Static assets
└── package.json       # Dependencies & Scripts
```

⚙️ Installation & Setup
Prerequisites
Node.js (v18 or higher)

MongoDB URI (Local or Atlas)

Steps
Clone the repository

Bash
git clone [https://github.com/yourusername/scalable-opd-queue.git](https://github.com/yourusername/scalable-opd-queue.git)
cd scalable-opd-queue
Install dependencies

Bash
npm install
Configure Environment Variables
Create a .env.local file in the root directory:

Code snippet
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hospital-queue
Run the development server

Bash
npm run dev
Open http://localhost:3000 with your browser.

🔬 Scientific Contribution
This project implements a Singleton Connection Pattern in src/lib/dbConnect.ts to solve the "Connection Storm" issue common in serverless environments.

TypeScript
// Optimized Connection Logic
if (!cached.promise) {
  cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
    return mongoose;
  });
}
This ensures that despite thousands of incoming requests, the application reuses existing database connections, reducing overhead and latency.

🔮 Future Scope
Containerization: Implementation of Docker & Kubernetes for horizontal scaling.

AI Integration: Machine Learning models to predict wait times based on historical data.

IoT Support: Integration with digital signage screens in hospital waiting halls.

📜 License
This project is open-source and available under the MIT License.