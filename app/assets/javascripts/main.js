$(function() {
  w = ($('#map').width());
  h = (w/2.5);
  map();
});

function map() {
  color = d3.scale.linear().domain([5,89]).range(["rgb(192,192,192)","rgb(42,95,62)"]);

  // The SVG container for map
  var width = 960,
  height = 430;

  // Defines projection as an equirectangular projection, translates, and scales it
  var projection = d3.geo.equirectangular().translate([w/2.05, 260]).scale(175);

  // Defines the path of the projection
  var path = d3.geo.path().projection(projection);

  // Defines svg
  var svg = d3.select("#map").append("svg").attr("width", w).attr("height", h).attr("id", "world");

  // Queue's appropriate json and tsv files; awaits function 'ready'; the order of files deferred matters
  queue()
    .defer(d3.json, "d3-world.json")
    .defer(d3.tsv, "names.tsv")
    .await(ready);

  // Ready function; called from 'queue'; takes three params: error, world (1st defer), names (2nd defer);
  function ready(error, world, names) {

    // ?
    var countries = topojson.feature(world, world.objects.countries).features;

    //Matches country projection with name and number from tsv
    countries.forEach(function(d) {
      d.name = names.filter(function(n) { return d.id == n.id; })[0].name;
      d.number = names.filter(function(n) { return d.id == n.id; })[0].number;
    });

    // Define var 'country' as all svg elements with class 'country'; append data from var 'countries'
    var country = svg.selectAll(".country").data(countries);

    // ?
    country.enter().insert("path")
      .attr("class", function(d, i){
        return "country";
      })
      .attr("title", function(d, i) {
        return d.name;
      }).attr("d", path)
      .on("mouseover", function(d, i){
        d3.select(this).style("stroke","red").style("stroke-width","2px");
        d3.select("#mapinfo").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY) + "px");
        d3.select("#mapinfo").html("<p>"+d.name+"</p>"+"<p>"+d.number+"</p>").classed("hidden", false);
      })
      .on("mouseout", function(){
        d3.select(this).style("stroke","black").style("stroke-width","0.25px");
        d3.select("#mapinfo").classed("hidden", true);
      })
      .style("fill", function(d){
        return color(d.number);
      })
      .style("stroke","black")
      .style("stroke-width", "0.25px");
  }
  //End 'Ready' function

}


function hideAnt() {
  world = $('#world');
  abc = world.children()[6];
  abc.style.display='none';
}
