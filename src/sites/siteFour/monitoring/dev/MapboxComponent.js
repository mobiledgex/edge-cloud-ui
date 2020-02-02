import React, {Component} from 'react';
import '../PageMonitoring.css'
import ReactMapboxGl, {Marker} from 'react-mapbox-gl';
import type {TypeAppInstance} from "../../../../shared/Types";
import {Button, Icon} from "semantic-ui-react";
import {showToast} from "../PageMonitoringCommonService";
import Lottie from "react-lottie";

const Map = ReactMapboxGl({
    accessToken: 'pk.eyJ1Ijoia3l1bmdqb29uLWdvLWNvbnN1bHRhbnQiLCJhIjoiY2s2Mnk2eHl0MDI5bzNzcGc0MTQ3NTM4NSJ9.BVwP4hu1ySJCJpGyVQBWSQ',
    latitude: 10.4515,
    longitude: 51.1657,

});

type Props = {
    handleLoadingSpinner: Function,
    cloudletKey: any,//hashmap
    markerList: Array,
    handleAppInstDropdown: Function,
}

type State = {
    date: string,
    appInstanceListGroupByCloudlet: any,
    cloudletKeys: Array,
    zoom: number,
    newCloudLetLocationList: Array,
    showModal: boolean,
    showOffice: boolean,
    isUpdateEnable: boolean,
}

export default class MapboxComponent extends Component<Props, State> {


    constructor(props) {
        super(props);
        this.state = {
            /* viewport: {
                 width: '100%',
                 height: '100%',
                 latitude: 10.4515,
                 longitude: 51.1657,
                 zoom: 0.7
             },*/
            zoom: 0.9,//mapZoom
            appInstanceListGroupByCloudlet: '',
            cloudletKeys: [],
            newCloudLetLocationList: [],
            showModal: false,
            showOffice: false,
            isUpdateEnable: false,

        };
    }

    componentDidMount = async () => {
        console.log('markerList2222===>', this.props.markerList);
        let appInstanceListGroupByCloudlet = this.props.markerList
        this.setCloudletLocation(appInstanceListGroupByCloudlet)

    };

    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        if (this.props.markerList !== nextProps.markerList) {

            console.log('markerList2222 nextProps_markerList===>', nextProps.markerList);
            let appInstanceListGroupByCloudlet = nextProps.markerList;
            this.setCloudletLocation(appInstanceListGroupByCloudlet)
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.props.markerList === nextProps.markerList && !this.state.isUpdateEnable) {
            return false;
        } else {
            return true;
        }
    }

    setCloudletLocation(appInstanceListGroupByCloudlet) {

        let cloudletKeys = Object.keys(appInstanceListGroupByCloudlet)

        let newCloudLetLocationList = []
        cloudletKeys.map((key, index) => {

            let AppNames = ''
            let CloudletLocation = '';
            let Cloudlet = '';
            let ClusterInst = '';
            appInstanceListGroupByCloudlet[key].map((item: TypeAppInstance, index) => {

                if (index === (appInstanceListGroupByCloudlet[key].length - 1)) {
                    AppNames += item.AppName;
                } else {
                    AppNames += item.AppName + " , "
                }


                CloudletLocation = item.CloudletLocation;
                Cloudlet = item.Cloudlet;
                ClusterInst = item.ClusterInst;

            })

            newCloudLetLocationList.push({
                AppNames: AppNames,
                CloudletLocation: CloudletLocation,
                Cloudlet: Cloudlet,
                ClusterInst: ClusterInst,
            })

        })

        this.setState({
            newCloudLetLocationList: newCloudLetLocationList,
        }, () => {
            console.log('newCloudLetLocationList===>', this.state.newCloudLetLocationList);
        })


    }

    renderOfficeLoc() {
        return (
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
                    coordinates={[127.106259, 37.404945]}
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
                    coordinates={[77.595914, 12.980056]}
                    onClick={() => {
                        showToast('Rahul')
                    }}>
                    <img

                        src="https://www.vippng.com/png/detail/318-3188126_building-company-office-icon-in-png-file-specialty.png" style={{color: 'red'}} height="25" width="25"/>
                    <div style={{color: 'white', fontWeight: 'bold', fontSize: 15, fontFamily: 'Acme'}}>
                        Rahul
                    </div>
                    <div style={{color: 'yellow', fontWeight: 'bold', fontSize: 15, fontFamily: 'Acme'}}>
                        [Rahul office]
                    </div>
                </Marker>
                {/*, */}
            </div>
        )
    }

    renderMapBoxCore = () => {
        return (
            <div style={{width: '100%', height: '100%'}}>
                <Map
                    style={'mapbox://styles/mapbox/dark-v9'}
                    containerStyle={{
                        width: '100%',
                        height: '100%',
                    }}
                    movingMethod={'easeTo'}
                    flyToOptions={{
                        speed: 3.5,
                        /*   center: [0, 0],
                           zoom: 45,
                           curve: 3,
                           easing(t) {
                               return t;
                           }*/
                    }}


                    zoom={[this.state.zoom]}
                >
                    {this.state.showOffice && this.renderOfficeLoc()}
                    {this.state.newCloudLetLocationList.map((item, index) => {

                        let listAppName = item.AppNames.split(",")

                        return (
                            <Marker
                                //key={key}
                                //style={styles.marker}
                                coordinates={[item.CloudletLocation.longitude, item.CloudletLocation.latitude]}
                            >
                                <img
                                    src="https://cdn1.iconfinder.com/data/icons/basic-ui-elements-coloricon/21/06_1-512.png" style={{color: 'red'}} height="30" width="25"/>

                                {item.Cloudlet.trim() === 'hamburg-stage' &&
                                <img
                                    src="https://icons.iconarchive.com/icons/google/noto-emoji-food-drink/1024/32382-hamburger-icon.png" style={{color: 'red'}} height="30" width="25"/>
                                }

                                <div style={{color: 'yellow', fontWeight: 'bold', fontSize: 15, fontFamily: 'Acme'}}>
                                    [{item.Cloudlet}]
                                </div>
                                {listAppName.map(AppName => {
                                    return (
                                        <div style={{color: 'white', fontSize: 12, fontFamily: 'Acme'}} onClick={() => {
                                            let dataSet = AppName.trim() + " | " + item.Cloudlet.trim() + " | " + item.ClusterInst.trim()
                                            //showToast(dataSet)
                                            this.props.handleAppInstDropdown(dataSet)
                                        }}>
                                            {AppName}
                                        </div>
                                    )
                                })}
                            </Marker>
                        )
                    })}
                </Map>
                {/* {this.props.appInstLoading &&
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
                }*/}
                <div style={{marginTop: -150}}>
                    <Button id="mapZoomCtl" size='larges' icon onClick={() => {

                        this.setState({
                            isUpdateEnable: true,
                            zoom: 0.8,
                        }, () => {
                            this.setState({
                                isUpdateEnable: false,
                            })
                        })
                    }}>
                        <Icon name="refresh"/>
                    </Button>
                    <Button id="mapZoomCtl" size='large' icon onClick={() => {
                        this.setState({
                            isUpdateEnable: true,
                            zoom: this.state.zoom * 1.5
                        }, () => {
                            this.setState({
                                isUpdateEnable: false,
                            })
                        })
                    }}>
                        <Icon name="plus square outline"/>
                    </Button>
                    <Button id="mapZoomCtl" size='large' icon onClick={() => {
                        this.setState({
                            isUpdateEnable: true,
                            zoom: this.state.zoom * 0.5
                        }, () => {
                            this.setState({
                                isUpdateEnable: false,
                            })
                        })
                    }}>
                        <Icon name="minus square outline"/>
                    </Button>
                    <Button id="mapZoomCtl" size='large' icon onClick={() => {
                        this.setState({
                            isUpdateEnable: true,
                            showOffice: !this.state.showOffice,
                        }, () => {
                            this.setState({
                                isUpdateEnable: false,
                            })
                        })
                    }}>
                        <Icon name="star badge square outline"/>
                    </Button>
                </div>
            </div>
        )
    }


    render() {
        return (
            <div style={{width: '100%', height: '100%'}}>
                {this.renderMapBoxCore()}
            </div>

        );
    }
}

