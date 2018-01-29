$( document ).ready(function () {

  var colors = d3.scaleOrdinal(d3.schemeCategory10);

  var svg = d3.select("svg"),
      width = +svg.attr("width"),
      height = +svg.attr("height"),
      link, node;

  svg.append('defs').append('marker')
      .attrs({'id':'arrowhead',
          'viewBox':'-0 -5 10 10',
          'refX':13,
          'refY':0,
          'orient':'auto',
          'markerWidth':13,
          'markerHeight':13,
          'xoverflow':'visible'})
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .style('stroke','none');

  var simulation = d3.forceSimulation()
      .force("link", d3.forceLink().id(function (d) {return d.name;}).strength(0))
      .force("charge", d3.forceManyBody().strength(0))
      .force("collision", d3.forceCollide().radius(6).strength(1))
      .force("x", d3.forceX(7*width/8 + width/16).strength(1))
      .force("y", d3.forceY(height/2));

  d3.json("data4.json", function (error, graph) {
    if (error) throw error;
    update(graph.links, graph.nodes);
  });

  function update(links, nodes) {
    link = svg.append("g")
        .attr("class", "link")
        .selectAll("line")
        .data(links)
        .enter()
        .append("line")
        .attr("class", "link")
        .attr('marker-end','url(#arrowhead)');

    node = svg.append("g")
          .attr("class", "node")
          .selectAll("circle")
          .data(nodes)
          .enter()
          .append("circle")
          .attr("r", 5)
          .style("fill", function (d, i) {return colors(i);})
          .call(d3.drag()
                  .on("start", dragstarted)
                  .on("drag", dragged)
                  .on("end", dragended));

    text = svg.append("g")
          .attr("class", "text")
          .selectAll("text")
          .data(nodes)
          .enter()
          .append("text")
          .style("font-size", "12px")
          .text(function(d) {return d.name;});

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);
  }

  function ticked() {
    link
        .attr("x1", function (d) {return d.source.x;})
        .attr("y1", function (d) {return d.source.y;})
        .attr("x2", function (d) {return d.target.x;})
        .attr("y2", function (d) {return d.target.y;});

    node
        .attr("cx", function(d) {return d.x;})
        .attr("cy", function(d) {return d.y;});

    text
        .attr("x", function(d) {return d.x + 5;})
        .attr("y", function(d) {return d.y;});
  }

  function dragstarted(d) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
  }

  function dragended(d) {
    if (!d3.event.active) simulation.alphaTarget(0);
    simulation.force("x", d3.forceX().strength(0))
        .force("y", d3.forceY().strength(0));
    for (i = 0; i < 8; i++) {
      if (d3.event.x < 0) {
        d.fx = width/16;
      } else if ((i*width/8 <= d3.event.x)&&((i + 1)*width/8 >= d3.event.x)) {
        d.fx = i*width/8 + width/16;
        break;
      } else {
        d.fx = 7*width/8 + width/16;
      }
    }
    d.fy = null;
  }

});
