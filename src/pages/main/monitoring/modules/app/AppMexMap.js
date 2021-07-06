import React from 'react'
import { Icon } from 'semantic-ui-react'
import { Marker, Popup } from "react-leaflet";
import { fields } from '../../../../../services/model/format';
import { showAppInstClient } from '../../../../../services/modules/appInstClient'
import cloneDeep from 'lodash/cloneDeep'
import MexCircleMarker from '../../../../../hoc/mexmap/utils/MexCircleMarker'
import { cloudGreenIcon, mobileIcon } from "../../../../../hoc/mexmap/MapProperties";
import MexMap from '../../../../../hoc/mexmap/MexMap'
import MexCurve from '../../../../../hoc/mexmap/utils/MexCurve'
import { Dialog } from '@material-ui/core';
import Legend from './MapLegend'
import { fetchPath, fetchURL } from '../../../../../services/config';
import { fetchToken } from '../../../../../services/service';
import { LIST_TOOLBAR_TRACK_DEVICES } from '../../../../../helper/constant/perpetual';

const DEFAULT_ZOOM = 2
class AppMexMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapData: {},
            polyline: [],
            showDevices: false,
            curveColor: 'red',
            backswitch: false
        }
        this.popup = React.createRef();
        this.ws = undefined
    }

    mapClick = (data) => {
        let location = data[fields.cloudletLocation]
        // this.popup.current.leafletElement.options.leaflet.map.closePopup();
        let keyData = data
        let main = { cloudletLocation: keyData[fields.cloudletLocation], data }
        this.setState({ mapData: { main }, polyline: [[location.latitude, location.longitude]], curveColor: keyData.color, backswitch: true })
        this.sendWSRequest(showAppInstClient(keyData))
    }

    resetMap = () => {
        if (this.ws) {
            this.ws.close()
            this.ws = undefined
        }
        this.setState({ showDevices: false, mapData: {}, backswitch: false }, () => {
            this.props.onListToolbarClear()
        })
    }

    sendWSRequest = (request) => {
        this.setState({ showDevices: true })
        this.ws = new WebSocket(`${fetchURL(true)}/ws${fetchPath(request)}`)
        this.ws.onopen = () => {
            this.ws.send(`{"token": "${fetchToken(this)}"}`);
            this.ws.send(JSON.stringify(request.data));
        }
        this.ws.onmessage = evt => {
            let response = JSON.parse(evt.data);
            if (response.code === 200) {
                let responseData = response.data
                let location = responseData[fields.location]
                let uniqueId = responseData.client_key.unique_id
                let mapData = cloneDeep(this.state.mapData)
                let polyline = cloneDeep(this.state.polyline)
                let key = `${location.latitude}_${location.longitude}`
                let data = []
                if (mapData[key]) {
                    data = mapData[key]
                    data.devices = data.devices ? data.devices : []
                    if (!data.devices.includes(uniqueId)) {
                        data.devices.push(uniqueId)
                        let label = parseInt(data.label) + 1
                        data.label = label
                    }
                }
                else {
                    polyline.push([location.latitude, location.longitude])
                    data = { cloudletLocation: location, label: 1, devices: [uniqueId] }
                }
                mapData[key] = data
                this.setState({ mapData, polyline })
            }
        }

        this.ws.onclose = evt => {

        }
    }



    renderMarkerPopup = (data) => {
        let selected = data['selected'] ? data['selected'] : 0
        return (
            <Popup className="map-control-div-marker-popup" ref={this.popup}>
                {
                    Object.keys(data).map(cloudlet => {
                        return (
                            cloudlet !== fields.cloudletLocation && cloudlet !== 'selected' && (data.selected === 0 || data[cloudlet].selected) ?
                                <div key={cloudlet}>
                                    <strong style={{ textTransform: 'uppercase', fontSize: 14 }}>{cloudlet}</strong>
                                    <div style={{ marginBottom: 10 }}></div>
                                    {data[cloudlet].map((item, i) => {
                                        let keyData = item.keyData
                                        let visible = keyData.hidden ? false : true
                                        if (visible) {
                                            return (
                                                selected === 0 || keyData.selected ?
                                                    <div key={`${i}_${cloudlet}`} className="map-control-div-marker-popup-label">
                                                        <code style={{ fontWeight: 400, fontSize: 12 }}>
                                                            <Icon style={{ color: keyData.color, marginRight: 5 }} name='circle' />
                                                            {keyData[fields.appName]} [{keyData[fields.version]}]
                                                            <code style={{ color: '#74B724' }}>
                                                                [{keyData[fields.clusterName]}]
                                                            </code>
                                                        </code>
                                                    </div> : null
                                            )
                                        }
                                    })} </div> : null

                        )
                    })
                }
            </Popup>
        )
    }

    calculateLength = (data) => {
        let cost = 0
        Object.keys(data).map(key => {
            if(key !== fields.cloudletLocation && key !== 'selected')
            {
                cost = cost + data[key].length 
            }
        })
        return cost
    }

    renderDeviceMarker = () => {
        const { showDevices, mapData, polyline, curveColor } = this.state
        return mapData ?
            <div>
                {Object.keys(mapData).map((key, i) => {
                    let location = mapData[key][fields.cloudletLocation]
                    let lat = location[fields.latitude]
                    let lon = location[fields.longitude]
                    return (
                        <React.Fragment key={key}>
                            {
                                key === 'main' ?
                                    <Marker icon={mobileIcon} position={[lat, lon]}>
                                    </Marker> :
                                    <MexCircleMarker coords={{ lat: lat, lng: lon }} label={mapData[key]['label']} popupData={mapData[key].devices} />
                            }
                        </React.Fragment>
                    )
                }
                )}
                {showDevices && polyline.length > 0 ?
                    <MexCurve data={[polyline]} color={curveColor} /> : null
                }
                <Legend data={mapData}/>
            </div> : null
    }

    renderMarker = () => {
        const { data } = this.props
        return data ?
            <div>
                {Object.keys(data).map((key, i) => {
                    if (key !== 'selected') {
                        let location = data[key][fields.cloudletLocation]
                        let lat = location[fields.latitude]
                        let lon = location[fields.longitude]
                        return (
                            data.selected === 0 || data[key].selected ?
                                <React.Fragment key={key}>
                                    <Marker icon={cloudGreenIcon(this.calculateLength(data[key]))} position={[lat, lon]}>
                                        {this.renderMarkerPopup(data[key])}
                                    </Marker>
                                </React.Fragment> : null
                        )
                    }
                })}
            </div> : null
    }

    render() {
        const { backswitch, showDevices } = this.state
        const { region } = this.props
        return (
            <React.Fragment>
                {showDevices ?
                    <Dialog fullScreen open={showDevices} onClose={this.resetMap} disableEscapeKeyDown={true}>
                        <MexMap renderMarker={this.renderDeviceMarker} back={this.resetMap} zoom={3} backswitch={backswitch} region={region} fullscreen={showDevices} />
                    </Dialog> :
                    <MexMap renderMarker={this.renderMarker} back={this.resetMap} zoom={DEFAULT_ZOOM} backswitch={backswitch} region={region} />
                }
            </React.Fragment>
        )
    }

    componentDidUpdate(preProps, preState) {
        let listAction = this.props.listAction
        if(listAction && listAction.action && listAction.action.action === LIST_TOOLBAR_TRACK_DEVICES)
        {
        let preListAction = preProps.listAction

        let action = listAction ? listAction.action : ''
        let preAction = preListAction ? preListAction.action : ''
        if (listAction && action !== preAction) {
            this.mapClick(listAction.data)
        }}
    }
}

export default AppMexMap


