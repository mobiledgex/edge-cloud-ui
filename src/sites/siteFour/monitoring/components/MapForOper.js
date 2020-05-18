import React, {useEffect, useRef, useState} from "react";
import {Map, Marker, Popup, TileLayer, Tooltip} from "react-leaflet";
import Ripple from "react-ripples";
import * as L from 'leaflet';
import {isEmpty, renderPlaceHolderLottiePinJump2} from "../service/PageMonitoringCommonService";
import type {TypeCloudlet} from "../../../../shared/Types";
import {listGroupByKey} from "../service/PageMonitoringService";
import Control from "react-leaflet-control";
import {PageMonitoringStyles} from "../common/PageMonitoringStyles";
import {Icon} from "semantic-ui-react";
import {CLOUDLET_STATE} from "../../../../shared/Constants";

let cloudGreenIcon = L.icon({
    iconUrl: require('../images/cloud_green.png'),
    //shadowUrl : 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
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
    lable001: {marginTop: 5, fontSize: 14, marginLeft: 25, fontStyle: 'italic'}
}

export default function MapForOper(props) {
    const mapRef = useRef(null);
    const [cloudletObjects, setCloudletObjects] = useState([]);
    const [locList, setLocList] = useState([]);
    const [newCloudletList, setCloudletList] = useState([]);
    const [mapCenter, setMapCenter] = useState([6.315299, -4.683301])
    const [zoom, setZoom] = useState(1)
    const [currentCluodlet: TypeCloudlet, setCurrentCloudlet] = useState(undefined)

    useEffect(() => {
        if (zoom !== 1) {
            setZoom(1)
        } else {
            setZoom(1.2)
        }
        setMapCenter(worldMapCenter);
    }, [props.toggleOperMapZoom])


    useEffect(() => {
        console.log(`appInstList===>`, props.appInstList);
    }, [props.appInstList])

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
        setLocList(cloudletLocList)
        setCloudletObjects(cloudletObjs)

        if (cloudletLocList.length === 1) {
            let selectCloudletOne = cloudletObjs[cloudletLocList[0]]
            setCurrentCloudlet(selectCloudletOne[0])
        } else {
            setCurrentCloudlet(undefined)
        }
    }


    function renderTooltip(cloudletOne: TypeCloudlet) {
        return (
            <Tooltip
                direction='right'
                offset={[14, -10]}//x,y
                opacity={0.8}
                permanent
                style={{cursor: 'pointer', pointerEvents: 'auto'}}

            >
                <span>{cloudletOne.CloudletName}</span>
            </Tooltip>
        )
    }

    async function handleMarkerClicked(cloudLetOne) {
        setCurrentCloudlet(undefined)
        setCurrentCloudlet(JSON.parse(JSON.stringify(cloudLetOne)))
        await props.parent.handleCloudletDropdown(cloudLetOne.CloudletName)
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
            >
                <TileLayer
                    url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                    //url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    minZoom={1}
                />

                {/*@todo:bottom info*/}
                {/*@todo:bottom info*/}
                {/*@todo:bottom info*/}
                {currentCluodlet !== undefined &&
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        background: 'rgba(0, 0, 0, 0.5)',
                        width: '100%',
                        height: 170,
                        zIndex: 99999,
                        //opacity: 0.5,
                        paddingTop: 10,
                        paddingLeft: 15,

                    }}
                    onClick={() => {
                    }}

                >
                    <div>
                        <div style={{fontSize: 17, color: 'yellow', fontWeight: 'bold', marginTop: 0, fontFamily: 'Roboto'}}>
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
                            <b>State</b>: {CLOUDLET_STATE[currentCluodlet.State]}
                        </div>
                        <div style={Styles.lable001}>
                            <b>CloudletInfoState</b>: {currentCluodlet.CloudletInfoState}
                        </div>
                    </div>
                    {/* <div style={{marginTop: 10}}>
                        {props.appInstList.map((item: TypeAppInstance, index) => {
                            return (
                                <div>
                                    <div style={{color: 'orange', marginTop: 3, fontSize: 14}}>
                                        {item.AppName}
                                    </div>
                                </div>
                            )
                        })}
                    </div>*/}

                </div>
                }

                <Control position="topleft" style={{marginTop: 3, display: 'flex',}}>

                    <div style={PageMonitoringStyles.mapControlDiv}>
                        <div
                            style={mapIconStyle}
                            onClick={async () => {
                                setCurrentCloudlet(undefined)
                                props.parent.handleCloudletDropdown(undefined).then(() => {
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

                    </div>
                </Control>
                {locList.map((locOne, index) => {

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
                                    {cloudletObjects[locOne].map((cloudLetOne: TypeCloudlet, index) => {
                                        return (
                                            <Ripple
                                                className='popup_oper_cloudlet'
                                                during={250}
                                                color='#1cecff'
                                                onClick={async () => {
                                                    await handleMarkerClicked(cloudLetOne)
                                                }}
                                            >
                                                <div
                                                    className='oper_popup_div'

                                                >
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
