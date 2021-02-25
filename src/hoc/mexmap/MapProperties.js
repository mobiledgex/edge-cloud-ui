import * as L from "leaflet";

export const cloudGreenIcon = L.icon({
    iconUrl: require('../helper/images/cloud_green.png'),
    iconSize: [40, 21],
    iconAnchor: [20, 21],
    shadowSize: [41, 41]
});

export const mobileIcon = L.icon({
    iconUrl: require('../helper/images/mobile-tower-green.png'),
    iconSize: [21, 34],
    iconAnchor: [20, 21],
    shadowSize: [41, 41]
});