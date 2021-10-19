import {csv} from "https://cdn.skypack.dev/d3-fetch@3";
var container = document.getElementById('visualization');
var items = []

function plot(items){
    // var dataset = new vis.DataSet(items);
    var groups = new vis.DataSet();
    groups.add({
        id: 1,
        content: 'raspi',
        // Optional: a field 'visible'
        // Optional: a field 'className'
      })
      groups.add({
        id: 2,
        content: 'raspi2',
        // Optional: a field 'visible'
        // Optional: a field 'className'
      })
      groups.add({
        id: 3,
        content: 'pizero',
        visible: true,
        // Optional: a field 'visible'
        // Optional: a field 'className'
      });

    var options = {
        drawPoints: false,
        interpolation: false,
        legend: { left: { position: "bottom-left" } }
    // start: '2014-06-10',
    // end: '2014-06-18'
    };
    // console.log(items)
    var graph2d = new vis.Graph2d(container, items, groups, options);
}

function read3rdsource(){
    csv("temp0.csv").then(function(data) {
      data.forEach(function(d) {
      //   d.temp = +d.temp;
      d.x=d.x.substring(0,19)
      d.group=3
      });
      items=items.concat(data); 
      plot(items);
    });
  }

function read2ndsource(){
    csv("temp2.csv").then(function(data) {
      data.forEach(function(d) {
      d.x=d.x.substring(0,19)
      d.group=2
      });
      items=items.concat(data); 
      read3rdsource();
    });
  }

csv("temp.csv").then(function(data) {
    data.forEach(function(d) {

    d.x=d.x.substring(0,19)
    d.group=1
    });
    items=items.concat(data); 
    read2ndsource();
  });


