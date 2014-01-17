$(function() {
  map();
  //Resize's SVG on window resize
  var world = $("#svg_world"),
        aspect = world.width() / world.height(),
        container = world.parent();
  $(window).on("resize", function() {
    var targetWidth = container.width();
    world.attr("width", targetWidth);
    world.attr("height", Math.round(targetWidth/aspect));
  }).trigger("resize");
});

function map() {
  // The SVG container for map
  var w = 960,
        h = 430;

  // Defines projection as an equirectangular projection, translates, and scales it
  var projection = d3.geo.equirectangular().translate([470,260]).scale(155);

  // Defines the path of the projection
  var path = d3.geo.path().projection(projection);

  // Defines svg
  var svg = d3.select("#map").append("svg").attr("viewBox","0 0 960 430").attr("width", w).attr("height", h).attr("id", "svg_world");

  // Queue's appropriate json and tsv files; awaits function 'ready'; the order of files deferred matters
  queue()
    .defer(d3.json, "d3-world.json")
    .defer(d3.tsv, "names.tsv")
    .await(ready);

  // Ready function; called from 'queue'; takes three params: error, world (1st defer), names (2nd defer);
  function ready(error, world, names) {

    // ?
    var countries = topojson.feature(world, world.objects.countries).features;

    //Loop that matches country projection with name and number from tsv
    countries.forEach(function(d) {
      d.name = names.filter(function(n) { return d.id == n.id; })[0].name;
      d.number = names.filter(function(n) { return d.id == n.id; })[0].number;
    });

    // Define var 'country' as all svg elements with class 'country'; append data from var 'countries'
    var country = svg.selectAll(".country").data(countries);

    // ?
    country.enter().insert("path")
      .attr("class", function(d){
        return "country";
      })
      .attr("title", function(d) {
        return d.name;
      }).attr("d", path)
      .on("mouseover", function(d){
        d3.select("#mapinfo").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY) + "px");
        d3.select("#mapinfo").html("<strong>"+d.name+"</strong><br><span class='toolStudent'>"+d.number+" students</span>").classed("hidden", false);
        d3.select(this).transition().style("stroke","black").style("stroke-width","1.25px");
      })
      .on("mouseout", function(){
        d3.select(this).transition().style("stroke","black").style("stroke-width","0.25px");
        d3.select("#mapinfo").classed("hidden", true);
      })
      .style("cursor", "pointer")
      .style("fill", function(d){
        if (d.number == 0){
          return "#e5f5e0";
        } else if (d.number < 5){
          return "#a1d99b";
        } else if (d.number < 10){
          return "#74c476";
        } else if (d.number < 20){
          return "#41ab5d";
        } else if (d.number < 40){
          return "#238b45";
        } else if (d.number < 60){
          return "#006d2c";
        } else {
          return "#00441b";
        }
      })
      .style("stroke","black")
      .style("stroke-width", "0.25px");
  }
  //End 'Ready' function

}

  // var color = d3.scale.ordinal().domain([0,8]).range(["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"] );

