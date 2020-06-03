import React from "react";
import { Marker } from "react-simple-maps";
import uuid from "uuid";
import { scaleLinear } from "d3-scale";
import ReactTooltip from "react-tooltip";
import { List } from "semantic-ui-react";
// style
import styles from "../../../css/worldMapStyles";

const grdColors = ["#000000", "#00CC44", "#88ff00", "#FFEE00", "#FF7700", "#FF0022", "#66CCFF", "#FF78A5", "#fffba7"];
const cityScale = scaleLinear()
    .domain([0, 37843000])
    .range([1, 48]);
const markerSize = [20, 24];

const markerShapePaths = [
    "M 38.875 12.960938 C 37.613281 6.019531 31.59375 0.75 24.351562 0.75 C 18.582031 0.75 13.59375 4.089844 11.160156 8.949219 C 5.210938 9.640625 0.59375 14.738281 0.59375 20.929688 C 0.59375 27.554688 5.875 32.921875 12.414062 32.992188 L 38.183594 32.992188 C 43.664062 32.992188 48.113281 28.496094 48.113281 22.957031 C 48.113281 17.667969 44.035156 13.328125 38.875 12.960938 Z M 38.875 12.960938",
    "M 20.832031 8.332031 L 8.332031 8.332031 C 6.042969 8.332031 4.1875 10.207031 4.1875 12.5 L 4.167969 37.5 C 4.167969 39.792969 6.042969 41.667969 8.332031 41.667969 L 41.667969 41.667969 C 43.957031 41.667969 45.832031 39.792969 45.832031 37.5 L 45.832031 16.667969 C 45.832031 14.375 43.957031 12.5 41.667969 12.5 L 25 12.5 Z M 20.832031 8.332031",
    "M 34.945312 17.558594 C 34.945312 27.097656 17.539062 49.683594 17.539062 49.683594 C 17.539062 49.683594 0.132812 27.097656 0.132812 17.558594 C 0.132812 8.019531 7.921875 0.289062 17.539062 0.289062 C 27.152344 0.289062 34.945312 8.019531 34.945312 17.558594 Z M 34.945312 17.558594"
];

const markerCloudPath = [
    "M 38.875 12.960938 C 37.613281 6.019531 31.59375 0.75 24.351562 0.75 C 18.582031 0.75 13.59375 4.089844 11.160156 8.949219 C 5.210938 9.640625 0.59375 14.738281 0.59375 20.929688 C 0.59375 27.554688 5.875 32.921875 12.414062 32.992188 L 38.183594 32.992188 C 43.664062 32.992188 48.113281 28.496094 48.113281 22.957031 C 48.113281 17.667969 44.035156 13.328125 38.875 12.960938 Z M 38.875 12.960938",
    "M 20.832031 8.332031 L 8.332031 8.332031 C 6.042969 8.332031 4.1875 10.207031 4.1875 12.5 L 4.167969 37.5 C 4.167969 39.792969 6.042969 41.667969 8.332031 41.667969 L 41.667969 41.667969 C 43.957031 41.667969 45.832031 39.792969 45.832031 37.5 L 45.832031 16.667969 C 45.832031 14.375 43.957031 12.5 41.667969 12.5 L 25 12.5 Z M 20.832031 8.332031",
    "M 34.945312 17.558594 C 34.945312 27.097656 17.539062 49.683594 17.539062 49.683594 C 17.539062 49.683594 0.132812 27.097656 0.132812 17.558594 C 0.132812 8.019531 7.921875 0.289062 17.539062 0.289062 C 27.152344 0.289062 34.945312 8.019531 34.945312 17.558594 Z M 34.945312 17.558594"
];

// self, city, i, config
const MarkerCloudlet = defaultProps => {
    const [idx, setIdx] = React.useState(defaultProps.idx);
    const [city, setCity] = React.useState(defaultProps.city);
    const [self, setSelf] = React.useState(defaultProps.self);
    const [config, setConfig] = React.useState(defaultProps.config);
    const [keyName, setKeyName] = React.useState(defaultProps.keyName);
    const [colorCode, setColorCode] = React.useState(defaultProps.gColor);
    const [tooltipMsg, setTooltipMsg] = React.useState("");
    let moveMouse = false;

    React.useEffect(() => {
        if (defaultProps.city) setCity(defaultProps.city);
    }, [defaultProps]);

    /** ******************************
    *
    ********************************* */

    const handleCityClick = () => {
        //
    };



    const handleLeaveMk = () => {
        // this.props.dispatch(hide())
        // ReactTooltip.hide(this.tooltipref);
        // this.moveMouse = false;
    };
    // const handleMouseDown = (a, b) => {
    //     const countries = CountryCode.ref_country_codes;
    //     let _lat = "";
    //     let _long = "";
    //     countries.map(country => {
    //         if (country.alpha2 === a.properties.ISO_A2) {
    //             _lat = country.latitude;
    //             _long = country.longitude;
    //         }
    //     });

    //     if (this.props.id == "Cloudlets") {
    //         const location = {
    //             region: a.properties.REGION_UN, name: a.properties.NAME, lat: _lat, long: _long, State: 5
    //         };

    //         const locationData = [
    //             {
    //                 name: a.properties.NAME,
    //                 coordinates: [_long, _lat],
    //                 population: 17843000,
    //                 cost: 3
    //             }];
    //         if (this.props.onMapClick) {
    //             this.props.onMapClick(location);
    //         }
    //         _self.setState({ cities: locationData, detailMode: false });
    //         _self.forceUpdate();
    //     }
    // };
    /** ******************************* */
    return (
        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
        <Marker
            className="markerTwo"
            marker={city}
            key={uuid()}
            coordinates={city.coordinates}
            onClick={handleCityClick}
            onMouseMove={() => {
                console.log("20200603 on mouse = ", city.name);
                defaultProps.handleTooltip(city.name);
            }
            }
            onMouseLeave={handleLeaveMk}
            style={{ cursor: "pointer" }}
        >
            {/* icon cloud circle */}
            <g
                // fill={grdColors[config.gColor]}
                // transform="translate(-12 -10) scale(0.8 0.8)"
                version="1.1"
                id="Layer_1"
                x="0px"
                y="0px"
                viewBox="0 0 50 50"
                style={{ enableBackground: "new 0 0 50 50" }}
                // blink
                className={[("blinkMark" + idx === keyName) ? keyName : null, (city.population > 35000000) ? "levelFive" : "levelOther"].join(" ")}
                // -blink
                cx={0}
                cy={0}
                r={cityScale(city.population - 200300)}
                fill="url(#levelBg)"
                stroke={styles.marker.stroke}
                strokeWidth={styles.marker.strokeWidth}
                transform={config.transform}
                mix-blend-mode="lighten"
            >
                {/* 필터 InnerGlow */}
                <defs>
                    <filter id="InnerGlow" colorInterpolationFilters="sRGB">
                        <feGaussianBlur id="GaussianBlur" result="GaussianBlurResult" stdDeviation="8" />
                        <feComposite id="Composite1" in2="GaussianBlurResult" result="CompositeResult1" in="SourceGraphic" operator="in" />

                        <feFlood
                            id="Flood"
                            result="FloodResult"
                            in="CompositeResult3"
                            floodOpacity="1"
                            floodColor={
                                (city.population > 35000000) ? grdColors[5]
                                    : (city.population <= 35000000 && city.population > 30000000) ? grdColors[4]
                                        : (city.population <= 30000000 && city.population > 25000000) ? grdColors[3]
                                            : (city.population <= 25000000 && city.population > 20000000) ? grdColors[2]
                                                : grdColors[6]
                            }
                        />
                        <feBlend id="Blend" in2="FloodResult" mode="normal" in="CompositeResult1" result="BlendResult1" />
                        <feComposite id="GaussianBlur" in2="SourceGraphic" result="CompositeResult3" operator="in" in="BlendResult1" />
                    </filter>
                </defs>
                {/* 필터 innershadow */}
                <defs>
                    <filter id="innershadow" x0="-50%" y0="-50%" width="200%" height="200%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur" />
                        <feOffset dy="2" dx="3" />
                        <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />

                        <feFlood
                            floodColor={
                                (city.population > 35000000) ? grdColors[5]
                                    : (city.population <= 35000000 && city.population > 30000000) ? grdColors[4]
                                        : (city.population <= 30000000 && city.population > 25000000) ? grdColors[3]
                                            : (city.population <= 25000000 && city.population > 20000000) ? grdColors[2]
                                                : grdColors[config.gColor]
                            }
                            floodOpacity="1"
                        />
                        <feComposite in2="shadowDiff" operator="in" />
                        <feComposite in2="SourceGraphic" operator="over" result="firstfilter" />


                        <feGaussianBlur in="firstfilter" stdDeviation="3" result="blur2" />
                        <feOffset dy="-2" dx="-3" />
                        <feComposite in2="firstfilter" operator="arithmetic" k2="-1" k3="1" result="shadowDiff" />

                        <feFlood
                            floodColor={
                                (city.population > 35000000) ? grdColors[5]
                                    : (city.population <= 35000000 && city.population > 30000000) ? grdColors[4]
                                        : (city.population <= 30000000 && city.population > 25000000) ? grdColors[3]
                                            : (city.population <= 25000000 && city.population > 20000000) ? grdColors[2]
                                                : grdColors[config.gColor]
                            }
                            floodOpacity="1"
                        />
                        <feComposite in2="shadowDiff" operator="in" />
                        <feComposite in2="firstfilter" operator="over" />
                    </filter>
                </defs>
                <path filter="url(#innershadow)" className={config.cName} d={markerCloudPath[0]} />
            </g>
            <g data-tip="tooltip" data-for="happyFace">
                <text
                    textAnchor="middle"
                    y={0}
                    className="marker_value"
                    style={{ fontSize: 12 }}
                >
                    {city.cost}
                </text>
            </g>
        </Marker>
    );
};

export default MarkerCloudlet;
