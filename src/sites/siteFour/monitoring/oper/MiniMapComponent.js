import React, {Component} from "react"
import {ComposableMap, Geographies, Geography, Marker, Markers, ZoomableGroup} from "react-simple-maps"
import {Button, Icon} from "semantic-ui-react";
import Lottie from "react-lottie";

const geoUrl =
    "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json"


type Props = {
    cloudletList: Array,

}

type State = {
    date: string,
    zoom: number,
    cloudletList: Array,
}


export default class MiniMapComponent extends Component<Props, State> {


    constructor(props) {
        super(props);
        this.state = {
            zoom: 0.45,
            cloudletList: [],
        }

        this.handleWheel = this.handleWheel.bind(this);
    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        if (this.props.cloudletList !== nextProps.cloudletList) {
            await this.setState({
                cloudletList: nextProps.cloudletList,
            });

            //this.state.cloudletList["0"].CloudletLocation.latitude
            //this.state.cloudletList["0"].CloudletLocation.longitude
            //this.state.cloudletList["0"].CloudletName
            console.log('componentWillReceiveProps_cloudletList===>', this.state.cloudletList);
        }
    }


    handleWheel(event) {
        event.preventDefault();
        console.log("scroll detected");
        console.log(event.deltaY);

        if (event.deltaY > 0) {
            this.setState({
                zoom: this.state.zoom / 1.1
            });
        }
        if (event.deltaY < 0) {
            this.setState({
                zoom: this.state.zoom * 1.1
            });
        }
    }

    handleDoubleClick = evt => {
        this.setState({
            zoom: this.state.zoom * 1.4
        })
    }

    render() {
        return (
            <div style={{
                width: "100%",
                backgroundColor: '#23252c',
                maxWidth: 1200,
                margin: "0 auto",
            }}
                 onDoubleClick={this.handleDoubleClick}
            >
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
                        <Geographies
                            geography={geoUrl}

                        >
                            {(geographies, projection) => geographies.map((geography, i) => geography.id !== "ATA" && (
                                <Geography
                                    key={i}
                                    onWheel={(e) => {
                                        this.handleWheel(e)
                                    }}
                                    geography={geography}
                                    projection={projection}
                                    style={{
                                        default: {
                                            fill: "#607D8B",
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
                                            fill: "#607D8B",
                                            stroke: "#607D8B",
                                            strokeWidth: 0.75,
                                            outline: "none",
                                        },
                                    }}
                                />
                            ))}
                        </Geographies>
                        <Markers>
                            {this.state.cloudletList.map((item, index) => {

                                console.log(`cloudletList===${index}>`, item);

                                return (
                                    //@todo : in simple map) [LONG,LAT]
                                    <Marker marker={{coordinates: [item.CloudletLocation.longitude, item.CloudletLocation.latitude,]}} style={{
                                        hidden: {opacity: 0},
                                    }}>
                                        <svg width="35" height="35">
                                            <image href="https://cdn0.iconfinder.com/data/icons/small-n-flat/24/678111-map-marker-512.png" style={{color: 'red'}} height="35" width="35"/>
                                        </svg>

                                        <text textAnchor="middle" fill="#fff" style={{fontSize: 15, fontFamily: "Roboto, sans-serif", fontStyle: 'italic'}}>
                                            {item.CloudletName.toString()}
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
                            animationData: require('../../../../lotties/pinjump'),
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
                            zoom: 0.45,
                        })
                    }}>
                        <Icon name="refresh"/>
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
