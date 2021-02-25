import React from 'react'
import MexMap, { MAP_CENTER, DEFAULT_ZOOM } from '../../hoc/mexmap/MexMap'
import { Icon } from 'semantic-ui-react'
import { Marker, Tooltip } from "react-leaflet";
import { fields } from '../../services/model/format';
import { CLUSTER_INST } from '../../constant';
import Legend, { mapLegendColor } from './MapLegend'

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
            zoom: DEFAULT_ZOOM,
            backswitch: false
        }
        this.popup = React.createRef();
    }

    resetMap = () => {
        this.setState({ mapData: {}, mapCenter: MAP_CENTER, zoom: DEFAULT_ZOOM, backswitch: false }, () => {
            this.props.onClick()
        })
    }

    gradientFilter(key) {
        return `<defs><filter id="inner${key}" x0="-25%" y0="-25%" width="200%" height="200%"><feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"></feGaussianBlur><feOffset dy="2" dx="3"></feOffset><feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite><feFlood flood-color="${mapLegendColor[key]}" flood-opacity="1"></feFlood><feComposite in2="shadowDiff" operator="in"></feComposite><feComposite in2="SourceGraphic" operator="over" result="firstfilter"></feComposite><feGaussianBlur in="firstfilter" stdDeviation="3" result="blur2"></feGaussianBlur><feOffset dy="-2" dx="-3"></feOffset><feComposite in2="firstfilter" operator="arithmetic" k2="-1" k3="1" result="shadowDiff"></feComposite><feFlood flood-color="${mapLegendColor[key]}" flood-opacity="1"></feFlood><feComposite in2="shadowDiff" operator="in"></feComposite><feComposite in2="firstfilter" operator="over"></feComposite></filter></defs>`
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

    renderIconMarker = (id, register, backswitch, dataList) => {

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

        // let path = `<circle filter="url(#inner${colorKey})" cx="12" cy="12" r="12"></circle>`
        let path = `<path filter="url(#inner${colorKey})" d="M 19.35 10.04 C 18.67 6.59 15.64 4 12 4 C 9.11 4 6.6 5.64 5.35 8.04 C 2.34 8.36 0 10.91 0 14 c 0 3.31 2.69 6 6 6 h 13 c 2.76 0 5 -2.24 5 -5 c 0 -2.64 -2.05 -4.78 -4.65 -4.96 Z"></path>`
        // if(backswitch)
        // {
        //     switch (id) {
        //         case CLUSTER_INST:
        //             path = `<path filter="url(#inner${colorKey})" d="M 10 4 H 4 c -1.1 0 -1.99 0.9 -1.99 2 L 2 18 c 0 1.1 0.9 2 2 2 h 16 c 1.1 0 2 -0.9 2 -2 V 8 c 0 -1.1 -0.9 -2 -2 -2 h -8 l -2 -2 Z"></path>`
        //             break;
        //         case 'AppInsts':
        //             path = `<path filter="url(#inner${colorKey})" d="M 12 2 C 8.13 2 5 5.13 5 9 c 0 5.25 7 13 7 13 s 7 -7.75 7 -13 c 0 -3.87 -3.13 -7 -7 -7 Z"></path>`
        //             break;
        //     }
        // }

        let gradient = this.gradientFilter(colorKey);
        let cost = dataList.length
        // let bgColor = (mapTileList[selectedIndex].name.indexOf('light') > -1) ? "rgba(10,10,10,.7)" : "rgba(10,10,10,.5)"

        let svgImage = `<svg viewBox="0 0 24 24"><g fill=rgba(10,10,10,.7) stroke="#fff" stroke-width="0"> ${gradient} ${path} </g><p style="position:absolute; top: 0; width: 28px; line-height: 28px; text-align: center;">${cost}</p></svg>`

        return (
            L.divIcon({
                html: `<div style="width:28px; height:28px">${svgImage}</div>`,
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

    renderMarkerPopup = (id, dataList) => {
        return (
            <Tooltip className="map-tooltip">
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
            </Tooltip>
        )
    }

    onMarkerClick = (dataList) => {
        this.setState({ backswitch: true }, () => {
            this.props.onClick(dataList)
        })
    }

    renderMarker = () => {
        const { mapData, backswitch } = this.state
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
                                <Marker onclick={() => { this.onMarkerClick(data[key].data) }} icon={this.renderIconMarker(id, register, backswitch, data[key].data)} position={[lat, lon]}>
                                    {register ? null : this.renderMarkerPopup(id, data[key].data)}
                                </Marker>
                            }

                        </React.Fragment>
                    )
                })}
                <Legend />
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
        const { mapCenter, zoom, backswitch } = this.state
        const { region, onMapClick, register } = this.props
        return (
            <MexMap renderMarker={this.renderMarker} back={this.resetMap} mapCenter={mapCenter} zoom={zoom} region={[region]} backswitch={backswitch} onMapClick={onMapClick} register={register} />
        )
    }
}

export default ListMexMap


