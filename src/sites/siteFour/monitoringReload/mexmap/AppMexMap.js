import React from 'react'
import MexMap from './MexMap'
import { Icon } from 'semantic-ui-react'
import { Marker, Polyline, Popup } from "react-leaflet";
import MexCircleMarker from './utils/MexCircleMarker'
import { fields } from '../../../../services/model/format';
import { cloudGreenIcon } from "./MapProperties";
import { mcURL } from '../../../../services/model/serviceMC'
import { getPath } from '../../../../services/model/endPointTypes'
import * as serverData from '../../../../services/model/serverData'
import { showAppInstClient } from '../../../../services/model/appInstClient'
import cloneDeep from 'lodash/cloneDeep'
import { MAP_CENTER, DEFAULT_ZOOM } from './MexMap'

import MexCurve from './utils/MexCurve'
import { polyline } from 'leaflet';


class AppMexMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapData: {},
            polyline: [],
            showDevices: false,
            mapCenter: MAP_CENTER,
            zoom: DEFAULT_ZOOM,
            curveColor : 'red'
        }
        this.popup = React.createRef();
        this.ws = undefined
    }

    mapClick = (data) => {
        this.setState({ mapCenter: [data.location.latitude, data.location.longitude], zoom: 12 })
        this.popup.current.leafletElement.options.leaflet.map.closePopup();
        let showData = data.keyData.showData
        let main = { location: showData[fields.cloudletLocation] }
        main[showData[fields.cloudletName]] = [data]
        this.setState({ mapData: { main }, polyline:[[data.location.latitude, data.location.longitude]], curveColor:data.keyData.color })
        this.sendWSRequest(showAppInstClient(showData))
    }

    resetMap = () => {
        if (this.ws) {
            this.ws.close()
            this.ws = undefined
        }
        this.setState({ showDevices: false, mapData: {}, mapCenter: MAP_CENTER, zoom: DEFAULT_ZOOM })
    }

    sendWSRequest = (request) => {
        this.ws = new WebSocket(`${mcURL(true)}/ws${getPath(request)}`)
        this.ws.onopen = () => {
            this.setState({ showDevices: true })
            this.ws.send(`{"token": "${serverData.getToken(this)}"}`);
            this.ws.send(JSON.stringify(request.data));
        }
        this.ws.onmessage = evt => {
            let response = JSON.parse(evt.data);
            if (response.code === 200) {
                let requestData = response.data
                let location = requestData.location
                let uniqueId = requestData.client_key.unique_id
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
                    data = { location, label: 1, devices: [uniqueId] }
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
                    Object.keys(data).map(cloudlet => (
                        cloudlet !== 'location' && cloudlet !== 'selected' ?
                            <div key={cloudlet}>
                                <strong style={{ textTransform: 'uppercase', fontSize: 14 }}>{cloudlet}</strong>
                                <div style={{ marginBottom: 10 }}></div>
                                {data[cloudlet].map((item, i) => {
                                    let keyData = item.keyData
                                    return (
                                        selected === 0 || keyData.selected ?
                                            <div key={`${i}_${cloudlet}`} className="map-control-div-marker-popup-label" onClick={() => { this.mapClick(item) }}>
                                                <code style={{ fontWeight: 400, fontSize: 12 }}>
                                                    <Icon style={{ color: keyData.color, marginRight: 5 }} name='circle' />
                                                    {keyData['app']} [{keyData['ver']}]
                                                    <code style={{ color: '#74B724' }}>
                                                        [{keyData['cluster']}]
                                                    </code>
                                                </code>
                                            </div> : null
                                    )
                                })} </div> : null

                    ))
                }
            </Popup>
        )
    }

    renderMarker = () => {
        const { showDevices, mapData, polyline, curveColor } = this.state
        let data = showDevices ? mapData : this.props.data

        return data ?
            <div>
                {Object.keys(data).map((key, i) => {
                    let location = data[key][fields.location]
                    let lat = location[fields.latitude]
                    let lon = location[fields.longitude]
                    return (
                        <React.Fragment key={key}>
                            {
                                showDevices ?
                                    key === 'main' ?
                                        <Marker icon={cloudGreenIcon} position={[lat, lon]}>
                                            {this.renderMarkerPopup(data[key])}
                                        </Marker> :
                                        <MexCircleMarker coords={{ lat: lat, lng: lon }} label={data[key]['label']} /> :
                                    <Marker icon={cloudGreenIcon} position={[lat, lon]}>
                                        {this.renderMarkerPopup(data[key])}
                                    </Marker>
                            }

                        </React.Fragment>
                    )
                })}
                {showDevices && polyline.length > 0 ? 
                    <MexCurve data={polyline} color={curveColor}/> : null
                }
            </div> : null
    }

    render() {
        const { mapCenter, zoom } = this.state
        return (
            <MexMap renderMarker={this.renderMarker} back={this.resetMap} mapCenter={mapCenter} zoom={zoom} />
        )
    }
}

export default AppMexMap


