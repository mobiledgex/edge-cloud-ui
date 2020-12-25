import React from 'react'
import MexMap, { MAP_CENTER, DEFAULT_ZOOM } from '../../mexmap/MexMap'
import { Icon } from 'semantic-ui-react'
import { Marker, Popup } from "react-leaflet";
import MexCircleMarker from '../../mexmap/utils/MexCircleMarker'
import { fields } from '../../../../../services/model/format';
import { cloudGreenIcon } from "../../mexmap/MapProperties";

import MexCurve from '../../mexmap/utils/MexCurve'


class ClusterMexMap extends React.Component {

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

    resetMap = () => {
        if (this.ws) {
            this.ws.close()
            this.ws = undefined
        }
        this.setState({ showDevices: false, mapData: {}, mapCenter: MAP_CENTER, zoom: DEFAULT_ZOOM })
    }

    renderMarkerPopup = (data) => {
        let selected = data['selected'] ? data['selected'] : 0
        return (
            <Popup className="map-control-div-marker-popup" ref={this.popup}>
                {
                    Object.keys(data).map(cloudlet => (
                        cloudlet !== 'cloudletLocation' && cloudlet !== 'selected' ?
                            <div key={cloudlet}>
                                {data[cloudlet].map((item, i) => {
                                    let keyData = item.keyData
                                    return (
                                        selected === 0 || keyData.selected ?
                                            <div key={`${i}_${cloudlet}`} className="map-control-div-marker-popup-label" >
                                                <code style={{ fontWeight: 400, fontSize: 12 }}>
                                                    <Icon style={{ color: keyData.color, marginRight: 5 }} name='circle' />
                                                    {keyData[fields.cloudletName]}
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
                    let location = data[key][fields.cloudletLocation]
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
        const { region } = this.props
        return (
            <MexMap renderMarker={this.renderMarker} back={this.resetMap} mapCenter={mapCenter} zoom={zoom} region={region} />
        )
    }
}

export default ClusterMexMap


