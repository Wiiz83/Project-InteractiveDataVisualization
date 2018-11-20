import { getCountryStats } from "./data.js";

export function bubbleTemplate(geo, data) {
  // TODO
  return (
    "<div class='hoverinfo'>Bubble: " +
    data.event.name +
    "<br> prop1: " +
    data.event.prop1 +
    "</div>"
  );
}

export function countryTemplate(geography, data) {
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
