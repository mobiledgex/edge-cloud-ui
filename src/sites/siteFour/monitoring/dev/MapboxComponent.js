import React, {Component} from 'react';
import '../PageMonitoring.css'
import ReactMapboxGl, {Layer, Marker, ZoomControl} from 'react-mapbox-gl';
import type {TypeAppInstance} from "../../../../shared/Types";
import {Button, Icon} from "semantic-ui-react";
import {showToast} from "../PageMonitoringCommonService";
import Lottie from "react-lottie";

const Map = ReactMapboxGl({
    accessToken: 'pk.eyJ1Ijoia3l1bmdqb29uLWdvLWNvbnN1bHRhbnQiLCJhIjoiY2s2Mnk2eHl0MDI5bzNzcGc0MTQ3NTM4NSJ9.BVwP4hu1ySJCJpGyVQBWSQ',
    latitude: 10.4515,
    longitude: 51.1657,

});


export default class MapboxComponent extends Component {

    state = {
        viewport: {
            width: '100%',
            height: '100%',
            latitude: 10.4515,
            longitude: 51.1657,
            zoom: 0.7
        },
        zoom: 0.75,
    };

    constructor() {
        super();

    }


    render() {
        return (
            <div style={{width: '100%', height: '100%'}}>
                <Map
                    style={'mapbox://styles/mapbox/dark-v9'}
                    containerStyle={{
                        width: '100%',
                        height: '100%',
                    }}
                    zoom={[this.state.zoom]}
                >
                    <Layer
                        id="my-id"
                        sourceId="data"
                        type="fill"
                        layerOptions={{filter: ['==', 'type', 'region']}}
                        layout={{}}
                        paint={{'fill-color': '#81D8D0', 'fill-opacity': 0.5}}
                    />
                    {/*<ZoomControl position={'bottom-left'} style={{color:'green'}}/>*/}
                    {/*<RotationControl/>*/}
                    {/*<ScaleControl/>*/}

                    {!this.props.appInstLoading &&
                        <div>
                            <Marker
                                //key={key}
                                //style={styles.marker}
                                coordinates={[-122.399076, 37.787302]}
                                onClick={() => {
                                    showToast('Mobiledgex')
                                }}>
                                <img

                                    src="https://www.vippng.com/png/detail/318-3188126_building-company-office-icon-in-png-file-specialty.png" style={{color: 'red'}} height="25" width="25"/>
                                <div style={{color: 'white', fontWeight: 'bold', fontSize: 15, fontFamily: 'Acme'}}>
                                    Mobiledgex
                                </div>
                                <div style={{color: 'yellow', fontWeight: 'bold', fontSize: 15, fontFamily: 'Acme'}}>
                                    [Mobiledgex office]
                                </div>
                            </Marker>
                            <Marker
                                //key={key}
                                //style={styles.marker}
                                coordinates={[127.106259,37.404945]}
                                onClick={() => {
                                    showToast('BIC')
                                }}>
                                <img

                                    src="https://www.vippng.com/png/detail/318-3188126_building-company-office-icon-in-png-file-specialty.png" style={{color: 'red'}} height="25" width="25"/>
                                <div style={{color: 'white', fontWeight: 'bold', fontSize: 15, fontFamily: 'Acme'}}>
                                    BIC
                                </div>
                                <div style={{color: 'yellow', fontWeight: 'bold', fontSize: 15, fontFamily: 'Acme'}}>
                                    [BIC office]
                                </div>
                            </Marker>

                            <Marker
                                //key={key}
                                //style={styles.marker}
                                coordinates={[77.595914,12.980056]}
                                onClick={() => {
                                    showToast('BIC')
                                }}>
                                <img

                                    src="https://www.vippng.com/png/detail/318-3188126_building-company-office-icon-in-png-file-specialty.png" style={{color: 'red'}} height="25" width="25"/>
                                <div style={{color: 'white', fontWeight: 'bold', fontSize: 15, fontFamily: 'Acme'}}>
                                    Rahul
                                </div>
                                <div style={{color: 'yellow', fontWeight: 'bold', fontSize: 15, fontFamily: 'Acme'}}>
                                    [Rahul's office]
                                </div>
                            </Marker>
                        </div>

                    }

                    {/*37.404945, 127.106259*/}

                    {!this.props.appInstLoading && this.props.markerList.map((item: TypeAppInstance, index) => {
                        return (
                            <Marker
                                //key={key}
                                //style={styles.marker}
                                coordinates={[item.CloudletLocation.longitude, item.CloudletLocation.latitude]}
                                onClick={() => {
                                    showToast(item.AppName + "[" + item.Cloudlet + "]")
                                }}>
                                <img

                                    src="https://cdn1.iconfinder.com/data/icons/basic-ui-elements-coloricon/21/06_1-512.png" style={{color: 'red'}} height="25" width="25"/>
                                <div style={{color: 'white', fontWeight: 'bold', fontSize: 15, fontFamily: 'Acme'}}>
                                    {item.AppName}
                                </div>
                                <div style={{color: 'yellow', fontWeight: 'bold', fontSize: 15, fontFamily: 'Acme'}}>
                                    [{item.Cloudlet}]
                                </div>
                            </Marker>
                        )
                    })}
                </Map>
                {this.props.appInstLoading &&
                <div style={{left: '39%', top: '32%', position: 'absolute'}}>
                    <Lottie
                        options={{
                            loop: true,
                            autoplay: true,
                            animationData: require('../../../../lotties/pinjump'),
                            rendererSettings: {
                                preserveAspectRatio: 'xMidYMid slice'
                            }
                        }}
                        height={150}
                        width={150}
                        isStopped={false}
                        isPaused={false}
                    />
                </div>
                }
                <div style={{marginTop: -120}}>
                    <Button id="mapZoomCtl" size='larges' icon onClick={() => {
                        this.setState({
                            zoom: 0.8,
                        })
                    }}>
                        <Icon name="refresh"/>
                    </Button>
                    <Button id="mapZoomCtl" size='large' icon onClick={() => {
                        this.setState({
                            zoom: this.state.zoom * 1.5
                        })
                    }}>
                        <Icon name="plus square outline"/>
                    </Button>
                    <Button id="mapZoomCtl" size='large' icon onClick={() => {
                        this.setState({
                            zoom: this.state.zoom * 0.5
                        })
                    }}>
                        <Icon name="minus square outline"/>
                    </Button>
                    <Button id="mapZoomCtl" size='large' icon onClick={() => {
                        this.setState({
                            showModal: !this.state.showModal
                        })
                    }}>
                        <Icon name="fullscreen square outline"/>
                    </Button>
                </div>
            </div>


        );
    }
}
