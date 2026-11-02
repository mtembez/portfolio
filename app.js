/**
 * Simon Munyambu Portfolio - Core Engine
 * Creative Components:
 * - Celestial Lion Constellation Particle Mesh (Canvas)
 * - 3D Perspective Card Tilt on Simon's Portrait Card
 * - Aceternity Spotlight Cursor Tracking
 * - Web Audio API Synthesizer (Tactile Click SFX)
 * - Real-Time Nairobi Telemetry Clock (EAT · UTC+3)
 * - Interactive Systems Terminal Emulator (POSIX shell)
 * - Paco Coursey cmdk Command Palette
 * - Slide-Over Architecture Drawer
 */

/* ==========================================================================
   1. Constellation & Celestial Lion Particle Canvas
   ========================================================================== */
const canvas = document.getElementById('constellationCanvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const particleCount = 45;
const connectionDistance = 140;
let mouse = { x: null, y: null, radius: 160 };

// Geometric keypoints tracing a celestial lion head constellation
const lionNodes = [
  { x: 0.50, y: 0.28 }, // Crown
  { x: 0.46, y: 0.22 }, // Forehead L
  { x: 0.54, y: 0.22 }, // Forehead R
  { x: 0.42, y: 0.30 }, // Ear L
  { x: 0.58, y: 0.30 }, // Ear R
  { x: 0.47, y: 0.35 }, // Eye L
  { x: 0.53, y: 0.35 }, // Eye R
  { x: 0.50, y: 0.42 }, // Nose
  { x: 0.45, y: 0.46 }, // Jaw L
  { x: 0.55, y: 0.46 }, // Jaw R
  { x: 0.50, y: 0.52 }, // Chin
  { x: 0.38, y: 0.38 }, // Mane Outer L
  { x: 0.62, y: 0.38 }, // Mane Outer R
  { x: 0.34, y: 0.50 }, // Mane Lower L
  { x: 0.66, y: 0.50 }  // Mane Lower R
];

const lionBones = [
  [0, 1], [0, 2], [1, 3], [2, 4], [1, 5], [2, 6], [5, 7], [6, 7],
  [7, 8], [7, 9], [8, 10], [9, 10], [3, 11], [4, 12], [11, 13], [12, 14],
  [13, 10], [14, 10], [5, 6]
];

function initCanvas() {
  width = canvas.width = window.innerWidth;
  height = canvas.height = window.innerHeight;
  particles = [];

  for (let i = 0; i < particleCount; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 1.5 + 0.8,
      alpha: Math.random() * 0.5 + 0.2
    });
  }
}

window.addEventListener('resize', initCanvas);
window.addEventListener('mousemove', (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});
window.addEventListener('mouseout', () => {
  mouse.x = null;
  mouse.y = null;
});

function drawCanvas() {
  ctx.clearRect(0, 0, width, height);

  // 1. Draw Celestial Lion Constellation in background
  ctx.save();
  const lionCenterX = width > 1024 ? width * 0.72 : width * 0.5;
  const lionCenterY = width > 1024 ? height * 0.32 : height * 0.2;
  const lionScale = Math.min(width, height) * 0.42;

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.2)';
  ctx.lineWidth = 1;

  // Draw lion bone lines
  lionBones.forEach(([startIdx, endIdx]) => {
    const p1 = lionNodes[startIdx];
    const p2 = lionNodes[endIdx];
    const x1 = lionCenterX + (p1.x - 0.5) * lionScale;
    const y1 = lionCenterY + (p1.y - 0.38) * lionScale;
    const x2 = lionCenterX + (p2.x - 0.5) * lionScale;
    const y2 = lionCenterY + (p2.y - 0.38) * lionScale;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  });

  // Draw glowing star nodes
  lionNodes.forEach((node, idx) => {
    const x = lionCenterX + (node.x - 0.5) * lionScale;
    const y = lionCenterY + (node.y - 0.38) * lionScale;

    ctx.fillStyle = idx === 0 || idx === 7 ? 'rgba(56, 189, 248, 0.9)' : 'rgba(129, 140, 248, 0.7)';
    ctx.beginPath();
    ctx.arc(x, y, idx === 0 || idx === 7 ? 2.8 : 2.0, 0, Math.PI * 2);
    ctx.fill();

    // Subtle star halo
    ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
    ctx.beginPath();
    ctx.arc(x, y, 7, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();

  // 2. Animate and draw floating ambient particles
  particles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.x < 0) p.x = width;
    if (p.x > width) p.x = 0;
    if (p.y < 0) p.y = height;
    if (p.y > height) p.y = 0;

    // Mouse interaction
    if (mouse.x !== null) {
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouse.radius) {
        p.x -= (dx / dist) * 0.6;
        p.y -= (dy / dist) * 0.6;
      }
    }

    ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
    ctx.fill();
  });

  // Draw connections between close particles
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < connectionDistance) {
        const opacity = (1 - dist / connectionDistance) * 0.14;
        ctx.strokeStyle = `rgba(129, 140, 248, ${opacity})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(drawCanvas);
}

initCanvas();
drawCanvas();


/* ==========================================================================
   2. 3D Perspective Card Tilt on Simon's Portrait Card
   ========================================================================= */
const portraitCard = document.getElementById('portraitCard');
if (portraitCard) {
  portraitCard.addEventListener('mousemove', (e) => {
    const rect = portraitCard.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;

    portraitCard.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) scale3d(1.02, 1.02, 1.02)`;
  });

  portraitCard.addEventListener('mouseleave', () => {
    portraitCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
  });
}


/* ==========================================================================
   3. Aceternity Spotlight Tracking on Bento & Project Cards
   ========================================================================== */
document.querySelectorAll('.spotlight-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  });
});


/* ==========================================================================
   4. Web Audio Synthesizer (Tactile Click SFX)
   ========================================================================== */
let audioCtx = null;
let sfxEnabled = true;

function initAudio() {
  if (!audioCtx && typeof (window.AudioContext || window.webkitAudioContext) !== 'undefined') {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
}

function playClickSound() {
  if (!sfxEnabled) return;
  initAudio();
  if (!audioCtx) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(300, audioCtx.currentTime + 0.02);

    gain.gain.setValueAtTime(0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.02);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.02);
  } catch (err) {
    // Silent fallback
  }
}

function playKeySound() {
  if (!sfxEnabled) return;
  initAudio();
  if (!audioCtx) return;

  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(450 + Math.random() * 80, audioCtx.currentTime);
    gain.gain.setValueAtTime(0.03, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + 0.015);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start();
    osc.stop(audioCtx.currentTime + 0.015);
  } catch (err) {
    // Silent fallback
  }
}

function toggleSFX() {
  sfxEnabled = !sfxEnabled;
  const btn = document.getElementById('sfxToggle');
  if (btn) {
    btn.innerHTML = sfxEnabled ? '<span>🔊</span><span>SFX ON</span>' : '<span>🔈</span><span>SFX OFF</span>';
  }
  if (sfxEnabled) playClickSound();
}


/* ==========================================================================
   5. Real-Time Nairobi Telemetry Clock
   ========================================================================== */
function updateNairobiClock() {
  const clockEl = document.getElementById('nairobiClock');
  if (!clockEl) return;

  try {
    const now = new Date();
    const options = {
      timeZone: 'Africa/Nairobi',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    clockEl.textContent = new Intl.DateTimeFormat('en-US', options).format(now);
  } catch (err) {
    clockEl.textContent = new Date().toLocaleTimeString();
  }
}

setInterval(updateNairobiClock, 1000);
updateNairobiClock();


/* ==========================================================================
   6. Interactive Systems Terminal Emulator
   ========================================================================== */
const termInput = document.getElementById('termInput');
const termOutput = document.getElementById('termOutput');
const termBody = document.getElementById('termBody');

let cmdHistory = [];
let historyIndex = -1;

const COMMANDS = {
  'help': () => `
Available system commands:
  <span class="term-prompt">help</span>       - Display this diagnostic manual
  <span class="term-prompt">skills</span>     - Audit technical domain capabilities
  <span class="term-prompt">projects</span>   - List production systems & GitHub repositories
  <span class="term-prompt">bio</span>        - Print Simon Munyambu's engineering background
  <span class="term-prompt">bench</span>      - Run simulated systems & event-loop benchmark
  <span class="term-prompt">neofetch</span>   - Print system hardware & software architecture
  <span class="term-prompt">contact</span>    - Display communication endpoints
  <span class="term-prompt">clear</span>      - Clear terminal screen buffer
`,

  'bio': () => `
<span class="term-highlight">Simon Munyambu · Software & AI/ML Systems Engineer</span>
Location: Nairobi, Kenya (East Africa Time, UTC+3)
Focus: Low-latency systems, Linux kernel primitives, transformer model serving,
       high-throughput network engines, and verifiable code with 100% test proof.
Philosophy: Zero AI slop, pre-mortem failure modeling, deterministic Exit Code 0.
`,

  'skills': () => `
<span class="term-highlight">=== CORE TECHNICAL CAPABILITY AUDIT ===</span>
[1] Systems & Low-Level:
    • C/C++20, Rust, POSIX APIs, epoll, io_uring, eBPF
    • Memory safety, cache-line optimization, multithreading
[2] AI & Deep Learning:
    • PyTorch, CUDA, TensorRT, vLLM, dynamic quantization
    • Transformer attention optimization, RAG, vector indexes
[3] Distributed Systems & Cloud:
    • Go, Python, AsyncIO, SQLite WAL mode, PostgreSQL, Docker
    • gRPC, REST, microservices, deterministic message queues
[4] Frontend & Design Engineering:
    • TypeScript, Tailwind Tokens, Shadcn/Tremor design patterns
    • Emil Kowalski micro-interactions, canvas animation, WCAG AA
[5] Visual & Graphic Design (Complementary Craft):
    • Brand identity systems, custom SVG vectors, logo design
    • Figma component systems, typography hierarchy, motion design
    • Color theory, spatial composition, and digital product aesthetics
`,

  'projects': () => `
<span class="term-highlight">=== PRODUCTION REPOSITORIES & SYSTEMS ===</span>
1. <span class="term-prompt">Applications Tracker</span> (<a href="https://github.com/mtembez/applications-tracker" target="_blank" rel="noopener noreferrer" style="color:var(--sky)">github.com/mtembez/applications-tracker</a>)
   Full-stack career console: Rich CLI + Starlette ASGI + SQLite WAL + 39 tests.
   Live Edge: <a href="https://mtembez.github.io/applications-tracker/" target="_blank" rel="noopener noreferrer" style="color:var(--sky)">mtembez.github.io/applications-tracker/</a>

2. <span class="term-prompt">Neuro-Dispatch</span> (AI Inference Engine)
   High-throughput token batching & FP8 dynamic quantization in C++20/CUDA.

3. <span class="term-prompt">Packet-Forge</span> (Network Ring Buffer)
   Zero-copy socket event loop utilizing io_uring & epoll (1.8M pkts/sec).

4. <span class="term-prompt">STEM-Eval</span> (Multimodal Evaluation Framework)
   Synthetic assay generator & ground truth auditor for frontier LLM models.
`,

  'bench': () => {
    const lat = (Math.random() * 0.08 + 0.12).toFixed(3);
    const iops = Math.floor(Math.random() * 15000 + 82000);
    return `
<span class="term-highlight">=== SIMULATED LINUX KERNEL BENCHMARK ===</span>
[*] Probing CPU cache locality:           L1/L2 hits > 98.4%
[*] epoll socket ring event latency:     <span class="term-highlight">${lat} ms (p99)</span>
[*] SQLite WAL concurrent write stream:   <span class="term-highlight">${iops} tx/sec</span>
[*] Memory allocations:                  0 byte heap leaks detected
[*] Status:                              ALL SYSTEMS VERIFIED NOMINAL
`;
  },

  'neofetch': () => `
   <span style="color:var(--sky)">      /\\_ /\\       </span>   <span class="term-prompt">simon@munyambu-systems</span>
   <span style="color:var(--sky)">     (  o.o )      </span>   ----------------------
   <span style="color:var(--sky)">      > ^ <       </span>   <span class="term-highlight">OS:</span> Linux x86_64 / POSIX Compliant
   <span style="color:var(--sky)">     /  Lion \\     </span>   <span class="term-highlight">Host:</span> High-Craft Systems Node (NBO)
   <span style="color:var(--sky)">    / /     \\ \\    </span>   <span class="term-highlight">Kernel:</span> 6.12.x-rt (Real-Time Preempt)
   <span style="color:var(--sky)">   (_/       \\_)   </span>   <span class="term-highlight">Uptime:</span> 99.99% Availability
                       <span class="term-highlight">Shell:</span> bash / zsh / posix-core
                       <span class="term-highlight">Stack:</span> C++, Rust, Go, Python, PyTorch
                       <span class="term-highlight">Memory:</span> 64GB DDR5 / Zero Cache Jitter
`,

  'contact': () => `
Direct Communication:
• Email:    <a href="mailto:simonmunyambu@gmail.com" style="color:var(--sky)">simonmunyambu@gmail.com</a>
• GitHub:   <a href="https://github.com/mtembez" target="_blank" rel="noopener noreferrer" style="color:var(--sky)">github.com/mtembez</a>
• Location: Nairobi, Kenya (UTC+3)
`
};

termInput.addEventListener('keydown', (e) => {
  playKeySound();

  if (e.key === 'Enter') {
    const rawCmd = termInput.value.trim();
    if (!rawCmd) return;

    cmdHistory.push(rawCmd);
    historyIndex = cmdHistory.length;

    const cmd = rawCmd.toLowerCase();
    const line = document.createElement('div');
    line.className = 'term-line';
    line.innerHTML = `<span class="term-prompt">simon@munyambu:~$</span> <span class="term-cmd">${escapeHtml(rawCmd)}</span>`;
    termOutput.appendChild(line);

    if (cmd === 'clear') {
      termOutput.innerHTML = '';
      termInput.value = '';
      return;
    }

    const resultDiv = document.createElement('div');
    resultDiv.className = 'term-line term-result';

    if (COMMANDS[cmd]) {
      resultDiv.innerHTML = COMMANDS[cmd]();
    } else {
      resultDiv.innerHTML = `<span style="color:#ef4444">bash: command not found: ${escapeHtml(rawCmd)}. Type <span class="term-prompt">help</span> for command list.</span>`;
    }

    termOutput.appendChild(resultDiv);
    termInput.value = '';
    termBody.scrollTop = termBody.scrollHeight;
  } else if (e.key === 'ArrowUp') {
    if (cmdHistory.length > 0 && historyIndex > 0) {
      historyIndex--;
      termInput.value = cmdHistory[historyIndex];
    }
  } else if (e.key === 'ArrowDown') {
    if (historyIndex < cmdHistory.length - 1) {
      historyIndex++;
      termInput.value = cmdHistory[historyIndex];
    } else {
      historyIndex = cmdHistory.length;
      termInput.value = '';
    }
  }
});


/* ==========================================================================
   7. Skills Filter Switcher
   ========================================================================== */
function filterSkills(domain) {
  const cards = document.querySelectorAll('.bento-card');
  const pills = document.querySelectorAll('.filter-pill');

  pills.forEach(pill => {
    pill.classList.remove('active');
    if (pill.getAttribute('onclick').includes(domain)) {
      pill.classList.add('active');
    }
  });

  cards.forEach(card => {
    if (domain === 'all' || card.getAttribute('data-domain') === domain) {
      card.style.display = 'flex';
      card.style.opacity = '1';
    } else {
      card.style.display = 'none';
      card.style.opacity = '0';
    }
  });
}


/* ==========================================================================
   8. Slide-Over Architecture Drawer
   ========================================================================== */
const ARCH_DATA = {
  'apptracker': {
    title: 'Applications Tracker & Systems Console',
    content: `
<div>
  <h4 style="color:var(--sky); margin-bottom:0.5rem;">System Architecture Diagram</h4>
  <div class="drawer-spec-block">
+------------------+         +-------------------------+
|     Rich CLI     |         |  Starlette ASGI Server  |
|  (Terminal POSIX)|         |  (Dual Persistence)     |
+--------+---------+         +------------+------------+
         |                                |
         |   SQLite WAL & Busy Timeout    |
         +--------------->+<--------------+
                          |
             +------------v-----------+
             |   tracker.db (WAL)     |
             |   PRAGMA synchronous   |
             +------------------------+
  </div>

  <h4 style="color:var(--sky); margin: 1rem 0 0.5rem;">Key Engineering Decisions</h4>
  <ul style="color:var(--text-muted); font-size:0.875rem; padding-left:1.25rem; line-height:1.6;">
    <li><strong>WAL Journaling:</strong> Eliminates reader/writer lock starvation during high concurrent access.</li>
    <li><strong>Zero Frontend Dependencies:</strong> Pure modern ES6, CSS Grid, and custom SVG without bloated frameworks.</li>
    <li><strong>Offline Resilient:</strong> Automated fallback to browser localStorage if edge server is unreachable.</li>
    <li><strong>Automated CI Matrix:</strong> 39 passing tests across Python 3.11, 3.12, and 3.13 on GitHub Actions.</li>
  </ul>

  <div style="margin-top:1.5rem; display:flex; gap:0.75rem;">
    <a href="https://github.com/mtembez/applications-tracker" target="_blank" rel="noopener noreferrer" class="btn-primary" style="font-size:0.85rem; padding:0.5rem 1rem;">View GitHub Repo ↗</a>
    <a href="https://mtembez.github.io/applications-tracker/" target="_blank" rel="noopener noreferrer" class="btn-secondary" style="font-size:0.85rem; padding:0.5rem 1rem;">Open Live Demo ↗</a>
  </div>
</div>
`
  },

  'neuro': {
    title: 'Neuro-Dispatch Inference Engine',
    content: `
<div>
  <h4 style="color:var(--purple); margin-bottom:0.5rem;">GPU Scheduling & Attention Batching</h4>
  <div class="drawer-spec-block">
[Incoming Tokens] ──> [Rust Dispatcher Queue] ──> [Lock-Free Ring]
                              │
                    ┌─────────▼─────────┐
                    │ Custom C++ CUDA   │
                    │ Attention Kernels │
                    └─────────┬─────────┘
                              ▼
                     [FP8 Quantized VRAM]
  </div>
  <h4 style="color:var(--purple); margin: 1rem 0 0.5rem;">Kernel Optimization Metrics</h4>
  <ul style="color:var(--text-muted); font-size:0.875rem; padding-left:1.25rem; line-height:1.6;">
    <li><strong>Continuous Batching:</strong> Evicts completed sequences without waiting for slower generations.</li>
    <li><strong>FP8 GEMM Kernels:</strong> 2x tensor core throughput while retaining 99.4% perplexity retention.</li>
    <li><strong>Zero-Copy Shared Memory:</strong> Eliminates host-to-device round-trip latency during scheduling.</li>
  </ul>
</div>
`
  },

  'packet': {
    title: 'Packet-Forge Network Engine',
    content: `
<div>
  <h4 style="color:var(--emerald); margin-bottom:0.5rem;">Zero-Copy Ring Buffer Topology</h4>
  <div class="drawer-spec-block">
[NIC Ring Buffer] ──> [Linux io_uring SQE] ──> [Zero-Copy Parser]
                             │
                      [Lock-Free SPSC]
                             │
                      [Worker Thread 0..N]
  </div>
  <h4 style="color:var(--emerald); margin: 1rem 0 0.5rem;">POSIX & Kernel Primitives</h4>
  <ul style="color:var(--text-muted); font-size:0.875rem; padding-left:1.25rem; line-height:1.6;">
    <li><strong>io_uring Ring Architecture:</strong> Kernel and userspace communicate through mapped ring buffers without system call context switch overhead.</li>
    <li><strong>CPU Core Pinning (pthread_setaffinity_np):</strong> Isolates workers to dedicated hardware threads to prevent L1/L2 cache evictions.</li>
  </ul>
</div>
`
  },

  'stem': {
    title: 'STEM-Eval Multimodal Benchmark Suite',
    content: `
<div>
  <h4 style="color:var(--amber); margin-bottom:0.5rem;">Assay Synthesis & Deterministic Auditing</h4>
  <div class="drawer-spec-block">
[Synthetic Physics/Assay Generator] ──> [Photometric Noise Injection]
                 │
      [Ground-Truth Matrix]
                 │
                 ├──> [Vision-Language Model Prompt]
                 │
                 ▼
      [Automated Evaluation & Drift Autopsy]
  </div>
  <h4 style="color:var(--amber); margin: 1rem 0 0.5rem;">Audit Mechanics</h4>
  <ul style="color:var(--text-muted); font-size:0.875rem; padding-left:1.25rem; line-height:1.6;">
    <li><strong>Parametric Scientific Ground Truths:</strong> Prevents benchmark contamination by dynamically synthesizing exact molecular weights and spectrogram peaks.</li>
    <li><strong>Strict Verification:</strong> Enforces automated verification pipelines with zero tolerance for QA rejections.</li>
  </ul>
</div>
`
  }
};

function openDrawer(projectId) {
  const data = ARCH_DATA[projectId];
  if (!data) return;

  document.getElementById('drawerTitle').textContent = data.title;
  document.getElementById('drawerContent').innerHTML = data.content;

  document.getElementById('drawerOverlay').classList.add('open');
  document.getElementById('archDrawer').classList.add('open');
}

function closeDrawer() {
  document.getElementById('drawerOverlay').classList.remove('open');
  document.getElementById('archDrawer').classList.remove('open');
}


/* ==========================================================================
   9. Command Palette (cmdk) Engine
   ========================================================================== */
const CMDK_ITEMS = [
  { label: 'Jump to Hero', shortcut: '#hero', action: () => scrollToSection('hero') },
  { label: 'View Skills Matrix', shortcut: '#skills', action: () => scrollToSection('skills') },
  { label: 'Explore Featured Projects', shortcut: '#projects', action: () => scrollToSection('projects') },
  { label: 'Open Systems Terminal', shortcut: '#terminal', action: () => scrollToSection('terminal') },
  { label: 'Read Engineering Philosophy', shortcut: '#architecture', action: () => scrollToSection('architecture') },
  { label: 'Review Career Experience', shortcut: '#experience', action: () => scrollToSection('experience') },
  { label: 'Contact Simon Munyambu', shortcut: '#contact', action: () => scrollToSection('contact') },
  { label: 'Open GitHub Profile (@mtembez)', shortcut: 'External', action: () => window.open('https://github.com/mtembez', '_blank') },
  { label: 'Open Live Applications Tracker', shortcut: 'Production', action: () => window.open('https://mtembez.github.io/applications-tracker/', '_blank') },
  { label: 'View Graphic Design & Visual Craft', shortcut: 'Creative', action: () => { scrollToSection('skills'); filterSkills('design'); } },
  { label: 'Toggle SFX Sound Engine', shortcut: 'Audio', action: () => toggleSFX() },
  { label: 'Run Neofetch Diagnostic', shortcut: 'Terminal', action: () => { scrollToSection('terminal'); termInput.value = 'neofetch'; termInput.dispatchEvent(new KeyboardEvent('keydown', {'key':'Enter'})); } }
];

function openCmdk() {
  playClickSound();
  document.getElementById('cmdkModal').style.display = 'flex';
  document.getElementById('cmdkInput').value = '';
  filterCmdk();
  setTimeout(() => document.getElementById('cmdkInput').focus(), 50);
}

function closeCmdk() {
  document.getElementById('cmdkModal').style.display = 'none';
}

function handleCmdkBackdrop(e) {
  if (e.target.id === 'cmdkModal') closeCmdk();
}

function filterCmdk() {
  const query = document.getElementById('cmdkInput').value.toLowerCase().trim();
  const list = document.getElementById('cmdkList');
  list.innerHTML = '';

  const filtered = CMDK_ITEMS.filter(item =>
    item.label.toLowerCase().includes(query) ||
    item.shortcut.toLowerCase().includes(query)
  );

  if (filtered.length === 0) {
    list.innerHTML = '<li style="padding: 1rem; color: var(--text-dim); text-align: center; font-size: 0.85rem;">No matching commands found.</li>';
    return;
  }

  filtered.forEach((item, index) => {
    const li = document.createElement('li');
    li.className = `cmdk-item ${index === 0 ? 'selected' : ''}`;
    li.innerHTML = `
      <span class="cmdk-item-label">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"></polyline></svg>
        <span>${escapeHtml(item.label)}</span>
      </span>
      <span class="kbd-shortcut">${item.shortcut}</span>
    `;
    li.onclick = () => {
      closeCmdk();
      playClickSound();
      item.action();
    };
    list.appendChild(li);
  });
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}


/* ==========================================================================
   10. Global Keyboard Shortcuts
   ========================================================================== */
window.addEventListener('keydown', (e) => {
  // Cmd+K or Ctrl+K
  if ((e.metaKey || e.ctrlKey) && e.code === 'KeyK') {
    e.preventDefault();
    const modal = document.getElementById('cmdkModal');
    if (modal.style.display === 'flex') {
      closeCmdk();
    } else {
      openCmdk();
    }
  }

  // Escape to close drawers and modals
  if (e.key === 'Escape') {
    closeCmdk();
    closeDrawer();
  }
});

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
