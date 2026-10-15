# ⚡ FlowQueue

<div align="center">

<img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=1,12,24,30&height=180&section=header&text=FlowQueue&fontSize=48&fontColor=F59E0B&animation=fadeIn&fontAlignY=38&desc=Distributed%20Background%20Job%20Queue%20%26%20DLQ%20Dashboard&descAlignY=58&descSize=16" width="100%" alt="FlowQueue Banner" />

<p align="center">
  <strong>Distributed In-Memory Background Job Queue & Task Dispatcher with Concurrency Workers, Retry Backoff & Dead-Letter Queue (DLQ).</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Engine-Node.js_%26_Express-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" />
  <img src="https://img.shields.io/badge/Concurrency-Worker_Pools-38BDF8?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Resilience-Dead--Letter_Queue-EF4444?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-F59E0B?style=for-the-badge" />
</p>

<p align="center">
  <a href="#-key-features">Key Features</a> &bull;
  <a href="#-architecture">Architecture</a> &bull;
  <a href="#-quick-start">Quick Start</a> &bull;
  <a href="#-author">Author</a>
</p>

</div>

---

## 🌟 Overview

**FlowQueue** is a lightweight, distributed background task orchestration engine engineered for modern asynchronous microservices (inspired by BullMQ and Celery). 

It features dynamic worker pool concurrency, automated backoff retry policies, and an interactive real-time dashboard displaying pending queues, active worker telemetry, and Dead-Letter Queue (DLQ) diagnostic logs.

---

## 🚀 Key Features

* **⚙️ Dynamic Concurrency Pools:** Scale active background execution threads on-the-fly (1x, 3x, 6x, 10x workers).
* **🔄 Automated Retry & Backoff:** Tasks automatically retry with state tracking before being moved to the Dead-Letter Queue.
* **💀 Dead-Letter Queue (DLQ) Inspector:** Real-time visibility into failed jobs with detailed execution stack traces.
* **⏸️ Queue Flow Control:** Instantly pause and resume task execution with zero state loss.
* **📊 Live WebSocket Telemetry:** Real-time metrics streaming with zero database polling overhead.

---

## ⚡ Quick Start

### 1. Clone & Install
```bash
git clone https://github.com/SahilRajput2266/FlowQueue.git
cd FlowQueue
npm install
```

### 2. Run Locally
```bash
npm start
```

Open your browser at:
```
http://localhost:5350
```

---

## 👨‍💻 Author

**Sahil Chauhan (Sahil Rajput)**
* GitHub: [@SahilRajput2266](https://github.com/SahilRajput2266)
* Email: [sahilrajput6244@gmail.com](mailto:sahilrajput6244@gmail.com)
* LinkedIn: [Sahil Chauhan](https://www.linkedin.com/in/sahil-chauhan-6bb687237)

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.
