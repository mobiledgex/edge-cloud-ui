import 'react-hot-loader'
import React from "react";
import {LayersControl, Map, Marker, Pane, Popup, TileLayer, Tooltip, ZoomControl} from "react-leaflet";
import {divIcon} from 'leaflet';
import * as L from 'leaflet'

import "./leaflet.css";
import {hot} from "react-hot-loader/root";
import 'react-leaflet-fullscreen-control'
import {showToast} from "../../../PageMonitoringCommonService";
import TouchRipple from "@material-ui/core/ButtonBase/TouchRipple";
import Ripples from "react-ripples";
import $ from 'jquery';
import {Button, Icon} from "semantic-ui-react";

const {BaseLayer, Overlay} = LayersControl
const rectangle = [
    [51.49, -0.08],
    [51.5, -0.06],
]
const center = [51.505, -0.09]
const outer = [
    [50.505, -29.09],
    [52.505, 29.09],
]

const DEFAULT_VIEWPORT = {
    center: [51.505, -0.09],
    zoom: 13,
}
const multiPolygon = [
    [
        [51.51, -0.12],
        [51.51, -0.13],
        [51.53, -0.13],
    ],
    [
        [51.51, -0.05],
        [51.51, -0.07],
        [51.53, -0.07],
    ],
]


export default hot(
    class LeafletTest001 extends React.Component {
        state = {
            viewport: DEFAULT_VIEWPORT,
            markers: [
                {key: 'marker1', position: [51.5, -0.1], content: 'My first popup'},
                {key: 'marker2', position: [51.51, -0.1], content: 'My second popup'},
                {key: 'marker3', position: [51.49, -0.05], content: 'My third popup'},
            ],
        }

        onClickReset = () => {
            this.setState({viewport: DEFAULT_VIEWPORT})
        }

        onViewportChanged = (viewport: Viewport) => {
            this.setState({viewport})
        }

        componentDidMount(): void {
            /*  $(".leaflet-tooltip").live("click", function(){
                  alert("The paragraph was clicked.");
              });*/
            /*    $(document).ready(function () {
                    $(".leaflet-tooltip").on("click", function(){
                        alert("고경준 천재님");
                    });
                });
             */
            //
            setTimeout(()=>{
                /*this.marker1.leafletElement.openPopup()
                this.marker2.leafletElement.openPopup()*/
            },10)
        }


        render() {

            var greenIcon = new L.Icon({
                iconUrl: require('./leaflet_icons/marker-icon-2x-green.png'),
                shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
                iconSize: [25, 41],
                iconAnchor: [12, 41],
                popupAnchor: [1, -34],
                shadowSize: [41, 41]
            });


            return (
                <div style={{height: '100%', width: '100%'}}>
                    <Map center={[45.4, 51.7]}
                         zoom={1.5}
                        /* bound={[
                             [25.505, -29.09],
                             [25.505, 29.09],
                         ]}*/
                         boundsOptions={{padding: [50, 50]}}
                    >
                        <TileLayer
                            //url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                            url={'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'}
                            minZoom={1}
                            //maxZoom={15}
                        />
                        <Marker
                            ref={c => this.marker1 = c}
                            icon={greenIcon}
                            className='marker1'
                            position={
                                [37.404945, 127.106259]
                            }
                            onClick={() => {
                            }}
                        >

                            <Popup
                                //position={[100.110924, 8.682127]}
                                offset={[0, 0]}
                                opacity={0.7}
                                className="tooltip1"
                            >
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <div style={{fontSize: 20, fontFamily: 'Acme'}}>
                                        [KR , SEONGNAM]
                                    </div>
                                    <button style={{backgroundColor: 'green', color: "white"}} onClick={() => {
                                        alert('eundew')
                                    }}>eundew
                                    </button>
                                    <div style={{height: 5}}/>
                                    <button onClick={() => {
                                        alert('GO')
                                    }}>GO
                                    </button>
                                    <div style={{height: 5}}/>
                                    <button onClick={() => {
                                        alert('Rahul')
                                    }}>Rahul
                                    </button>
                                    <div style={{height: 5}}/>
                                    <button onClick={() => {
                                        alert('redstar')
                                    }}>redstar
                                    </button>
                                </div>
                            </Popup>

                        </Marker>
                        <Marker
                            ref={c => this.marker2 = c}
                            position={
                                [50.110924, 8.682127]
                            }
                            onClick={() => {
                                //alert('sdlfkdslkf')
                            }}
                        >

                            <Popup
                                //position={[100.110924, 8.682127]}
                                offset={[0, 0]}
                                opacity={0.7}
                                className="tooltip1"
                            >
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <div style={{fontSize: 20, fontFamily: 'Acme'}}>
                                        [flakflut eu]
                                    </div>
                                    <button style={{backgroundColor: 'green', color: "white"}} onClick={() => {
                                        alert('eundew')
                                    }}>eundew
                                    </button>
                                    <div style={{height: 5}}/>
                                    <button onClick={() => {
                                        alert('GO')
                                    }}>GO
                                    </button>
                                    <div style={{height: 5}}/>
                                    <button onClick={() => {
                                        alert('Rahul')
                                    }}>Rahul
                                    </button>
                                    <div style={{height: 5}}/>
                                    <button onClick={() => {
                                        alert('redstar')
                                    }}>redstar
                                    </button>
                                </div>
                            </Popup>

                        </Marker>

                        <Marker
                            ref={this.openPopup}
                            position={
                                [28, 3]
                            }
                            onClick={() => {
                                // alert('sdlfkdslkf')
                            }}
                        >
                            <Popup
                                //position={[100.110924, 8.682127]}
                                offset={[0, 0]}
                                opacity={0.7}
                                className="tooltip1"
                            >
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    <div style={{fontSize: 20, fontFamily: 'Acme'}}>
                                        Rahul..
                                    </div>
                                    <button style={{backgroundColor: 'green', color: "white"}} onClick={() => {
                                        showToast('eundew')
                                    }}>eundew
                                    </button>
                                    <div style={{height: 5}}/>
                                    <button onClick={() => {
                                        showToast('GO')
                                    }}>GO
                                    </button>
                                    <div style={{height: 5}}/>
                                    <button onClick={() => {
                                        showToast('Rahul')
                                    }}>Rahul
                                    </button>
                                    <div style={{height: 5}}/>
                                    <button onClick={() => {
                                        showToast('redstar')
                                    }}>redstar
                                    </button>
                                </div>
                            </Popup>
                        </Marker>

                    </Map>

                    <div className="controls" style={{marginTop: -250, zIndex:9999999}}>
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
            );
        }


    }
)
