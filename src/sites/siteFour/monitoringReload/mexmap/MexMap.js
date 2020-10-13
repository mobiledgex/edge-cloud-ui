import React from "react";
import { Map, Marker, Polyline, Popup, TileLayer, LayersControl } from "react-leaflet";
import Control from 'react-leaflet-control';
import "leaflet-make-cluster-group/LeafletMakeCluster.css";
import { Icon, Button } from "semantic-ui-react";
import { cloudGreenIcon } from "./MapProperties";
import { fields } from "../../../../services/model/format";
import LinearProgress from '@material-ui/core/LinearProgress'
import { Card, NativeSelect, InputLabel, FormControl, Select } from "@material-ui/core";
import MexCircleMarker from './MexCircleMarker'

const DEFAULT_ZOOM = 3
const MAP_CENTER = [43.4, 51.7]

class MexMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapCenter: MAP_CENTER,
            zoom : DEFAULT_ZOOM
        }
        this.map = React.createRef();
        this.popup = React.createRef();
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }

    onMapMarkerClick = (data) => {
        this.setState({mapCenter : [data.location.latitude, data.location.longitude], zoom : 12})
        this.popup.current.leafletElement.options.leaflet.map.closePopup();
        this.props.onMapClick(data)
    }


    renderMarkerPopup = (dataList) => {
        return (
            <Popup className="map-control-div-marker-popup" ref={this.popup}>
                {
                    dataList.map((data, i) => {
                        return (
                            <div key={i} className="map-control-div-marker-popup-label" style={{ color: data.color ? data.color : '#FFF' }} onClick={() => { this.onMapMarkerClick(data) }}>
                                {data.label}
                            </div>
                        )
                    })
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
                    let dataList = mapDataType[key]
                    let location = dataList[0][fields.location]
                    let lat = location.latitude
                    let lon = location.longitude
                    return (
                        <React.Fragment key={`${i}_${j}_${type}`}>
                            {
                                type === 'cloudlet' ?
                                    <Marker icon={cloudGreenIcon} position={[lat, lon]}>
                                        {this.renderMarkerPopup(dataList)}
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

    zoomReset = () => {
        this.map.current.leafletElement.setZoom(DEFAULT_ZOOM)
    }

    zoomIn = () => {
        let zoom = this.map.current.leafletElement.getZoom()
        this.map.current.leafletElement.setZoom(zoom + 1)
    }

    zoomOut = () => {
        let zoom = this.map.current.leafletElement.getZoom()
        this.map.current.leafletElement.setZoom(zoom - 1)
    }

    renderMapControl = () => {
        let controllers = [
            { icon: 'redo', onClick: () => { this.zoomReset() } },
            { icon: 'add', onClick: () => { this.zoomIn() } },
            { icon: 'minus', onClick: () => { this.zoomOut() } }
        ]
        return (
            <Control position="topleft" className="map-control">
                {controllers.map((controller, key) => (
                    <div key={key} className="map-control-div">
                        <div
                            onClick={controller.onClick}>
                            <Icon name={controller.icon} className="map-control-div-icon" />
                        </div>
                    </div>
                ))}
            </Control>
        )
    }

    render() {
        const { zoom, mapCenter } = this.state
        return (
            <div className="mex-map" mex-test="component-map">
                <Map
                    ref={this.map}
                    center={mapCenter}
                    zoom={zoom}
                    easeLinearity={1}
                    useFlyTo={true}
                    dragging={true}
                    boundsOptions={{ padding: [50, 50] }}
                    minZoom={3}
                    minNativeZoom={3}
                    zoomControl={false}
                    maxBounds={[[-90.0, -180.0], [90.0, 180.0]]}>
                    <TileLayer
                        style={{ width: '100%', height: '100%', zIndex: 1 }}
                        url={'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'}
                        zoom={2}
                        style={{ zIndex: 1 }}
                    />
                    {this.renderMapControl()}
                    {this.renderMarker()}
                </Map>
            </div>
        )
    }

    componentDidMount() {
    }
}

export default MexMap