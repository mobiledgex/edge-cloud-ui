// @flow
import React, {useEffect, useState} from 'react';
import {Button, Modal as AModal, Tabs} from "antd";
import '../PageMonitoring.css'
import ReactGlobe from "react-globe";
import type {TypeAppInstance, TypeCloudletMarker} from "../../../../shared/Types";
import {isEmpty, showToast} from "../PageMonitoringCommonService";
import {Right} from "../PageMonitoringStyledComponent";

const {TabPane} = Tabs;
const FA = require('react-fontawesome')
type Props = {
    appInstanceListGroupByCloudlet: any,
};

export default function GlobePopupContainer(props) {

    const [cloudletLocationList, setCloudletLocationList] = useState([])
    const [currentGlobeTheme, setCurrentGlobeTheme] = useState('default')
    const [markerList, setMarkerList] = useState([])
    const [animationSequence, setAnimationSequence] = useState()
    const [initialCoordinates, setInitialCoordinates] = useState([0, 30])
    const [globeTyle, setGlobeTyle] = useState('https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/globe.jpg')
    const [cloudletIndex, setCloudletIndex] = useState(0)


    useEffect(() => {
        let appInstanceListOnCloudlet = props.appInstanceListGroupByCloudlet
        if (!isEmpty(appInstanceListOnCloudlet)) {
            makeAppInstLocation(appInstanceListOnCloudlet)
        } else {
            setMarkerList([]);
            setCloudletLocationList([])
            setCloudletIndex(0)
        }


    }, [props.appInstanceListGroupByCloudlet, props.isOpenGlobe, initialCoordinates])

    function makeAppInstLocation(appInstListOnCloudlet) {
        let cloudletKeys = Object.keys(appInstListOnCloudlet)

        let newCloudLetLocationList = []
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

            newCloudLetLocationList.push({
                AppNames: AppNames,
                CloudletLocation: CloudletLocation,
                Cloudlet: Cloudlet,
                isShow: false,
                isShowCircle: false,
                //ClusterInst: ClusterInst,
            })


        })


        setMarkerList(markerList);
        setCloudletLocationList(newCloudLetLocationList);

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
                    /*renderer: marker => {
                        const {color, id, value} = marker
                        const scaledSize = value / 3
                        const geometry = new EdgesGeometry(10, 10, scaledSize)
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

    const makeCloudletLocationDivOne = () => (
        cloudletLocationList.map((item: TypeCloudletMarker, index) => {
            let AppList = item.AppNames.split(",");
            return (
                <React.Fragment>
                    <div
                        style={{
                            backgroundColor: makeBackgroundOnCloudletDiv(cloudletIndex, index),
                            padding: 10,
                            borderRadius: 10,
                            height: 'auto'
                        }}
                        onClick={() => {
                            //setInitialCoordinates([item.CloudletLocation.latitude, item.CloudletLocation.longitude])
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

                        }}>
                        <div style={{display: 'flex'}}>
                            <div style={{cursor: 'pointer', fontWeight: 'bold', fontFamily: 'ubuntu', fontSize: 18}}>
                                {item.Cloudlet}
                            </div>
                        </div>
                        <div style={{marginLeft: 25}}>
                            {AppList.map((AppInstOne, index) => {
                                return (
                                    <div onClick={() => {
                                        showToast(AppInstOne, 5)
                                    }} style={{color: 'yellow', fontFamily: 'ubuntu', cursor: 'pointer'}}>
                                        -{AppInstOne.toString().split("|")[0].trim()}
                                    </div>
                                )
                            })}

                        </div>
                    </div>
                </React.Fragment>
            )
        })
    )

    const renderTopButtons = () => (
        <Right>
            <div style={{display: 'flex'}}>
                <div style={{width: 10}}/>
                <Button
                    //type={currentGlobeTheme ==='default' }
                    onClick={() => {
                        setCurrentGlobeTheme('default')
                        setGlobeTyle('https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/globe.jpg')
                    }}
                >
                    default
                </Button>
                <div style={{width: 10}}/>
                <Button
                    color={'primary'}
                    onClick={() => {
                        setCurrentGlobeTheme('dark')
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
                    <div style={{display: 'flex', width: '100%',}}>
                        {renderPrevBtn2()}
                        <div className='page_monitoring_popup_title'>
                            Deployed Instance On Globe
                        </div>
                    </div>
                    <div style={{
                        flex: 1,
                        height: '86vh',
                        width: '97vw',
                        marginTop: 10,
                    }}>
                        {renderGlobe()}
                        <div style={{position: 'absolute', right: 40, top: 80,}}>
                            {renderTopButtons()}
                            <div style={{height: 10}}/>
                            {makeCloudletLocationDivOne()}
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
