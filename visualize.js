import {csv} from "https://cdn.skypack.dev/d3-fetch@3";
var container = document.getElementById('visualization');
var items = []

function plot(items){
    var options = {
      defaultGroup: "",
      drawPoints: false,
      interpolation: false,
      legend: { left: { position: "bottom-left" } },
      start: Date.now()-1000*3600*24,
      end: Date.now()+1000*3600*1,
      graphHeight: "600px",
    };
    var graph2d = new vis.Graph2d(container, items, options);
  }

var url='https://meow.suprdory.com:8001/dict'
// var url='http://127.0.0.1:8001/dict'
// var url = 'https://192.168.1.200:8001/dict'

fetch(url)
  .then(response => response.json())
  // .then(data => console.log(data))
  .then(data => plot(Array.from(data)))

