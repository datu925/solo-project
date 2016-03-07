$(function() {

    var outerRadius = 960 / 2,
        innerRadius = outerRadius - 180;

    var svg = d3.select("body").append("svg")
        .attr("width", outerRadius * 2)
        .attr("height", outerRadius * 2)
      .append("g")
        .attr("transform", "translate(" + outerRadius + "," + outerRadius + ")");

    var fill = d3.scale.category20c();

    var chord = d3.layout.chord()
        .padding(.01)
        // .sortGroups(d3.descending);
        // .sortSubgroups(d3.descending)
        // .sortChords(d3.descending);

    var arc = d3.svg.arc()
        .innerRadius(innerRadius)
        .outerRadius(innerRadius + 20);

    var filepath;
    if ($("#filename").data("filename") === "states") {
      filepath = "/states.csv"
    } else {
      filepath = "/nhl.csv"
    }


  d3.csv(filepath, type, function(error, data) {

    var indexByState = d3.map();
    var stateByIndex = d3.map();
    var matrix = [];
    var i = 0

    data.forEach(function(d) {
      if (!indexByState.has(d.state1)) {
        stateByIndex.set(i, d.state1);
        indexByState.set(d.state1, i++);
      }
    });


    data.forEach(function(d) {
      var source = indexByState.get(d.state1),
          row = matrix[source];
      if (!row) {
       row = matrix[source] = [];
       for (var j = -1; ++j < i;) row[j] = 0;
      }
      row[indexByState.get(d.state2)] = +d.length;
    });

    chord.matrix(matrix);


    // size scale for data

    // determine the appropriate radius for the circle
    var g = svg.selectAll(".group")
        .data(chord.groups)
      .enter().append("g")
        .attr("class", "group");


    g.append("path")
        .style("fill", function(d) { return fill(d.index); })
        .style("stroke", function(d) { return fill(d.index); })
        .attr("d", arc)
        .on("mouseover", highlight)
        .on("mouseout", highlightReset);

    g.append("text")
        .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
        .attr("dy", ".35em")
        .attr("transform", function(d) {
          return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
              + "translate(" + (innerRadius + 26) + ")"
              + (d.angle > Math.PI ? "rotate(180)" : "");
        })
        .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
        .text(function(d) { return stateByIndex.get(d.index); });

    var chordPaths = svg.selectAll(".chord")
        .data(chord.chords)
      .enter().append("path")
        .attr("class", "chord")
        .attr("id", function(d) { return d.source.index; })
        .style("stroke", function(d) { return d3.rgb(fill(d.source.index)).darker(); })
        .style("fill", function(d) { return fill(d.source.index); })
        .attr("d", d3.svg.chord().radius(innerRadius))
        .on("mouseover", debug);


    function highlight(d, i) {
      chordPaths.classed("fade", function(p) {
                    return p.source.index != i
                        && p.target.index != i;
                  });
    }

    function highlightReset(d, i) {
      chordPaths.classed("fade", false);
    }
  });

  function type(d) {
    d.length = +d.length;
    return d;
  }


  function debug(d) {
    // debugger;
  }

});
