import {csv} from "https://cdn.skypack.dev/d3-fetch@3";
var container = document.getElementById('visualization');
var items = []

function plot(items){
    // var dataset = new vis.DataSet(items);
    var options = {
        drawPoints: false,
        interpolation: false,
    // start: '2014-06-10',
    // end: '2014-06-18'
    };
    // console.log(items)
    var graph2d = new vis.Graph2d(container, items, options);
}

function read2ndsource(){
    csv("temp2.csv").then(function(data) {
      data.forEach(function(d) {
      //   d.temp = +d.temp;
      d.x=d.x.substring(0,19)
      d.group=2
      });
      items=items.concat(data); 
      plot(items);
    });
  }

csv("temp.csv").then(function(data) {
    data.forEach(function(d) {
    //   d.temp = +d.temp;
    d.x=d.x.substring(0,19)
    d.group=1
    });
    // console.log(data[0])
    items=items.concat(data); 
    // console.log(items[0])
    // plot(items);
    read2ndsource();
  });


