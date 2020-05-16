import React, {useEffect, useState} from "react";
import {Map, Marker, Popup, TileLayer, Tooltip} from "react-leaflet";
import * as L from 'leaflet';
import {renderPlaceHolderLottiePinJump2} from "../service/MonitoringCommonService";
import type {TypeCloudlet} from "../../../../shared/Types";
import {listGroupByKey} from "../service/MonitoringService";
import "../common/OperMapStyle.css";
import Control from "react-leaflet-control";
import {MonitoringStyles} from "../common/MonitoringStyles";
import {Icon} from "semantic-ui-react";

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

export default function MapForOper(props) {
    const [cloudletObjects, setCloudletObjects] = useState([]);
    const [locList, setLocList] = useState([]);
    const [newCloudletList, setCloudletList] = useState([]);
    const [mapCenter, setMapCenter] = useState([6.315299, -4.683301])
    const [zoom, setZoom] = useState(1)
    const [currentCluodlet, setCurrentCluodlet] = useState(undefined)

    useEffect(() => {
        setCloudletLocation()
    }, [props.cloudletList])

    useEffect(() => {
        setZoom(1)
    }, [props.operZoom])


    function setCloudletLocation() {
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


    return (
        <div style={{height: '100%', width: '100%'}}>
            <Map
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
                {currentCluodlet !== undefined &&
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    width: '100%',
                    height: 150,
                    zIndex: 99999,
                    opacity: 0.5,
                    color: 'yellow',
                    padding: 20,

                }}>
                    {currentCluodlet.toString()}
                </div>
                }

                <Control position="topleft" style={{marginTop: 3, display: 'flex',}}>

                    <div style={MonitoringStyles.mapControlDiv}>
                        <div
                            style={mapIconStyle}
                            onClick={async () => {
                                setCurrentCluodlet(undefined)
                                await props.parent.handleCloudletDropdown(undefined)
                                setTimeout(() => {
                                    setZoom(1)
                                }, 250)
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
                            icon={cloudGreenIcon}
                            className='marker1'
                            position={
                                [CloudletLocation.latitude, CloudletLocation.longitude,]
                            }
                            onMouseOver={(e) => {
                                e.target.openPopup();
                            }}
                            onMouseOut={(e) => {
                                //e.target.closePopup();
                            }}
                            onClick={() => {
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
                                            <div
                                                className='oper_popup_div'
                                                onClick={() => {
                                                    setCurrentCluodlet(undefined)
                                                    setCurrentCluodlet(JSON.stringify(cloudLetOne))

                                                }}
                                            >
                                                {cloudLetOne.CloudletName}
                                            </div>
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
