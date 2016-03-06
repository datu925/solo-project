$(function() {

    var margin = {top: 20, right: 30, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
        height = 700 - margin.top - margin.bottom;


    var chart = d3.select(".chart")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + (width / 2 + margin.left) + "," + (height / 2 + margin.top) + ")");

    var maxRadius = 70;


  d3.csv("/data.csv", function(error, data) {
    var states = data.map(function(d) { return d.state1 }).concat(data.map(function(d) { return d.state2 }));

    var unique_states = d3.map(states, function(d) { return d; }).values();

    var dataTree = {
        children: unique_states.map(function(d) { return { name: d} } )
    };

    // size scale for data

    // determine the appropriate radius for the circle
    var roughCircumference = 1600,
        radius = roughCircumference / (Math.PI * 2);

    var tree = d3.layout.tree()
        .size([360, radius]);

    var nodes = tree.nodes(dataTree);
    // debugger

    var circle = chart.selectAll("g")
      .data(nodes.slice(1))
    .enter().append("g")
      .attr("transform", function(d) {
        return "rotate(" + (d.x - 90) + ") translate(" + d.y + ")"; })

    circle.append("circle")
      .attr("class", "circle")
      .attr("r", 10)

    circle.append("text")
      .attr("class", "circle")
      .attr("text-anchor", "middle")
      .attr("dx", "1.5em")
      .text(function(d) { return d.name })


  });

});
