import * as L from "leaflet";

export const cellphoneIcon = L.icon({
    iconUrl: require('../images/cellhone_white003.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


export const cloudGreenIcon = L.icon({
    iconUrl: require('../images/cloud_green.png'),
    iconSize: [40, 21],
    iconAnchor: [20, 21],
    shadowSize: [41, 41]
});

export const cloudBlueIcon = L.icon({
    iconUrl: require('../images/cloud_blue2.png'),
    iconSize: [45, 39],//todo: width, height
    iconAnchor: [24, 30],//x,y
    shadowSize: [41, 41]
});


export const cloudRedIcon = L.icon({
    iconUrl: require('../images/red-clouds-xxl.png'),
    //shadowUrl : 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [40, 38],//todo: width, height
    iconAnchor: [24, 30],//x,y
    shadowSize: [41, 41]
});
