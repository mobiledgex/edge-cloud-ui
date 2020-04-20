import React from "react";
import * as L from 'leaflet';
import "../../PageMonitoring.css";
import 'react-leaflet-fullscreen-control'
import type {TypeAppInstance, TypeClient} from "../../../../shared/Types";
import Ripples from "react-ripples";
import {CheckCircleOutlined} from '@material-ui/icons';
import {Map, Marker, Polyline, Popup, TileLayer, Tooltip} from "react-leaflet";
import PageDevMonitoring from "../dev/PageDevMonitoring";
import CircularProgress from "@material-ui/core/CircularProgress";
import {renderPlaceHolderLottiePinJump3} from "../PageMonitoringCommonService";
import MarkerClusterGroup from "leaflet-make-cluster-group";

const DEFAULT_VIEWPORT = {
    center: [51.505, -0.09],
    zoom: 13,
}
let greenIcon = new L.Icon({
    iconUrl: require('../../../../assets/leaflet_markers/marker-icon-2x-green.png'),
    //iconUrl: require('../images/cloud003.png'),
    //iconUrl: 'https://cdn4.iconfinder.com/data/icons/social-messaging-ui-color-and-shapes-1/177800/11-512.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [21, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

var cellphoneIcon2 = L.icon({
    iconUrl: require('../images/cellhone_white003.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});


let cellphoneIcon = new L.Icon({
    iconUrl: require('../images/mobile-icon-66.png'),
    //shadowUrl: '',
    iconSize: [41, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

let cloudIcon = L.icon({
    iconUrl: require('../images/cloud_green.png'),
    //shadowUrl : 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [40, 21],
    iconAnchor: [20, 21],
    shadowSize: [41, 41]
});

type Props = {
    parent: PageDevMonitoring,
    markerList: Array,
    selectedClientLocationListOnAppInst: any,
    isMapUpdate: boolean,
    currentWidgetWidth: number,

};
type State = {
    zoom: number,
    popUploading: boolean,
    newCloudLetLocationList: Array,
    isUpdateEnable: boolean,
    clientList: any,
    currentTyleLayer: any,
    currentWidgetWidth: number,
    objKeys: any,

};

export default class LeafletMapContainerDev_____TEST extends React.Component<Props, State> {
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


    constructor(props: Props) {
        super(props);
        this.state = {
            zoom: 3,//mapZoom
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
            popupLoading: false,
            clientList: [],
            currentTyleLayer: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
            currentWidgetWidth: window.innerWidth / 3,
            clientObjKeys: [],


        };


    }

    componentDidMount = async () => {
        console.log('componentDidMount===>', this.props.markerList);
        let appInstanceListGroupByCloudlet = this.props.markerList
        this.setCloudletLocation(appInstanceListGroupByCloudlet)


    };

    groupBy = (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                currentValue
            );
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    };

    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        if (this.props.markerList !== nextProps.markerList) {
            console.log('markerList2222 nextProps_markerList===>', nextProps.markerList);
            let appInstanceListGroupByCloudlet = nextProps.markerList;
            this.setCloudletLocation(appInstanceListGroupByCloudlet)
        }

        //@desc : clientList
        //@desc : clientList
        //@desc : clientList
        if (this.props.selectedClientLocationListOnAppInst !== nextProps.selectedClientLocationListOnAppInst) {
            await this.setState({
                clientObjKeys: [],
            })
            console.log("selectedClientLocationListOnAppInst==nextProps==>", nextProps.selectedClientLocationListOnAppInst);

            let clientList = nextProps.selectedClientLocationListOnAppInst;

            let newClientList = []
            clientList.map((item: TypeClient, index) => {
                let clientLocation = item.latitude.toString() + item.longitude.toString();
                item.clientLocation = clientLocation;
                newClientList.push(item);
            })

            /*console.log("newClientList====>", newClientList);
            let __newClientList = this.groupBy(newClientList, newClientListOne=>newClientList.clentLocation)*/
            //console.log("__newClientList====>", __newClientList);

            console.log("newClientList====>", newClientList);

            let groupedClientList = this.groupBy(newClientList, 'clientLocation')

            console.log("__newClientList02====>", groupedClientList);

            let objKeys = Object.keys(groupedClientList)

            console.log("clientObjKeys====>", objKeys);

            objKeys.map(item => {
                console.log("lskflksdflkklsd====>", groupedClientList[item]);

            })


            await this.setState({
                clientList: groupedClientList,
                clientObjKeys: objKeys,
            }, () => {
                console.log("selectedClientLocationListOnAppInst====>", this.state.clientList);
            })
        }

    }

    /*  shouldComponentUpdate(nextProps, nextState) {
            if (this.props.markerList !== nextProps.markerList &&  nextProps.isMapUpdate ) {

 //               alert('update')
                return true;
            } else {
                return false;
            }
      }*/

    setCloudletLocation(pAppInstanceListGroupByCloudlet) {

        let cloudletKeys = Object.keys(pAppInstanceListGroupByCloudlet)

        let newCloudLetLocationList = []
        cloudletKeys.map((key, index) => {

            let AppNames = ''
            let CloudletLocation = '';
            let Cloudlet = '';
            let ClusterInst = '';
            pAppInstanceListGroupByCloudlet[key].map((innerItem: TypeAppInstance, index) => {

                console.log("setCloudletLocation====>", innerItem);

                if (index === (pAppInstanceListGroupByCloudlet[key].length - 1)) {
                    AppNames += innerItem.AppName + " | " + innerItem.ClusterInst + " | " + innerItem.Region + " | " + innerItem.HealthCheck + " | " + innerItem.Version + " | " + innerItem.Operator
                } else {
                    AppNames += innerItem.AppName + " | " + innerItem.ClusterInst + " | " + innerItem.Region + " | " + innerItem.HealthCheck + " | " + innerItem.Version + " | " + innerItem.Operator + " , "
                }
                console.log("Operator===>", innerItem.Operator);

                CloudletLocation = innerItem.CloudletLocation;
                Cloudlet = innerItem.Cloudlet;

            })

            console.log("setCloudletLocation===>", AppNames);

            newCloudLetLocationList.push({
                AppNames: AppNames,
                CloudletLocation: CloudletLocation,
                Cloudlet: Cloudlet,
                isShow: false,
                isShowCircle: false,
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


    render() {

        return (
            <React.Fragment>
                <div className='page_monitoring_title_area' style={{display: 'flex'}}>
                    <div style={{
                        display: 'flex',
                        width: '100%',
                        height: 30
                    }}>
                        <div className='page_monitoring_title' style={{
                            backgroundColor: 'transparent',
                            flex: .38
                        }}>
                            Deployed Instance
                        </div>
                        {/**/}
                        {/*<Button>
                            add marker
                        </Button>*/}
                    </div>

                    <div className='page_monitoring_title' style={{
                        backgroundColor: 'transparent',
                        flex: .65
                    }}>
                        {this.props.parent.state.mapPopUploading &&
                        <div style={{zIndex: 99999999999}}>
                            <CircularProgress style={{
                                color: '#1cecff',
                                marginRight: 0,
                                marginBottom: -2,
                                fontWeight: 'bold',
                            }}
                                              size={14}/>
                        </div>
                        }
                    </div>

                </div>
                {/*@todo: LeafletMapWrapperForDev*/}
                <div className='page_monitoring_container'>
                    <div style={{height: '100%', width: '100%', zIndex: 1}}>
                        <Map center={[45.4, 51.7]}
                             duration={0.9}
                             zoom={this.state.zoom}
                             style={{width: '100%', height: '100%', zIndex: 1,}}
                             easeLinearity={1}
                             useFlyTo={true}
                             dragging={true}
                             boundsOptions={{padding: [50, 50]}}
                             maxZoom={15}
                             onResize={() => {

                             }}
                             ref={(ref) => {
                                 this.map = ref;
                             }}
                        >


                            {this.props.parent.state.loading && renderPlaceHolderLottiePinJump3()}
                            <TileLayer
                                url={this.state.currentTyleLayer}
                                //url={'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'}
                                minZoom={2}
                                style={{zIndex: 1}}
                                //maxZoom={15}
                            />

                            {/*@todo:clientList...*/}
                            {/*@todo:clientList...*/}
                            {/*@todo:clientList...*/}
                            {this.state.objKeys.map((objkeyOne, index) => {
                                let groupedClientList = this.state.clientList;


                                return (
                                    <MarkerClusterGroup>
                                        {groupedClientList[objkeyOne].map(item => {
                                            console.log("groupedClientList====>", item)

                                            return (
                                                <React.Fragment>
                                                    <Marker
                                                        icon={cellphoneIcon2}
                                                        position={
                                                            [item.latitude, item.longitude]
                                                            //[item.latitude, item.longitude]
                                                        }
                                                    >
                                                        {/* <Tooltip
                                                    direction='right'
                                                    offset={[0, 0]}
                                                    opacity={0.8}
                                                    permanent

                                                    style={{cursor: 'pointer', pointerEvents: 'auto'}}

                                                >
                                                  <span
                                                      className='toolTip'
                                                      style={{color: 'black'}}>
                                                      {item.uuid}
                                                  </span>
                                                </Tooltip>*/}
                                                        <Popup className='leaflet-popup-content-wrapper2'
                                                               style={{fontSize: 11}}>{item.uuid}</Popup>
                                                    </Marker>

                                                    {/*@todo:라인을 그리는 부분...*/}
                                                    {/*@todo:라인을 그리는 부분...*/}
                                                    {/*@todo:라인을 그리는 부분...*/}
                                                    <Polyline
                                                        dashArray={['10, 10']}
                                                        id="132512"
                                                        positions={[
                                                            [item.latitude, item.longitude], [item.serverLocInfo.lat, item.serverLocInfo.long],

                                                            //[item.latitude, item.longitude], [item.serverLocInfo.lat, item.serverLocInfo.long],
                                                        ]}
                                                        color={'yellow'}
                                                    />

                                                </React.Fragment>
                                            )

                                        })

                                        }
                                    </MarkerClusterGroup>
                                )


                            })}

                            {/*  <Marker
                                //ref={c => this.marker1 = c}
                                icon={cellphoneIcon}
                                //className='marker1'
                                //lat, long
                                position={
                                    [37.3454,127.1167, ]
                                }
                            />*/}

                            {this.state.newCloudLetLocationList.map((outerItem, outerIndex) => {
                                let listAppName = outerItem.AppNames.split(",")
                                console.log("outerItem====>", outerItem);


                                if (outerItem.CloudletLocation.latitude != undefined) {
                                    return (
                                        <Marker
                                            ref={c => this.marker1 = c}
                                            icon={cloudIcon}
                                            className='marker1'
                                            position={
                                                [outerItem.CloudletLocation.latitude, outerItem.CloudletLocation.longitude,]
                                            }
                                            onClick={() => {

                                                let toggleNewCloudletLocationList = this.state.newCloudLetLocationList;
                                                toggleNewCloudletLocationList[outerIndex].isShowCircle = !toggleNewCloudletLocationList[outerIndex].isShowCircle
                                                this.setState({
                                                    newCloudLetLocationList: toggleNewCloudletLocationList,
                                                    isUpdateEnable: true,
                                                })

                                                //this.props.handleSelectCloudletForMapkerClicked(item.CloudletName)
                                            }}
                                        >
                                            <Tooltip
                                                direction='right'
                                                offset={[14, -10]}//x,y
                                                opacity={0.8}
                                                permanent
                                                ref={c => {
                                                    this.toolTip = c;
                                                }}
                                                style={{cursor: 'pointer', pointerEvents: 'auto'}}

                                            >

                                <span
                                    className='toolTip'
                                    style={{color: 'black'}}>{outerItem.Cloudlet}</span>
                                            </Tooltip>
                                            <Popup className='popup1'>

                                                {listAppName.map(AppFullName => {

                                                    let AppName = AppFullName.trim().split(" | ")[0].trim()
                                                    let ClusterInst = AppFullName.trim().split(" | ")[1].trim()
                                                    let Region = AppFullName.trim().split(" | ")[2].trim()
                                                    let HealthCheck = AppFullName.trim().split(" | ")[3].trim()
                                                    let Version = AppFullName.trim().split(" | ")[4].trim()
                                                    let Operator = AppFullName.trim().split(" | ")[5].trim()

                                                    let lat = outerItem.CloudletLocation.latitude;
                                                    let long = outerItem.CloudletLocation.longitude;

                                                    let serverLocation = {
                                                        lat,
                                                        long,
                                                    }


                                                    return (
                                                        <div style={{
                                                            fontSize: 14, cursor: 'crosshair',

                                                            flexDirection: 'column',
                                                            marginTop: 5, marginBottom: 5
                                                        }}
                                                        >
                                                            <Ripples
                                                                style={{marginLeft: 5}}
                                                                color='#1cecff' during={500}
                                                                onClick={() => {

                                                                    let dataSet = AppName + " | " + outerItem.Cloudlet.trim() + " | " + ClusterInst + " | " + Region + " | " + HealthCheck + " | " + Version + " | " + Operator + " | " + JSON.stringify(serverLocation);

                                                                    console.log("dataSet====>", dataSet)

                                                                    this.props.handleAppInstDropdown(dataSet)
                                                                }}
                                                            >
                                                                {AppName} [{Version}]
                                                                <div style={{
                                                                    color: '#77BD25',
                                                                    fontSize: 12
                                                                }}>
                                                                    &nbsp;&nbsp;{` [${ClusterInst.trim()}]`}
                                                                </div>
                                                                <div>

                                                                    {/*todo:HealthCheck value 3 is okay*/}
                                                                    {/*todo:HealthCheck value 3 is okay*/}
                                                                    {/*todo:HealthCheck value 3 is okay*/}
                                                                    {HealthCheck === 3 ?
                                                                        <div style={{
                                                                            marginLeft: 7,
                                                                            marginBottom: 0,
                                                                            height: 15,
                                                                        }}>
                                                                            <CheckCircleOutlined style={{
                                                                                color: 'green',
                                                                                fontSize: 17,
                                                                                marginBottom: 25
                                                                            }}/>
                                                                        </div>
                                                                        :
                                                                        <div style={{
                                                                            marginLeft: 7,
                                                                            marginBottom: 0,
                                                                            height: 15,
                                                                        }}>
                                                                            <CheckCircleOutlined style={{
                                                                                color: 'red',
                                                                                fontSize: 17,
                                                                                marginBottom: 25
                                                                            }}/>
                                                                        </div>
                                                                    }
                                                                </div>
                                                            </Ripples>
                                                        </div>
                                                    )
                                                })}
                                            </Popup>
                                        </Marker>
                                    )
                                }


                            })}
                        </Map>
                    </div>

                </div>
            </React.Fragment>
        );
    }
}
