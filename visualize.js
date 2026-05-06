import {csv} from "https://cdn.skypack.dev/d3-fetch@3";
var container = document.getElementById('visualization');
var items = []

function plot(items, groups){
    var options = {
      defaultGroup: "",
      drawPoints: false,
      interpolation: false,
      legend: { left: { position: "bottom-left" } },
      start: Date.now()-1000*3600*24,
      end: Date.now()+1000*3600*1,
      graphHeight: "600px",
    };
    var graph2d = new vis.Graph2d(container, items, groups, options);
  }

// Split data into per-sensor continuous segments so vis.js draws gaps naturally.
// Each segment becomes its own group; extra segments share the first segment's
// CSS class (same color) and are hidden from the legend.
function splitIntoSegments(rawItems) {
  // Collect and sort unique sensor names to assign stable class indices
  const sensorNames = [...new Set(rawItems.map(i => i.group))].sort();

  const allItems = [];
  const groupDefs = new vis.DataSet();

  for (const sensorName of sensorNames) {
    const classIdx = sensorNames.indexOf(sensorName) % 10;
    const className = 'vis-graph-group' + classIdx;

    const pts = rawItems.filter(i => i.group === sensorName)
                        .sort((a, b) => new Date(a.x) - new Date(b.x));

    // Compute median inter-point interval to detect real gaps
    const diffs = pts.slice(1).map((p, i) => new Date(p.x) - new Date(pts[i].x));
    const sorted = [...diffs].sort((a, b) => a - b);
    const median = sorted[Math.floor(sorted.length / 2)] || 0;
    const threshold = median * 3;

    let segIdx = 0;
    let segId = sensorName + '_seg_0';
    groupDefs.add({ id: segId, content: sensorName, className: className });

    for (let i = 0; i < pts.length; i++) {
      if (i > 0 && diffs[i - 1] > threshold) {
        segIdx++;
        segId = sensorName + '_seg_' + segIdx;
        groupDefs.add({
          id: segId,
          content: sensorName,
          className: className,
          options: { excludeFromLegend: true }
        });
      }
      allItems.push({ x: pts[i].x, y: pts[i].y, group: segId });
    }
  }

  return { items: allItems, groups: groupDefs };
}

var url='https://meow.suprdory.com:8001/dict'
// var url='http://127.0.0.1:8001/dict'
// var url = 'https://192.168.1.200:8001/dict'

fetch(url)
  .then(response => response.json())
  // .then(data => console.log(data))
  .then(data => {
    const { items, groups } = splitIntoSegments(Array.from(data));
    plot(items, groups);
  })

