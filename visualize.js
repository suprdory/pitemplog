import {csv} from "https://cdn.skypack.dev/d3-fetch@3";
var container = document.getElementById('visualization');

function plot(data){
    // var dataset = new vis.DataSet(data);
    var options = {
        drawPoints: false,
        interpolation: false,
    // start: '2014-06-10',
    // end: '2014-06-18'
    };
    // console.log(data)
    var graph2d = new vis.Graph2d(container, data, options);
}


csv("temp.csv").then(function(data) {
    data.forEach(function(d) {
    //   d.temp = +d.temp;
    d.x=d.x.substring(0,19)
    });
    plot(data); 
  });