import React from 'react'
import { Icon } from 'semantic-ui-react'
import { Marker, Popup } from "react-leaflet";
import MexMap, { MAP_CENTER, DEFAULT_ZOOM } from '../../mexmap/MexMap'
import MexCircleMarker from '../../mexmap/utils/MexCircleMarker'
import { fields } from '../../../../../services/model/format';
import { cloudGreenIcon } from "../../mexmap/MapProperties";
import { mcURL } from '../../../../../services/model/serviceMC'
import { getPath } from '../../../../../services/model/endPointTypes'
import * as serverData from '../../../../../services/model/serverData'
import { showAppInstClient } from '../../../../../services/model/appInstClient'
import cloneDeep from 'lodash/cloneDeep'

import MexCurve from '../../mexmap/utils/MexCurve'
import { Dialog } from '@material-ui/core';


class AppMexMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapData: {},
            polyline: [],
            showDevices: false,
            mapCenter: MAP_CENTER,
            zoom: DEFAULT_ZOOM,
            curveColor: 'red',
            backswitch: false,
            openMap:false,
        }
        this.popup = React.createRef();
        this.ws = undefined
    }

    mapClick = (data) => {
        let location = data[fields.cloudletLocation]
        this.setState({ mapCenter: [location.latitude, location.longitude], zoom: 7 })
        //this.popup.current.leafletElement.options.leaflet.map.closePopup();
        let keyData = data
        let main = { cloudletLocation: keyData[fields.cloudletLocation], selected:1 }
        main[keyData[fields.cloudletName]] = [data]
        this.setState({ mapData: { main }, polyline: [[location.latitude, location.longitude]], curveColor: keyData.color, backswitch: true })
        this.sendWSRequest(showAppInstClient(keyData))
    }

    resetMap = () => {
        if (this.ws) {
            this.ws.close()
            this.ws = undefined
        }
        this.setState({ showDevices: false, mapData: {}, mapCenter: MAP_CENTER, zoom: DEFAULT_ZOOM, backswitch: false })
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
                    data = { cloudletLocation : location, label: 1, devices: [uniqueId] }
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

    renderMarker = () => {
        const { showDevices, mapData, polyline, curveColor } = this.state
        console.log('Rahul1234', mapData)
        let data = showDevices ? mapData : this.props.data
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

                            </React.Fragment> : null
                        )
                    }
                })}
                {showDevices && polyline.length > 0 ?
                    <MexCurve data={polyline} color={curveColor} /> : null
                }
            </div> : null
    }

    closeMap = ()=>{
        this.setState({openMap:false})
    }

    render() {
        const { mapCenter, zoom, backswitch, openMap } = this.state
        const { region } = this.props
        return (
            <React.Fragment>
                <MexMap renderMarker={this.renderMarker} back={this.resetMap} mapCenter={mapCenter} zoom={zoom} backswitch={backswitch} region={region} />
                {/* <Dialog fullScreen open={openMap} onClose={this.closeMap}>
                    <MexMap renderMarker={this.renderMarker} back={this.resetMap} mapCenter={mapCenter} zoom={zoom} backswitch={backswitch} region={region} />
                </Dialog> */}
            </React.Fragment>
        )
    }

    componentDidUpdate(preProps, preState) {
        let listAction = this.props.listAction
        if (listAction.action !== undefined && listAction.action !== preProps.listAction.action) {
            this.mapClick(listAction.data)
        }
    }
}

export default AppMexMap


