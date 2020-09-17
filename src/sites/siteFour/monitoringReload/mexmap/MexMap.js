import React from "react";
import { Map, Marker, Polyline, Popup, TileLayer, LayersControl } from "react-leaflet";
import Control from 'react-leaflet-control';
import "leaflet-make-cluster-group/LeafletMakeCluster.css";
import { Icon, Button } from "semantic-ui-react";
import { cloudGreenIcon } from "./MapProperties";
import { fields } from "../../../../services/model/format";
import LinearProgress from '@material-ui/core/LinearProgress'
import { Card, NativeSelect, InputLabel, FormControl, Select } from "@material-ui/core";

const DEFAULT_ZOOM = 3
const MAP_CENTER = [43.4, 51.7]

class MexMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            mapCenter: MAP_CENTER
        }
        this.map = React.createRef();
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }

    onMapMarkerClick = (data) => {
    }


    renderMarkerPopup = (dataList) => {
        return (
            <Popup className="map-control-div-marker-popup">
                {
                    dataList.map((data, i) => {
                        return (
                            <div key={i} className="map-control-div-marker-popup-label" onClick={() => { this.onMapMarkerClick(data) }}>
                                {`${data[fields.appName]} [${data[fields.version]}] ${data[fields.clusterName]}`}
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
            return Object.keys(mapData).map((key, i) => {
                let dataList = mapData[key]
                let location = dataList[0][fields.cloudletLocation]
                let lat = location.latitude
                let lon = location.longitude
                return (
                    <React.Fragment key={i}>
                        <Marker icon={cloudGreenIcon} position={[lat, lon]}>
                            {this.renderMarkerPopup(dataList)}
                        </Marker>
                    </React.Fragment>
                )
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
                    zoom={DEFAULT_ZOOM}
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