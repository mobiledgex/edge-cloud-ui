// @flow
import React, {useEffect, useState} from 'react';
import {Button, Modal as AModal} from "antd";
import '../PageMonitoring.css'
import ReactGlobe from "react-globe";
import type {TypeAppInstance, TypeCloudletMarker} from "../../../../shared/Types";
import {renderWifiLoader, showToast} from "../PageMonitoringCommonService";
import {Left, Right} from "../PageMonitoringStyledComponent";
import {GLOBE_THEME} from "../../../../shared/Constants";
import {requestShowAppInstClientWS} from "../PageMonitoringMetricService";
import PageDevMonitoring from "../dev/PageDevMonitoring";
import _ from 'lodash'

const FA = require('react-fontawesome')
type Props = {
    appInstanceListGroupByCloudlet: any,
    clientLocationListOnAppInst: any,
    parent: PageDevMonitoring

};

export default function GlobePopupContainer(props) {

    const [cloudletLocationList, setCloudletLocationList] = useState([])
    const [currentGlobeTheme, setCurrentGlobeTheme] = useState(GLOBE_THEME.DEFAULT)
    const [markerList, setMarkerList] = useState([])

    const [currentLevel, setCurrentLevel] = useState('cluster')

    const [animationSequence, setAnimationSequence] = useState()
    const [initialCoordinates, setInitialCoordinates] = useState([0, 30])
    const [globeTyle, setGlobeTyle] = useState('https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/globe.jpg')
    const [cloudletIndex, setCloudletIndex] = useState(0)


    useEffect(() => {

        if (!_.isEmpty(props.appInstanceListGroupByCloudlet)) {
            makeAppInstLocation(props.appInstanceListGroupByCloudlet)
        } else {
            setMarkerList([]);
            setCloudletLocationList([])
            setCloudletIndex(0)
        }

    }, [props.appInstanceListGroupByCloudlet, props.isOpenGlobe])

    useEffect(() => {
        if (!_.isEmpty(props.clientLocationListOnAppInst)) {
            console.log(`clientLocationListOnAppInst====>`, props.clientLocationListOnAppInst)
            makeClientLocation(props.clientLocationListOnAppInst)
        } else {
            setMarkerList([]);
        }
    }, [props.clientLocationListOnAppInst])

    function makeClientLocation(clientLocationList) {
        setMarkerList([])
        console.log(`appInstListOnCloudlet333..2222====>`, clientLocationList);

        let tempMarketList = []
        for (let index in clientLocationList) {
            tempMarketList.push({
                id: index,
                uuid: clientLocationList[index].uuid,
                Cloudlet: clientLocationList[index].uuid,
                AppNames: clientLocationList[index].uuid,
                color: 'green',
                coordinates: [clientLocationList[index].latitude, clientLocationList[index].longitude],
                value: 50,
            })

        }

        console.log(`markerList====>`, tempMarketList);

        if (tempMarketList.length === 0) {
            showToast('no client on that appInst')
        }

        setMarkerList(tempMarketList)

        setAnimationSequence(
            [
                {
                    animationDuration: 1500,
                    coordinates: tempMarketList[0].coordinates,
                    distanceRadiusScale: 4,
                    easingFunction: ['Linear', 'None'],
                },
            ]
        )

    }


    function makeAppInstLocation(appInstListOnCloudlet) {
        let cloudletKeys = Object.keys(appInstListOnCloudlet)

        let _cloudletLocationList = []
        let markerList = []

        ///////////////////
        let firstCloudletnLocation = [];
        cloudletKeys.map((key, outerIndex) => {

            let AppNames = ''
            let CloudletLocation = '';
            let Cloudlet = '';
            let ClusterInst = '';
            appInstListOnCloudlet[key].map((appInstOne: TypeAppInstance, index) => {

                if (index === (appInstListOnCloudlet[key].length - 1)) {
                    AppNames += appInstOne.AppName + " | " + appInstOne.ClusterInst + " | " + appInstOne.Region + " | " + appInstOne.HealthCheck + " | " + appInstOne.Version + " | " + appInstOne.Operator
                } else {
                    AppNames += appInstOne.AppName + " | " + appInstOne.ClusterInst + " | " + appInstOne.Region + " | " + appInstOne.HealthCheck + " | " + appInstOne.Version + " | " + appInstOne.Operator + " , "
                }

                CloudletLocation = appInstOne.CloudletLocation;
                Cloudlet = appInstOne.Cloudlet;

            })

            if (outerIndex === 0) {
                firstCloudletnLocation = [CloudletLocation.latitude, CloudletLocation.longitude]
            }


            markerList.push({
                id: outerIndex,
                Cloudlet: Cloudlet,
                AppNames: AppNames,
                color: 'orange',
                coordinates: [CloudletLocation.latitude, CloudletLocation.longitude],
                value: 50,
            })

            _cloudletLocationList.push({
                AppNames: AppNames,
                CloudletLocation: CloudletLocation,
                Cloudlet: Cloudlet,
                isShow: false,
                isShowCircle: false,
                //ClusterInst: ClusterInst,
            })


        })


        setMarkerList(markerList);
        setCloudletLocationList(_cloudletLocationList);

        setAnimationSequence(
            [
                {
                    animationDuration: 1500,
                    coordinates: firstCloudletnLocation,
                    distanceRadiusScale: 4,
                    easingFunction: ['Linear', 'None'],
                },
            ]
        )
    }


    function closePopupWindow() {
        props.parent.setState({
            isOpenGlobe: false,
        })
    }

    function renderPrevBtn2() {
        return (
            <div style={{
                flex: .025,
                backgroundColor: 'transparent',
                width: 120,
                display: 'flex',
                alignSelf: 'center',
                justifyContent: 'center'
            }} onClick={() => {
                closePopupWindow();
            }}>
                {/*<ArrowBack  style={{fontSize: 30, color: 'white'}} color={'white'}/>*/}
                <FA name="arrow-circle-left" style={{fontSize: 40, color: 'white'}}/>

            </div>
        )
    }

    function renderGlobe() {
        return (
            /*@todo:ReactGlobe*/
            /*@todo:ReactGlobe*/
            /*@todo:ReactGlobe*/
            /*@todo:ReactGlobe*/
            /*@todo:ReactGlobe*/
            <ReactGlobe
                globeOptions={{
                    texture: globeTyle,
                }}
                animations={animationSequence}
                //initialCoordinates={initialCoordinates}
                markers={markerList}
                /*  lightOptions={{
                      ambientLightColor: '#77BD25',
                      ambientLightIntensity: 1,
                  }}*/
                markerOptions={{
                    activeScale: 1.1,
                    //cloudsOpacity: 0.8,
                    enableClouds: false,
                    enableTooltip: true,
                    enterAnimationDuration: 3000,
                    enterEasingFunction: ['Bounce', 'InOut'],
                    exitAnimationDuration: 3000,
                    exitEasingFunction: ['Cubic', 'Out'],
                    getTooltipContent: marker => {

                        let AppNameList = marker.AppNames.split(",")

                        let AppNames = []
                        AppNameList.map(item => {
                            AppNames.push(item.split("|")[0])
                        })

                        return (
                            `<p style="font-size: 17pt; font-weight: bold; font-family: Ubuntu">${marker.Cloudlet.toString()}</p> <p style="color: yellow">${AppNames.toString()}</p> `
                        )

                    },
                    radiusScaleRange: [0.01, 0.05],
                    /* renderer: marker => {
                         const {color, id, value} = marker
                         const scaledSize = value / 3
                         const geometry = new SphereGeometry(10, 10, scaledSize)
                         //: new SphereGeometry(scaledSize, 10, 10)
                         const material = new MeshLambertMaterial({
                             color: new Color(color),
                         })
                         return new Mesh(geometry, material)
                     },*/
                }}
            />
        )
    }

    function makeBackgroundOnCloudletDiv(cloudletIndex, index) {
        if (cloudletIndex === index) {
            return 'rgba(128,128,128,.3)'
        } else {
            return null;
        }
    }

    const handleClickedCloudlet = (index, item) => {
        makeAppInstLocation(props.appInstanceListGroupByCloudlet)
        setCloudletIndex(index);
        setAnimationSequence(
            [
                {
                    animationDuration: 1000,
                    coordinates: [item.CloudletLocation.latitude, item.CloudletLocation.longitude],
                    distanceRadiusScale: 2,
                    easingFunction: ['Linear', 'None'],
                    //easingFunction: ['Elastic', 'In'],
                    //easingFunction: ['Exponential', 'In']
                },
            ]
        )
    }

    let websocketInstance = null;

    function handleClickedAppInst(AppInstOne) {

        setCurrentLevel('client')
        showToast(AppInstOne.split("|")[0], 5)
        try {
            websocketInstance = requestShowAppInstClientWS(AppInstOne.toString(), props.parent)
        } catch (e) {
            alert(e)
        }
    }

    const makeCloudletLocationDivOne = () => {
        return cloudletLocationList.map((outerItem: TypeCloudletMarker, index) => {
            let AppList = outerItem.AppNames.split(",");


            return (
                <React.Fragment>
                    <div
                        style={{
                            backgroundColor: makeBackgroundOnCloudletDiv(cloudletIndex, index),
                            padding: 10,
                            borderRadius: 10,
                            height: 'auto',
                            cursor: 'pointer',
                        }}
                        onClick={() => handleClickedCloudlet(index, outerItem)}>
                        <div style={{display: 'flex'}}>
                            <div style={{cursor: 'pointer', fontWeight: 'bold', fontFamily: 'ubuntu', fontSize: 18}}>
                                {outerItem.Cloudlet}
                            </div>
                        </div>
                        <div style={{marginLeft: 25, cursor: 'pointer !important'}}>
                            {AppList.map((AppInstOne, index) => {

                                let AppName = AppInstOne.trim().split(" | ")[0].trim()
                                let ClusterInst = AppInstOne.trim().split(" | ")[1].trim()
                                let Region = AppInstOne.trim().split(" | ")[2].trim()
                                let HealthCheck = AppInstOne.trim().split(" | ")[3].trim()
                                let Version = AppInstOne.trim().split(" | ")[4].trim()
                                let Operator = AppInstOne.trim().split(" | ")[5].trim()
                                let lat = outerItem.CloudletLocation.latitude;
                                let long = outerItem.CloudletLocation.longitude;

                                let serverLocation = {
                                    lat,
                                    long,
                                }

                                let fullAppInstOne = AppName + " | " + outerItem.Cloudlet.trim() + " | " + ClusterInst + " | " + Region + " | " + HealthCheck + " | " + Version + " | " + Operator + " | " + JSON.stringify(serverLocation);

                                return (
                                    <div onClick={() => handleClickedAppInst(fullAppInstOne)} style={{color: 'yellow', fontFamily: 'ubuntu', cursor: 'crosshair !important'}}>
                                        -{AppInstOne.toString().split("|")[0].trim()}
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                </React.Fragment>
            )
        })
    }


    const renderTopButtons = () => (
        <Right>
            <div style={{display: 'flex'}}>
                <div style={{width: 10}}/>
                <Button
                    type={currentGlobeTheme === GLOBE_THEME.DEFAULT ? 'primary' : null}
                    onClick={() => {
                        setCurrentGlobeTheme(GLOBE_THEME.DEFAULT)
                        setGlobeTyle('https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/globe.jpg')
                    }}
                >
                    default
                </Button>
                <div style={{width: 10}}/>
                <Button
                    type={currentGlobeTheme === GLOBE_THEME.DARK ? 'primary' : null}
                    color={'primary'}
                    onClick={() => {
                        setCurrentGlobeTheme(GLOBE_THEME.DARK)
                        setGlobeTyle('https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/globe_dark.jpg')
                    }}
                >
                    dark
                </Button>
            </div>
            <div style={{height: 10}}/>
            {/*
            <div style={{color: 'maroon', fontWeight: 'bold', fontSize: 12, fontFamily: 'Black Ops One'}}>
                {cloudletLocationList.length.toString()} Cloudlets
            </div>
            */}
        </Right>
    )


    return (
        <div style={{flex: 1, display: 'flex'}}>
            <AModal
                mask={false}
                visible={props.isOpenGlobe}
                onOk={() => {
                    closePopupWindow();
                }}
                //maskClosable={true}
                onCancel={() => {
                    closePopupWindow();

                }}
                closable={false}
                bodyStyle={{
                    height: window.innerHeight * 0.95,
                    marginTop: 0,
                    marginLeft: 0,
                    backgroundColor: 'rgb(41, 44, 51)'
                }}
                width={'100%'}
                style={{padding: '10px', top: 0, minWidth: 1200}}
                footer={null}
            >
                <div style={{width: '100%'}}>
                    <div style={{display: 'flex', width: '100%', height: 50, backgroundColor: 'transparent'}}>
                        {renderPrevBtn2()}
                        <Left className={'page_monitoring_popup_title'} style={{flex: .2}}>
                            Deployed Instance On Globe
                        </Left>
                        <Left style={{backgroundColor: 'transparent', flex: .8, height: 50,}}>
                            {props.parent.state.loading && renderWifiLoader(50, 50, 7)}
                        </Left>
                    </div>
                    <div style={{
                        flex: 1,
                        height: '86vh',
                        width: '97vw',
                        marginTop: 10,
                    }}>
                        {renderGlobe()}
                        <div style={{position: 'absolute', right: 40, top: 100,}}>
                            {renderTopButtons()}
                            <div style={{height: 10}}/>
                            {makeCloudletLocationDivOne()}
                        </div>

                        <div style={{position: 'absolute', left: 40, top: 80,}}>
                            <div style={{height: 10}}/>
                            Client List on Current AppInst
                            <div>
                                {markerList.map((item, index) => {
                                    return (
                                        <div style={{display: 'flex'}}>

                                            {item.uuid !== undefined &&
                                            <div style={{display: 'flex'}}>
                                                <div>
                                                    {item.id}
                                                </div>
                                                <div style={{color: 'maroon', fontWeight: 'bold', marginLeft: 20,}}>
                                                    {item.uuid.toString()}
                                                </div>
                                            </div>
                                            }
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>
                </div>


            </AModal>

        </div>
    )
};


/* lightOptions={{
                            pointLightColor: 'green',
                            pointLightIntensity: 4,
                            pointLightPositionRadiusScales: [2, 1, -1],
                        }}*/
/**/
