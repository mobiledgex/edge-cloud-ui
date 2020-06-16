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
import { Button, Icon, List } from "semantic-ui-react";

import MarkerCloudlet from "./MarkerCloudlet";
import MarkerClient from "./MarkerClient";
import styles from "../../../css/worldMapStyles";

import RadialGradientSVG from "../../../chartGauge/radialGradientSVG";
import { groupByCompare, groupBy } from "../../../utils";

const geoPaths = ["/topojson-maps/world-110m.json"];
const zoomControls = { center: [30, -40], zoom: 1 };
const grdColors = ["#000000", "#00CC44", "#88ff00", "#FFEE00", "#FF7700", "#FF0022", "#66CCFF", "#FF78A5", "#fffba7"];
const markerSize = [20, 24];
let moveMouse = false;

const ClusterMap = props => {
    const [toggle, setToggle] = React.useState(false);
    const [position, setPosition] = React.useState({ coordinates: zoomControls.center, zoom: zoomControls.zoom });
    const [transform, setTransform] = React.useState();
    const [clients, setClients] = React.useState([]);
    const [center, setCenter] = React.useState(zoomControls.center);
    const [zoom, setZoom] = React.useState(1);
    const [cities, setCities] = React.useState([]);
    const [countries] = React.useState([]);
    const [citiesSecond] = React.useState([]);
    const [detailMode, setDetailMode] = React.useState(false);
    const [selectedCity, setSelectedCity] = React.useState([]);
    const [oldCountry, setOldCountry] = React.useState("");
    const [unselectCity] = React.useState("");
    const [clickCities, setClickCities] = React.useState([]);
    const [saveMarker] = React.useState([]);
    const [keyName] = React.useState("");
    const [tooltipMsg, setTooltipMsg] = React.useState();

    useEffect(() => {
        const initialData = (props.dataList) ? props.dataList : props.locData;
        const data = props.locData ? initialData : initialData.length > 0 ? initialData.filter(item => item.state === 5) : [];
        const methodCount = 0;

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
            // let zoom = props.locData ? zoom : 3;
            // let center = props.locData ? center : zoomControls.center;

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

                // zoom = 4;
                // center = props.mapDetails.coordinates;
            }
            setCities(locationData);
            setClients(clientLocations);
        }
    }, [props]);

    const handleZoomIn = () => {
        if (zoomControls.zoom >= 4) {
            zoomControls.zoom = 4;
            return;
        }
        zoomControls.zoom++;
        setToggle(true);
        // setZoom(zoomControls.zoom);
        setPosition(pos => ({ ...pos, zoom: pos.zoom * 2 }));
    };

    const handleZoomOut = () => {
        if (zoomControls.zoom <= 1) {
            zoomControls.zoom = 1;
            return;
        }
        zoomControls.zoom--;
        setToggle(true);
        // setZoom(zoomControls.zoom);
        setPosition(pos => ({ ...pos, zoom: pos.zoom / 2 }));
    };

    const handleReset = () => {
        setPosition(pos => ({ ...pos, zoom: 1 }));
        setCenter(zoomControls.center);
        setZoom(1);
        setDetailMode(false);
        setToggle(false);
        if (props.onClick) { props.onClick(); }
    };

    function handleMoveEnd(position) {
        console.log("20200614 move pos = ", position);
        setPosition(position);
    }

    const makeList = obj => {
        let stringValue = "";
        obj.map(text => {
            stringValue += (text + " \n ");
        });
        return stringValue;
    };
    const handleTooltip = names => {
        ReactTooltip.rebuild();
        ReactTooltip.show();
        setTooltipMsg(names);
    };
    const makeListItem = names => (
        names.map(name => (
            <List.Item>{name}</List.Item>
        ))
    );

    const handleCityClick = city => {
        if (selectAll(".rsm-markers").selectAll(".levelFive")) {
            selectAll(".rsm-markers").selectAll(".levelFive")
                .transition()
                .ease(easeBack)
                .attr("r", markerSize[0]);
        }
        const clickMarker = [];
        if (city) {
            city.name.map((item, i) => {
                clickMarker.push({
                    name: item, coordinates: city.coordinates, population: 17843000, cost: 1
                });
            });
        }
        setZoom(4);
        setCenter(city.coordinates);
        setDetailMode(true);
        setClickCities(clickMarker);
        // if (this.props.onClick) {
        //     this.props.onClick(city)
        // }
    };

    const handleViewZone = country => {
        // change the data of detail Info
        setSelectedCity(country.name);
        if (selectAll(".detailMarker_" + oldCountry)) {
            selectAll(".detailMarker_" + oldCountry)
                .transition()
                .attr("r", markerSize[0])
                .style("opacity", 1);
        }
        setOldCountry(country.name);
    };

    const handleMoveMk = (marker, evt) => {
        const x = evt.clientX;
        const y = evt.clientY + window.pageYOffset;
        let names = [];
        if (marker.name.length) {
            names = makeList(marker.name);
        }

        setTooltipMsg((typeof names === "object") ? names : marker.name);
        if (!moveMouse) {
            ReactTooltip.rebuild();
        }

        moveMouse = true;
    };

    const handleLeaveMk = () => {
        // this.props.dispatch(hide())
        ReactTooltip.hide();
        moveMouse = false;
    };

    // setTimeout(() => {
    //     setToggle(true);
    // }, 3000);

    return (
        <div className="mapMainContainer">
            {detailMode
                ? <div
                    className="zoom-inout-reset-clusterMap"
                    style={{
                        paddingLeft: 8, top: 290, position: "absolute", display: "block"
                    }}
                >
                    <Button id="mapZoomCtl" size="large" icon onClick={handleReset}>
                        <Icon name="compress" />
                    </Button>
                </div>
                : <div
                    className="zoom-inout-reset-clusterMap"
                    style={{
                        paddingLeft: 8, top: 290, position: "absolute", display: "block"
                    }}
                >
                    <Button id="mapZoomCtl" size="large" icon onClick={handleReset}>
                        <Icon name="expand" />
                    </Button>

                    <Button id="mapZoomCtl" size="large" icon onClick={handleZoomIn}>
                        <Icon name="plus square outline" />
                    </Button>
                    <Button id="mapZoomCtl" size="large" icon onClick={handleZoomOut}>
                        <Icon name="minus square outline" />
                    </Button>
                </div>}
            <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[5]} endColor={grdColors[5]} idCSS="levelFive" rotation={0} />
            <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[4]} endColor={grdColors[4]} idCSS="levelFour" rotation={0} />
            <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[3]} endColor={grdColors[3]} idCSS="levelThree" rotation={0} />
            <RadialGradientSVG startColor={grdColors[0]} middleColor={grdColors[2]} endColor={grdColors[2]} idCSS="levelTwo" rotation={0} />
            <RadialGradientSVG startColor="#394251" middleColor="#394251" endColor="#394251" idCSS="levelBg" rotation={0} />
            <ReactTooltip id="happyFace" className="customToolTip" type="dark" effect="float">
                <List>{tooltipMsg && tooltipMsg.length > 0 ? makeListItem(tooltipMsg) : null}</List>
            </ReactTooltip>
            <Spring
                from={{ zoomS: 1 }}
                to={{ zoomS: zoom }}
                config={{ clamp: true }}
            >
                {_props => (
                    <div>

                        <ComposableMap
                            style={{
                                backgroundColor: styles.geoBackground.color
                            }}
                        >
                            <ZoomableGroup
                                zoom={_props.zoomS}
                                center={position.coordinates}
                                // zoom={position.zoom}
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
                                                transform, gColor: 6, cName: "st1", path: 0
                                            }}
                                            keyName={keyName}
                                            handleTooltip={handleTooltip}
                                            onClick={handleCityClick}
                                            onMouseOver={handleMoveMk}
                                            onMouseMove={handleMoveMk}
                                            onMouseLeave={handleLeaveMk}
                                        />
                                    ))
                                }
                            </ZoomableGroup>
                        </ComposableMap>
                    </div>
                )}
            </Spring>
        </div>
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
