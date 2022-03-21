import React from 'react'
import { Marker, Popup } from "react-leaflet";
import { localFields } from '../../../services/fields';
import Legend from './MapLegend'
import { mapLegendColor, renderFlagSVG, renderSVG } from '../../mexmap/constant';
import { serverFields } from '../../../helper/formatter';
import { perpetual } from '../../../helper/constant';
import MexMap from '../../mexmap/MexMap'
import { Icon } from 'semantic-ui-react'

const DEFAULT_ZOOM = 3

const processMapData = (dataList) => {
    let mapData = {}
    dataList.map(data => {
        if (data[localFields.cloudletLocation]) {
            let cloudletLocation = data[localFields.cloudletLocation]
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
            mapData: {}
        }
        this.popup = React.createRef();
    }

    renderColor = (data) => {
        let colorKey = 0
        if (data[localFields.cloudletStatus] === serverFields.READY) {
            colorKey = 1
        }
        else if (data[localFields.cloudletStatus] === perpetual.STATUS_UNDER_MAINTAINANCE) {
            colorKey = 2
        }
        return mapLegendColor[colorKey]
    }

    renderLabel = (id, data) => {
        switch (id) {
            case perpetual.PAGE_CLOUDLETS:
                return data[localFields.cloudletName]
            case perpetual.PAGE_CLUSTER_INSTANCES:
                return data[localFields.clusterName]
            case perpetual.PAGE_APP_INSTANCES:
                return `${data[localFields.appName]} [${data[localFields.version]}]`
            case perpetual.PAGE_GUEST_ZONES:
            case perpetual.PAGE_HOST_ZONES:
                return data[localFields.zoneId]
        }
    }

    renderIconMarker = (id, register, dataList) => {

        let colorKey = 0
        if (register || id === perpetual.PAGE_GUEST_ZONES || id === perpetual.PAGE_HOST_ZONES) {
            colorKey = 1
        }
        else {
            let online = false;
            let offline = false;
            let maintenance = false;

            dataList.map(data => {
                if (data[localFields.cloudletStatus] === serverFields.READY) {
                    online = true
                }
                else if (data[localFields.cloudletStatus] === perpetual.STATUS_UNDER_MAINTAINANCE) {
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
                html: `<div style="width:28px; height:28px">${id === perpetual.PAGE_GUEST_ZONES || id === perpetual.PAGE_HOST_ZONES ? renderFlagSVG(colorKey, cost) : renderSVG(colorKey, cost)}</div>`,
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

    popupClose = () => {
        this.setState({ mapData: {} }, () => {
            if (this.props.onClick) {
                this.props.onClick()
            }
        })
    }

    renderMarkerPopup = (id, dataList) => {
        return (
            <Popup className="map-control-div-marker-popup" ref={this.popup} onClose={this.popupClose} onOpen={this.popupOpen}>
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
        if (this.props.onClick) {
            this.props.onClick(dataList)
        }
    }

    renderMarker = () => {
        const { mapData } = this.state
        const { id, register } = this.props
        let data = mapData
        return data ?
            <div>
                {Object.keys(data).map((key, i) => {
                    let location = data[key][localFields.cloudletLocation]
                    let lat = location[localFields.latitude]
                    let lon = location[localFields.longitude]
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
                {register ? null : this.props.id === perpetual.PAGE_CLOUDLETS ? <Legend /> : null}
            </div> : null
    }

    static getDerivedStateFromProps(props, state) {
        let mapData = processMapData(props.dataList)
        return { mapData }
    }

    render() {
        const { region, onMapClick } = this.props
        return (
            <MexMap renderMarker={this.renderMarker} region={[region]} onMapClick={onMapClick} zoom={DEFAULT_ZOOM} />
        )
    }
}

export default ListMexMap