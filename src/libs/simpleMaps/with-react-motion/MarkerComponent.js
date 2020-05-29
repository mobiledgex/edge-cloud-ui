import React from "react";
import { Marker } from "react-simple-maps";
import uuid from 'uuid';

// self, city, i, config
const MarkerComponent = props => {
    const [city, setCity] = React.useState(props.city);
    const [self, setSelf] = React.useState(props.self);

    return (
        <Marker
            className="markerTwo"
            key={uuid()}
            marker={city}
            onClick={self.handleCityClick}
            onMouseOver={self.handleMoveMk}
            onMouseMove={self.handleMoveMk}
            onMouseLeave={self.handleLeaveMk}
            style={{}}
        >

            <g

                version="1.1"
                id="Layer_1"
                x="0px"
                y="0px"
                viewBox="0 0 50 50"
                style={{ enableBackground: "new 0 0 50 50" }}
                // blink
                className={[("blinkMark" + i == self.state.keyName) ? self.state.keyName : null, (city.population > 35000000) ? "levelFive" : "levelOther"].join(" ")}
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
                <path filter="url(#innershadow)" className={config.cName} d={paths[config.path]} ref={ref => self.circle = ref} />
            </g>
            <g data-tip="tooltip" data-for="happyFace">
                <text
                    textAnchor="middle"
                    y={8}
                    className="marker_value"
                    style={{ fontSize: 24 }}
                >
                    {city.cost}
                </text>
            </g>
        </Marker>
    );
};

export default MarkerComponent;
