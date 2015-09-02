var Chord;

(function(){

Chord = function(countries, data) {

var chord = d3.layout.chord()
  .padding(.05)
  .sortSubgroups(d3.descending);

var width = 800,
  height = 700,
  innerRadius = Math.min(width, height) * .3,
  outerRadius = innerRadius * 1.1;

var fill = d3.scale.ordinal()
  .domain(d3.range(4))
  .range([ "#69FF00", "#00EBFF", "#FDB82B", "#FE004B", "#00FE8B",
      "#0050FF", "#FF00FF", "#FDFD00", "#A292FF", "#FFBD6A", "#068894",
      "#9F4454", "#D5140D", "#1874EC"]);

var svg = d3.select(".svg-container")
  .append("svg")
    .attr("width", width)
    .attr("height", height)
  .append("g")
    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

var aCountries = _.pluck(data, 'a_name'),
    bCountries = _.pluck(data, 'b_name'),
    allCountries = _.uniq(aCountries.concat(bCountries));

var matrix = [];
_.each(allCountries, function(a, a_index) {
  matrix[a_index] = matrix[a_index] || [];

  _.each(allCountries, function(b, b_index) {
    var relationship = _.findWhere(data, {a_name: a, b_name: b}) || {},
        count = +relationship.count || 0;

    matrix[a_index][b_index] = count;
  });
});

chord.matrix(matrix);

svg.append("g").selectAll("path")
    .data(chord.groups)
  .enter().append("path")
    .style("fill", function(d) { return fill(d.index); })
    .style("stroke", function(d) { return d3.rgb(fill(d.index)).darker(); })
    .attr("d", d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius))
    .on("mouseover", fade(.1))
    .on("mouseout", fade(1));

svg.append("g")
    .attr("class", "chord")
  .selectAll("path")
    .data(chord.chords)
  .enter().append("path")
    .attr("d", d3.svg.chord().radius(innerRadius))
    .style("fill", function(d) { return fill(d.target.index); })
    .style("stroke", function(d) { return d3.rgb(fill(d.target.index)).darker(); })
    .style("opacity", 1);

svg.append("g").selectAll("g")
    .data(chord.groups)
  .enter()
    .append("text")
  .each(function(d) { d.angle = (d.startAngle + d.endAngle) / 2; })
    .attr("dy", ".35em")
    .attr("transform", function(d) {
      return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")"
          + "translate(" + (innerRadius + 26) + ")"
          + (d.angle > Math.PI ? "rotate(180)" : "");
    })
    .style("text-anchor", function(d) { return d.angle > Math.PI ? "end" : null; })
    .text(function(d) {
      var iso = allCountries[d.index],
        country = _.findWhere(countries, {iso: iso});

      return country.country;
    });

// Returns an event handler for fading a given chord group.
function fade(opacity) {
  return function(g, i) {
    svg.selectAll(".chord path")
        .filter(function(d) { return d.source.index != i && d.target.index != i; })
      .transition()
        .style("opacity", opacity);
  };
}

};

})();
