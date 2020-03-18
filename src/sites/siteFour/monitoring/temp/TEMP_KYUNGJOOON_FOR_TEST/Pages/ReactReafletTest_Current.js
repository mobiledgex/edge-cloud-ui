import 'react-hot-loader';
import * as React from 'react';
import {
    Map,
    Marker,
    Popup,
    TileLayer,
    Tooltip,
    Polyline
} from "react-leaflet";
import L from 'leaflet';
import {hot} from "react-hot-loader/root";

import '../../../PageMonitoring.css'
import {Button} from "antd";
import {Select} from "antd";
import {Icon} from "semantic-ui-react";
import MarkerClusterGroup from 'leaflet-make-cluster-group'
import 'leaflet-make-cluster-group/LeafletMakeCluster.css'

type Props = {};
type State = {
    visible: boolean,
    currentTarget: any,
    frankuTarget: any,
    currentTarget: any,
    darkTileLayer: any,
    whiteTileLayer: any,
    currentTyleLayer: any,
    currentZoomLevel: number,
    currentHeight: number,
    currentWidth: number,
};
let greenIcon = new L.Icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    //iconUrl: require('../images/cloud003.png'),
    //iconUrl: 'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-and-shapes-1/177800/11-512.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [21, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var redIcon = L.icon({
    iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
    //shadowUrl : 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [21, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var cloud = L.icon({
    iconUrl: require('./images/cloud_green.png'),
    //shadowUrl : 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [40, 21],
    iconAnchor: [20, 21],
    shadowSize: [41, 41]
});

var cell_phone = L.icon({
    iconUrl: require('./images/cellhone_white003.png'),
    //shadowUrl : 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

export default hot(
    class ReactReafletTest extends React.Component<Props, State> {
        map = null;

        state = {
            visible: false,
            busanTarget: [35.1796, 129.0756],
            frankuTarget: [50.1109, 8.6821],
            currentTarget: [50.1109, 8.6821],
            currentZoomLevel: 3,
            /*darkTileLayer: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
            whiteTileLayer: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager_nolabels/{z}/{x}/{y}.png',*/
            currentTyleLayer: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
            currentHeight: '80%',
            currentWidth: '100%',
        }

        mapTileList = [
            {
                url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
                name: 'dark1',
            },
            {
                url: 'https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png',
                name: 'dark2',
            },

            {
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
                name: 'white1',
            },
            {
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                name: 'white2',
            },


        ]

        componentDidMount(): void {

        }

        render() {

            const position = [51.505, -0.09]
            const position2 = [37.3875, 122.0575]
            const position3 = [37.4449, 127.1389]
            const position4 = [36.7783, -119.4179]

            const position5 = [50.1109, 8.6821]
            const posSeoul = [37.5665, 126.9780]

            return (
                <div className='page_monitoring_container'>
                    <div style={{height: this.state.currentHeight, width: '100%', zIndex: 1}}>
                        <Map
                            center={[45.4, 51.7]}
                             duration={0.9}
                             style={{width: '100%', height: this.state.currentHeight, zIndex: 1,}}
                             zoom={this.state.currentZoomLevel}
                             onZoomEnd={(e) => {

                                 let zoomLevel = e.target._zoom;

                                 this.setState({
                                     currentZoomLevel: zoomLevel,
                                 })
                             }}
                             maxZoom={15}
                             ref={(ref) => {
                                 this.map = ref;
                             }}
                             easeLinearity={1}
                             useFlyTo={true}
                             dragging={true}
                             boundsOptions={{padding: [50, 50]}}
                        >
                            <MarkerClusterGroup>
                                <Marker

                                    position={[37.2411, 127.1776]}
                                    icon={cell_phone}

                                >
                                    <Popup>용인 jessica.</Popup>
                                </Marker>
                                <Marker

                                    position={[37.2411, 127.1776]}
                                    icon={cell_phone}

                                >
                                    <Popup>용인 jessica2123.</Popup>
                                </Marker>
                                <Marker

                                    position={[37.2411, 127.1776]}
                                    icon={cell_phone}

                                >
                                    <Popup>용인 jessica3.</Popup>
                                </Marker>
                                <Marker

                                    position={[37.2411, 127.1776]}
                                    icon={cell_phone}

                                >
                                    <Popup>용인 jessica4.</Popup>
                                </Marker>
                                <Marker

                                    position={[37.2411, 127.1776]}
                                    icon={cell_phone}

                                >
                                    <Popup>용인 jessica5.</Popup>
                                </Marker>
                                <Marker

                                    position={[37.2411, 127.1776]}
                                    icon={cell_phone}

                                >
                                    <Popup>용인 jessica6.</Popup>
                                </Marker>
                                <Marker

                                    position={[37.2411, 127.1776]}
                                    icon={cell_phone}

                                >
                                    <Popup>용인 jessica7.</Popup>
                                </Marker>
                                <Marker

                                    position={[37.2411, 127.1776]}
                                    icon={cell_phone}

                                >
                                    <Popup>용인 jessica8.</Popup>
                                </Marker>
                                <Marker
                                    position={[37.5665, 126.9780]}
                                    icon={cell_phone}
                                >
                                    <Popup>seoul WeWork.</Popup>
                                </Marker>
                                <Marker
                                    position={[37.5665, 126.9780]}
                                    icon={cell_phone}
                                >
                                    <Popup>seoul WeWork2.</Popup>
                                </Marker>
                                <Marker
                                    position={[37.5665, 126.9780]}
                                    icon={cell_phone}
                                >
                                    <Popup>seoul WeWork3.</Popup>
                                </Marker>
                                <Marker
                                    position={[37.5665, 126.9780]}
                                    icon={cell_phone}
                                >
                                    <Popup>seoul WeWork4.</Popup>
                                </Marker>
                                <Marker
                                    position={[37.5665, 126.9780]}
                                    icon={cell_phone}
                                >
                                    <Popup>seoul WeWork5</Popup>
                                </Marker>
                                <Marker
                                    position={[37.5665, 126.9780]}
                                    icon={cell_phone}
                                >
                                    <Popup>seoul WeWork6.</Popup>
                                </Marker>
                                <Marker

                                    position={[37.3947, 127.1112]}
                                    icon={cell_phone}

                                >
                                    <Popup>성남 고경준.</Popup>
                                </Marker>
                            </MarkerClusterGroup>

                            <TileLayer
                                url={this.state.currentTyleLayer}
                                //url={'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'}
                                minZoom={2}
                                style={{zIndex: 1}}
                                //maxZoom={15}
                            />

                            {/*todo:클라우드렛*/}
                            {/*todo:클라우드렛*/}
                            {/*todo:클라우드렛*/}
                            <Marker
                                position={[50.1109, 8.6821]}
                                icon={cloud}
                            >
                                <Popup>Frankfurutu eu.</Popup>
                            </Marker>
                            <Marker
                                position={[35.1796, 129.0756]}
                                icon={cloud}
                            >
                                <Popup>부산 클라우드렛.</Popup>
                            </Marker>


                            <Polyline
                                dashArray={['8, 8']}
                                positions={[
                                    this.state.currentTarget, [37.2411, 127.1776],
                                ]}
                                color={'yellow'}
                            />
                            <Polyline
                                dashArray={['8, 8']}
                                positions={[
                                    this.state.currentTarget, [37.3947, 127.1112],
                                ]}
                                color='yellow'
                            />
                            <Polyline
                                dashArray={['8, 8']}
                                positions={[
                                    this.state.currentTarget, [37.5665, 126.9780],
                                ]}
                                color={'yellow'}
                            />


                        </Map>
                        <div style={{display: 'flex', marginTop: 30, marginLeft: 10,}}>
                            <Button type="info"
                                    onClick={() => {
                                        this.setState({
                                            currentTarget: this.state.frankuTarget,
                                        })
                                    }}
                            >changeTarget2</Button>
                            <div style={{width: 30}}/>
                            <Button type="primary"
                                    onClick={() => {
                                        this.setState({
                                            currentTarget: this.state.busanTarget,
                                        })
                                    }}
                            >changeTarget</Button>
                            <div style={{width: 30}}/>
                            <Button type="primary"
                                    style={{backgroundColor: 'orange', borderColor: 'orange'}}
                                    onClick={() => {
                                        this.setState({
                                            currentZoomLevel: 3,
                                        })
                                    }}
                            >reset zoom level</Button>
                            <div style={{width: 30}}/>
                            <Button type="primary"
                                    style={{backgroundColor: 'blue', borderColor: 'blue'}}
                                    onClick={() => {
                                        this.setState({
                                            currentHeight: '50%',
                                            currentWidth: '50%',
                                        })
                                    }}
                            >size small</Button>
                            <div style={{width: 30}}/>
                            <Button type="primary"
                                    style={{backgroundColor: 'red', borderColor: 'red'}}
                                    onClick={() => {
                                        this.setState({

                                            currentHeight: '80%',
                                            currentWidth: '100%',
                                        })
                                    }}
                            >size big</Button>

                            <div style={{width: 30}}/>
                            <Select defaultValue={this.mapTileList[0].name} style={{width: 120}} onChange={(value) => {

                                this.setState({
                                    currentTyleLayer: this.mapTileList[value].url
                                })

                            }}>
                                {this.mapTileList.map((item, index) => {
                                    return (
                                        <Select.Option value={index}>{item.name}</Select.Option>
                                    )
                                })}


                            </Select>
                            <div style={{position: 'absolute', top: 80, left: 12, zIndex: 99999}}>
                                <Icon

                                    onClick={() => {
                                        this.setState({
                                            currentZoomLevel: 3,
                                        })
                                    }}
                                    name='redo '
                                    style={{
                                        color: 'black',
                                        fontSize: 20,
                                        borderRadius: 5,
                                        backgroundColor: 'white',
                                        height: 30,
                                        width: 30
                                    }}/>
                            </div>
                            <div style={{margin:20, fontSize:30, fontWeight:'bold'}}>
                                {this.state.currentZoomLevel.toString()}
                            </div>
                        </div>
                    </div>
                    <div>

                    </div>
                </div>
            );
        };
    }
)
