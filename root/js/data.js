// TODO
export function getCountryStats(geo, data, year = null) {
  return {
    stat1: 10,
    stat2: 20
  };
}

d3.json("json/datas.json", function(datas) {

  dataset_events=datas.results;
}

//TODO
export function getCountryBubbles(geo, data, year = null) {
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

export function getColorFromKillNumber(mahdi) {
  if(mahdi <= 10){
    return "LOW";
  } else if ((500 < mahdi) && (mahdi > 10)){
    return "MEDIUM";
  } else {
    return "HIGH";
  }

}

var dataset_events;