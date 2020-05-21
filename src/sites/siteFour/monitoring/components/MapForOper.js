import React, {useEffect, useRef, useState} from "react";
import {Map, Marker, Popup, TileLayer} from "react-leaflet";
import Ripple from "react-ripples";
import * as L from 'leaflet';
import {isEmpty, renderPlaceHolderLottiePinJump2} from "../service/PageMonitoringCommonService";
import type {TypeAppInst, TypeCloudlet, TypeCluster} from "../../../../shared/Types";
import {changeClassficationTxt, listGroupByKey} from "../service/PageDevOperMonitoringService";
import Control from "react-leaflet-control";
import {Center, PageMonitoringStyles} from "../common/PageMonitoringStyles";
import {Icon} from "semantic-ui-react";
import {CLASSIFICATION, CLOUDLET_CLUSTER_STATE} from "../../../../shared/Constants";
import {Progress} from "antd";

let cloudGreenIcon = L.icon({
    iconUrl: require('../images/cloud_green.png'),
    iconSize: [40, 21],
    iconAnchor: [20, 21],
    shadowSize: [41, 41]
});
export const mapIconStyle = {
    backgroundColor: 'transparent',
    height: 30,
    width: 30,
    display: 'flex',
    justifyContent: 'center',
    alignSelf: 'center'
}

export const worldMapCenter = [
    6.315299, -4.683301
]

const Styles = {
    lable001: {
        marginTop: 5,
        fontSize: 13,
        marginLeft: 25,
        fontStyle: 'italic'
    },
    infoDiv: {
        position: 'absolute',
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        width: '100%',
        height: 190,
        zIndex: 99999,
        padding: 10,
        marginLeft: 0,
        display: 'flex'
    },
    topInfoDiv: {
        position: 'absolute',
        top: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        width: '50%',
        height: 190,
        zIndex: 99999,
        padding: 10,
        marginLeft: 0,
        display: 'flex',
        borderRadius: 10,
    },
    topInfoDivNoAppInst: {
        position: 'absolute',
        top: 0,
        right: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        width: '50%',
        height: 60,
        zIndex: 99999,
        padding: 10,
        marginLeft: 0,
        display: 'flex',
        borderRadius: 10,
    },
}

export default function MapForOper(props) {
    const mapRef = useRef(null);
    const [cloudletObjects, setCloudletObjects] = useState([]);
    //const [newCloudletList, setCloudletList] = useState([]);
    const [cloudLocList, setCloudLocList] = useState([]);
    const [mapCenter, setMapCenter] = useState([6.315299, -4.683301])
    const [zoom, setZoom] = useState(1)
    const [currentCluodlet: TypeCloudlet, setCurrentCloudlet] = useState(undefined)
    const [filteredClusterList, setFilteredClusterList] = useState([])
    const [isEnableZoom, setIsEnableZoom] = useState(true)

    const height = 200;
    //todo:///////////////// filteredUsageList /////////////
    //todo://////////////////////////////
    const [count, setCount] = useState(-1);
    const [usageOne: any, setUsageOne] = useState(-1);
    const hwMarginTop = 15;
    const hwFontSize = 15;

    useEffect(() => {

        console.log(`filteredUsageList===>`, props.filteredUsageList);
        if (props.filteredUsageList !== undefined && props.filteredUsageList.length === 1) {
            setCount(props.filteredUsageList.length)
            setUsageOne(props.filteredUsageList[0])
        } else {
            setCount(-1);
        }

    }, [props.filteredUsageList]);

    useEffect(() => {
        if (zoom !== 1) {
            setZoom(1)
        } else {
            setZoom(1.2)
        }
        setMapCenter(worldMapCenter);
    }, [props.toggleOperMapZoom])

    useEffect(() => {
        if (props.cloudletLength === 1) {
            setIsEnableZoom(false)
        } else {
            setIsEnableZoom(true)
        }
    }, [props.cloudletLength])

    //////////////////////////////////////////////////////
    useEffect(() => {
        console.log(`appInstList===>`, props.filteredAppInstList);
    }, [props.filteredAppInstList])

    useEffect(() => {
        async function loadContent() {
            await setCloudletLocation()
            if (!isEmpty(props.cloudletList)) {
                props.parent.setState({
                    mapLoading: false,
                })
            }
        }

        loadContent();
    }, [props.cloudletList])


    async function setCloudletLocation() {
        let newCloudletList = []
        props.cloudletList.map((item: TypeCloudlet, index) => {
            let cloudletLocationStr = JSON.stringify(item.CloudletLocation)

            if (props.cloudletList.length === 1) {
                if (index === 0) {
                    setMapCenter([item.CloudletLocation.latitude, item.CloudletLocation.longitude])
                }
                setZoom(2)
            } else {
                setMapCenter([6.315299, -4.683301])
                setZoom(1)
            }
            item.cloudletLocationStr = cloudletLocationStr;
            newCloudletList.push(item);
        })

        let cloudletObjs = listGroupByKey(newCloudletList, 'cloudletLocationStr')
        let cloudletLocList = Object.keys(cloudletObjs)
        setCloudLocList(cloudletLocList)
        setCloudletObjects(cloudletObjs)


        //todo: when one Cloudlet
        if (cloudletLocList.length === 1) {
            let selectCloudletOne = cloudletObjs[cloudletLocList[0]]
            setCurrentCloudlet(selectCloudletOne[0])

            console.log(`filteredClusterList===>`, props.filteredClusterList);
            setFilteredClusterList(props.filteredClusterList)

        } else {
            setCurrentCloudlet(undefined)
        }
    }


    async function handleMarkerClicked(cloudLetOne) {
        setCurrentCloudlet(undefined)
        setCurrentCloudlet(JSON.parse(JSON.stringify(cloudLetOne)))
        await props.parent.handleOnChangeCloudletDropdown(cloudLetOne.CloudletName)
    }

    /*function renderClusterInfo() {
        return (
            <div style={{
                flex: .5,
                border: '0.5px solid grey',
                padding: 10,
                overflowY: 'auto',
                marginLeft: 15,
                marginRight: 5,
                borderRadius: 10,
            }}>

                {filteredClusterList.map((item: TypeCluster, index) => {
                    return (
                        <div
                            onClick={async () => {
                                await props.parent.handleOnChangeClusterDropdown(item.ClusterName + " | " + item.Cloudlet)
                            }}
                            key={index} style={{
                            display: 'flex',
                            flexDirection: 'column',
                            marginTop: index !== 0 && index === (filteredClusterList.length - 1) ? 10 : 0,
                            marginBottom: 5,
                            //border: '0.5px solid grey',
                        }}
                        >
                            <div style={{
                                fontSize: 15,
                                color: 'yellow',
                                fontWeight: 'bold',
                                marginTop: 0,
                                fontFamily: 'Roboto'
                            }}>
                                <Icon name='th'/> {item.ClusterName}
                            </div>
                            <div style={Styles.lable001}>
                                <b>Deployment</b>: <span style={{
                                color: 'green',
                                fontWeight: 'bold',
                                fontSize: 15
                            }}>{item.Deployment}</span>
                            </div>
                            <div style={Styles.lable001}>
                                <b>Flavor</b>: {item.Flavor}
                            </div>
                            <div style={Styles.lable001}>
                                <b>State</b>: {CLOUDLET_CLUSTER_STATE[item.State]}
                            </div>
                            <div style={Styles.lable001}>
                                <b>Reservable</b>: {item.Reservable}
                            </div>
                            <div style={Styles.lable001}>
                                <b>IpAccess</b>: {item.IpAccess}
                            </div>
                        </div>
                    )
                })}
                {filteredClusterList.length === 0 &&
                <Center style={{fontSize: 20, color: 'orange', alignSelf: 'center', height: 135}}>
                    <div style={{marginTop: 15, fontStyle: 'italic'}}>
                        No Cluster
                    </div>
                </Center>
                }

            </div>
        )
    }*/

    function renderCloudletInfo() {
        return (
            <div style={{flex: .5, border: '0.5px solid grey', padding: 10, borderRadius: 10, marginLeft: 5}}
                 onClick={async () => {
                     await props.parent.handleOnChangeCloudletDropdown(currentCluodlet.CloudletName + " | " + JSON.stringify(currentCluodlet.CloudletLocation))
                 }}
            >
                <div style={{
                    fontSize: 15,
                    color: 'yellow',
                    fontWeight: 'bold',
                    marginTop: 0,
                    fontFamily: 'Roboto'
                }}>
                    <Icon name='cloud'/> {currentCluodlet.CloudletName}
                </div>
                <div style={Styles.lable001}>
                    <b>Operator</b>: {currentCluodlet.Operator}
                </div>
                <div style={Styles.lable001}>
                    <b>Ip_support</b>: {currentCluodlet.Ip_support}
                </div>

                <div style={Styles.lable001}>
                    <b>Num_dynamic_ips</b>:{currentCluodlet.Num_dynamic_ips}
                </div>
                <div style={Styles.lable001}>
                    <b>State</b>: {CLOUDLET_CLUSTER_STATE[currentCluodlet.State]}
                </div>
                <div style={Styles.lable001}>
                    <b>CloudletInfoState</b>: {currentCluodlet.CloudletInfoState}
                </div>
            </div>

        )

    }

    function renderAppInstInfo() {
        return (
            props.currentOperLevel === CLASSIFICATION.CLUSTER && props.filteredAppInstList.length > 0 && filteredClusterList.length === 1 ?
                <div
                    style={Styles.topInfoDiv}
                >
                    {/*todo:##################################*/}
                    {/*todo:appInst top info               */}
                    {/*todo:##################################*/}
                    <div style={{
                        flex: 1,
                        border: '0.5px solid grey',
                        padding: 10,
                        overflowY: 'auto',
                        marginLeft: 15,
                        marginRight: 5,
                        borderRadius: 10,
                    }}>
                        {props.filteredAppInstList.map((item: TypeAppInst, index) => {
                            return (
                                <div
                                    onClick={async () => {
                                    }}
                                    key={index} style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    marginTop: index !== 0 && index === (filteredClusterList.length - 1) ? 10 : 0,
                                }}
                                >
                                    <div style={{fontSize: 12, color: 'white',}}>
                                        <Icon name='server'/> {item.AppName}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                : props.currentOperLevel === CLASSIFICATION.CLUSTER && props.filteredAppInstList.length === 0 ?
                <div
                    style={Styles.topInfoDivNoAppInst}
                >
                    <div style={{
                        flex: 1,
                        border: '0.5px solid grey',
                        padding: 0,
                        overflowY: 'auto',
                        marginLeft: 15,
                        marginRight: 5,
                        borderRadius: 10,
                    }}>
                        <Center style={{
                            fontSize: 15,
                            color: 'orange',
                            alignSelf: 'center',
                            height: 40,
                            marginTop: -1,
                            fontWeight: 'bold'
                        }}>
                            <div style={{marginTop: 0, fontStyle: 'italic'}}>
                                No App Inst
                            </div>
                        </Center>
                    </div>
                </div>
                : null

        )

    }

    function renderCloudletResource() {
        return (
            <div style={{backgroundColor: 'transparent', height: '100%', flex: .5}}>
                {count === 1 && props.currentClassification === CLASSIFICATION.CLOUDLET ?
                    <Center style={{height: height,}}>
                        <div>
                            <Progress
                                strokeColor={'orange'}
                                type="circle"
                                width={100}
                                trailColor='#262626'
                                style={{fontSize: 10}}
                                percent={usageOne.usedVCpuCount / usageOne.maxVCpuCount * 100}
                                strokeWidth={10}
                                format={(percent, successPercent) => {
                                    return usageOne.usedVCpuCount + "/" + usageOne.maxVCpuCount;
                                }}
                            />
                            <div style={{marginTop: hwMarginTop, fontSize: hwFontSize}}>
                                vCPU
                            </div>
                        </div>
                        <div style={{width: 15}}/>
                        <div>
                            <Progress
                                strokeColor='skyblue'
                                type="circle"
                                width={100}
                                trailColor='#262626'
                                percent={Math.round(usageOne.usedMemUsage / usageOne.maxMemUsage * 100)}
                                strokeWidth={10}
                            />
                            <div style={{marginTop: hwMarginTop, fontSize: hwFontSize}}>
                                MEM
                            </div>
                        </div>
                        <div style={{width: 15}}/>
                        <div>
                            <Progress
                                strokeColor='#79FF00'
                                type="circle"
                                width={100}
                                trailColor='#262626'
                                percent={Math.ceil((usageOne.usedDiskUsage / usageOne.maxDiskUsage) * 100)}
                                strokeWidth={10}
                                format={(percent, successPercent) => {
                                    return usageOne.usedDiskUsage + "/" + usageOne.maxDiskUsage;
                                }}
                            />
                            <div style={{marginTop: hwMarginTop, fontSize: hwFontSize}}>
                                DISK
                            </div>
                        </div>
                    </Center>
                    : count === 1 && props.currentClassification === CLASSIFICATION.CLUSTER_FOR_OPER ? //@DESC: CLUSTER LEVEL FOR OPER
                        <Center style={{height: height,}}>
                            <div>
                                <Progress
                                    strokeColor={props.chartColorList[0]}
                                    type="circle"
                                    width={100}
                                    trailColor='#262626'
                                    style={{fontSize: 10}}
                                    percent={Math.round(usageOne.sumCpuUsage)}
                                    strokeWidth={10}

                                />
                                <div style={{marginTop: hwMarginTop, fontSize: hwFontSize}}>
                                    CPU
                                </div>
                            </div>
                            <div style={{width: 15}}/>
                            <div>
                                <Progress
                                    strokeColor={props.chartColorList[1]}
                                    type="circle"
                                    width={100}
                                    trailColor='#262626'
                                    percent={Math.round(usageOne.sumMemUsage)}
                                    strokeWidth={10}
                                />
                                <div style={{marginTop: hwMarginTop, fontSize: hwFontSize}}>
                                    MEM
                                </div>
                            </div>
                            <div style={{width: 15}}/>
                            <div>
                                <Progress
                                    strokeColor={props.chartColorList[2]}
                                    type="circle"
                                    width={100}
                                    trailColor='#262626'
                                    percent={Math.round(usageOne.sumDiskUsage)}
                                    strokeWidth={10}
                                />
                                <div style={{marginTop: hwMarginTop, fontSize: hwFontSize}}>
                                    DISK
                                </div>
                            </div>
                        </Center>
                        :
                        <Center style={{
                            fontSize: 22,
                            backgroundColor: 'rgba(157,255,255,.02)',
                            height: height,
                            flexDirection: 'column'
                        }}>
                            <div>
                                <div>
                                    No Available
                                </div>
                                <div style={{fontSize: 12}}>
                                    (It is shown only in one
                                    specific {changeClassficationTxt(props.currentClassification)})
                                </div>
                            </div>


                        </Center>
                }


            </div>
        )

    }


    return (
        <div style={{height: '100%', width: '100%'}}>
            <Map
                ref={mapRef}
                center={mapCenter}
                zoom={zoom}
                duration={0.7}
                style={{width: '100%', height: '100%'}}
                easeLinearity={1}
                useFlyTo={true}
                dragging={true}
                zoomControl={false}
                boundsOptions={{padding: [50, 50]}}
                scrollWheelZoom={isEnableZoom}
            >
                <TileLayer
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                    //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    minZoom={1}
                />

                {/*@todo:#####################################################*/}
                {/*@todo:cloudlet , cluster ,AppInst info                        */}
                {/*@todo:####################################################*/}
                {currentCluodlet !== undefined &&
                <div
                    style={Styles.infoDiv}
                >
                    {renderCloudletInfo()}
                    {renderCloudletResource()}
                </div>
                }
                {renderAppInstInfo()}

                {/*todo:Control*/}
                {/*todo:Control*/}
                {/*todo:Control*/}
                <Control position="topleft" style={{marginTop: 3, display: 'flex',}}>

                    <div style={PageMonitoringStyles.mapControlDiv}>
                        <div
                            style={mapIconStyle}
                            onClick={async () => {
                                setCurrentCloudlet(undefined)
                                props.parent.handleOnChangeCloudletDropdown(undefined).then(() => {
                                    props.parent.setState({
                                        toggleZoom: !props.parent.state.toggleZoom
                                    });
                                    mapRef.current.leafletElement.closePopup();
                                })

                            }}
                        >
                            <Icon

                                name='redo'
                                style={{fontSize: 20, color: 'white', cursor: 'pointer'}}
                            />
                        </div>
                        <div
                            style={mapIconStyle}
                            onClick={() => {
                                setZoom(zoom + 1)
                            }}
                        >
                            <Icon
                                name='add'
                                style={{fontSize: 20, color: 'white', cursor: 'pointer'}}
                            />
                        </div>
                        <div style={{width: 2}}/>
                        <div
                            style={mapIconStyle}
                            onClick={() => {
                                if (zoom > 1) {
                                    setZoom(zoom - 1)
                                }
                            }}
                        >
                            <Icon
                                name='minus'
                                style={{fontSize: 20, color: 'white', cursor: 'pointer'}}
                            />
                        </div>
                        <div
                            style={mapIconStyle}
                            onClick={() => {
                                setIsEnableZoom(!isEnableZoom
                                )
                            }}
                        >
                            <Icon
                                name='arrows alternate vertical'
                                style={{fontSize: 20, color: isEnableZoom ? 'white' : 'grey', cursor: 'pointer'}}
                            />
                        </div>

                    </div>
                </Control>
                {cloudLocList.map((locOne, index) => {

                    let CloudletLocation = JSON.parse(locOne)
                    return (
                        <Marker
                            key={index}
                            icon={cloudGreenIcon}
                            className='marker1'
                            position={
                                [CloudletLocation.latitude, CloudletLocation.longitude,]
                            }
                            /*onMouseOver={(e) => {                                e.target.openPopup();                            }}*/ /* onMouseOut={(e) => {                                 //e.target.closePopup();                            }}*/
                            onClick={async () => {
                            }}
                        >
                            <Popup
                                className='popup_oper_cloudlet'
                                offset={[0, 0]}
                                opacity={0.7}
                                style={{width: '200px !important'}}
                            >
                                <div style={{display: 'flex', flexDirection: 'column'}}>
                                    {cloudletObjects[locOne].map((cloudLetOne: TypeCloudlet, innerIndex) => {
                                        return (
                                            <Ripple
                                                key={innerIndex}
                                                className='popup_oper_cloudlet'
                                                during={250}
                                                color='#1cecff'
                                                onClick={async () => {
                                                    await handleMarkerClicked(cloudLetOne)
                                                }}
                                            >
                                                <div className='oper_popup_div'>
                                                    {cloudLetOne.CloudletName}
                                                </div>
                                            </Ripple>
                                        )
                                    })}
                                </div>
                            </Popup>

                        </Marker>
                    )

                })}
                {props.parent.state.mapLoading && renderPlaceHolderLottiePinJump2()}
            </Map>

        </div>
    )

}
