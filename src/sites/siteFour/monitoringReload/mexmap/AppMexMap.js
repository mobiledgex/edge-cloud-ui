import React from 'react'
import MexMap from './MexMap'
import { Icon } from 'semantic-ui-react'
import { Marker, Popup } from "react-leaflet";
import MexCircleMarker from './MexCircleMarker'
import { fields } from '../../../../services/model/format';
import { cloudGreenIcon } from "./MapProperties";

class AppMexMap extends React.Component {

    constructor(props) {
        super(props)

    }

    onAppMapClick = (data) => {
        //this.sendWSRequest(showAppInstClient(data.data))
    }

    renderMarkerPopup = (data) => {
        let selected = data['selected']
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
                                            <div key={`${i}_${cloudlet}`} className="map-control-div-marker-popup-label" onClick={() => { this.onAppMapClick(data) }}>
                                                <code style={{ fontWeight: 400, fontSize: 12 }}>
                                                    <Icon style={{ color: keyData.color, marginRight: 5 }} name='circle' />
                                                    {keyData['app']} [{keyData['ver']}]
                                                <code style={{ color: '#74B724' }}>
                                                        [{keyData['cluster']}]
                                                </code>
                                                    <Icon name="mobile alternate" />
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
        let mapData = this.props.data
        if (mapData) {
            return Object.keys(mapData).map((type, j) => {
                let mapDataType = mapData[type]
                return Object.keys(mapDataType).map((key, i) => {
                    let data = mapDataType[key]
                    let location = data[fields.location]
                    let lat = location[fields.latitude]
                    let lon = location[fields.longitude]
                    return (
                        <React.Fragment key={`${i}_${j}_${type}`}>
                            {
                                type === 'cloudlet' ?
                                    <Marker icon={cloudGreenIcon} position={[lat, lon]}>
                                        {this.renderMarkerPopup(data)}
                                    </Marker> : null
                            }
                            {
                                type === 'devices' ?
                                    <MexCircleMarker coords={{ lat: lat, lng: lon }} label={dataList[0]['label']} /> : null
                            }
                        </React.Fragment>
                    )
                })

            })

        }
    }

    render() {
        const { mapData } = this.props
        return (
            <MexMap mapData={mapData} renderMarker={this.renderMarker} />
        )
    }
}

export default AppMexMap


