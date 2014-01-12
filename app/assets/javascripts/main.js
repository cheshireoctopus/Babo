$(function() {
  map();
});

function map() {
  // The SVG container for map
  var width = 960,
  height = 430;

  // Defines projection as an equirectangular projection, translates, and scales it
  var projection = d3.geo.equirectangular().translate([470, 260]).scale(155);

  // Defines the path of the projection
  var path = d3.geo.path().projection(projection);

  // Defines svg
  var svg = d3.select("#map").append("svg").attr("width", width).attr("height", height);

  // Define info div
  // var tt_Kenya = d3.select("#map").append("div").attr("class", "mminfo").attr("id", "tt_Kenya");
  // tt_Kenya.attr("style", "left:472px;top:275px").html("<div class='mmtitle'>KENYA</div>");

  // Queue's appropriate json and tsv files; awaits function 'ready'
  queue()
    .defer(d3.json, "d3-world.json")
    .defer(d3.tsv, "names.tsv")
    .await(ready);

  // Ready function; called from 'queue'
  function ready(error, world, names) {

    var countries = topojson.feature(world, world.objects.countries).features;
    console.log(countries[0]);
    console.log(countries);

    //Matches country projection with name from tsv
    countries.forEach(function(d) {
      d.name = names.filter(function(n) { return d.id == n.id; })[0].name;
    });

    var country = svg.selectAll(".mmcountry").data(countries);

    country.enter().insert("path").attr("class", function(d, i) {
      return hoverSpecific(d, i);
    }).attr("title", function(d, i) {
      return d.name;
    }).attr("d", path);

  }
  //End 'Ready' function

  function hoverSpecific(d, i) {
    return 'mmcountry countryHover';
  }

}
