import React, { useEffect } from "react";
import { Spring, config } from "react-spring/renderprops";
import {
    ComposableMap,
    Geographies,
    Geography,
    ZoomableGroup,
    Marker
} from "react-simple-maps";
import { isEqual } from "lodash";
import { Motion, spring } from "react-motion";
import * as d3 from "d3";
import styles from "../../../css/worldMapStyles";


import * as aggregation from "../../../utils";

const geoPaths = ["/topojson-maps/world-110m.json"];
const zoomControls = { center: [30, 40], zoom: 3 };

const ClusterMap = props => {
    const [toggle, setToggle] = React.useState(false);
    const [position, setPosition] = React.useState({ coordinates: [0, 0], zoom: 1 });


    const [center] = React.useState(zoomControls.center);
    const [zoom] = React.useState(zoomControls.zoom);
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
                return ({ LAT: reduceUp(item.latitude), LON: reduceUp(item.longitude), cloudlet: item.cloudletName, methodCount: item.callCount });
            }
        });


        const locationData = [];
        const groupbyData = aggregation.groupByCompare(locations, ["LAT", "LON"]);

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
        });
        //
        const cloudlet = data.map(item => (
            { LAT: item.latitude, LON: item.longitude, cloudlet: item.cloudletName }
        ));


        const cloudletData = [];

        const groupbyClData = aggregation.groupBy(cloudlet, "cloudlet");

        Object.keys(groupbyClData).map(key => {
            cloudletData.push({
                name: key, coordinates: [groupbyClData[key][0].LON, groupbyClData[key][0].LAT], population: 17843000, cost: methodCount
            });
        });


        if (!isEqual(locationData, cities)) {
            const clickMarker = [];
            let zoom = props.locData ? zoom : 3;
            let center = props.locData ? center : zoomControls.center;

            if (props.mapDetails) {
                if (d3.selectAll(".rsm-markers").selectAll(".levelFive")) {
                    d3.selectAll(".rsm-markers").selectAll(".levelFive")
                        .transition()
                        .ease(d3.easeBack)
                        .attr("r", markerSize[0]);
                }

                props.mapDetails.name.map((item, _i) => {
                    clickMarker.push({
                        name: item, coordinates: props.mapDetails.coordinates, population: 17843000, cost: 1
                    });
                });

                zoom = 4;
                center = props.mapDetails.coordinates;
            }
            setCities(locationData);
            // return {
            //     cities: locationData, center, zoom, detailMode: !!props.mapDetails, clickCities: clickMarker
            // };
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
        //setPosition(position);
    }

    setTimeout(() => {
        setToggle(true);
    }, 3000);

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
                            <Marker coordinates={[-101, 53]} fill="#777">
                                <svg width="190" height="160" xmlns="http://www.w3.org/2000/svg">
                                    <path d={`M 5 5 Q 50 5 100 100`} stroke="greenyellow" strokeDasharray="5,5" fill="transparent" />
                                </svg>
                            </Marker>
                        </ZoomableGroup>
                    </ComposableMap>
                </div>
            )}
        </Spring>
    );
};

export default ClusterMap;
