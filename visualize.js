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
      groups.add({
        id: 4,
        content: 'audiopi',
        visible: true,
        // Optional: a field 'visible'
        // Optional: a field 'className'
      });


    var options = {
      defaultGroup: "",
      drawPoints: false,
      interpolation: false,
      legend: { left: { position: "bottom-left" } },
      start: Date.now()-1000*3600*24,
      end: Date.now()+1000*3600*1,
    };
    // console.log(items)
    var graph2d = new vis.Graph2d(container, items, groups, options);
}


function read4thsource(){
  csv("temp_audiopi_1min.csv").then(function(data) {
    data.forEach(function(d) {
      // d.temp = +d.temp;
    d.x=d.x.substring(0,19)
    d.group='audiopi'
    });
    items=items.concat(data); 
    plot(items);
  });
}

function read3rdsource(){
    csv("temp_pizero_1min.csv").then(function(data) {
      data.forEach(function(d) {
      d.y = +d.y;
      // if (d.y == 0){
      //   d.y=null
      //   // d.x=null
      // }
      d.x=d.x.substring(0,19)
      d.group='pizero'
      });
      console.log(data)
      items=items.concat(data); 
      read4thsource();
    });
  }

function read2ndsource(){
    csv("temp_raspi2_1min.csv").then(function(data) {
      data.forEach(function(d) {
      d.x=d.x.substring(0,19)
      d.group='raspi2'
      });
      items=items.concat(data); 
      read3rdsource();
    });
  }

csv("temp_raspi_1min.csv").then(function(data) {
    data.forEach(function(d) {

    d.x=d.x.substring(0,19)
    d.group='raspi'
    });
    items=items.concat(data); 
    read2ndsource();
  });


