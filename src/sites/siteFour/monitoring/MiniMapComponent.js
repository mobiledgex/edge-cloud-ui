import React, {Component} from "react"
import {
    ComposableMap,
    ZoomableGroup,
    Geographies,
    Geography, Markers, Marker, Annotation, Annotations
} from "react-simple-maps"
import {Button, Icon} from "semantic-ui-react";
import type {TypeAppInstance, TypeGridInstanceList, TypeUtilization} from "../../../shared/Types";
import {CircularProgress} from "@material-ui/core";
import Lottie from "react-lottie";

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"


type Props = {
    cloudletList: Array,

}

type State = {
    date: string,


}


export default class MiniMapComponent extends Component<Props, State> {
    state = {
        zoom: 0.45,
        cloudletList: [],
    }

    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        if (this.props.cloudletList !== nextProps.cloudletList) {
            await this.setState({
                cloudletList: nextProps.cloudletList,
            });

            //this.state.cloudletList["0"].CloudletLocation.latitude
            //this.state.cloudletList["0"].CloudletLocation.longitude
            //this.state.cloudletList["0"].CloudletName

            console.log('cloudletList===>', this.state.cloudletList);
        }
    }


    render() {
        return (
            <div style={{
                width: "100%",
                backgroundColor: '#23252c',
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
                            {this.state.cloudletList.map(item => {

                                return (
                                    <Marker marker={{coordinates: [item.CloudletLocation.longitude, item.CloudletLocation.latitude]}} style={{
                                        hidden: {opacity: 0},
                                    }}>
                                        <svg width="35" height="35">
                                            <image href="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png" style={{color: 'red'}} height="35" width="35"/>
                                        </svg>

                                        <text textAnchor="middle" fill="#77BD25" style={{fontSize: 20, fontFamily: "Roboto, sans-serif", fontWeight: 'bold'}}>
                                            {item.CloudletName.toString().substring(0, 17) + "..."}
                                        </text>
                                    </Marker>
                                )
                            })}
                        </Markers>
                    </ZoomableGroup>

                </ComposableMap>
                {this.props.loading &&
                <div style={{left: '39%', top: '32%', position: 'absolute'}}>
                    <Lottie
                        options={{
                            loop: true,
                            autoplay: true,
                            animationData: require('../../../lotties/pinjump'),
                            rendererSettings: {
                                preserveAspectRatio: 'xMidYMid slice'
                            }
                        }}
                        height={150}
                        width={150}
                        isStopped={false}
                        isPaused={false}
                    />
                </div>
                }
                <div className="controls" style={{marginTop: -190}}>
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
