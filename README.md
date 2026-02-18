# Scalability Analysis of a Real-Time Hospital Queue Management System

## 📌 Project Overview

This repository contains the source code and experimental data for the research paper: **"Scalability Analysis of a Real-Time Hospital Queue Management System using MERN Stack Architecture."**

The project addresses the critical challenge of patient overcrowding in public healthcare facilities, specifically Outpatient Departments (OPD). By replacing physical token systems with a **"Virtual Queue"** web application, this system allows patients to book slots remotely and track their status in real-time.

The architecture is built on the **MERN Stack (Next.js App Router)** and utilizes a **Singleton Database Connection Pattern** to handle high concurrency. Stress testing with Apache JMeter confirmed the system can handle **500+ concurrent users** with **0% error rate** and **sub-20ms latency**.

## 🚀 Key Features

* **Real-Time Queue Tracking:** Dynamic updates using Next.js client-side rendering.

* **High-Performance Backend:** Utilizes Node.js non-blocking I/O and a Singleton Connection pattern (`dbConnect.ts`) to prevent connection leaks during traffic spikes.

* **Department Management:** Supports specialized queues for **Radiology, Cardiology, Neurology, OPD, and ENT**.

* **Priority Logic:** Built-in algorithm handling three priority levels (0: Emergency, 1: Urgent, 2: Normal).

* **Scientific Validation:** Rigorously tested for scalability using **Apache JMeter**.

## 🛠️ Tech Stack

* **Frontend:** Next.js 16 (React 19), Tailwind CSS v4

* **Backend:** Next.js App Router (Serverless/Node.js)

* **Database:** MongoDB (via Mongoose v9)

* **Language:** TypeScript

* **Testing Tool:** Apache JMeter (v5.6.3)

## 📊 Research & Performance Benchmarks

As detailed in the accompanying research paper, the system was stress-tested to simulate an "OPD Rush Hour" scenario.

### Experimental Results (Apache JMeter)

| Metric | Scenario A (100 Users) | Scenario B (500 Users) |
| :--- | :--- | :--- |
| **Average Latency** | 18 ms | 16 ms |
| **Throughput** | 10.1 req/sec | 50.1 req/sec |
| **Error Rate** | 0.00% | 0.00% |
| **Max Response Time** | 236 ms | 119 ms |

> **Key Insight:** The system demonstrated linear scalability. When user load increased by 5x, throughput increased by exactly 5x, proving that the Node.js event loop effectively managed concurrency without bottlenecks.

## 📂 Project Structure

```bash
├── src
│   ├── app            # Next.js App Router
│   │   ├── api        # Backend endpoints (e.g., /api/patients)
│   │   └── page.tsx   # Frontend Dashboard & Booking Interface
│   ├── lib            # Utility functions
│   │   └── dbConnect.ts  # Singleton MongoDB connection pattern
│   ├── models         # Mongoose Schemas
│   │   └── Patient.ts    # Patient data model (Schema validation)
│   └── types          # TypeScript interfaces
├── public             # Static assets
└── package.json       # Project dependencies
```
## ⚙️ Installation & Setup
Follow these steps to run the research prototype locally.

### Prerequisites
Node.js (v18 or higher)

MongoDB URI (Local instance or MongoDB Atlas)

Steps
Clone the repository

Bash
git clone [https://github.com/yourusername/scalable-opd-queue.git](https://github.com/yourusername/scalable-opd-queue.git)
cd scalable-opd-queue
Install dependencies

Bash
npm install
Configure Environment Variables
Create a .env.local file in the root directory and add your MongoDB connection string:

Code snippet
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/hospital-queue
Run the development server

Bash
npm run dev
Access the Application
Open http://localhost:3000 in your browser.

## 🔬 Scientific Contribution: The Singleton Pattern
A key contribution of this architecture is the implementation of the Singleton Connection Pattern in src/lib/dbConnect.ts. This solves the "Connection Storm" issue common in serverless environments.

TypeScript
// src/lib/dbConnect.ts
if (!cached.promise) {
  cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => {
    return mongoose;
  });
}
This ensures that despite thousands of incoming requests, the application reuses existing database connections, significantly reducing overhead and latency.

## 🔮 Future Scope
Containerization: Implementation of Docker & Kubernetes for horizontal scaling across multiple nodes.

AI Integration: Machine Learning models (LSTM) to predict wait times based on historical footfall data.

IoT Support: Integration with digital signage screens in hospital waiting halls for patients without smartphones.

## 📜 License
This project is open-source and available under the MIT License.