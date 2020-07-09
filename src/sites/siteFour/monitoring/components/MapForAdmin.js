import React, {createRef} from "react";
import {Map, Marker, Popup, TileLayer, Tooltip} from "react-leaflet";
import type {TypeAppInst, TypeClient, TypeCloudlet} from "../../../../shared/Types";
import PageMonitoringView from "../view/PageMonitoringView";
import CircularProgress from "@material-ui/core/CircularProgress";
import Control from 'react-leaflet-control';
import {groupByKey_, removeDuplicates, renderBarLoader, showToast} from "../service/PageMonitoringCommonService";
import {Icon} from "semantic-ui-react";
import {Select} from 'antd'
import {connect} from "react-redux";
import * as actions from "../../../../actions";
import "leaflet-make-cluster-group/LeafletMakeCluster.css";
import {Center, PageMonitoringStyles} from "../common/PageMonitoringStyles";
import '../common/PageMonitoringStyles.css'
import {listGroupByKey, makeMapThemeDropDown, renderCloudletHwUsageDashBoardForAdmin, renderCloudletInfoForAdmin} from "../service/PageMonitoringService";
import {cloudBlueIcon, cloudGreenIcon} from "../common/MapProperties";

const bottomDivHeight = 185;
const hwMarginTop = 5;
const hwFontSize = 12;
const {Option} = Select;
const DEFAULT_VIEWPORT = {
    center: [51.505, -0.09],
    zoom: 13,
}

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
    currentOrgView: string,
    currentClassification: string,
    filteredCloudletUsageList: any,
    locationGroupedCloudletList: any,

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
    cloudletUsageOne: any,

};


export default connect(mapStateToProps, mapDispatchProps)((
    class MapForAdmin extends React.Component<Props, State> {
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

            };


        }


        componentDidMount = async () => {
            try {
                await this.setState({
                    cloudletUsageOne: this.props.cloudletUsageList[0],
                },()=>{
                    console.log(`cloudletUsageOne====>`,this.state.cloudletUsageOne);
                });
                let markerList = this.props.markerList
                this.setCloudletLocation(markerList, true)

            } catch (e) {
                throw new Error(e)
            }

        };

        async componentWillReceiveProps(nextProps: any, nextContext: any): void {
            try {

                if (this.props.isEnableZoomIn !== nextProps.isEnableZoomIn) {
                    this.setState({
                        isEnableZoomIn: false,
                    })
                }

                if (this.props.markerList !== nextProps.markerList) {

                    await this.setState({
                        cloudletUsageOne: nextProps.cloudletUsageList[0],
                    })
                    let markerList = nextProps.markerList;
                    if (nextProps.currentOrgView === 'oper' || nextProps.currentOrgView === 'all') {
                        this.setCloudletLocation(markerList)
                    } else {//devorg
                        this.setCloudletLocationForDevOrg(markerList)
                    }
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


        setCloudletLocationForDevOrg(appInstListOnCloudlet, isMapCenter = false) {
            try {


                let cloudletKeys = Object.keys(appInstListOnCloudlet)
                let newCloudLetLocationList = this.makeNewCloudletLocationListForDevOrg(appInstListOnCloudlet, cloudletKeys)
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
                            mapCenter: isMapCenter ? this.state.mapCenter : [locationGroupedCloudletList[0].CloudletLocation.latitude, locationGroupedCloudletList[0].CloudletLocation.longitude],
                            zoom: 2,
                        })
                    }
                })
            } catch (e) {
                showToast(e.toString())
                //throw new Error(e)
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
                    let State = '';
                    appInstListOnCloudlet[key].map((innerItem: TypeCloudlet, index) => {
                        if (index === (appInstListOnCloudlet[key].length - 1)) {
                            AppNames += innerItem.State + " | " + innerItem.CloudletName + " | " + innerItem.Region + " | " + "-" + " | " + "-" + " | " + innerItem.Operator + " | " + innerItem.CloudletName
                        } else {
                            AppNames += innerItem.State + " | " + innerItem.CloudletName + " | " + innerItem.Region + " | " + "-" + " | " + "-" + " | " + innerItem.Operator + " | " + innerItem.CloudletName + " , "
                        }
                        CloudletLocation = innerItem.CloudletLocation;
                        Cloudlet = innerItem.CloudletName;
                        State = innerItem.State;
                    })

                    newCloudLetLocationList.push({
                        AppNames: AppNames,
                        State: State,
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


        makeNewCloudletLocationListForDevOrg(appInstListOnCloudlet, cloudletKeys) {
            try {
                let newCloudLetLocationList = []
                cloudletKeys.map((key, index) => {
                    let AppNames = ''
                    let CloudletLocation = '';
                    let Cloudlet = '';
                    let State = '';
                    appInstListOnCloudlet[key].map((innerItem: TypeAppInst, index) => {
                        if (index === (appInstListOnCloudlet[key].length - 1)) {
                            AppNames += innerItem.State + " | " + innerItem.Cloudlet + " | " + innerItem.Region + " | " + "-" + " | " + "-" + " | " + innerItem.Operator + " | " + innerItem.Cloudlet
                        } else {
                            AppNames += innerItem.State + " | " + innerItem.Cloudlet + " | " + innerItem.Region + " | " + "-" + " | " + "-" + " | " + innerItem.Operator + " | " + innerItem.Cloudlet + " , "
                        }
                        CloudletLocation = innerItem.CloudletLocation;
                        Cloudlet = innerItem.Cloudlet;
                        State = innerItem.State;
                    })

                    newCloudLetLocationList.push({
                        AppNames: AppNames,
                        State: State,
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

        setCloudletLocation(appInstListOnCloudlet, isMapCenter = false) {
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
                            mapCenter: isMapCenter ? this.state.mapCenter : [locationGroupedCloudletList[0].CloudletLocation.latitude, locationGroupedCloudletList[0].CloudletLocation.longitude],
                            zoom: 2,
                        })
                    }
                })
            } catch (e) {
                showToast(e.toString())
                //throw new Error(e)
            }
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

        renderCloudletMarkerTooltip(cloudlets) {
            return (
                <Tooltip
                    className='mapCloudletTooltip'
                    direction='right'
                    offset={[14, -10]}//x,y
                    opacity={0.8}
                    permanent
                    ref={c => {
                        this.toolTip = c;
                    }}
                    style={{cursor: 'pointer', pointerEvents: 'auto'}}

                >
                    {cloudlets.map((cloudletOne, index) => {
                        return (
                            <div
                                onClick={() => {
                                    alert(cloudletOne)
                                }}
                                key={index}
                                className='mapCloudletTooltipInnerBlack'
                            >
                                {cloudletOne}
                            </div>
                        )
                    })}

                </Tooltip>
            )
        }


        renderCloudletMarkerPopup(cloudlets) {
            return (
                <Popup
                    className='tooltipForAdmin'
                    offset={[0, 0]}
                    opacity={0.7}
                    style={{width: 'auto'}}
                >
                    <div style={{display: 'flex', flexDirection: 'column'}}>
                        {cloudlets.map((cloudletOne, index) => {
                            return (
                                <div
                                    onClick={() => {
                                        let cloudletFull = cloudletOne + " | " + cloudletOne
                                        this.props.handleOnChangeCloudletDropdownForAdmin(cloudletFull)
                                    }}
                                    key={index}
                                    className='mapCloudletTooltipInnerForAdmin'
                                >
                                    {cloudletOne}
                                </div>
                            )
                        })}
                    </div>
                </Popup>
            )
        }

        renderCloudletMarkers = () => (
            this.state.locationGroupedCloudletList.map((cloudletOne: TypeCloudlet, cloudletIndex) => {
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
                            {this.renderCloudletMarkerTooltip(cloudlets)}
                            {/*{this.renderCloudletMarkerPopup(cloudlets)}*/}
                        </Marker>
                    </React.Fragment>
                )
            })
        )


        renderMapControl() {
            return (
                <React.Fragment>
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


                </React.Fragment>
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
                            <div className='page_monitoring_title' style={{
                                backgroundColor: 'transparent',
                                flex: .2
                            }}>
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

        renderCounterDiv() {
            return (
                <Control position="topright" style={{marginTop: 3, display: 'flex',}}>
                    <Center style={PageMonitoringStyles.mapStatusBoxCloudlet}>
                        <div style={{}}>
                            Cloudlet : {this.props.parent.state.cloudletCount}
                        </div>
                    </Center>
                </Control>
            )
        }


        render() {
            return (
                <div ref={c => this.element = c} style={{flex: 1, height: '100%'}}>
                    {this.props.parent.state.mapLoading && renderBarLoader(false)}
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
                                {this.renderCounterDiv()}
                                {this.props.isFullScreenMap ?
                                    <div style={{position: 'absolute', top: 5, right: 5, zIndex: 99999}}>
                                        {makeMapThemeDropDown(this)}
                                    </div>
                                    : null
                                }
                                {/*@desc:#####################################..*/}
                                {/*@desc:Cloudlet Markers                    ...*/}
                                {/*@desc:#####################################..*/}
                                <React.Fragment>
                                    <React.Fragment>
                                        {this.renderCloudletMarkers()}
                                    </React.Fragment>
                                </React.Fragment>
                                {this.props.cloudletList.length === 1 &&
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
                                }
                            </Map>
                        </div>

                    </div>
                </div>
            );
        }
    }
))

