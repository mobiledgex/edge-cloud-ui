import React from "react";
import { Map, TileLayer } from "react-leaflet";
import Control from 'react-leaflet-control';
import { Icon } from "semantic-ui-react";
import { Tooltip } from "@material-ui/core";
import { regionLocation } from "../../constant";
import isEqual from 'lodash/isEqual'

export const MAP_CENTER = [3.2, 23.53]
class MexMap extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            zoom: props.zoom,
            mapCenter: MAP_CENTER
        }
        this.map = React.createRef();
        this.regions = localStorage.regions ? localStorage.regions.split(",") : [];
    }

    updateView = (mapCenter, zoom) => {
        zoom = zoom ? zoom : this.map.current.leafletElement.getZoom()
        this.setState({ mapCenter, zoom })
        this.map.current.leafletElement.setView(mapCenter, zoom)
    }

    updateZoom = (zoom) => {
        this.setState({ zoom })
        this.map.current.leafletElement.setZoom(zoom)
    }

    zoomReset = () => {
        this.updateView(MAP_CENTER, this.props.zoom)
    }

    zoomIn = () => {
        let zoom = this.map.current.leafletElement.getZoom()
        this.updateZoom(zoom + 1)
    }

    zoomOut = () => {
        let zoom = this.map.current.leafletElement.getZoom()
        this.updateZoom(zoom - 1)
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
            this.updateView([lat, long])
            let location = { lat, long }
            this.props.onMapClick(location)
        }
    }

    render() {
        const { renderMarker, backswitch, fullscreen, wheel, style } = this.props
        const { mapCenter, zoom } = this.state
        return (
            <div className={fullscreen ? 'mex-map-full' : 'mex-map'} mex-test="component-map" style={style ? style : {}}>
                <Map
                    ref={this.map}
                    center={mapCenter}
                    zoom={zoom}
                    easeLinearity={1}
                    useFlyTo={true}
                    boxZoom={true}
                    dragging={true}
                    boundsOptions={{ padding: [50, 50] }}
                    minZoom={2}
                    minNativeZoom={3}
                    animate={false}
                    scrollWheelZoom={wheel ? wheel : false}
                    zoomControl={false}
                    onClick={this.onMapClick}
                    maxBounds={[[-90.0, -180.0], [90.0, 180.0]]}>
                    <TileLayer
                        style={{ width: '100%', height: '100%', zIndex: 1 }}
                        url={'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png'}
                        zoom={2}
                    />
                    {this.renderMapControl(backswitch)}
                    {renderMarker ? renderMarker() : null}
                </Map>
            </div>
        )
    }

    calculateCenter = () => {
        const { region } = this.props
        if (region) {
            if (region.length > 1) {
                this.updateView(MAP_CENTER, this.props.zoom)
            }
            else {
                const { center, zoom } = regionLocation(region[0])
                this.updateView(center, zoom)
            }
        }
    }

    componentDidUpdate(preProps, preState) {
        if (!isEqual(preProps.region, this.props.region)) {
            this.calculateCenter()
        }
        else if (!isEqual(preProps.center, this.props.center)) {
            const { center, zoom } = this.props
            this.updateView(center ? center : MAP_CENTER, center ? 5 : zoom)
        }
    }

    componentDidMount() {
        this.calculateCenter()
    }
}

export default MexMap