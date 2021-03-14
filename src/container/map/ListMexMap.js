import React from 'react'
import MexMap, { MAP_CENTER, DEFAULT_ZOOM } from '../../hoc/mexmap/MexMap'
import { Icon } from 'semantic-ui-react'
import { Marker, Popup } from "react-leaflet";
import { fields } from '../../services/model/format';
import { CLUSTER_INST } from '../../constant';
import Legend from './MapLegend'
import { mapLegendColor, renderSVG } from '../../hoc/mexmap/constant';

const processMapData = (dataList) => {
    let mapData = {}
    dataList.map(data => {
        if (data[fields.cloudletLocation]) {
            let cloudletLocation = data[fields.cloudletLocation]
            if (cloudletLocation.latitude && cloudletLocation.longitude) {
                let key = `${cloudletLocation.latitude}_${cloudletLocation.longitude}`
                mapData[key] = mapData[key] ? mapData[key] : { cloudletLocation }
                mapData[key]['data'] = mapData[key]['data'] ? mapData[key]['data'] : []
                mapData[key]['data'].push(data)
            }
        }
    })
    return mapData
}

class ListMexMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapData: {},
            mapCenter: MAP_CENTER,
            zoom: DEFAULT_ZOOM
        }
        this.popup = React.createRef();
    }

    renderColor = (data) => {
        let colorKey = 0
        if (data[fields.cloudletStatus] === 2) {
            colorKey = 1
        }
        else if (data[fields.cloudletStatus] === 999) {
            colorKey = 2
        }
        return mapLegendColor[colorKey]
    }

    renderLabel = (id, data) => {
        switch (id) {
            case 'Cloudlets':
                return data[fields.cloudletName]
            case CLUSTER_INST:
                return data[fields.clusterName]
            case 'AppInsts':
                return `${data[fields.appName]} [${data[fields.version]}]`
        }
    }

    renderIconMarker = (id, register, dataList) => {

        let colorKey = 0
        if (register) {
            colorKey = 1
        }
        else {
            let online = false;
            let offline = false;
            let maintenance = false;

            dataList.map(data => {
                if (data[fields.cloudletStatus] === 2) {
                    online = true
                }
                else if (data[fields.cloudletStatus] === 999) {
                    maintenance = true
                }
                else {
                    offline = true
                }
            })

            if ((maintenance && online && offline) || (maintenance && online) || (maintenance && offline) || (online && offline)) {
                colorKey = 3
            }
            else if (maintenance) {
                colorKey = 2
            }
            else if (offline) {
                colorKey = 0
            }
            else if (online) {
                colorKey = 1
            }
        }

        let cost = dataList.length

        return (
            L.divIcon({
                html: `<div style="width:28px; height:28px">${renderSVG(colorKey, cost)}</div>`,
                iconSize: [28, 28],
                iconAnchor: [14, 14],
                className: 'map-marker'
            }
            ))
    }

    assignPopupProperties = popup => {
        if (popup) {
            popup.leafletElement.options.autoClose = false;
            popup.leafletElement.options.closeOnClick = false;
        }
    }

    popupClose = ()=>{
        this.setState({ mapData: {}, mapCenter: MAP_CENTER, zoom: DEFAULT_ZOOM }, () => {
            this.props.onClick()
        })
    }

    renderMarkerPopup = (id, dataList) => {
        return (
            <Popup className="map-control-div-marker-popup" ref={this.popup} onClose={this.popupClose}>
                {
                    dataList.map((data, i) => (
                        <div key={i} className="map-control-div-marker-popup-label" >
                            <code style={{ fontWeight: 400, fontSize: 12 }}>
                                <Icon style={{ color: this.renderColor(data), marginRight: 5 }} name='circle' />
                                {this.renderLabel(id, data)}
                            </code>
                        </div>
                    ))
                }
            </Popup>
        )
    }

    onMarkerClick = (dataList) => {
        this.props.onClick(dataList)
    }

    renderMarker = () => {
        const { mapData } = this.state
        const { id, register } = this.props
        let data = mapData
        return data ?
            <div>
                {Object.keys(data).map((key, i) => {
                    let location = data[key][fields.cloudletLocation]
                    let lat = location[fields.latitude]
                    let lon = location[fields.longitude]
                    return (
                        <React.Fragment key={key}>
                            {
                                <Marker onclick={() => { this.onMarkerClick(data[key].data) }} icon={this.renderIconMarker(id, register, data[key].data)} position={[lat, lon]}>
                                    {register ? null : this.renderMarkerPopup(id, data[key].data)}
                                </Marker>
                            }

                        </React.Fragment>
                    )
                })}
                {register ? null : <Legend />}
            </div> : null
    }

    static getDerivedStateFromProps(props, state) {
        let mapData = processMapData(props.dataList)
        if (props.register && props.dataList.length === 1) {
            let location = props.dataList[0].cloudletLocation
            return { mapData, mapCenter: [parseInt(location.latitude), parseInt(location.longitude)] }
        }
        return { mapData }
    }

    render() {
        const { mapCenter, zoom } = this.state
        const { region, onMapClick, register } = this.props
        return (
            <MexMap renderMarker={this.renderMarker} mapCenter={mapCenter} zoom={zoom} region={[region]} onMapClick={onMapClick} register={register} />
        )
    }
}

export default ListMexMap

