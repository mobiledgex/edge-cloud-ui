import React from "react";
import * as L from 'leaflet';
import "../PageMonitoring.css";
import 'react-leaflet-fullscreen-control'
import type {TypeAppInstance} from "../../../../shared/Types";
import Ripples from "react-ripples";
import {AccessAlarm, Check, CheckCircleOutlined, CheckOutlined} from '@material-ui/icons';
import {Circle, Map, Marker, Popup, TileLayer, Tooltip} from "../../../../components/react-leaflet_kj/src/index";
import PageDevMonitoring from "../dev/PageDevMonitoring";
import {Icon} from "antd";
import {showToast} from "../PageMonitoringCommonService";


const DEFAULT_VIEWPORT = {
    center: [51.505, -0.09],
    zoom: 13,
}
let greenIcon = new L.Icon({
    iconUrl: require('../../../../assets/leaflet_markers/marker-icon-2x-green.png'),
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

type Props = {
    parent: PageDevMonitoring,
    markerList: Array,

};
type State = {
    zoom: number,
    popUploading: boolean,
    newCloudLetLocationList: Array,
    isUpdateEnable: boolean,

};

export default class LeafletMapWrapperForDev extends React.Component<Props, State> {

    constructor(props: Props) {
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
            popupLoading: false,


        };


    }

    componentDidMount = async () => {
        console.log('componentDidMount===>', this.props.markerList);
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
        /*  if (this.props.markerList === nextProps.markerList && !this.state.isUpdateEnable) {
              return false;//don't update
          } else {
              showToast('shouldComponentUpdate')
              return true;
          }*/
        return true;
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
                    AppNames += innerItem.AppName + " | " + innerItem.ClusterInst + " | " + innerItem.Region + " | " + innerItem.HealthCheck;
                } else {
                    AppNames += innerItem.AppName + " | " + innerItem.ClusterInst + " | " + innerItem.Region + " | " + innerItem.HealthCheck + " , "
                }

                CloudletLocation = innerItem.CloudletLocation;
                Cloudlet = innerItem.Cloudlet;

            })

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
            <div style={{height: '100%', width: '100%', zIndex: 1}}>
                <Map center={[45.4, 51.7]}
                     duration={0.9}
                     zoom={this.state.zoom}
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
                                    offset={[0, 0]}
                                    opacity={0.8}
                                    permanent
                                    ref={c => {
                                        this.toolTip = c;
                                    }}
                                    style={{cursor: 'pointer', pointerEvents: 'auto'}}

                                >

                                        <span
                                            className='toolTip'
                                            style={{color: 'black'}}>{item.Cloudlet}</span>
                                </Tooltip>

                                {/* {item.isShowCircle &&
                                <Circle
                                    center={[item.CloudletLocation.latitude, item.CloudletLocation.longitude,]}
                                    radius={5000000}
                                    color={'green'}
                                    opacity={0.1}
                                    weight={0.1}
                                />
                                }*/}
                                <Popup className='popup1'>

                                    {listAppName.map(AppName_ClusterInst => {

                                        let AppName = AppName_ClusterInst.trim().split(" | ")[0].trim()
                                        let ClusterInst = AppName_ClusterInst.trim().split(" | ")[1].trim()
                                        let Region = AppName_ClusterInst.trim().split(" | ")[2].trim()
                                        let HealthCheck = AppName_ClusterInst.trim().split(" | ")[3].trim()


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

                                                        let arrayTemp = AppName_ClusterInst.split(" | ");

                                                        let AppInst = arrayTemp[0].trim()
                                                        let Cluster = arrayTemp[1].trim();
                                                        let Region = arrayTemp[2].trim();

                                                        let dataSet = AppInst + " | " + item.Cloudlet.trim() + " | " + Cluster + " | " + Region;
                                                        //showToast(dataSet)

                                                        this.props.handleAppInstDropdown(dataSet)
                                                    }}
                                                >
                                                    {AppName}
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
                                                            <div style={{marginLeft: 7, marginBottom: 0,height:15, }}>
                                                                <CheckCircleOutlined style={{color: 'green', fontSize: 17, marginBottom:25}}/>
                                                            </div>
                                                            :
                                                            <div style={{marginLeft: 7, marginBottom: 0,height:15, }}>
                                                                <CheckCircleOutlined style={{color: 'red', fontSize: 17, marginBottom:25}}/>
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
                    })}
                </Map>
            </div>
        );
    }
}
