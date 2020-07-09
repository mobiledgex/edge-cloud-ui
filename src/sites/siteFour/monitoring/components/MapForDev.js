import React, {createRef} from "react";
import {Map, Marker, Polyline, Popup, TileLayer, Tooltip} from "react-leaflet";
import type {TypeAppInst, TypeClient, TypeCloudlet, TypeCloudletUsage} from "../../../../shared/Types";
import Ripples from "react-ripples";
import {CheckCircleOutlined} from '@material-ui/icons';
import PageMonitoringView from "../view/PageMonitoringView";
import CircularProgress from "@material-ui/core/CircularProgress";
import Control from 'react-leaflet-control';
import {groupByKey_, removeDuplicates, renderBarLoader, renderSmallProgressLoader, showToast} from "../service/PageMonitoringCommonService";
import MarkerClusterGroup from "leaflet-make-cluster-group";
import {Icon} from "semantic-ui-react";
import {Select} from 'antd'
import {connect} from "react-redux";
import * as actions from "../../../../actions";
import "leaflet-make-cluster-group/LeafletMakeCluster.css";
import {PageMonitoringStyles} from "../common/PageMonitoringStyles";
import {listGroupByKey, makeMapThemeDropDown, reduceString, renderCloudletHwUsageDashBoardForAdmin, renderCloudletInfoForAdmin} from "../service/PageMonitoringService";
import MomentTimezone from "moment-timezone";
import {cellphoneIcon, cloudBlueIcon, cloudGreenIcon} from "../common/MapProperties";
import '../common/PageMonitoringStyles.css'
import {CLASSIFICATION} from "../../../../shared/Constants";
import {getMexTimezone} from "../../../../utils/sharedPreferences_util";

const {Option} = Select;
const DEFAULT_VIEWPORT = {
    center: [51.505, -0.09],
    zoom: 13,
}

const bottomDivHeight = 185;
const hwMarginTop = 5;
const hwFontSize = 12;

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
    parent: PageMonitoringView,
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
    handleAppInstDropdown: any,
    loading: boolean,
    appInstList: any,
    clusterList: any,
    cloudletList: any,
    mapLoading: boolean,
    currentClassification: string,
    cloudletUsageList: any,
    cloudletUsageListCount: number,
    currentCloudletMap: any,


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
    cloudletUsageList: any,
    cloudletUsageListCount: number,
    cloudletUsageOne: TypeCloudletUsage,
    cloudletOne: TypeCloudlet,

};

export default connect(mapStateToProps, mapDispatchProps)(
    class MapForDevContainer extends React.Component<Props, State> {
        tooltip = createRef();

        constructor(props: Props) {
            super(props);
            this.appInstPopup = React.createRef();
            this.state = {
                zoom: 2,//mapZoom
                appInstanceListGroupByCloudlet: '',
                cloudletKeys: [],
                locationGroupedCloudletList: [],
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
                cloudletUsageList: [],
                cloudletUsageListCount: 0,
                cloudletUsageOne: undefined,
                cloudletOne: undefined,

            };


        }


        componentDidMount = async () => {
            try {
                let markerList = this.props.markerList
                this.setCloudletLocation(markerList, true)
                await this.setState({
                    cloudletUsageOne: this.props.cloudletUsageList[0],
                    cloudletUsageList: this.props.cloudletUsageList,
                });
            } catch (e) {
                //throw new Error(e)
            }
        };


        async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
            try {

                if (this.props.isEnableZoomIn !== nextProps.isEnableZoomIn) {
                    this.setState({
                        isEnableZoomIn: false,
                    })
                }

                if (this.props.cloudletList !== nextProps.cloudletList) {
                    await this.setState({
                        cloudletUsageOne: this.props.cloudletUsageList[0],
                        cloudletOne: this.props.cloudletList[0],
                        cloudletUsageList: this.props.cloudletUsageList,
                    });
                }

                if (this.props.markerList !== nextProps.markerList) {
                    let markerList = nextProps.markerList;
                    this.setCloudletLocation(markerList, true)
                }

                //@desc : #############################
                //@desc:   hide appInstInfoPopup
                //@desc : #############################
                if (this.props.isShowAppInstPopup !== nextProps.isShowAppInstPopup) {
                    try {
                        if (this.appInstPopup.current !== undefined) {
                            this.appInstPopup.current.leafletElement.options.leaflet.map.closePopup();
                        }
                    } catch (e) {

                    }

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
                throw new Error(e)
            }

        }

        makeLocationGroupedCloudletList(locationGrpedList, locKeys) {
            try {
                let locationGroupedCloudletList = []
                locKeys.map(item => {
                    let AppNames = '';
                    let CloudletLocation = '';
                    let strCloudletLocation = '';
                    let Cloudlet = '';
                    locationGrpedList[item].map((innerItem, index) => {
                        if (index === locationGrpedList[item].length - 1) {
                            AppNames += innerItem.AppNames
                            Cloudlet += innerItem.Cloudlet
                        } else {
                            AppNames += innerItem.AppNames + ", "
                            Cloudlet += innerItem.Cloudlet + ", "
                        }

                        CloudletLocation = innerItem.CloudletLocation;
                        strCloudletLocation = innerItem.strCloudletLocation;
                    })

                    let CloudletGrpOne = {
                        AppNames,
                        CloudletLocation,
                        strCloudletLocation,
                        Cloudlet,
                    }

                    locationGroupedCloudletList.push(CloudletGrpOne)
                })

                return locationGroupedCloudletList;
            } catch (e) {
                throw new Error(e)
            }
        }

        makeNewCloudletLocationList(appInstListOnCloudlet, cloudletKeys) {
            try {
                let newCloudLetLocationList = []
                cloudletKeys.map((key, index) => {
                    let AppNames = ''
                    let CloudletLocation = '';
                    let Cloudlet = '';
                    appInstListOnCloudlet[key].map((innerItem: TypeAppInst, index) => {

                        if (index === (appInstListOnCloudlet[key].length - 1)) {
                            AppNames += innerItem.AppName + " | " + innerItem.ClusterInst + " | " + innerItem.Region + " | " + innerItem.HealthCheck + " | " + innerItem.Version + " | " + innerItem.Operator + " | " + innerItem.Cloudlet
                        } else {
                            AppNames += innerItem.AppName + " | " + innerItem.ClusterInst + " | " + innerItem.Region + " | " + innerItem.HealthCheck + " | " + innerItem.Version + " | " + innerItem.Operator + " | " + innerItem.Cloudlet + " , "
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
                return newCloudLetLocationList;
            } catch (e) {
                throw new Error(e)
            }
        }

        async setCloudletLocation(appInstListOnCloudlet, isMapCenter = false) {
            try {

                let cloudletKeys = Object.keys(appInstListOnCloudlet)
                let newCloudLetLocationList = this.makeNewCloudletLocationList(appInstListOnCloudlet, cloudletKeys)
                let locationGrpList = listGroupByKey(newCloudLetLocationList, 'strCloudletLocation')
                let locKeys = Object.keys(locationGrpList);
                let locationGroupedCloudletList = this.makeLocationGroupedCloudletList(locationGrpList, locKeys)

                this.setState({
                    selectedAppInstIndex: -1,
                    locationGroupedCloudletList: locationGroupedCloudletList,
                    appInstanceListGroupByCloudlet: appInstListOnCloudlet,
                }, () => {
                    if (locationGroupedCloudletList[0] !== undefined) {
                        this.setState({
                            mapCenter: [locationGroupedCloudletList[0].CloudletLocation.latitude, locationGroupedCloudletList[0].CloudletLocation.longitude],
                            zoom: 2,
                        })
                    }
                })
            } catch (e) {
                showToast(e.toString())
                //throw new Error(e)
            }
        }


        makeClientMarker(objkeyOne, index) {
            let groupedClientList = this.state.clientList;
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

            return (
                <MarkerClusterGroup key={index}>
                    {groupedClientList[objkeyOne].map((item, innerIndex) => {
                        return (
                            <React.Fragment key={innerIndex}>
                                <Marker
                                    icon={cellphoneIcon}
                                    position={
                                        [item.latitude, item.longitude]
                                    }
                                >
                                    <Popup className='clientPopup'
                                    >
                                        <div style={{
                                            display: 'flex',
                                            fontSize: 13,
                                        }}>
                                            <div style={{color: 'white',}}>
                                                {item.uuid}
                                            </div>
                                            <div style={{width: 5,}}/>
                                            <div style={{color: 'orange'}}>
                                                [{MomentTimezone(item.timestamp.seconds, 'X').tz(getMexTimezone()).format('lll').trim().toString().trim()}]
                                            </div>
                                        </div>

                                    </Popup>
                                </Marker>
                                {/*@desc:#####################################..*/}
                                {/*@desc:Render lines....                       */}
                                {/*@desc:#####################################..*/}
                                <Polyline
                                    //dashArray={['30,1,30']}
                                    id={innerIndex}
                                    smoothFactor={2.0}

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
                });
                clearInterval(this.props.parent.intervalForAppInst)
                clearInterval(this.props.parent.intervalForCluster)
                await this.props.parent.handleOnChangeClusterDropdown(undefined);
            } catch (e) {

            }
        }

        renderAppHealthCheckState(paramHealthCheckStatus) {
            return (
                <div>
                    {paramHealthCheckStatus === 3 ?
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
            )
        }

        renderAppInstPopup(listAppName, cloudletOne, cloudletIndex) {
            return (
                <Popup index={cloudletIndex} permanent className='cloudlet_popup' ref={this.appInstPopup}>
                    {listAppName.map((AppFullName, appIndex) => {
                        let AppName = AppFullName.trim().split(" | ")[0].trim()
                        let ClusterInst = AppFullName.trim().split(" | ")[1].trim()
                        let Region = AppFullName.trim().split(" | ")[2].trim()
                        let HealthCheckStatus = AppFullName.trim().split(" | ")[3].trim()
                        let Version = AppFullName.trim().split(" | ")[4].trim()
                        let Operator = AppFullName.trim().split(" | ")[5].trim()
                        let selectCloudlet = AppFullName.trim().split(" | ")[6].trim()
                        let serverLocation = {
                            lat: cloudletOne.CloudletLocation.latitude,
                            long: cloudletOne.CloudletLocation.longitude,
                        }

                        let fullAppInstOne = AppName + " | " + selectCloudlet + " | " + ClusterInst + " | " + Version + " | " + Region + " | " + HealthCheckStatus + " | " + Operator + " | " + JSON.stringify(serverLocation);

                        return (
                            <div style={PageMonitoringStyles.appPopupDiv}
                                 key={appIndex * cloudletIndex}
                            >
                                <Ripples
                                    style={{marginLeft: 5,}}
                                    color='#1cecff'
                                    during={500}
                                    onClick={async () => {
                                        try {
                                            await this.setState({selectedAppInstIndex: appIndex})
                                            await this.props.handleOnChangeAppInstDropdown(fullAppInstOne)

                                        } catch (e) {
                                            throw new Error(e)
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
                                    {this.renderAppHealthCheckState(HealthCheckStatus)}
                                </Ripples>
                            </div>
                        )
                    })}
                </Popup>
            )
        }

        renderCloudletMarkers = () => (
            this.state.locationGroupedCloudletList.map((cloudletOne, cloudletIndex) => {
                let listAppName = cloudletOne.AppNames.split(",")
                let cloudlets = cloudletOne.Cloudlet.toString().split(',');
                return (
                    <React.Fragment>
                        <Marker
                            ref={c => this.marker1 = c}
                            icon={this.props.cloudletIconColor === 'green' ? cloudGreenIcon : cloudBlueIcon}
                            className='marker1'
                            position={
                                [cloudletOne.CloudletLocation.latitude, cloudletOne.CloudletLocation.longitude]
                            }
                        >
                            <Tooltip
                                className='mapCloudletTooltipDev'
                                direction='right'
                                offset={[14, -10]}//x,y
                                opacity={0.8}
                                permanent
                                ref={c => {
                                    this.toolTip = c;
                                }}
                                style={{cursor: 'pointer', pointerEvents: 'auto'}}

                            >
                                {cloudlets.map((item, index) => {
                                    return (
                                        <div
                                            key={index}
                                            className='mapCloudletTooltipInnerBlack'
                                        >
                                            {item}
                                        </div>
                                    )
                                })}

                            </Tooltip>
                            {/*desc:################################*/}
                            {/*desc:appInstPopup                    */}
                            {/*desc:################################*/}
                            {this.renderAppInstPopup(listAppName, cloudletOne, cloudletIndex)}
                        </Marker>

                    </React.Fragment>
                )
            })
        )

        renderMapControl() {
            return (
                <Control position="topleft" style={{marginTop: 3, display: 'flex',}}>

                    <div style={PageMonitoringStyles.mapControlDiv}>
                        {this.props.currentClassification === CLASSIFICATION.CLUSTER || this.props.currentClassification === CLASSIFICATION.APPINST ?
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
                            </div> :
                            null
                        }
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
                    </div>

                </Control>
            )
        }

        renderHeader() {
            return (
                <div>
                    {!this.props.isFullScreenMap &&
                    <div className='page_monitoring_title_area draggable'>
                        <div style={{
                            display: 'flex',
                            width: '100%',
                            height: 30
                        }}>
                            <div className='page_monitoring_title'
                                 style={{
                                     backgroundColor: 'transparent',
                                     flex: .2
                                 }}
                            >
                                Deployed Instance
                            </div>
                            <div
                                style={{
                                    backgroundColor: 'transparent',
                                    flex: .8,
                                    marginLeft: -8,
                                }}
                            >
                                {makeMapThemeDropDown(this)}
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
            )
        }

        renderMapControlForCount() {
            try {
                return (
                    <Control position="topright" style={{marginTop: 3, display: 'flex',}}>
                        <div style={PageMonitoringStyles.mapStatusBox}>
                            <div style={{display: 'flex'}}>
                                Cluster&nbsp;&nbsp;&nbsp;:
                                <div style={{flex: .5, marginLeft: 5,}}>
                                    {this.props.loading ? renderSmallProgressLoader(-1) : this.props.clusterList.length}
                                </div>

                            </div>
                            <div style={{display: 'flex'}}>
                                App Inst :
                                <div style={{flex: .5, marginLeft: 5,}}>
                                    {this.props.loading ? renderSmallProgressLoader(-1) : this.props.appInstList.length}
                                </div>
                            </div>
                        </div>
                    </Control>
                )
            } catch (e) {

            }
        }


        render() {
            return (
                <div style={{flex: 1, height: '90%'}} ref={c => this.outerDiv = c}>
                    {this.props.mapLoading && renderBarLoader(false)}
                    {this.renderHeader()}
                    <div className='page_monitoring_container'>
                        <div style={{height: '100%', width: '100%', zIndex: 1}}>
                            <Map
                                center={this.state.mapCenter}
                                zoom={this.state.zoom}
                                duration={0.9}
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
                                ref={(ref) => {
                                    this.map = ref;
                                }}
                            >
                                <TileLayer
                                    url={this.props.currentTyleLayer}
                                    minZoom={2}
                                    style={{zIndex: 1}}
                                />
                                {this.renderMapControl()}
                                {this.props.currentClassification === CLASSIFICATION.CLUSTER_FOR_ADMIN || this.props.currentClassification === CLASSIFICATION.CLOUDLET_FOR_ADMIN ? this.renderMapControlForCount() : null}
                                {this.props.isFullScreenMap ?
                                    <div style={{position: 'absolute', top: 5, right: 5, zIndex: 99999}}>
                                        {makeMapThemeDropDown(this)}
                                    </div>
                                    : null
                                }
                                {/*@desc:#####################################..*/}
                                {/*@desc: Client Markers  (MarkerClusterGroup)...*/}
                                {/*@desc:#####################################..*/}
                                {this.state.clientObjKeys.map((objkeyOne, index) =>
                                    this.makeClientMarker(objkeyOne, index)
                                )}

                                {/*@desc:#####################################..*/}
                                {/*@desc:Cloudlet Markers                    ...*/}
                                {/*@desc:#####################################..*/}
                                <React.Fragment>
                                    <React.Fragment>
                                        {this.renderCloudletMarkers()}
                                    </React.Fragment>
                                </React.Fragment>
                                {/*todo:#####################*/}
                                {/*todo:bottom dash board*/}
                                {/*todo:#####################*/}
                                {this.props.currentClassification === CLASSIFICATION.CLOUDLET_FOR_ADMIN ?
                                    <div
                                        style={{
                                            position: 'absolute',
                                            bottom: 0,
                                            background: 'rgba(0, 0, 0, 0.5)',
                                            width: '100%',
                                            height: bottomDivHeight,
                                            zIndex: 99999,
                                            padding: 10,
                                            marginLeft: 0,
                                            display: 'flex'
                                        }}
                                    >
                                        {this.props.currentCloudletMap !== undefined && renderCloudletInfoForAdmin(this.props.currentCloudletMap)}
                                        {this.state.cloudletUsageOne !== undefined && renderCloudletHwUsageDashBoardForAdmin(this.state.cloudletUsageOne, bottomDivHeight, hwMarginTop, hwFontSize)}
                                    </div>
                                    : null
                                }
                            </Map>
                        </div>

                    </div>
                </div>
            );
        }
    }
)

