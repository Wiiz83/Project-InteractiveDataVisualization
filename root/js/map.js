
var width = 1200,
  height = 600;
var centered = null;
var year = 4222;

new Datamap({
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
    HIGH: "#afafaf",
    LOW: "#123456",
    MEDIUM: "blue",
    UNKNOWN: "rgb(0,0,0)",
    defaultFill: "green",
    bubble: "#000000"
  },
  done: function(datamap) {
    datamap.svg.selectAll(".datamaps-subunit").on("click", function(geography) {
      if (centered == geography) {
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
    });
  }
}).legend();

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
  return dataset_events.map(u => ({
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
}

function getColorFromKillNumber(mahdi) {
  if(mahdi <= 10){
    return "LOW";
  } else if ((500 < mahdi) && (mahdi > 10)){
    return "MEDIUM";
  } else {
    return "HIGH";
  }

}
var dataset_events;
d3.json("json/datas.json", function(data) {
       dataset_events = data.results;        

});

 function bubbleTemplate(geo, data) {
  // TODO
  return (
    "<div class='hoverinfo'>Bubble: " +
    data.event.name +
    "<br> prop1: " +
    data.event.prop1 +
    "</div>"
  );
}

 function countryTemplate(geography, data) {
  const stats = getCountryStats(geography, data);
  // TODO
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