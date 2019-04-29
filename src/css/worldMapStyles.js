const React = require("react");

const { StyleSheet } = React;

export default {
    geoBackground:{
        color:"transparent",
    },
    geography: {
        default: {
            fill: "rgba(71,82,102,0.65)",
            stroke: "rgba(255,255,255,0.3)",
            strokeWidth: 0.1,
            outline: "none"
        },
        hover: {
            fill: "rgba(96,106,128,0.9)",
            stroke: "rgba(255,255,255,0.5)",
            strokeWidth: 0.1,
            outline: "none",
        },
        pressed: {
            fill: "rgba(71,82,102,0.3)",
            stroke: "rgba(255,255,255,0.5)",
            strokeWidth: 0.1,
            outline: "none",
        }
    },
    marker: {
        levelColors:["rgba(255,87,34,0.8)","rgba(45,255,34,0.8)","rgba(44,87,255,0.8)","rgba(255,255,34,0.8)","rgba(255,87,255,0.8)"],
        stroke:"rgba(255,255,255,0)",
        strokeWidth: 0,
        strokeOpacity: 0,
        second: {
            fill:"rgba(0,204,68,1)",
            stroke:"rgba(255,255,255,1)",
            strokeWidth: 0.4,
        },
    },

};