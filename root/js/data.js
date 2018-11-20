// TODO
export function getCountryStats(geo, data, year = null) {
  return {
    stat1: 10,
    stat2: 20
  };
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

var dataset_events = [
  {
    name: "Hot",
    prop1: 45,
    latitude: 21.32,
    longitude: 5.32
  },
  {
    name: "Chilly",
    prop1: 45,
    latitude: -25.32,
    longitude: 120.32,
    radius: 1
  },
  {
    name: "Hot again",
    prop1: 45,
    latitude: 21.32,
    longitude: -84.32,
    radius: 1
  }
];
