import React from "react";
import { Map, TileLayer } from "react-leaflet";
import Control from 'react-leaflet-control';
import "leaflet-make-cluster-group/LeafletMakeCluster.css";
import { Icon } from "semantic-ui-react";
import { Tooltip } from "@material-ui/core";
import { regionLocation } from "../../constant";

export const DEFAULT_ZOOM = 2
export const MAP_CENTER = [3.2, 23.53]

class MexMap extends React.Component {

    constructor(props) {
        super(props)
        this.map = React.createRef();
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }

    zoomReset = () => {
        this.map.current.leafletElement.setView(MAP_CENTER, DEFAULT_ZOOM)
    }

    zoomIn = () => {
        let zoom = this.map.current.leafletElement.getZoom()
        this.map.current.leafletElement.setZoom(zoom + 1)
    }

    zoomOut = () => {
        let zoom = this.map.current.leafletElement.getZoom()
        this.map.current.leafletElement.setZoom(zoom - 1)
    }

    renderMapControl = (backswitch) => {
        let controllers = [
            { label: 'Zoom In', icon: 'add', onClick: () => { this.zoomIn() }, visible: true },
            { label: 'Zoom Out', icon: 'minus', onClick: () => { this.zoomOut() }, visible: true },
            { label: 'Zoom Reset', icon: 'redo', onClick: () => { this.zoomReset() }, visible: true },
            { label: 'Close', icon: 'close', onClick: () => { this.props.back() }, visible: backswitch }
        ]
        return (
            <Control position="topleft" className="map-control">
                {controllers.map((controller, key) => (
                    controller.visible ? <div key={key} className="map-control-div">
                        <Tooltip title={controller.label}>
                            <div
                                onClick={controller.onClick}>
                                <Icon name={controller.icon} className="map-control-div-icon" />
                            </div>
                        </Tooltip>
                    </div> : null
                ))}
            </Control>
        )
    }

    onMapClick = (e) => {
        if (this.props.onMapClick) {
            let lat = Math.round(e.latlng['lat'])
            let long = Math.round(e.latlng['lng'])
            this.map.current.leafletElement.setView([lat, long], 3)
            let location = { lat, long }
            this.props.onMapClick(location)
        }
    }

    render() {
        const { renderMarker, mapCenter, zoom, backswitch, fullscreen } = this.props
        return (
            <div className={fullscreen ? 'mex-map-full' : 'mex-map'} mex-test="component-map">
                <Map
                    ref={this.map}
                    center={mapCenter}
                    zoom={zoom}
                    easeLinearity={1}
                    useFlyTo={true}
                    dragging={true}
                    boundsOptions={{ padding: [50, 50] }}
                    minZoom={2}
                    minNativeZoom={3}
                    animate={false}
                    scrollWheelZoom={false}
                    zoomControl={false}
                    onClick={this.onMapClick}
                    maxBounds={[[-90.0, -180.0], [90.0, 180.0]]}>
                    <TileLayer
                        style={{ width: '100%', height: '100%', zIndex: 1 }}
                        url={'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png'}
                        zoom={2}
                        style={{ zIndex: 1 }}
                    />
                    {this.renderMapControl(backswitch)}
                    {renderMarker()}
                </Map>
            </div>
        )
    }

    componentDidUpdate(preProps, preState) {
        if(this.props.register && this.props.mapCenter !== preProps.mapCenter)
        {
            this.map.current.leafletElement.setView(this.props.mapCenter, 3)
        }
        if (preProps.region !== this.props.region) {
            if (this.props.region.length > 1) {
                this.map.current.leafletElement.setView(MAP_CENTER, DEFAULT_ZOOM)
            }
            else {
                const { center, zoom } = regionLocation(this.props.region[0])
                this.map.current.leafletElement.setView(center, zoom)
            }
        }
    }

    componentDidMount() {
    }
}

export default MexMap