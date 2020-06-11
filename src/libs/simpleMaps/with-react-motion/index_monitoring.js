import React, { useEffect } from "react";
import { Spring, config } from "react-spring/renderprops";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Line
} from "react-simple-maps";
import { isEqual } from "lodash";
import { selectAll, easeBack } from "d3";

import MarkerComponent from "./MarkerComponent";
import MarkerClient from "./MarkerClient";
import styles from "../../../css/worldMapStyles";


import { groupByCompare, groupBy } from "../../../utils";

const geoPaths = ["/topojson-maps/world-110m.json"];
const zoomControls = { center: [30, 40], zoom: 3 };

const ClusterMap = props => {
    const [toggle, setToggle] = React.useState(false);
    const [position, setPosition] = React.useState({ coordinates: [0, 0], zoom: 1 });

    const [clients, setClients] = React.useState([]);
    const [center, setCenter] = React.useState(zoomControls.center);
    const [zoom, setZoom] = React.useState(zoomControls.zoom);
    const [cities, setCities] = React.useState([]);
    const [countries] = React.useState([]);
    const [citiesSecond] = React.useState([]);
    const [detailMode] = React.useState(false);
    const [selectedCity] = React.useState([]);
    const [oldCountry] = React.useState("");
    const [unselectCity] = React.useState("");
    const [clickCities] = React.useState([]);
    const [saveMarker] = React.useState([]);
    const [keyName] = React.useState("");

    useEffect(() => {
        const initialData = (props.dataList) ? props.dataList : props.locData;
        const data = props.locData ? initialData : initialData.filter(item => item.fields.state === 5);
        const methodCount = 0;
        console.log("20200521 container widget   == 101010 =", initialData, ":", methodCount);

        function reduceUp(value) {
            return Math.round(value);
        }

        const locations = data.map(item => {
            if (item) {
                return ({
                    LAT: reduceUp(item.latitude), LON: reduceUp(item.longitude), cloudlet: item.cloudletName, methodCount: item.callCount
                });
            }
        });


        const locationData = [];
        const clientLocations = [];
        const groupbyData = groupByCompare(locations, ["LAT", "LON"]);

        const cloundletName = key => {
            const nameArray = [];
            groupbyData[key].map((item, i) => {
                nameArray[i] = item.cloudlet;
            });
            return nameArray;
        };

        Object.keys(groupbyData).map(key => {
            locationData.push({
                name: cloundletName(key), coordinates: [groupbyData[key][0].LON, groupbyData[key][0].LAT], population: 17843000, cost: groupbyData[key][0].methodCount
            });
            clientLocations.push({
                name: cloundletName(key), coordinates: [132, 37], population: 17843000, cost: groupbyData[key][0].methodCount
            });
        });
        //
        // const cloudlet = data.map(item => (
        //     { LAT: item.latitude, LON: item.longitude, cloudlet: item.cloudletName }
        // ));
        // const cloudletData = [];
        // const groupbyClData = groupBy(cloudlet, "cloudlet");
        // Object.keys(groupbyClData).map(key => {
        //     cloudletData.push({
        //         name: key, coordinates: [groupbyClData[key][0].LON, groupbyClData[key][0].LAT], population: 17843000, cost: methodCount
        //     });
        // });


        if (!isEqual(locationData, cities)) {
            const clickMarker = [];
            setZoom(props.locData ? zoom : 3);
            setCenter(props.locData ? center : zoomControls.center);

            if (props.mapDetails) {
                if (selectAll(".rsm-markers").selectAll(".levelFive")) {
                    selectAll(".rsm-markers").selectAll(".levelFive")
                        .transition()
                        .ease(easeBack)
                        .attr("r", markerSize[0]);
                }

                props.mapDetails.name.map((item, _i) => {
                    clickMarker.push({
                        name: item, coordinates: props.mapDetails.coordinates, population: 17843000, cost: 1
                    });
                });

                setZoom(4);
                setCenter(props.mapDetails.coordinates);
            }
            setCities(locationData);
            setClients(clientLocations);

            /** zoom in * */
            setTimeout(() => {
                // setToggle(true);
                pathOnBoard("45%", 0.45);

            }, 300);

        }
    }, [props]);

    function handleZoomIn() {
        if (position.zoom >= 4) return;
        setPosition(pos => ({ ...pos, zoom: pos.zoom * 2 }));
    }

    function handleZoomOut() {
        if (position.zoom <= 1) return;
        setPosition(pos => ({ ...pos, zoom: pos.zoom / 2 }));
    }

    function handleMoveEnd(position) {
        // setPosition(position);
    }

    // setTimeout(() => {
    //     setToggle(true);
    // }, 3000);
    function pathOnBoard(text, pos) {
        // Get the coordinates of the point that is the fraction 'pos' along the path
        const path = document.getElementById("connectLine");
        const pathLength = path.getTotalLength();
        const loc = path.getPointAtLength(pos * pathLength);

        // Make a div
        const element = document.getElementById("rect2829");
        element.setAttribute("x", loc.x);
        element.setAttribute("y", loc.y);
    }


    return (
        <Spring
            from={{ zoom: 1 }}
            to={{ zoom: toggle ? 3 : 1 }}
            config={{ clamp: true }}
        >
            {props => (
                <div>
                    <ComposableMap>
                        <ZoomableGroup
                            zoom={props.zoom}
                            center={position.coordinates}
                            onMoveEnd={handleMoveEnd}
                        >
                            <Geographies geography={geoPaths[0]}>
                                {({ geographies }) => geographies.map(geo => (
                                    <Geography key={geo.rsmKey} geography={geo} style={styles.geography} />
                                ))}
                            </Geographies>
                            <defs>
                                <marker
                                    id="Square"
                                    markerWidth="10"
                                    markerHeight="10"
                                    refX="5"
                                    refY="5"
                                    orient="auto"
                                >
                                    <path d="M 5,1 L 9,5 5,9 1,5 z" fill="#6a9100" />
                                </marker>
                                <marker
                                    id="Circle"
                                    markerWidth="10"
                                    markerHeight="10"
                                    refX="5"
                                    refY="5"
                                    orient="auto"
                                >
                                    <circle cx="5" cy="5" r="2" fill="dodgerblue" />
                                </marker>
                            </defs>
                            {
                                cities.map((city, i) => (
                                    <MarkerComponent
                                        self={this}
                                        city={city}
                                        idx={i}
                                        config={{
                                            transform: "translate(-24,-18)", gColor: 6, cName: "st1", path: 0
                                        }}
                                        keyName={keyName}
                                    />
                                ))
                            }
                            {
                                cities.map((city, i) => (
                                    <Line
                                        id="connectLine"
                                        from={city.coordinates}
                                        to={[132, 37]}
                                        stroke="greenyellow"
                                        strokeWidth={1}
                                        strokeLinecap="round"
                                        strokeDasharray="3,3"
                                    />
                                ))
                            }
                            {
                                clients.map((client, j) => (
                                    <MarkerClient
                                        self={this}
                                        city={client}
                                        idx={j}
                                        config={{
                                            transform: "translate(-24,-18)", gColor: 6, cName: "st1", path: 0
                                        }}
                                        keyName={keyName}
                                    />
                                ))
                            }
                            {
                                cities.map((city, i) => (
                                    <svg id="rect2829">
                                        <g
                                            data-tip="tooltip"
                                            data-for="happyFace"
                                        >
                                            <rect
                                                ry="4.4704852"
                                                height="21.048122"
                                                width="70.583839"
                                                cx="100"
                                                cy="50"
                                                style={{
                                                    fill: "#000000", stroke: "greenyellow", strokeWidth: 0.77330667, strokeOpacity: 1
                                                }}
                                            />
                                            <text
                                                id="text2852"
                                                textAnchor="middle"
                                                x={35}
                                                y={17}
                                                className="marker_value"
                                                fill="#AFAFAF"
                                                style={{ fontSize: 18 }}
                                            >
                                                {/* <textPath href="#connectLine" startOffset="50%"> */}
                                                {city.cost}
                                                {/* </textPath> */}
                                            </text>
                                        </g>
                                    </svg>
                                ))
                            }
                        </ZoomableGroup>
                    </ComposableMap>
                </div>
            )}
        </Spring>
    );
};

export default ClusterMap;

/*
<g data-tip="tooltip" data-for="happyFace">
                                        <text
                                            textAnchor="middle"
                                            y={8}
                                            className="marker_value"
                                            fill="#AFAFAF"
                                            style={{ fontSize: 18 }}
                                        >
                                            <textPath href="#connectLine" startOffset="45%">
                                                {city.cost}
                                            </textPath>

                                        </text>
                                    </g>
                                    */
