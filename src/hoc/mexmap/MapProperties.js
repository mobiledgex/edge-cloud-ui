import * as L from "leaflet";
import { renderSVG, renderColorSVG } from "./constant";

export const cloudGreenIcon = (cost) => L.divIcon({
    html: `<div style="width:28px; height:28px">${renderSVG(1, cost)}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    className: 'map-marker'
});

export const cloudIcon = (key, color, cost) => L.divIcon({
    html: `<div style="width:28px; height:28px">${renderColorSVG(key, color, cost)}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    className: 'map-marker'
});

export const mobileIcon = L.icon({
    iconUrl: '/assets/images/mobile-tower-green.png',
    iconSize: [21, 34],
    iconAnchor: [20, 21],
    shadowSize: [41, 41]
});