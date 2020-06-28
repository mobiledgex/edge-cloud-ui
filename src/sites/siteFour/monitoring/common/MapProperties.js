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
    //shadowUrl : 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [40, 21],
    iconAnchor: [20, 21],
    shadowSize: [41, 41]
});

export const cloudBlueIcon = L.icon({
    iconUrl: require('../images/cloud_blue2.png'),
    //shadowUrl : 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
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

export const mapTileList = [
    {
        url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
        name: 'dark1',
        value: 0,
    },
    {
        url: 'https://cartocdn_{s}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png',
        name: 'dark2',
        value: 1,
    },
    {
        url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
        name: 'dark3',
        value: 2,
    },

    {
        url: 'https://cartocdn_{s}.global.ssl.fastly.net/base-flatblue/{z}/{x}/{y}.png',
        name: 'blue',
        value: 3,
    },
    {
        url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
        name: 'light2',
        value: 4,
    },
    {
        url: 'https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png',
        name: 'light3',
        value: 5,
    },
    {
        url: 'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
        name: 'light4',
        value: 6,
    },
]
