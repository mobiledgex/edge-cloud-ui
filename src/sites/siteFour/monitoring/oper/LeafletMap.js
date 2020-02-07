import 'react-hot-loader'
import React from "react";
import {LayersControl, Map, Marker, Popup, TileLayer, Tooltip} from "react-leaflet";
import * as L from 'leaflet';
import "../PageMonitoring.css";
import {hot} from "react-hot-loader/root";
import 'react-leaflet-fullscreen-control'
import {Button, Icon} from "semantic-ui-react";
import {renderPlaceHolderLottie, renderPlaceHolderLottiePinJump, showToast} from "../PageMonitoringCommonService";
import {Markers} from "react-simple-maps";
import {CircularProgress} from "@material-ui/core";

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
let greenIcon = new L.Icon({
    iconUrl: require('../leaflet_markers/marker-icon-2x-green.png'),
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


export default hot(
    class LeafletMap extends React.Component {
        state = {
            viewport: DEFAULT_VIEWPORT,
            markers: [
                {key: 'marker1', position: [51.5, -0.1], content: 'My first popup'},
                {key: 'marker2', position: [51.51, -0.1], content: 'My second popup'},
                {key: 'marker3', position: [51.49, -0.05], content: 'My third popup'},
            ],
        }

        /*  async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
              if (this.props.cloudletList !== nextProps.cloudletList) {
                  await this.setState({
                      cloudletList: nextProps.cloudletList,
                  });

                  //this.state.cloudletList["0"].CloudletLocation.latitude
                  //this.state.cloudletList["0"].CloudletLocation.longitude
                  //this.state.cloudletList["0"].CloudletName
                  console.log('componentWillReceiveProps_cloudletList===>', this.state.cloudletList);
              }
          }*/

        renderPopup(){
            return (
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
            )
        }

        renderMarkerOne(item) {

            return (
                <Marker
                    ref={c => this.marker1 = c}
                    icon={greenIcon}
                    className='marker1'
                    position={
                        [item.CloudletLocation.latitude, item.CloudletLocation.longitude,]
                    }
                    onClick={() => {

                        alert(item.CloudletName)
                    }}
                >
                    <Tooltip direction='right' offset={[0, 0]} opacity={0.5} permanent>
                        <span>{item.CloudletName}</span>
                    </Tooltip>
                </Marker>
            )
        }


        render() {


            return (
                <div style={{height: '100%', width: '100%'}}>
                    {!this.props.loading ?
                        <Map center={[45.4, 51.7]}
                             duration={0.9}
                             zoom={1.0}
                             style={{width: '100%', height: '100%'}}
                             easeLinearity={1}
                             useFlyTo={true}
                             dragging={true}
                             boundsOptions={{padding: [50, 50]}}
                        >
                            <TileLayer
                                url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                                //url={'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'}
                                minZoom={2}
                                //maxZoom={15}
                            />
                            {this.props.cloudletList.map(item => {

                                return this.renderMarkerOne(item)
                            })}
                        </Map> :
                        renderPlaceHolderLottiePinJump()
                    }


                    <div className="controls" style={{marginTop: -250, zIndex: 9999999}}>
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
