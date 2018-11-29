var width = 1200;
var height = 600;
var centered = null;
var currentyear = 4222;
var map;
var current_dataset;
var init_dataset;

map = new Datamap({
  scope: "world",
  responsive: true,
  element: document.getElementById("map"),
  projection: "mercator",
  height: height,
  width: width,
  geographyConfig: {
    popupTemplate: countryTemplate
  },
  fills: {
    HIGH: "#C70039",
    LOW: "#FFFE33",
    MEDIUM: "#3385FF",
    //UNKNOWN: "rgb(0,0,0)",
    defaultFill: "green"
    //bubble: "#000000"
  },
  done: function(datamap) {
    $("#slider").on("input change", function() {
      currentyear = currentYearChanged();
      updateMap(datamap, centered, currentyear);
    });

    datamap.svg.selectAll(".datamaps-subunit").on("click", function(geography) {
      updateMap(datamap, geography, currentyear,true);
    });
  }
}).legend();

$(document).ready(function() {
  currentyear = currentYearChanged();
});

function currentYearChanged() {
  var slider = document.getElementById("slider");
  var output = document.getElementById("output");
  output.innerHTML = slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function() {
    output.innerHTML = this.value;
  };

  // Filtrer les données avec l'année choisie
  return slider.value;
}

function updateMap(datamap, geography, year,yearchange = true) {
  currentyear = year;
  if (centered == geography && !yearchange) {
    datamap.bubbles([]);
    zoomToWorld(datamap);
    centered = null;
  } else {
    centered = geography;
    datamap.bubbles(getCountryBubbles(datamap, geography, year), {
      popupTemplate: bubbleTemplate
    });
    zoomToCountry(datamap, geography);
  }
}

function zoomToWorld(map) {
  map.svg
    .selectAll(".datamaps-subunits")
    .transition()
    .duration(750)
    .style("stroke-width", "1.5px")
    .attr("transform", "");
}

function zoomToCountry(map, geography) {
  var path = d3.geo.path().projection(map.projection);
  var bounds = path.bounds(geography),
    dx = bounds[1][0] - bounds[0][0],
    dy = bounds[1][1] - bounds[0][1],
    x = (bounds[0][0] + bounds[1][0]) / 2,
    y = (bounds[0][1] + bounds[1][1]) / 2,
    scale = 0.9 / Math.max(dx / width, dy / height),
    translate = [width / 2 - scale * x, height / 2 - scale * y];

  map.svg
    .selectAll("g")
    .transition()
    .duration(400)
    .style("stroke-width", 1.5 / scale + "px")
    .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
}

// TODO
function getCountryStats(geo, data, year = null) {
  return {
    stat1: 10,
    stat2: 20
  };
}

//TODO
function getCountryBubbles(geo, data, year = null) {
  var r = current_dataset
  .filter(u => u.iyear == year)
  .map(u => ({
    event: u,
    latitude: u.latitude,
    longitude: u.longitude,
    borderWidth: 0.5,
    borderOpacity: 1,
    radius: 0.4,
    fillOpacity: 0.75,
    fillKey: getColorFromKillNumber(u.nkill),
    borderColor: "#000000"
  }));
  console.log(r);

  return r;
}

function getColorFromKillNumber(l) {
  if (l <= 10) {
    return "LOW";
  } else if (500 < l && l > 10) {
    return "MEDIUM";
  } else {
    return "HIGH";
  }
}

// Chargement des données
d3.json("json/convertcsv.json", function(data) {
  current_dataset = data;
  init_dataset = data;
});

//
function bubbleTemplate(geo, data) {
  return (
    "<div class='hoverinfo'>Bubble: " +
    data.event.name +
    "<br> prop1: " +
    data.event.prop1 +
    "</div>"
  );
}

//
function countryTemplate(geography, data) {
  const stats = getCountryStats(geography, data);
  return (
    "<div class='hoverinfo'>Country: " +
    geography.properties.name +
    " (" +
    geography.id +
    " )" +
    "<br> Stat1: " +
    stats.stat1 +
    "</div>"
  );
}

// Filter les données avec l'année courante
function changeCurrentYear(year) {
  if (current_dataset == undefined || init_dataset == undefined) {
    return;
  }
  current_dataset = init_dataset.filter(el => el.iyear == year);
  reloadMap();
}

// Recharge la map avec le nouveau dataset
function reloadMap() {
  map = new Datamap(map);
}
