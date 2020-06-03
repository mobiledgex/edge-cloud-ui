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
import ReactTooltip from "react-tooltip";
import { List } from "semantic-ui-react";

import MarkerCloudlet from "./MarkerCloudlet";
import MarkerClient from "./MarkerClient";
import styles from "../../../css/worldMapStyles";

import RadialGradientSVG from "../../../chartGauge/radialGradientSVG";
import { groupByCompare, groupBy } from "../../../utils";

const geoPaths = ["/topojson-maps/world-110m.json"];
const zoomControls = { center: [30, -40], zoom: 3 };
const grdColors = ["#000000", "#00CC44", "#88ff00", "#FFEE00", "#FF7700", "#FF0022", "#66CCFF", "#FF78A5", "#fffba7"];

const ClusterMap = props => {
    const [toggle, setToggle] = React.useState(false);
    const [position, setPosition] = React.useState({ coordinates: zoomControls.center, zoom: zoomControls.zoom });

    const [clients, setClients] = React.useState([]);
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
    const [tooltipMsg, setTooltipMsg] = React.useState();

    useEffect(() => {
        const initialData = (props.dataList) ? props.dataList : props.locData;
        const data = props.locData ? initialData : initialData.length > 0 ? initialData.filter(item => item.state === 5) : [];
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
            console.log("20200603 props city == ", groupbyData[key], ":", groupbyData);
            locationData.push({
                name: cloundletName(key), coordinates: [groupbyData[key][0].LON, groupbyData[key][0].LAT], population: 17843000, cost: groupbyData[key].length
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
            let zoom = props.locData ? zoom : 3;
            let center = props.locData ? center : zoomControls.center;

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

                zoom = 4;
                center = props.mapDetails.coordinates;
            }
            setCities(locationData);
            setClients(clientLocations);
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

    // const makeList = (obj) => (
    //     <List>
    //         {obj.map((key, i) => (
    //             <List.Item key={i}>

    //                 {key}

    //             </List.Item>
    //         ))
    //         }
    //     </List>

    // );
    const makeList = (obj) => {
        let stringValue = "";
        obj.map(text => {
            stringValue += (text + " \n ")
        });
        return stringValue;
    };
    const handleTooltip = names => {
        ReactTooltip.rebuild();
        ReactTooltip.show();
        setTooltipMsg(makeList(names));
    };

    // setTimeout(() => {
    //     setToggle(true);
    // }, 3000);

    return (
        <Spring
            from={{ zoom: 1 }}
            to={{ zoom: toggle ? 3 : 1 }}
            config={{ clamp: true }}
        >
            {props => (
                <div>
                    <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[5]} endColor={grdColors[5]} idCSS="levelFive" rotation={0} />
                    <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[4]} endColor={grdColors[4]} idCSS="levelFour" rotation={0} />
                    <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[3]} endColor={grdColors[3]} idCSS="levelThree" rotation={0} />
                    <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[2]} endColor={grdColors[2]} idCSS="levelTwo" rotation={0} />
                    <RadialGradientSVG startColor="#394251" middleColor="#394251" endColor="#394251" idCSS="levelBg" rotation={0} />
                    <ReactTooltip id="happyFace" className="customToolTip" type="dark" effect="float" style={{ left: "-100px" }}>
                        <span>{tooltipMsg}</span>
                    </ReactTooltip>
                    <ComposableMap
                        style={{
                            backgroundColor: styles.geoBackground.color
                        }}
                    >
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
                            {
                                cities.map((city, i) => (
                                    <MarkerCloudlet
                                        self={this}
                                        city={city}
                                        idx={i}
                                        config={{
                                            transform: "translate(-12,-12) scale(0.5)", gColor: 6, cName: "st1", path: 0
                                        }}
                                        keyName={keyName}
                                        handleTooltip={handleTooltip}
                                    />
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
