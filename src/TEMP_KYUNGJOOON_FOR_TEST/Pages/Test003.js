import 'react-hot-loader'
import React from "react";
import {LayersControl, Map, Marker, Pane, Popup, TileLayer, Tooltip, ZoomControl} from "react-leaflet";
import "./leaflet.css";
import {showToast} from "../../sites/siteFour/monitoring/PageMonitoringCommonService";
import {hot} from "react-hot-loader/root";
import 'react-leaflet-fullscreen-control'

const {BaseLayer, Overlay} = LayersControl
const rectangle = [
    [51.49, -0.08],
    [51.5, -0.06],
]
const center = [51.505, -0.09]
const outer = [
    [50.505, -29.09],
    [52.505, 29.09],
]

const DEFAULT_VIEWPORT = {
    center: [51.505, -0.09],
    zoom: 13,
}
const multiPolygon = [
    [
        [51.51, -0.12],
        [51.51, -0.13],
        [51.53, -0.13],
    ],
    [
        [51.51, -0.05],
        [51.51, -0.07],
        [51.53, -0.07],
    ],
]


export default hot(
    class Test002 extends React.Component {
        state = {
            viewport: DEFAULT_VIEWPORT,
            markers: [
                {key: 'marker1', position: [51.5, -0.1], content: 'My first popup'},
                {key: 'marker2', position: [51.51, -0.1], content: 'My second popup'},
                {key: 'marker3', position: [51.49, -0.05], content: 'My third popup'},
            ],
        }

        onClickReset = () => {
            this.setState({viewport: DEFAULT_VIEWPORT})
        }

        onViewportChanged = (viewport: Viewport) => {
            this.setState({viewport})
        }

        render() {
            return (
                <div style={{height: window.innerHeight, width: '100%'}}>
                    <Map center={[45.4, -75.7]} zoom={2}

                         bound={[
                             [50.505, -29.09],
                             [52.505, 29.09],
                         ]}
                        //onClick={this.onClickReset}
                        // onViewportChanged={this.onViewportChanged}
                        //     viewport={this.state.viewport}
                    >
                        <TileLayer
                            //url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                            //url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
                            url={'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'}

                            minZoom={3}
                            //maxZoom={15}
                        />
                        <Pane   style={{zIndex: 500}}>
                            <a style={{zIndex:99999, color:'white'}}>sldkflsdkf</a>
                        </Pane>
                        <ZoomControl position="topright"/>
                        <Marker
                            position={
                                [37.404945, 127.106259]
                            }
                            onClick={() => {
                                alert('sdlfkdslkf')
                            }}
                        >
                            {/* <Popup>
                        <span>asdasdasd11111</span>
                    </Popup>*/}
                            <Tooltip className='tooltip1' click={() => {
                                alert('sdlkfsdlkflsdk')
                            }} direction='right' offset={[-8, -2]} opacity={0.7} permanent style={{backgroundColor: 'red'}}>

                                <br/>
                                <div onClick={() => {
                                    alert('sdlfksdlkflkdsf')
                                }}>고경준 천재님이십니다2323
                                </div>
                                <span>고경준 139489183249</span>
                            </Tooltip>

                        </Marker>
                        {/* <Rectangle bounds={rectangle} color="black">
                        <Tooltip direction="bottom" offset={[0, 20]} opacity={1} permanent>
                            permanent Tooltip for Rectangle
                        </Tooltip>
                    </Rectangle>*/}
                        <Marker
                            //key={key}
                            //style={styles.marker}
                            position={[12.980056, 77.595914,]}
                            onClick={() => {
                                showToast('Rahul')
                            }}>
                            <Popup>
                                A pretty CSS3 popup. <br/> Easily customizable.
                            </Popup>
                        </Marker>
                        <Marker
                            //key={key}
                            //style={styles.marker}
                            position={[37.787302, -122.399076,]}
                            onClick={() => {
                                showToast('Mobiledgex')
                            }}>
                        </Marker>
                        <Marker position={[51.51, -0.09]}>
                            <Popup>Popup for Marker</Popup>
                            <Tooltip>Tooltip for Marker</Tooltip>
                        </Marker>

                    </Map>
                </div>
            );
        }


    }
)
