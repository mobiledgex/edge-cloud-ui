import React from 'react'
import { cloudGreenIcon } from '../../../../../hoc/mexmap/MapProperties'
import MexMap from '../../../../../hoc/mexmap/MexMap'
import { Marker, Popup } from "react-leaflet";
import { fields } from '../../../../../services/model/format'
import { Icon } from '../../../../../hoc/mexui';
import { PARENT_APP_INST, PARENT_CLOUDLET, PARENT_CLUSTER_INST } from '../../../../../helper/constant/perpetual';
import { Skeleton } from '@material-ui/lab';
import './style.css'

const DEFAULT_ZOOM = 3

const CloudletPopup = (props) => {
    const { data } = props
    return data[fields.cloudletName]
}

const AppInstPopup = (props) => {
    const { data } = props
    return (
        <React.Fragment>
            {data[fields.appName]} [{data[fields.version]}]
            <code style={{ color: '#74B724' }}>
                [{data[fields.clusterName]}]
            </code>
        </React.Fragment>
    )
}

const ClusterInstPopup = (props) => {
    const { data } = props
    return (
        <React.Fragment>
            <code>{data[fields.clusterName]}</code>
        </React.Fragment>
    )
}

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

    renderModulePopup = (data) => {
        const { moduleId } = this.props
        switch (moduleId) {
            case PARENT_CLOUDLET:
                return <CloudletPopup data={data} />
            case PARENT_APP_INST:
                return <AppInstPopup data={data} />
            case PARENT_CLUSTER_INST:
                return <ClusterInstPopup data={data} />
        }
    }

    renderMarkerPopup = (data) => {
        const { moduleId } = this.props
        return (
            <Popup className="map-control-div-marker-popup" ref={this.popup}>
                {
                    Object.keys(data).map(key => {
                        let dataList = data[key]
                        return (
                            <div key={key}>
                                {
                                    <React.Fragment>
                                        <div>
                                            {moduleId !== PARENT_CLOUDLET ?
                                                <React.Fragment>
                                                    <strong style={{ textTransform: 'uppercase', fontSize: 14 }}>{dataList[0][fields.cloudletName]}</strong>
                                                    <br /><br />
                                                </React.Fragment> : null
                                            }
                                            {dataList.map((item, i) => (

                                                <div key={`${i}_${key}`} className="map-control-div-marker-popup-label" >
                                                    <code style={{ fontWeight: 400, fontSize: 12, display: 'flex', alignItems: 'center' }}>
                                                        <Icon style={{ color: item.color, marginRight: 5, fontSize: 10 }}>circle</Icon>
                                                        {this.renderModulePopup(item)}
                                                    </code>
                                                </div>
                                            ))}
                                        </div>
                                    </React.Fragment>
                                }
                            </div>
                        )
                    })
                }
            </Popup>
        )
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
        const { data, search, selection, regions } = props
        if (data) {
            let maps = {}
            regions.map(region => {
                if (data[region]) {
                    let keys = Object.keys(data[region])
                    if (keys.length > 0) {
                        keys.map(key => {
                            if ((selection.count === 0 || selection[key]) && (search.length === 0 || key.includes(search))) {
                                let item = data[region][key]
                                const { latitude, longitude } = item[fields.cloudletLocation]
                                let mapKey = `${latitude}_${longitude}`
                                let cloudletKey = item[fields.cloudletName]
                                maps[mapKey] = maps[mapKey] ? maps[mapKey] : {}
                                maps[mapKey][cloudletKey] = maps[mapKey][cloudletKey] ? maps[mapKey][cloudletKey] : []
                                maps[mapKey][cloudletKey].push(item)
                            }
                        })
                    }
                }
            })
            return { maps }
        }
        return null
    }

    render() {
        const { backswitch, maps } = this.state
        const { regions, zoom } = this.props
        return (
            maps ? <MexMap renderMarker={this.renderMarker} back={this.resetMap} zoom={zoom ? zoom : DEFAULT_ZOOM} backswitch={backswitch} region={regions} /> : <Skeleton variant='rect' height={300} />
        )
    }

    componentDidMount() {
    }
}

export default Map