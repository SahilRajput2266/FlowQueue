const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const path = require('path');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const io = new Server(server, { cors: { origin: '*' } });

// Queue State
const jobs = new Map(); // id -> job
let concurrency = 3; // default active workers
let isPaused = false;
let activeRunningCount = 0;

function broadcastState() {
  const jobList = Array.from(jobs.values()).sort((a, b) => b.createdAt - a.createdAt);
  io.emit('queue:state', {
    jobs: jobList.slice(0, 100),
    stats: {
      total: jobs.size,
      pending: jobList.filter(j => j.status === 'pending').length,
      active: jobList.filter(j => j.status === 'active').length,
      completed: jobList.filter(j => j.status === 'completed').length,
      failed: jobList.filter(j => j.status === 'failed').length,
      concurrency,
      isPaused
    }
  });
}

function processNextJobs() {
  if (isPaused) return;

  const pending = Array.from(jobs.values()).filter(j => j.status === 'pending');
  while (activeRunningCount < concurrency && pending.length > 0) {
    const job = pending.shift();
    executeJob(job);
  }
}

async function executeJob(job) {
  activeRunningCount++;
  job.status = 'active';
  job.startedAt = Date.now();
  job.logs.push(`[Worker-${activeRunningCount}] Job execution started`);
  broadcastState();

  const duration = Math.floor(1500 + Math.random() * 2500); // 1.5s - 4s runtime

  setTimeout(() => {
    activeRunningCount--;
    // Simulate deliberate failure for retry demonstration
    if (job.shouldFail && job.attempts < job.maxAttempts) {
      job.attempts++;
      job.status = 'pending'; // retry
      job.logs.push(`[Worker] Attempt ${job.attempts} failed: Simulation error. Scheduling backoff retry...`);
    } else if (job.shouldFail && job.attempts >= job.maxAttempts) {
      job.status = 'failed';
      job.completedAt = Date.now();
      job.logs.push(`[Worker] Max attempts reached (${job.maxAttempts}). Moved to Dead-Letter Queue (DLQ).`);
    } else {
      job.status = 'completed';
      job.completedAt = Date.now();
      job.logs.push(`[Worker] Successfully processed task in ${duration}ms`);
    }

    broadcastState();
    processNextJobs();
  }, duration);
}

// Seed initial queue
for (let i = 1; i <= 6; i++) {
  const id = 'job_' + Math.random().toString(36).substring(2, 8);
  const types = ['SendEmailReport', 'ProcessVideoTranscode', 'SyncDatabaseBackup', 'ComputeAnalyticsAggregates'];
  const t = types[Math.floor(Math.random() * types.length)];
  jobs.set(id, {
    id,
    type: t,
    priority: i === 1 ? 'High' : 'Normal',
    status: 'pending',
    attempts: 0,
    maxAttempts: 3,
    createdAt: Date.now() - (10 - i) * 1000,
    logs: ['Enqueued to FlowQueue mesh']
  });
}
setInterval(processNextJobs, 800);

io.on('connection', (socket) => {
  broadcastState();

  socket.on('job:add', (data) => {
    const id = 'job_' + Math.random().toString(36).substring(2, 8);
    const job = {
      id,
      type: data.type || 'GenericTask',
      priority: data.priority || 'Normal',
      status: 'pending',
      attempts: 0,
      maxAttempts: 3,
      shouldFail: Boolean(data.shouldFail),
      createdAt: Date.now(),
      logs: ['Enqueued via API']
    };
    jobs.set(id, job);
    broadcastState();
    processNextJobs();
  });

  socket.on('queue:concurrency', (val) => {
    concurrency = Math.max(1, Math.min(10, parseInt(val, 10)));
    broadcastState();
    processNextJobs();
  });

  socket.on('queue:togglePause', () => {
    isPaused = !isPaused;
    broadcastState();
    if (!isPaused) processNextJobs();
  });

  socket.on('queue:clear', () => {
    jobs.clear();
    broadcastState();
  });
});

const PORT = process.env.PORT || 5350;
server.listen(PORT, () => {
  console.log(`===================================================`);
  console.log(`  🚀 FlowQueue Background Job Mesh on port ${PORT}`);
  console.log(`  🌐 Local URL: http://localhost:${PORT}`);
  console.log(`===================================================`);
});
