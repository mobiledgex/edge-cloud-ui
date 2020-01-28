import React, {Component} from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography, Markers, Marker
} from "react-simple-maps"
import {Button, Icon} from "semantic-ui-react";

const wrapperStyles = {
    width: "100%",
    maxWidth: 980,
    margin: "0 auto",
}

// url to a valid topojson file
const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"

export default class Test001 extends React.Component {

    state = {
        zoom: 0.6,
    }


    render() {
        return (
            <div style={{
                width: "100%",
                backgroundColor: '#4a4a4a',
                maxWidth: 1200,
                margin: "0 auto",
            }}>
                <ComposableMap
                    projectionConfig={{
                        scale: 500,
                        //rotation: [-11, 0, 0],
                    }}
                    width={980}
                    height={700}
                    style={{
                        width: "100%",
                        height: "auto",
                    }}
                >
                    <ZoomableGroup center={[0, 20]} zoom={this.state.zoom} onZoomEnd={(position) => {

                        this.setState({
                            zoom: position.zoom
                        })

                    }}>
                        <Geographies geography={geoUrl}>
                            {(geographies, projection) => geographies.map((geography, i) => geography.id !== "ATA" && (
                                <Geography
                                    key={i}
                                    geography={geography}
                                    projection={projection}
                                    style={{
                                        default: {
                                            fill: "#ECEFF1",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                        hover: {
                                            fill: "#607D8B",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                        pressed: {
                                            fill: "#FF5722",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                    }}
                                />
                            ))}
                        </Geographies>
                        <Markers>
                            <Marker marker={{ coordinates: [ 121.4747, 31.25516 ] }} style={{
                                hidden: {opacity: 0},
                            }}>
                                <svg width="25" height="25">

                                    <image href="https://image.flaticon.com/icons/svg/252/252116.svg" height="25" width="25"/>
                                </svg>
                            </Marker>
                            <Marker marker={{ coordinates: [ 50.4747, 25.25516 ] }} style={{
                                hidden: {opacity: 0},
                            }}>
                                <svg width="25" height="25">

                                    <image href="https://image.flaticon.com/icons/svg/252/252116.svg" height="25" width="25"/>
                                </svg>
                            </Marker>
                        </Markers>
                    </ZoomableGroup>

                </ComposableMap>
                <div className="controls" style={{marginTop: -100}}>
                    <Button id="mapZoomCtl" size='larges' icon onClick={() => {

                        this.setState({
                            zoom: 1,
                        })
                    }}>
                        <Icon name="expand"/>
                    </Button>
                    <Button id="mapZoomCtl" size='large' icon onClick={() => {
                        this.setState({
                            zoom: this.state.zoom * 1.2
                        })
                    }}>
                        <Icon name="plus square outline"/>
                    </Button>
                    <Button id="mapZoomCtl" size='large' icon onClick={() => {
                        this.setState({
                            zoom: this.state.zoom * 0.8
                        })
                    }}>
                        <Icon name="minus square outline"/>
                    </Button>
                </div>

            </div>
        )
    }
}


const styles = {
    geoBackground: {
        color: "transparent",
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
        levelColors: ["rgba(255,87,34,0.8)", "rgba(45,255,34,0.8)", "rgba(44,87,255,0.8)", "rgba(255,255,34,0.8)", "rgba(255,87,255,0.8)"],
        stroke: "rgba(255,255,255,0)",
        strokeWidth: 0,
        strokeOpacity: 0,
        second: {
            fill: "rgba(0,204,68,1)",
            stroke: "rgba(255,255,255,1)",
            strokeWidth: 0.4,
        },
    },
}
