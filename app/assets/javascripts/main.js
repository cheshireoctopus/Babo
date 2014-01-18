$(function() {
  map();
  timerz();
  //Resize's SVG on window resize
  var world = $("#svg_world"),
        aspect = world.width() / world.height(),
        container = world.parent();
  $(window).on("resize", function() {
    var targetWidth = container.width();
    world.attr("width", targetWidth);
    world.attr("height", Math.round(targetWidth/aspect));
  }).trigger("resize");
  // var color = d3.scale.ordinal().domain([0,8]).range(["#f7fcf5","#e5f5e0","#c7e9c0","#a1d99b","#74c476","#41ab5d","#238b45","#006d2c","#00441b"] );
});

//Timer Function
function timerz() {
  setTimeout(function() {
    total();
  },1000);
  setTimeout(function() {
    undergraduate();
  },2000);
  setTimeout(function() {
    graduate();
  },3000);
  setTimeout(function() {
    exchange();
  },4000);
  setTimeout(function() {
    total();
  },5000);
}

//Main Map Function
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

    // Defines countries
    var countries = topojson.feature(world, world.objects.countries).features;

    //Loop that matches country projection with name and number from tsv
    countries.forEach(function(d) {
      d.name = names.filter(function(n) { return d.id == n.id; })[0].name;
      d.ugrad = names.filter(function(n) { return d.id == n.id; })[0].ugrad;
      d.grad = names.filter(function(n) {return d.id == n.id; })[0].grad;
      d.exchange = names.filter(function(n) {return d.id == n.id; })[0].exchange;
      d.total = names.filter(function(n) {return d.id == n.id;})[0].total;
    });

    // Define var 'country' as all svg elements with class 'country'; append data from var 'countries'
    var country = svg.selectAll(".country").data(countries);

    //For each country, inserts path and styling
    country.enter().insert("path")
      .attr("class", "country")
      .attr("title", function(d) {
        return d.name;
      }).attr("d", path)
      .style("fill", "#ddd")
      .style("cursor", "pointer")
      .style("stroke","black")
      .style("stroke-width", "0.25px");
  }
  //End 'Ready' function

}

window.onload = function() {

  path = d3.selectAll("path");
  mapinfo = d3.select("#mapinfo");

  // Event function
  var handler = function() {
    if (select.value == "Total Students") {
      total();
    } else if (select.value == "Undergraduate") {
      undergraduate();
    } else if (select.value == "Graduate") {
      graduate();
    } else if (select.value == "Exchange") {
      exchange();
    }

  };

  // Add event listener
  var select = document.getElementById('view');
  if(select.addEventListener){
    select.addEventListener('change',handler,false);
  } else {
    select.attachEvent('onchange',handler,false);
  }

};

function total() {
  path
      .on("mouseover", function(d){
        d3.select("#mapinfo").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY) + "px");
        d3.select("#mapinfo").html("<strong>"+d.name+"</strong><br><span class='toolStudent'>"+d.total+" Total students</span>").classed("hidden", false);
        d3.select(this).transition().style("stroke","black").style("stroke-width","1.25px");
      })
      .on("mouseout", function(){
        d3.select(this).transition().style("stroke","black").style("stroke-width","0.25px");
        d3.select("#mapinfo").classed("hidden", true);
      })
      .transition().style("fill",function(d){
        if (d.total == 0){
          return "#e5f5e0";
        } else if (d.total < 5){
          return "#a1d99b";
        } else if (d.total < 10){
          return "#74c476";
        } else if (d.total < 20){
          return "#41ab5d";
        } else if (d.total < 40){
          return "#238b45";
        } else if (d.total < 60){
          return "#006d2c";
        } else {
          return "#00441b";
        }
        });
}

function undergraduate() {
  path
      .on("mouseover", function(d){
        d3.select("#mapinfo").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY) + "px");
        d3.select("#mapinfo").html("<strong>"+d.name+"</strong><br><span class='toolStudent'>"+d.ugrad+" Undergraduate students</span>").classed("hidden", false);
        d3.select(this).transition().style("stroke","black").style("stroke-width","1.25px");
      })
      .on("mouseout", function(){
        d3.select(this).transition().style("stroke","black").style("stroke-width","0.25px");
        d3.select("#mapinfo").classed("hidden", true);
      })
      .transition(1000).style("fill",function(d){
        if (d.ugrad == 0){
          return "#e5f5e0";
        } else if (d.ugrad < 5){
          return "#a1d99b";
        } else if (d.ugrad < 10){
          return "#74c476";
        } else if (d.ugrad < 20){
          return "#41ab5d";
        } else if (d.ugrad < 40){
          return "#238b45";
        } else if (d.ugrad < 60){
          return "#006d2c";
        } else {
          return "#00441b";
        }
      });
}

function graduate() {
  path
      .on("mouseover", function(d){
        d3.select("#mapinfo").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY) + "px");
        d3.select("#mapinfo").html("<strong>"+d.name+"</strong><br><span class='toolStudent'>"+d.grad+" graduate students</span>").classed("hidden", false);
        d3.select(this).transition().style("stroke","black").style("stroke-width","1.25px");
      })
      .on("mouseout", function(){
        d3.select(this).transition().style("stroke","black").style("stroke-width","0.25px");
        d3.select("#mapinfo").classed("hidden", true);
      })
      .transition(1000).style("fill",function(d){
        if (d.grad == 0){
          return "#e5f5e0";
        } else if (d.grad < 5){
          return "#a1d99b";
        } else if (d.grad < 10){
          return "#74c476";
        } else if (d.grad < 20){
          return "#41ab5d";
        } else if (d.grad < 40){
          return "#238b45";
        } else if (d.grad < 60){
          return "#006d2c";
        } else {
          return "#00441b";
        }
      });
}

function exchange() {
  path
        .on("mouseover", function(d){
        d3.select("#mapinfo").style("left", (d3.event.pageX) + "px").style("top", (d3.event.pageY) + "px");
        d3.select("#mapinfo").html("<strong>"+d.name+"</strong><br><span class='toolStudent'>"+d.exchange+" exchange students</span>").classed("hidden", false);
        d3.select(this).transition().style("stroke","black").style("stroke-width","1.25px");
      })
      .on("mouseout", function(){
        d3.select(this).transition().style("stroke","black").style("stroke-width","0.25px");
        d3.select("#mapinfo").classed("hidden", true);
      })
      .transition(1000).style("fill",function(d){
        if (d.exchange == 0){
          return "#e5f5e0";
        } else if (d.exchange <= 1){
          return "#a1d99b";
        } else if (d.exchange <= 3){
          return "#238b45";
        } else {
          return "#00441b";
        }
      });
}
