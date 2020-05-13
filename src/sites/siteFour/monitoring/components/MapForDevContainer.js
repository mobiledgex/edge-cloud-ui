import React, {createRef} from "react";
import * as L from 'leaflet';
import type {TypeAppInstance, TypeClient} from "../../../../shared/Types";
import Ripples from "react-ripples";
import {CheckCircleOutlined} from '@material-ui/icons';
import {Map, Marker, Polyline, Popup, TileLayer, Tooltip,} from "react-leaflet";
import PageDevMonitoring from "../dev/PageDevMonitoring";
import CircularProgress from "@material-ui/core/CircularProgress";
import Control from 'react-leaflet-control';
import {groupByKey_, removeDuplicates} from "../PageMonitoringCommonService";
import MarkerClusterGroup from "leaflet-make-cluster-group";
import {Icon} from "semantic-ui-react";
import {notification, Select} from 'antd'
import {connect} from "react-redux";
import * as actions from "../../../../actions";
import {
    DARK_CLOUTLET_ICON_COLOR,
    DARK_LINE_COLOR,
    WHITE_CLOUTLET_ICON_COLOR,
    WHITE_LINE_COLOR
} from "../../../../shared/Constants";
import "leaflet-make-cluster-group/LeafletMakeCluster.css";
import '../PageMonitoring.css'
import {PageMonitoringStyles} from "../PageMonitoringStyles";
import {groupByCloudletLocation, reduceString} from "../dev/PageDevMonitoringService";
import moment from "moment-timezone";

const FontAwesomeIcon = require('react-fontawesome')

const {Option} = Select;

const DEFAULT_VIEWPORT = {
    center: [51.505, -0.09],
    zoom: 13,
}


let cellphoneIcon2 = L.icon({
    iconUrl: require('../images/cellhone_white003.png'),
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

let iconPlus = L.icon({
    iconUrl: 'https://cdn0.iconfinder.com/data/icons/simplie-essential-action/22/action_021-add-new-plus-increase-512.png',
    iconSize: [40, 21],
    iconAnchor: [20, 21],
    shadowSize: [41, 41]
});


let cloudGreenIcon = L.icon({
    iconUrl: require('../images/cloud_green.png'),
    //shadowUrl : 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [40, 21],
    iconAnchor: [20, 21],
    shadowSize: [41, 41]
});

let cloudBlueIcon = L.icon({
    iconUrl: require('../images/cloud_blue2.png'),
    //shadowUrl : 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
    iconSize: [45, 39],//todo: width, height
    iconAnchor: [24, 30],//x,y
    shadowSize: [41, 41]
});


const mapStateToProps = (state) => {
    return {
        isLoading: state.LoadingReducer.isLoading,
        currentTyleLayer: state.MapTyleLayerReducer.currentTyleLayer,
        lineColor: state.MapTyleLayerReducer.lineColor,
        cloudletIconColor: state.MapTyleLayerReducer.cloudletIconColor,
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        toggleLoading: (data) => {
            dispatch(actions.toggleLoading(data))
        },
        setMapTyleLayer: (data) => {
            dispatch(actions.setMapTyleLayer(data))
        },

        setLineColor: (data) => {
            dispatch(actions.setLineColor(data))
        },

        setCloudletIconColor: (data) => {
            dispatch(actions.setCloudletIconColor(data))
        },
    };
};
type Props = {
    parent: PageDevMonitoring,
    markerList: Array,
    selectedClientLocationListOnAppInst: any,
    isMapUpdate: boolean,
    currentWidgetWidth: number,
    isFullScreenMap: boolean,
    currentTyleLayer: string,
    lineColor: string,
    cloudletIconColor: string,
    setMapTyleLayer: Function,
    setLineColor: Function,
    setCloudletIconColor: Function,
    isLoading: boolean,
    isShowAppInstPopup: boolean,
    isEnableZoomIn: boolean,

};
type State = {
    zoom: number,
    popUploading: boolean,
    newCloudLetLocationList: Array,
    isUpdateEnable: boolean,
    clientList: any,
    currentTyleLayer: any,
    currentWidgetWidth: number,
    clientObjKeys: any,
    lineColor: string,
    cloudIcon: string,
    cloudletIconColor: string,
    mapCenter: any,
    selectedAppInstIndex: number,
    isEnableZoomIn: boolean,
    isCloudletClustering: boolean,
    currentTimeZone: string,

};

export default connect(mapStateToProps, mapDispatchProps)(
    class MapForDevContainer extends React.Component<Props, State> {
        mapTileList = [
            {
                url: 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png',
                name: 'dark1',
                value: 0,
            },
            {
                url: 'https://cartocdn_{s}.global.ssl.fastly.net/base-midnight/{z}/{x}/{y}.png',
                name: 'dark2',
                value: 1,
            },
            {
                url: 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png',
                name: 'dark3',
                value: 2,
            },

            {
                url: 'https://cartocdn_{s}.global.ssl.fastly.net/base-flatblue/{z}/{x}/{y}.png',
                name: 'blue',
                value: 3,
            },
            {
                url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Light_Gray_Base/MapServer/tile/{z}/{y}/{x}',
                name: 'light2',
                value: 4,
            },
            {
                url: 'https://cartocdn_{s}.global.ssl.fastly.net/base-antique/{z}/{x}/{y}.png',
                name: 'light3',
                value: 5,
            },
            {
                url: 'https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png',
                name: 'light4',
                value: 6,
            },
        ]


        constructor(props: Props) {
            super(props);
            this.appInstPopup = React.createRef();
            this.state = {
                zoom: 2,//mapZoom
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
                lineColor: 'green',
                cloudletIconColor: 'green',
                mapCenter: [43.4, 51.7],
                selectedAppInstIndex: -1,
                isEnableZoomIn: false,
                isCloudletClustering: false,
                currentTimeZone: undefined,

            };


        }

        tooltip = createRef();

        componentDidMount = async () => {

            try {
                let appInstanceListGroupByCloudlet = this.props.markerList
                await this.setCloudletLocation(appInstanceListGroupByCloudlet, true)
            } catch (e) {

            }

        };


        async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
            try {

                if (this.props.isEnableZoomIn !== nextProps.isEnableZoomIn) {
                    this.setState({
                        isEnableZoomIn: false,
                    })
                }

                if (this.props.markerList !== nextProps.markerList) {
                    let appInstanceListGroupByCloudlet = nextProps.markerList;
                    this.setCloudletLocation(appInstanceListGroupByCloudlet)
                }

                //@desc : #############################
                //@desc:   hide appInstInfoPopup
                //@desc : #############################
                if (this.props.isShowAppInstPopup !== nextProps.isShowAppInstPopup) {
                    this.appInstPopup.current.leafletElement.options.leaflet.map.closePopup();
                }

                //@desc : #############################
                //@desc : clientList
                //@desc : #############################
                if (this.props.selectedClientLocationListOnAppInst !== nextProps.selectedClientLocationListOnAppInst) {

                    await this.setState({
                        clientObjKeys: [],
                    })
                    let clientList = nextProps.selectedClientLocationListOnAppInst;
                    //desc: duplication remove by client cellphone uuid
                    clientList = removeDuplicates(clientList, "uuid")

                    let newClientList = []
                    clientList.map((item: TypeClient, index) => {
                        let clientLocation = parseFloat(item.latitude).toFixed(1).toString() + parseFloat(item.longitude).toFixed(1).toString();
                        item.clientLocation = clientLocation;
                        newClientList.push(item);
                    })

                    let groupedClientList = groupByKey_(newClientList, 'clientLocation')
                    let clientObjKeys = Object.keys(groupedClientList)
                    await this.setState({
                        clientList: groupedClientList,
                        clientObjKeys: clientObjKeys,
                    }, () => {
                    })
                }
            } catch (e) {

            }

        }

        setCloudletLocation(pAppInstanceListGroupByCloudlet, isMapCenter = false) {
            try {
                let cloudletKeys = Object.keys(pAppInstanceListGroupByCloudlet)

                let newCloudLetLocationList = []
                cloudletKeys.map((key, index) => {
                    let AppNames = ''
                    let CloudletLocation = '';
                    let Cloudlet = '';
                    let ClusterInst = '';

                    pAppInstanceListGroupByCloudlet[key].map((innerItem: TypeAppInstance, index) => {
                        if (index === (pAppInstanceListGroupByCloudlet[key].length - 1)) {
                            AppNames += innerItem.AppName + " | " + innerItem.ClusterInst + " | " + innerItem.Region + " | " + innerItem.HealthCheck + " | " + innerItem.Version + " | " + innerItem.Operator
                        } else {
                            AppNames += innerItem.AppName + " | " + innerItem.ClusterInst + " | " + innerItem.Region + " | " + innerItem.HealthCheck + " | " + innerItem.Version + " | " + innerItem.Operator + " , "
                        }
                        CloudletLocation = innerItem.CloudletLocation;
                        Cloudlet = innerItem.Cloudlet;
                    })

                    newCloudLetLocationList.push({
                        AppNames: AppNames,
                        CloudletLocation: CloudletLocation,
                        strCloudletLocation: CloudletLocation.latitude.toString() + "_" + CloudletLocation.longitude.toString(),
                        Cloudlet: Cloudlet,
                        isShow: false,
                        isShowCircle: false,
                        //ClusterInst: ClusterInst,
                    })

                })

                let groupByCloudletLocationObject = groupByCloudletLocation(newCloudLetLocationList, 'strCloudletLocation')
                let keysForCloudlet = Object.keys(groupByCloudletLocationObject);
                let locationGroupedCloudletList = []
                keysForCloudlet.map((item, index) => {
                    let itemOne = groupByCloudletLocationObject[item];
                    locationGroupedCloudletList.push(itemOne);
                })

                //@todo: cloudletDIV block, hidden
                let arrIsShowCloudlet = []
                newCloudLetLocationList.map(item => {
                    arrIsShowCloudlet.push(false);
                })

                this.setState({
                    selectedAppInstIndex: -1,
                    newCloudLetLocationList: locationGroupedCloudletList,
                    arrIsShowCloudlet: arrIsShowCloudlet,
                    appInstanceListGroupByCloudlet: pAppInstanceListGroupByCloudlet,
                }, () => {
                    //@desc: Move the center of the map to the center of the item.
                    if (locationGroupedCloudletList[0] !== undefined) {
                        this.setState({
                            mapCenter: isMapCenter ? this.state.mapCenter : [locationGroupedCloudletList[0][0].CloudletLocation.latitude, locationGroupedCloudletList[0][0].CloudletLocation.longitude],
                            zoom: 2,
                        })
                    }
                })
            } catch (e) {

            }

        }

        async handleClickAppInst(fullAppInstOne) {
            try {
                await this.props.handleAppInstDropdown(fullAppInstOne)
            } catch (e) {

            }

        }

        makeMapThemeDropDown() {
            return (
                <Select
                    size={"small"}
                    defaultValue="dark1"
                    style={{width: 70}}
                    showArrow={false}
                    bordered={false}
                    ref={c => this.themeSelect = c}
                    listHeight={550}
                    onChange={async (value) => {
                        try {
                            let index = value
                            let lineColor = DARK_LINE_COLOR
                            let cloudletIconColor = DARK_CLOUTLET_ICON_COLOR
                            if (Number(index) >= 4) {
                                lineColor = WHITE_LINE_COLOR;
                                cloudletIconColor = WHITE_CLOUTLET_ICON_COLOR
                            }
                            this.props.setMapTyleLayer(this.mapTileList[index].url);
                            this.props.setLineColor(lineColor);
                            this.props.setCloudletIconColor(cloudletIconColor);
                            setTimeout(() => {
                                this.themeSelect.blur();
                            }, 250)

                        } catch (e) {

                        } finally {

                        }

                    }}
                >
                    {this.mapTileList.map((item, index) => {
                        return (
                            <Option style={{color: 'white'}} defaultChecked={index === 0}
                                    value={item.value}>{item.name}</Option>
                        )
                    })}
                </Select>
            )
        }

        makeClusterGroupForClient(objkeyOne, index) {
            let groupedClientList = this.state.clientList;
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;


            return (
                <MarkerClusterGroup key={index}>
                    {groupedClientList[objkeyOne].map((item, index) => {
                        return (
                            <React.Fragment>
                                <Marker
                                    icon={cellphoneIcon2}
                                    position={
                                        [item.latitude, item.longitude]
                                    }
                                >
                                    <Popup className='clientPopup'
                                    >
                                        <div style={{
                                            display: 'flex',
                                            fontSize: 13,
                                            minWidth: '250px !important',
                                            width: '250px !important',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}>
                                            <div style={{color: 'white',}}>
                                                {item.uuid}
                                            </div>
                                            <div style={{width: 5,}}/>
                                            <div>
                                                [&nbsp;
                                            </div>
                                            <div style={{color: 'orange'}}>
                                                {moment(item.timestamp.seconds, 'X').tz(timeZone).format('lll').trim().toString()}
                                            </div>
                                            <div style={{width: 5,}}/>
                                            {/*   <div style={{color: 'green',}}>
                                                nanos
                                                : {moment.unix(item.timestamp.nanos).format("MM/DD/YYYY").toString()}
                                            </div>*/}
                                            <div>
                                                ]
                                            </div>
                                        </div>

                                    </Popup>
                                </Marker>
                                {/*@desc:#####################################..*/}
                                {/*@desc:Render lines....                       */}
                                {/*@desc:#####################################..*/}
                                <Polyline
                                    //dashArray={['30,1,30']}
                                    id={index}
                                    positions={[
                                        [item.latitude, item.longitude], [item.serverLocInfo.lat, item.serverLocInfo.long],
                                    ]}
                                    color={this.props.lineColor}
                                />

                            </React.Fragment>
                        )


                    })

                    }
                </MarkerClusterGroup>
            )
        }

        handleRefresh = async () => {
            try {
                await this.setState({
                    zoom: 1,
                    selectedAppInstIndex: -1,
                }, () => {
                    notification.success({
                        placement: 'bottomLeft',
                        duration: 1.5,
                        message: 'Fetch locally stored data.',
                    });
                })

                await this.props.parent.handleClusterDropdownAndReset('');
            } catch (e) {

            }
        }

        setVerticalOffset(lat, cloudletIndex) {
            return lat + (cloudletIndex * 0.005)
        }

        renderCloudletMarkers = () => (
            this.state.newCloudLetLocationList.map((cloudletList, cloudletIndex) => {
                return cloudletList.map((cloudletOne, cloudletOneIndex) => {
                    let listAppName = cloudletOne.AppNames.split(",")

                    return (
                        <React.Fragment>
                            <Marker
                                ref={c => this.marker1 = c}
                                icon={this.props.cloudletIconColor === 'green' ? cloudGreenIcon : cloudBlueIcon}
                                className='marker1'
                                position={
                                    //@DESC :If the positions are the same, a slight VERTICAL OFFSET is given.
                                    [cloudletOneIndex === 0 ? cloudletOne.CloudletLocation.latitude : this.setVerticalOffset(cloudletOne.CloudletLocation.latitude, cloudletIndex), cloudletOne.CloudletLocation.longitude]
                                    //[cloudletOne.CloudletLocation.latitude, cloudletOne.CloudletLocation.longitude]
                                }
                                onClick={() => {


                                    let toggleNewCloudletLocationList = this.state.newCloudLetLocationList;
                                    toggleNewCloudletLocationList[cloudletOneIndex].isShowCircle = !toggleNewCloudletLocationList[cloudletOneIndex].isShowCircle
                                    this.setState({
                                        newCloudLetLocationList: toggleNewCloudletLocationList,
                                        isUpdateEnable: true,
                                        selectedAppInstIndex: -1,
                                        zoom: this.state.isEnableZoomIn ? 14 : this.state.zoom,
                                        mapCenter: this.state.isEnableZoomIn ? [cloudletOne.CloudletLocation.latitude, cloudletOne.CloudletLocation.longitude] : null,
                                    })
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
                                    <div
                                        className='toolTip'
                                        style={{color: 'black'}}>{cloudletOne.Cloudlet}</div>
                                </Tooltip>
                                {/*desc:################################*/}
                                {/*desc:appInstPopup                    */}
                                {/*desc:################################*/}
                                <Popup permanent className='popup1' ref={this.appInstPopup}>
                                    {listAppName.map((AppFullName, innerIndex) => {
                                        let AppName = AppFullName.trim().split(" | ")[0].trim()
                                        let ClusterInst = AppFullName.trim().split(" | ")[1].trim()
                                        let Region = AppFullName.trim().split(" | ")[2].trim()
                                        let HealthCheck = AppFullName.trim().split(" | ")[3].trim()
                                        let Version = AppFullName.trim().split(" | ")[4].trim()
                                        let Operator = AppFullName.trim().split(" | ")[5].trim()
                                        let lat = cloudletOne.CloudletLocation.latitude;
                                        let long = cloudletOne.CloudletLocation.longitude;

                                        let serverLocation = {
                                            lat,
                                            long,
                                        }

                                        let fullAppInstOne = AppName + " | " + cloudletOne.Cloudlet.trim() + " | " + ClusterInst + " | " + Version + " | " + Region + " | " + HealthCheck + " | " + Operator + " | " + JSON.stringify(serverLocation);

                                        return (
                                            <div style={{
                                                fontSize: 14,
                                                cursor: 'crosshair',
                                                flexDirection: 'column',
                                                marginTop: 0,
                                                marginBottom: 5,
                                                borderRadius: 5,
                                                justifyContents: 'center',
                                                alignSelf: 'center',
                                                alignItem: 'center,',
                                                display: 'flex',
                                                //backgroundColor: innerIndex === this.state.selectedAppInstIndex ? 'rgba(192, 192, 192,.2)' : null,
                                            }}
                                            >
                                                <Ripples
                                                    style={{marginLeft: 5,}}
                                                    color='#1cecff' during={500}
                                                    onClick={async () => {
                                                        try {
                                                            this.setState({
                                                                selectedAppInstIndex: innerIndex,
                                                            })
                                                            await this.handleClickAppInst(fullAppInstOne)
                                                        } catch (e) {

                                                        }
                                                    }}
                                                >
                                                    {reduceString(AppName.toString(), 25)} [{Version}]
                                                    <div style={{
                                                        color: '#77BD25',
                                                        fontSize: 12
                                                    }}>
                                                        &nbsp;&nbsp;[{reduceString(ClusterInst.trim(), 25)}]
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

                        </React.Fragment>
                    )
                })

            })

        )

        render() {

            return (
                <React.Fragment>
                    <div>
                        {!this.props.isFullScreenMap &&
                        <div className='page_monitoring_title_area draggable'>
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

                            </div>
                        </div>
                        }

                        {this.props.parent.state.mapPopUploading &&
                        <div className='page_monitoring_title_area draggable'>
                            <div className='page_monitoring_title' style={{
                                backgroundColor: 'transparent',
                                flex: .65
                            }}>
                                <div style={{zIndex: 99999999999}}>
                                    <CircularProgress style={{
                                        color: '#1cecff',
                                        marginRight: 0,
                                        marginBottom: -2,
                                        fontWeight: 'bold',
                                    }}
                                                      size={14}
                                    />
                                </div>
                            </div>
                        </div>
                        }

                    </div>
                    <div className='page_monitoring_container'>
                        <div style={{height: '100%', width: '100%', zIndex: 1}}>
                            <Map center={this.state.mapCenter}
                                 duration={0.9}
                                 zoom={this.state.zoom}
                                 onZoomEnd={(e) => {
                                     this.setState({
                                         zoom: e.target._zoom,
                                     })
                                 }}
                                 style={{width: '100%', height: '100%', zIndex: 1,}}
                                 easeLinearity={1}
                                 useFlyTo={true}
                                 dragging={true}
                                 boundsOptions={{padding: [50, 50]}}
                                 maxZoom={14}
                                 zoomControl={false}
                                 onResize={() => {

                                 }}

                                 ref={(ref) => {
                                     this.map = ref;
                                 }}
                            >
                                {/*{this.props.parent.state.loading && renderPlaceHolderLottiePinJump3()}*/}
                                <TileLayer
                                    url={this.props.currentTyleLayer}
                                    minZoom={2}
                                    style={{zIndex: 1}}
                                />
                                {/*@todo:#####################################..*/}
                                {/*@todo: zoom, reset Icons...*/}
                                {/*@todo:#####################################..*/}
                                <Control position="topleft" style={{marginTop: 3, display: 'flex',}}>

                                    <div style={PageMonitoringStyles.mapControlDiv}>
                                        <div
                                            style={{backgroundColor: 'transparent', height: 30}}
                                            onClick={() => {
                                                this.setState({
                                                    zoom: this.state.zoom + 1,
                                                })
                                            }}
                                        >
                                            <Icon
                                                name='add'

                                                style={{fontSize: 20, color: 'white', cursor: 'pointer'}}
                                            />
                                        </div>
                                        <div style={{width: 2}}/>
                                        <div
                                            style={{
                                                backgroundColor: 'transparent',
                                                height: 30,
                                                width: 30,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignSelf: 'center'
                                            }}
                                            onClick={() => {
                                                this.setState({
                                                    zoom: this.state.zoom - 1,
                                                })
                                            }}
                                        >
                                            <Icon
                                                name='minus'

                                                style={{fontSize: 20, color: 'white', cursor: 'pointer'}}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                backgroundColor: 'transparent',
                                                height: 30,
                                                width: 30,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignSelf: 'center'
                                            }}
                                        >
                                            <Icon
                                                name='redo'
                                                onClick={this.handleRefresh}
                                                style={{fontSize: 20, color: 'white', cursor: 'pointer'}}
                                            />
                                        </div>
                                        <div
                                            style={{
                                                backgroundColor: 'transparent',
                                                height: 30,
                                                width: 30,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignSelf: 'center'
                                            }}
                                        >
                                            <Icon
                                                name='zoom-in'
                                                onClick={() => {
                                                    this.setState({
                                                        isEnableZoomIn: !this.state.isEnableZoomIn
                                                    })
                                                }}
                                                style={{
                                                    fontSize: 20,
                                                    color: this.state.isEnableZoomIn ? 'white' : 'grey',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        </div>

                                        <div
                                            style={{
                                                backgroundColor: 'transparent',
                                                height: 30,
                                                width: 30,
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignSelf: 'center'
                                            }}
                                        >
                                            <Icon
                                                name='compress'
                                                onClick={() => {
                                                    this.setState({
                                                        isCloudletClustering: !this.state.isCloudletClustering
                                                    })
                                                }}
                                                style={{
                                                    fontSize: 20,
                                                    color: this.state.isCloudletClustering ? 'white' : 'grey',
                                                    cursor: 'pointer'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </Control>

                                {/*@todo:#####################################..*/}
                                {/*@todo: topRight Dropdown changing MapTyles...*/}
                                {/*@todo:#####################################..*/}
                                {this.props.isFullScreenMap ?
                                    <div style={{position: 'absolute', top: 5, right: 5, zIndex: 99999}}>
                                        {this.makeMapThemeDropDown()}
                                    </div>
                                    : <Control position="bottomright" style={{marginTop: 1, marginRight: -1}}>
                                        {this.makeMapThemeDropDown()}
                                    </Control>
                                }
                                {/*@desc:#####################################..*/}
                                {/*@desc: Client Markers  (MarkerClusterGroup)...*/}
                                {/*@desc:#####################################..*/}
                                {this.state.clientObjKeys.map((objkeyOne, index) =>
                                    this.makeClusterGroupForClient(objkeyOne, index)
                                )}


                                {/*@desc:#####################################..*/}
                                {/*@desc:cloudlet Markers                    ...*/}
                                {/*@desc:#####################################..*/}
                                <React.Fragment>
                                    {this.state.isCloudletClustering ?
                                        <MarkerClusterGroup>
                                            {this.renderCloudletMarkers()}
                                        </MarkerClusterGroup>
                                        :
                                        <React.Fragment>
                                            {this.renderCloudletMarkers()}
                                        </React.Fragment>
                                    }

                                </React.Fragment>
                            </Map>
                        </div>

                    </div>
                </React.Fragment>
            );
        }
    }
)

