import 'react-hot-loader'
import React from "react";
import {Map, Marker, Popup, TileLayer, Tooltip} from "react-leaflet";
import * as L from 'leaflet';
import "../PageMonitoring.css";
import {hot} from "react-hot-loader/root";
import 'react-leaflet-fullscreen-control'
import type {TypeAppInstance} from "../../../../shared/Types";
import Ripples from "react-ripples";


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
    class LeafletMapWrapperForDev extends React.Component {

        constructor(props) {
            super(props);
            this.state = {
                zoom: 0.9,//mapZoom
                appInstanceListGroupByCloudlet: '',
                cloudletKeys: [],
                newCloudLetLocationList: [],
                showModal: false,
                showOffice: false,
                isUpdateEnable: false,
                arrIsShowCloudlet: [],
                reDrawMap: 'dummy',
                viewport: DEFAULT_VIEWPORT,
                markers: [
                    {key: 'marker1', position: [51.5, -0.1], content: 'My first popup'},
                    {key: 'marker2', position: [51.51, -0.1], content: 'My second popup'},
                    {key: 'marker3', position: [51.49, -0.05], content: 'My third popup'},
                ],


            };
        }

        componentDidMount = async () => {
            console.log('markerList2222===>', this.props.markerList);
            let appInstanceListGroupByCloudlet = this.props.markerList
            this.setCloudletLocation(appInstanceListGroupByCloudlet)

        };

        async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
            if (this.props.markerList !== nextProps.markerList) {

                console.log('markerList2222 nextProps_markerList===>', nextProps.markerList);
                let appInstanceListGroupByCloudlet = nextProps.markerList;
                this.setCloudletLocation(appInstanceListGroupByCloudlet)
            }
        }

        shouldComponentUpdate(nextProps, nextState) {
            if (this.props.markerList === nextProps.markerList && !this.state.isUpdateEnable) {
                return false;
            } else {
                return true;
            }
        }

        setCloudletLocation(pAppInstanceListGroupByCloudlet) {

            let cloudletKeys = Object.keys(pAppInstanceListGroupByCloudlet)

            let newCloudLetLocationList = []
            cloudletKeys.map((key, index) => {

                let AppNames = ''
                let CloudletLocation = '';
                let Cloudlet = '';
                let ClusterInst = '';
                pAppInstanceListGroupByCloudlet[key].map((innerItem: TypeAppInstance, index) => {

                    if (index === (pAppInstanceListGroupByCloudlet[key].length - 1)) {
                        AppNames += innerItem.AppName + " | " + innerItem.ClusterInst;
                    } else {
                        AppNames += innerItem.AppName + " | " + innerItem.ClusterInst + " , "
                    }


                    CloudletLocation = innerItem.CloudletLocation;
                    Cloudlet = innerItem.Cloudlet;

                })

                newCloudLetLocationList.push({
                    AppNames: AppNames,
                    CloudletLocation: CloudletLocation,
                    Cloudlet: Cloudlet,
                    isShow: false,
                    //ClusterInst: ClusterInst,
                })

            })

            let arrIsShowCloudlet = []

            //@todo: cloudletDIV block, hidden
            newCloudLetLocationList.map(item => {
                arrIsShowCloudlet.push(false);
            })


            console.log('arrIsShowCloudlet===>', arrIsShowCloudlet);


            this.setState({
                newCloudLetLocationList: newCloudLetLocationList,
                arrIsShowCloudlet: arrIsShowCloudlet,
                appInstanceListGroupByCloudlet: pAppInstanceListGroupByCloudlet,
            }, () => {
                console.log('newCloudLetLocationList===>', this.state.newCloudLetLocationList);
            })


        }

        renderPopup() {
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
                        this.props.handleSelectCloudletForMapkerClicked(item.CloudletName)
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
                <div style={{height: '100%', width: '100%', zIndex: 1}}>
                    <Map center={[45.4, 51.7]}
                         duration={0.9}
                         zoom={1.0}
                         style={{width: '100%', height: '100%', zIndex: 1,}}
                         easeLinearity={1}
                         useFlyTo={true}
                         dragging={true}
                         boundsOptions={{padding: [50, 50]}}
                    >
                        <TileLayer
                            url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                            //url={'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'}
                            minZoom={2}
                            style={{zIndex: 1}}
                            //maxZoom={15}
                        />
                        {this.state.newCloudLetLocationList.map((item, outerIndex) => {

                            let listAppName = item.AppNames.split(",")

                            return (
                                <Marker
                                    ref={c => this.marker1 = c}
                                    icon={greenIcon}
                                    className='marker1'
                                    position={
                                        [item.CloudletLocation.latitude, item.CloudletLocation.longitude,]
                                    }
                                    onClick={() => {
                                        //this.props.handleSelectCloudletForMapkerClicked(item.CloudletName)
                                    }}
                                >
                                    <Tooltip direction='right' offset={[0, 0]} opacity={0.8} permanent

                                             onClick={() => {
                                                 alert('lklsdkflksd====>>>')
                                             }}
                                    >
                                        <span style={{color: 'black'}}>{item.Cloudlet}</span>
                                    </Tooltip>
                                    <Popup className='popup1'>
                                        {listAppName.map(AppName_ClusterInst => {

                                            let AppName = AppName_ClusterInst.trim().split(" | ")[0].trim()
                                            let ClusterInst = AppName_ClusterInst.trim().split(" | ")[1].trim()


                                            return (

                                                <div style={{
                                                    fontSize: 14, fontFamily: 'Righteous', cursor: 'crosshair',
                                                    flexDirection: 'column',
                                                    marginTop: 5, marginBottom: 5
                                                }}
                                                >
                                                    <Ripples
                                                        style={{}}
                                                        color='#1cecff' during={500}
                                                        onClick={() => {

                                                            let arrayTemp = AppName_ClusterInst.split(" | ");

                                                            let Cluster = arrayTemp[1].trim();
                                                            let AppInst = arrayTemp[0].trim()
                                                            let dataSet = AppInst + " | " + item.Cloudlet.trim() + " | " + Cluster
                                                            //showToast(dataSet)
                                                            this.props.handleAppInstDropdown(dataSet)
                                                        }}
                                                    >
                                                        {AppName}
                                                        <div style={{color: '#77BD25', fontFamily: 'Acme', fontSize: 12}}>
                                                            &nbsp;&nbsp;{` [${ClusterInst.trim()}]`}
                                                        </div>
                                                    </Ripples>
                                                </div>


                                            )
                                        })}
                                    </Popup>
                                </Marker>
                            )
                        })}
                    </Map>
                </div>
            );
        }


    }
)
