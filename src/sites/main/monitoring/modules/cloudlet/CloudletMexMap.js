import React from 'react'
import { Icon } from 'semantic-ui-react'
import { Marker, Popup } from "react-leaflet";
import { fields } from '../../../../../services/model/format';
import MexMap from '../../../../../hoc/mexmap/MexMap'
import { cloudGreenIcon } from "../../../../../hoc/mexmap/MapProperties";
import MexCircleMarker from '../../../../../hoc/mexmap/utils/MexCircleMarker'
import MexCurve from '../../../../../hoc/mexmap/utils/MexCurve'

const DEFAULT_ZOOM = 3
class CloudletMexMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapData: {},
            polyline: [],
            showDevices: false,
            curveColor: 'red'
        }
        this.popup = React.createRef();
        this.ws = undefined
    }

    resetMap = () => {
        if (this.ws) {
            this.ws.close()
            this.ws = undefined
        }
        this.setState({ showDevices: false, mapData: {} })
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
                                        <Marker icon={cloudGreenIcon(data[key].data.length)} position={[lat, lon]}>
                                            {this.renderMarkerPopup(data[key])}
                                        </Marker> :
                                        <MexCircleMarker coords={{ lat: lat, lng: lon }} label={data[key]['label']} /> :
                                    <Marker icon={cloudGreenIcon(data[key].data.length)} position={[lat, lon]}>
                                        {this.renderMarkerPopup(data[key])}
                                    </Marker>
                            }

                        </React.Fragment>
                    )
                })}
                {showDevices && polyline.length > 0 ?
                    <MexCurve data={polyline} color={curveColor} /> : null
                }
            </div> : null
    }

    render() {
        const { region } = this.props
        return (
            <MexMap renderMarker={this.renderMarker} back={this.resetMap} zoom={DEFAULT_ZOOM} region={region} />
        )
    }
}

export default CloudletMexMap


