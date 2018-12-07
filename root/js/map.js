var width = 1200;
var height = 600;
var centered = null;
var currentyear = 2005;
var map;
var dataset;
var stats =[] ;
var map;
// Chargement des données
d3.json("json/output.json", function (data) {
  dataset = data;
  dataset.forEach(e => {
    if (!stats[e.iyear]) {
      stats[e.iyear]=[];
    }
    if (!stats[e.iyear][e.country_iso]) {
      stats[e.iyear][e.country_iso] = {
        n:0,
        success:0,
        nwound:0,
        nkill:0,
        iso : e.country_iso
      }
    }
    stats[e.iyear][e.country_iso].n ++;
    stats[e.iyear][e.country_iso].success += parseInt(e.success);
    stats[e.iyear][e.country_iso].nwound += isNaN(parseInt(e.nwound)) ? 0 : parseInt(e.nwound) ;
    stats[e.iyear][e.country_iso].nkill += isNaN(parseInt(e.nkill)) ? 0 : parseInt(e.nkill) ;
    stats[e.iyear][e.country_iso].fillKey =getCountryColorFromKillNumber(stats[e.iyear][e.country_iso].nkill);
  });
  map =  new Datamap({
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
      UNKNOWN: "#D8D8D8",
      LOW: "#ff9090",
      MEDIUM: "#ff0000",
      HIGH: "#a30000",
      defaultFill: "#D8D8D8"
    },
    done: function (datamap) {
      datamap.updateChoropleth(stats[currentyear]);
      $("#slider").on("input change", function () {
        currentyear = currentYearChanged();
        updateMap(datamap, centered, currentyear, true);
      });
      datamap.svg.selectAll(".datamaps-subunit").on("click", function (geography) {
        updateMap(datamap, geography, currentyear, false);
      });
    }
  }).legend();
});

$(document).ready(function () {
  currentyear = currentYearChanged();
});

function currentYearChanged() {
  var slider = document.getElementById("slider");
  var output = document.getElementById("output");
  output.innerHTML = slider.value; // Display the default slider value

  // Update the current slider value (each time you drag the slider handle)
  slider.oninput = function () {
    output.innerHTML = this.value;
  };

  // Filtrer les données avec l'année choisie
  return slider.value;
}

function updateMap(datamap, geography, year, yearchange = false) {
  currentyear = year;
  if (!yearchange)
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
  if (yearchange)
    if (centered == null) {
      datamap.bubbles([]);
      zoomToWorld(datamap);
    } else {
      centered = geography;
      datamap.bubbles(getCountryBubbles(datamap, geography, year), {
        popupTemplate: bubbleTemplate
      });
      zoomToCountry(datamap, geography,year);
    }
}

function zoomToWorld(map) {
  map.updateChoropleth(stats[currentyear]);
  map.svg
    .selectAll(".datamaps-subunits")
    .transition()
    .duration(750)
    .style("stroke-width", "1.5px")
    .attr("transform", "");
}

function zoomToCountry(map, geography,year) {
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

function getCountryColorFromKillNumber(l) {
  if (l==undefined) {
    return"UNKNOWN";
  }
  if (l <= 5) {
    return "LOW";
  } else if (l < 50) {
    return "MEDIUM";
  } else {
    return "HIGH";
  }
}



function countryTemplate(geography, data) {
  return (
    "<div class='hoverinfo'>Pays: " +
    geography.properties.name +
    (stats[currentyear][geography.id] != null ? 
      " <br>Nombre d'attaques: " +
      stats[currentyear][geography.id].n +
      " <br>Réussies: " +
      stats[currentyear][geography.id].success +
      " <br>Tués: " +
      stats[currentyear][geography.id].nkill +
      " <br>Blessés: " +
      stats[currentyear][geography.id].nwound 
       : "<br>Aucune donnée")
      +
    "</div>"
  );
}

function getCountryBubbles(geo, data, year = currentyear) {
  function getColorFromKillNumber(l) {
    if (l <= 1) {
      return "LOW";
    } else if (l < 10) {
      return "MEDIUM";
    } else {
      return "HIGH";
    }
  }
  return dataset
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
}

function bubbleTemplate(geo, data) {
  function armedAttackTypes(event) {
    str = "";
    if (event.attacktype2_txt !== "") {
      str += ", " + event.attacktype2_txt;
    }
    if (event.attacktype3_txt !== "") {
      str += ", " + event.attacktype2_txt;
    }
    return str;
  }

  function weapons(event) {
    str = event.weaptype1_txt;
    if (event.weaptype2_txt !== "") {
      str += ", " + event.weaptype2_txt;
    }
    if (event.weaptype3_txt !== "") {
      str += ", " + event.weaptype3_txt;
    }
    if (event.weaptype4_txt !== "") {
      str += ", " + event.weaptype4_txt;
    }
    return str;
  }

  function target(event) {
    str = event.targtype1_txt;
    if (event.targtype2_txt !== "") {
      str += ", " + event.targtype2_txt;
    }
    if (event.targtype3_txt !== "") {
      str += ", " + event.targtype3_txt;
    }
    return str;
  }
  return (
    "<div class='hoverinfo'> " +
    "Succès: " + (data.event.success == 1 ? 'Oui' : 'Non') +

    "<br> Ville: " + data.event.city +
    "<br> Date: " + data.event.iday + '/' + data.event.imonth + '/' + data.event.iyear +
    "<br> Cibles(s): " + target(data.event) +

    "<br> Tués: " + data.event.nkill +
    ' <br> Blessés:  ' + (data.event.nwound == null ? 'N/D' : data.event.nwound) +
    "<br> Type(s) d'attaque: " + data.event.attacktype1_txt + armedAttackTypes(data.event) +
    "<br> Type(s) d'armes: " + weapons(data.event) +
    "<br> Description: " + data.event.summary +
    "</div>"
  );
}