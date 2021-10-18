// create a dataSet with groups
var names = ["SquareShaded", "Bargraph", "Blank", "CircleShaded"];
var groups = new vis.DataSet();
groups.add({
  id: 0,
  content: names[0],
  className: "custom-style1",
  options: {
    drawPoints: {
      style: "square", // square, circle
    },
    shaded: {
      orientation: "bottom", // top, bottom
    },
  },
});

groups.add({
  id: 1,
  content: names[1],
  className: "custom-style2",
  options: {
    style: "bar",
    drawPoints: { style: "circle", size: 10 },
  },
});

groups.add({
  id: 2,
  content: names[2],
  options: {
    yAxisOrientation: "right", // right, left
    drawPoints: false,
  },
});

groups.add({
  id: 3,
  content: names[3],
  className: "custom-style3",
  options: {
    yAxisOrientation: "right", // right, left
    drawPoints: {
      style: "circle", // square, circle
    },
    shaded: {
      orientation: "top", // top, bottom
    },
  },
});

var container = document.getElementById("visualization");
var items = [
  { x: "2014-06-12", y: 0, group: 0 },
  { x: "2014-06-13", y: 30, group: 0 },
  { x: "2014-06-14", y: 10, group: 0 },
  { x: "2014-06-15", y: 15, group: 1 },
  { x: "2014-06-16", y: 30, group: 1 },
  { x: "2014-06-17", y: 10, group: 1 },
  { x: "2014-06-18", y: 15, group: 1 },
  { x: "2014-06-19", y: 52, group: 1 },
  { x: "2014-06-20", y: 10, group: 1 },
  { x: "2014-06-21", y: 20, group: 2 },
  { x: "2014-06-22", y: 600, group: 2 },
  { x: "2014-06-23", y: 100, group: 2 },
  { x: "2014-06-24", y: 250, group: 2 },
  { x: "2014-06-25", y: 300, group: 2 },
  { x: "2014-06-26", y: 200, group: 3 },
  { x: "2014-06-27", y: 600, group: 3 },
  { x: "2014-06-28", y: 1000, group: 3 },
  { x: "2014-06-29", y: 250, group: 3 },
  { x: "2014-06-30", y: 300, group: 3 },
];

var dataset = new vis.DataSet(items);
var options = {
  dataAxis: {
    showMinorLabels: false,
    right: {
      title: {
        text: "Title (right axis)",
      },
    },
  },
  legend: { left: { position: "bottom-left" } },
  start: "2014-06-09",
  end: "2014-07-03",
};
var graph2d = new vis.Graph2d(container, items, groups, options);

function showIcons(show) {
  graph2d.setOptions({ dataAxis: { icons: show } });
}

function showTitle(axis, show) {
  var title;
  if (show == true) {
    title = { text: "Title (" + axis + " axis)" };
  } else {
    title = { text: undefined };
  }

  if (axis == "left") {
    graph2d.setOptions({ dataAxis: { left: { title: title } } });
  } else {
    graph2d.setOptions({ dataAxis: { right: { title: title } } });
  }
}

var colors = ["red", "green", "blue", "black", "yellow", "purple", "pink"];
function styleTitle(axis) {
  var title;
  title = {
    style: "color: " + colors[Math.floor(Math.random() * colors.length) + 1],
  };

  if (axis == "left") {
    graph2d.setOptions({ dataAxis: { left: { title: title } } });
  } else {
    graph2d.setOptions({ dataAxis: { right: { title: title } } });
  }
}

