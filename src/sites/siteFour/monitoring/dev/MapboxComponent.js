import React, {Component} from 'react';
import Ripples from 'react-ripples'
import '../PageMonitoring.css'
import ReactMapboxGl, {Marker, Popup} from 'react-mapbox-gl';
import type {TypeAppInstance} from "../../../../shared/Types";
import {Button, Icon} from "semantic-ui-react";
import {showToast} from "../PageMonitoringCommonService";
import Lottie from "react-lottie";

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

let tokenList = [
    'pk.eyJ1Ijoia3l1bmdqb29uLWdvLWNvbnN1bHRhbnQiLCJhIjoiY2s2Mnk2eHl0MDI5bzNzcGc0MTQ3NTM4NSJ9.BVwP4hu1ySJCJpGyVQBWSQ',
    'pk.eyJ1Ijoia3l1bmdqb29uZ283NyIsImEiOiJjazYyeGhvM2YwamFrM21vZjM0azJrOG9iIn0.P616aVPjYWPrjbVU5bCUHQ',
]

const Map = ReactMapboxGl({
    accessToken: tokenList[getRandomInt(2)],
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
    arrIsShowCloudlet: Array,
    reDrawMap: boolean,
    appInstanceListGroupByCloudlet: Array,
}


export default class MapboxComponent extends Component<Props, State> {


    constructor(props) {
        super(props);
        this.state = {

            zoom: 0.9,//mapZoom
            appInstanceListGroupByCloudlet: '',
            cloudletKeys: [],
            newCloudLetLocationList: [],
            showModal: false,
            showOffice: false,
            isUpdateEnable: false,
            arrIsShowCloudlet: [],
            reDrawMap: 'dummy',

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

    setCloudletLocation(pAppInstanceListGroupByCloudlet) {

        let cloudletKeys = Object.keys(pAppInstanceListGroupByCloudlet)

        let newCloudLetLocationList = []
        cloudletKeys.map((key, index) => {

            let AppNames = ''
            let CloudletLocation = '';
            let Cloudlet = '';
            let ClusterInst = '';
            pAppInstanceListGroupByCloudlet[key].map((innerItem: TypeAppInstance, index) => {

                if (index === (pAppInstanceListGroupByCloudlet[key].length - 1)) {
                    AppNames += innerItem.AppName + " | " + innerItem.ClusterInst;
                } else {
                    AppNames += innerItem.AppName + " | " + innerItem.ClusterInst + " , "
                }


                CloudletLocation = innerItem.CloudletLocation;
                Cloudlet = innerItem.Cloudlet;

            })

            newCloudLetLocationList.push({
                AppNames: AppNames,
                CloudletLocation: CloudletLocation,
                Cloudlet: Cloudlet,
                isShow: false,
                //ClusterInst: ClusterInst,
            })

        })

        let arrIsShowCloudlet = []

        //@todo: cloudletDIV block, hidden
        newCloudLetLocationList.map(item => {
            arrIsShowCloudlet.push(false);
        })


        console.log('arrIsShowCloudlet===>', arrIsShowCloudlet);


        this.setState({
            newCloudLetLocationList: newCloudLetLocationList,
            arrIsShowCloudlet: arrIsShowCloudlet,
            appInstanceListGroupByCloudlet: pAppInstanceListGroupByCloudlet,
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
                {/*, */}
            </div>
        )
    }


    makeid(length) {
        let result = '';
        let characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let charactersLength = characters.length;
        for (var i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }

    render() {
        return (
            <div style={{width: '100%', height: '100%'}}>
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
                        {this.state.newCloudLetLocationList.map((item, outerIndex) => {


                            let listAppName = item.AppNames.split(",")

                            return (
                                <Marker
                                    //key={key}
                                    //style={styles.marker}
                                    onClick={() => {

                                        let newCloudLetLocationList = this.state.newCloudLetLocationList
                                        let toggledOne = !newCloudLetLocationList[outerIndex].isShow;

                                        console.log('zoom===>', this.state.zoom);


                                        newCloudLetLocationList[outerIndex].isShow = toggledOne;
                                        this.setState({
                                            isUpdateEnable: true,
                                            newCloudLetLocationList: newCloudLetLocationList,
                                        }, () => {
                                            console.log('newCloudLetLocationList===>', this.state.newCloudLetLocationList);

                                        })


                                    }}
                                    coordinates={[item.CloudletLocation.longitude, item.CloudletLocation.latitude]}
                                >
                                    {/*@todo:green_marker*/}
                                    <img src={'https://cdn1.iconfinder.com/data/icons/basic-ui-elements-coloricon/21/06_1-512.png'} style={{color: 'red'}} height="30" width="25"/>
                                    {item.Cloudlet.trim() === 'hamburg-stage' &&
                                    <img
                                        src="https://icons.iconarchive.com/icons/google/noto-emoji-food-drink/1024/32382-hamburger-icon.png" style={{color: 'red'}} height="30"
                                        width="25"/>
                                    }

                                    <div style={{color: 'yellow', fontWeight: 'bold', fontSize: 14,}}>
                                        [{item.Cloudlet}]
                                    </div>

                                    <div style={{display: item.isShow ? 'block' : 'none'}}>


                                        {listAppName.map(AppName_ClusterInst => {

                                            let AppName = AppName_ClusterInst.trim().split(" | ")[0].trim()
                                            let ClusterInst = AppName_ClusterInst.trim().split(" | ")[1].trim()


                                            return (

                                                <div style={{
                                                    color: 'white', fontSize: 12, fontFamily: 'Righteous', cursor: 'crosshair',
                                                    flexDirection: 'column',
                                                }}
                                                >
                                                    <Ripples
                                                        style={{}}
                                                        color='#77BD25' during={500}
                                                        onClick={() => {

                                                            let arrayTemp = AppName_ClusterInst.split(" | ");

                                                            let Cluster = arrayTemp[1].trim();
                                                            let AppInst = arrayTemp[0].trim()
                                                            let dataSet = AppInst + " | " + item.Cloudlet.trim() + " | " + Cluster
                                                            //showToast(dataSet)
                                                            this.props.handleAppInstDropdown(dataSet)
                                                        }}
                                                    >
                                                        {AppName}
                                                        <div style={{color: '#77BD25', fontFamily: 'Acme', fontSize: 12}}>
                                                            &nbsp;&nbsp;{` [${ClusterInst.trim()}]`}
                                                        </div>
                                                        <div>
                                                            {this.state.newCloudLetLocationList[outerIndex].isShow.toString()}
                                                        </div>

                                                    </Ripples>
                                                </div>


                                            )
                                        })}
                                    </div>
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
            </div>

        );
    }
}

