import React from 'react'
import { Marker } from "react-leaflet";
import { fields } from '../../../../../services/model/format';
import { showAppInstClient } from '../../../../../services/modules/appInstClient'
import cloneDeep from 'lodash/cloneDeep'
import MexCircleMarker from '../../../../../hoc/mexmap/utils/MexCircleMarker'
import { cloudGreenIcon } from "../../../../../hoc/mexmap/MapProperties";
import MexMap from '../../../../../hoc/mexmap/MexMap'
import MexCurve from '../../../../../hoc/mexmap/utils/MexCurve'
import { Dialog } from '@material-ui/core';
import Legend from './MapLegend'
import { fetchPath, fetchURL } from '../../../../../services/config';
import { fetchWSToken } from '../../../../../services/service';

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
            this.props.onClose()
        })
    }

    sendWSRequest = async (request) => {
        let token = await fetchWSToken(this)
        if (token) {
            this.setState({ showDevices: true })
            this.ws = new WebSocket(`${fetchURL(true)}/ws${fetchPath(request)}`)
            this.ws.onopen = () => {
                this.ws.send(`{"token": "${token}"}`);
                this.ws.send(JSON.stringify(request.data));
            }
            this.ws.onmessage = evt => {
                let response = JSON.parse(evt.data);
                if (response.code === 200) {
                    let responseData = response.data
                    let location = responseData[fields.location]
                    if (location) {
                        let latitude = location.latitude ? location.latitude : 0
                        let longitude = location.longitude ? location.longitude : 0
                        let uniqueId = responseData.client_key.unique_id
                        let mapData = cloneDeep(this.state.mapData)
                        let polyline = cloneDeep(this.state.polyline)
                        let key = `${latitude}_${longitude}`
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
                            polyline.push([latitude, longitude])
                            data = { cloudletLocation: { latitude, longitude }, label: 1, devices: [uniqueId] }
                        }
                        mapData[key] = data
                        this.setState({ mapData, polyline })
                    }
                }
            }

            this.ws.onclose = evt => {

            }
        }
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
                                    <Marker icon={cloudGreenIcon()} position={[lat, lon]} interactive={false}>
                                    </Marker> :
                                    <MexCircleMarker coords={{ lat: lat, lng: lon }} label={mapData[key]['label']} /*popupData={mapData[key].devices}*/ interactive={false} />
                            }
                        </React.Fragment>
                    )
                }
                )}
                {showDevices && polyline.length > 0 ?
                    <MexCurve data={[polyline]} color={curveColor} /> : null
                }
                <Legend data={mapData} />
            </div> : null
    }



    render() {
        const { backswitch, showDevices } = this.state
        const { region } = this.props
        return (
            <Dialog fullScreen open={showDevices} onClose={this.resetMap} disableEscapeKeyDown={true}>
                <MexMap renderMarker={this.renderDeviceMarker} back={this.resetMap} zoom={3} backswitch={backswitch} region={region} fullscreen={showDevices} />
            </Dialog>
        )
    }

    componentDidMount() {
        this.mapClick(this.props.data)
    }

    componentWillUnmount() {
        this.props.onClose()
    }
}

export default AppMexMap


