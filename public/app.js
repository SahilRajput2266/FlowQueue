/**
 * FlowQueue - Client Dashboard
 */
(function () {
  'use strict';
  const socket = io();

  let jobs = [];
  let selectedJob = null;

  const statPending = document.getElementById('statPending');
  const statActive = document.getElementById('statActive');
  const statCompleted = document.getElementById('statCompleted');
  const statFailed = document.getElementById('statFailed');
  const jobsTableBody = document.getElementById('jobsTableBody');
  const logStream = document.getElementById('logStream');
  const activeJobId = document.getElementById('activeJobId');
  const btnTogglePause = document.getElementById('btnTogglePause');
  const btnDispatchBatch = document.getElementById('btnDispatchBatch');
  const btnDispatchFailing = document.getElementById('btnDispatchFailing');

  socket.on('queue:state', ({ jobs: list, stats }) => {
    jobs = list;
    statPending.textContent = stats.pending;
    statActive.textContent = stats.active;
    statCompleted.textContent = stats.completed;
    statFailed.textContent = stats.failed;

    btnTogglePause.textContent = stats.isPaused ? 'Resume Queue ▶' : 'Pause Queue ⏸';

    renderTable();
    if (selectedJob) {
      const refreshed = jobs.find(j => j.id === selectedJob.id);
      if (refreshed) selectJob(refreshed);
    } else if (jobs.length > 0) {
      selectJob(jobs[0]);
    }
  });

  function renderTable() {
    jobsTableBody.innerHTML = '';
    jobs.forEach(j => {
      const tr = document.createElement('tr');
      tr.className = selectedJob && selectedJob.id === j.id ? 'active' : '';
      tr.innerHTML = `
        <td class="job-id-cell">${j.id}</td>
        <td><strong>${j.type}</strong></td>
        <td>${j.priority}</td>
        <td><span class="status-pill ${j.status}">${j.status}</span></td>
        <td>${j.attempts}/${j.maxAttempts}</td>
        <td style="color: var(--text-dim)">${timeAgo(j.createdAt)}</td>
      `;
      tr.addEventListener('click', () => selectJob(j));
      jobsTableBody.appendChild(tr);
    });
  }

  function selectJob(j) {
    selectedJob = j;
    activeJobId.textContent = j.id;
    logStream.innerHTML = '';
    j.logs.forEach(line => {
      const div = document.createElement('div');
      div.className = 'log-line';
      div.textContent = line;
      logStream.appendChild(div);
    });
  }

  // Concurrency Buttons
  document.querySelectorAll('.btn-c').forEach(b => {
    b.addEventListener('click', () => {
      document.querySelectorAll('.btn-c').forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      socket.emit('queue:concurrency', b.dataset.c);
    });
  });

  btnTogglePause.addEventListener('click', () => socket.emit('queue:togglePause'));

  btnDispatchBatch.addEventListener('click', () => {
    const tasks = ['SendEmailReport', 'ProcessVideoTranscode', 'SyncDatabaseBackup', 'ComputeAnalyticsAggregates'];
    for (let i = 0; i < 5; i++) {
      socket.emit('job:add', { type: tasks[Math.floor(Math.random() * tasks.length)] });
    }
  });

  btnDispatchFailing.addEventListener('click', () => {
    socket.emit('job:add', { type: 'FaultyExternalAPISync', shouldFail: true, priority: 'High' });
  });

  function timeAgo(t) {
    const s = Math.floor((Date.now() - t) / 1000);
    if (s < 60) return s + 's ago';
    return Math.floor(s / 60) + 'm ago';
  }

})();
