// Chart.js is loaded globally via script tag in index.html

const COLORS = [
  '#4dc9f6', '#f67019', '#f53794', '#537bc4', '#acc236',
  '#166a8f', '#00a950', '#8549ba', '#e8c45a', '#58595b',
];

// Group raw API points by sensor, insert null values at data gaps so Chart.js
// renders breaks in the line rather than spanning across missing periods.
function buildDatasets(rawItems) {
  const sensorMap = new Map();
  for (const pt of rawItems) {
    if (!sensorMap.has(pt.group)) sensorMap.set(pt.group, []);
    sensorMap.get(pt.group).push({ x: new Date(pt.x).getTime(), y: pt.y });
  }

  const datasets = [];
  let colorIdx = 0;
  for (const [name, pts] of [...sensorMap.entries()].sort()) {
    pts.sort((a, b) => a.x - b.x);

    // Compute median inter-point interval to detect real gaps
    const diffs = pts.slice(1).map((p, i) => p.x - pts[i].x);
    const sorted = [...diffs].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] || 0;
    const threshold = median * 3;

    const gapped = [];
    for (let i = 0; i < pts.length; i++) {
      gapped.push({ x: pts[i].x, y: pts[i].y });
      if (i < pts.length - 1 && diffs[i] > threshold) {
        gapped.push({ x: pts[i].x + 1, y: null }); // null breaks the line
      }
    }

    datasets.push({
      label: name,
      data: gapped,
      borderColor: COLORS[colorIdx % COLORS.length],
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      pointRadius: 0,
      spanGaps: false,
      tension: 0,
    });
    colorIdx++;
  }
  return datasets;
}

const STORAGE_KEY = 'pitemplog_xrange';

function saveRange(chart) {
  const { min, max } = chart.scales.x;
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ min, max }));
}

function loadRange() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  return { min: Date.now() - 24 * 3600 * 1000, max: Date.now() + 3600 * 1000 };
}

let chart;

// Inline plugin: draws a light grey vertical line at the current time
const nowLinePlugin = {
  id: 'nowLine',
  afterDraw(chart) {
    const { ctx, scales: { x, y } } = chart;
    const xPos = x.getPixelForValue(Date.now());
    if (xPos < x.left || xPos > x.right) return;
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(xPos, y.top);
    ctx.lineTo(xPos, y.bottom);
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.4)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  },
};

// Dark theme defaults
Chart.defaults.color = '#e0e0e0';
Chart.defaults.borderColor = '#444';

const url = 'https://meow.suprdory.com:8001/dict';
// const url = 'http://127.0.0.1:8001/dict';

fetch(url)
  .then(response => response.json())
  .then(data => {
    const datasets = buildDatasets(Array.from(data));
    const ctx = document.getElementById('chart').getContext('2d');
    chart = new Chart(ctx, {
      type: 'line',
      data: { datasets },
      plugins: [nowLinePlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        events: ['wheel', 'touchstart', 'touchmove'], // only what zoom plugin needs
        scales: {
          x: {
            type: 'time',
            min: loadRange().min,
            max: loadRange().max,
            time: {
              tooltipFormat: 'dd MMM HH:mm',
              displayFormats: {
                hour: 'dd MMM HH:mm',
                day: 'dd MMM',
                month: 'MMM yyyy',
              },
            },
            ticks: { maxTicksLimit: 12 },
          },
          y: {
            title: { display: true, text: '°C' },
          },
        },
        plugins: {
          tooltip: { enabled: false },
          legend: { position: 'bottom' },
          zoom: {
            zoom: { wheel: { enabled: true, speed: 0.3 }, pinch: { enabled: false }, mode: 'x',
              onZoomComplete: ({ chart }) => saveRange(chart) },
            pan: { enabled: true, mode: 'x',
              onPanComplete: ({ chart }) => saveRange(chart) },
          },
        },
      },
    });

    // Custom pinch-to-zoom: uses raw touch distance so finger orientation doesn't matter
    let pinchDist = null;
    const canvas = ctx.canvas;
    canvas.addEventListener('touchstart', e => {
      pinchDist = e.touches.length === 2
        ? Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY)
        : null;
    }, { passive: true });
    canvas.addEventListener('touchmove', e => {
      if (e.touches.length !== 2 || pinchDist === null) return;
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      if (d > 0) { chart.zoom(d / pinchDist); pinchDist = d; }
    }, { passive: true });
    canvas.addEventListener('touchend', () => {
      if (pinchDist !== null) saveRange(chart);
      pinchDist = null;
    }, { passive: true });

    setInterval(() => chart.draw(), 1000);

    document.getElementById('reload-btn').addEventListener('click', () => {
      fetch(url)
        .then(r => r.json())
        .then(fresh => {
          chart.data.datasets = buildDatasets(Array.from(fresh));
          chart.update('none');
        });
    });
  });

