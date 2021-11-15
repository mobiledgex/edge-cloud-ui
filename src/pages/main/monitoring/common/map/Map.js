import React from 'react'
import { cloudGreenIcon } from '../../../../../hoc/mexmap/MapProperties'
import MexMap from '../../../../../hoc/mexmap/MexMap'
import { Marker, Popup } from "react-leaflet";
import { fields } from '../../../../../services/model/format'
import { Icon } from '../../../../../hoc/mexui';

const DEFAULT_ZOOM = 3

class Map extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            backswitch: false,
            maps: undefined
        }
        this.popup = React.createRef();
    }

    resetMap = () => {
    }

    renderMarkerPopup = (data) => {
        <Popup className="map-control-div-marker-popup" ref={this.popup}>
            {
                Object.keys(data).map(cloudletKey => {
                    let dataList = data[cloudletKey]
                    return (
                        <div key={cloudletKey}>
                            {
                                dataList.map((item, i) => (
                                    <div key={`${i}_${cloudletKey}`} className="map-control-div-marker-popup-label" >
                                        <code style={{ fontWeight: 400, fontSize: 12 }}>
                                            <Icon style={{ color: item.color, marginRight: 5 }}>circle</Icon>
                                            {item[fields.cloudletName]}
                                        </code>
                                    </div>
                                ))
                            }
                        </div>
                    )
                })
            }
        </Popup>
    }

    renderMarker = () => {
        const { maps } = this.state
        return (
            <div>
                {Object.keys(maps).map((key, i) => {
                    let map = maps[key]
                    let location = key.split('_')
                    if (location.length === 2) {
                        let lat = location[0]
                        let lon = location[1]
                        return (
                            <React.Fragment key={key}>
                                <Marker icon={cloudGreenIcon(Object.keys(map).length)} position={[lat, lon]}>
                                    {this.renderMarkerPopup(map)}
                                </Marker>
                            </React.Fragment>
                        )
                    }
                })}
            </div>
        )
    }

    static getDerivedStateFromProps(props, state) {
        if (props.data) {
            const { data, tools } = props
            let maps = {}
            let keys = Object.keys(data)
            keys.map(key => {
                let item = data[key]
                const { latitude, longitude } = item[fields.cloudletLocation]
                let mapKey = `${latitude}_${longitude}`
                let cloudletKey = item[fields.cloudletName]
                maps[mapKey] = maps[mapKey] ? maps[mapKey] : {}
                maps[mapKey][cloudletKey] = maps[mapKey][cloudletKey] ? maps[mapKey][cloudletKey] : []
                maps[mapKey][cloudletKey].push(item)
            })
            return { maps }
        }
        return null
    }

    shouldComponentUpdate(nextProps, nextState) {
        return true//this.props.refresh !== nextProps.refresh
    }

    render() {
        const { backswitch, maps } = this.state
        const { regions } = this.props
        return (
            maps ? <MexMap renderMarker={this.renderMarker} back={this.resetMap} zoom={DEFAULT_ZOOM} backswitch={backswitch} region={regions} /> : null
        )
    }

    componentDidMount() {
    }
}

export default Map