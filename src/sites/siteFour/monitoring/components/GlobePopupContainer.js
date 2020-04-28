// @flow
import Ripples from "react-ripples";
import React, {useEffect, useState} from 'react';
import {Button, Modal as AModal, Tabs} from "antd";
import '../PageMonitoring.css'
import ReactGlobe from "react-globe";
import type {TypeAppInstance, TypeCloudletMarker} from "../../../../shared/Types";
import {isEmpty} from "../PageMonitoringCommonService";
import {BoxGeometry, Mesh, MeshLambertMaterial, SphereGeometry, EdgesGeometry} from "three";

const {TabPane} = Tabs;
const FA = require('react-fontawesome')
type Props = {
    appInstanceListGroupByCloudlet: any,
};

export default function GlobePopupContainer(props) {

    const [cloudletLocationList, setCloudletLocationList] = useState([])
    //marketList
    const [markerList, setMarkerList] = useState([])
    const [animationSequence, setAnimationSequence] = useState()
    const [initialCoordinates, setInitialCoordinates] = useState([0, 30])

    const [tyle, setTyle] = useState('https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/globe.jpg')

    const [cloudletIndex, setCloudletIndex] = useState(0)

    useEffect(() => {
        console.log(`appInstanceListGroupByCloudlet====>`, props.appInstanceListGroupByCloudlet);

        let appInstanceListOnCloudlet = props.appInstanceListGroupByCloudlet

        if (!isEmpty(appInstanceListOnCloudlet)) {
            makeAppInstLocation(appInstanceListOnCloudlet)
        } else {
            setMarkerList([]);
            setCloudletLocationList([])
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
                    texture: tyle,
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
                            `${AppNames.toString()} `
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
                            Deployed App Instance On Globe
                        </div>
                    </div>
                    <div style={{
                        flex: 1,
                        height: '86vh',
                        width: '97vw',
                        marginTop: 10,
                    }}>
                        {renderGlobe()}
                        <div style={{position: 'absolute', right: 100, top: 100,}}>
                            <div style={{display: 'flex'}}>

                                <div style={{width: 10}}/>
                                <Button
                                    onClick={() => {
                                        setTyle('https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/globe.jpg')
                                    }}
                                >
                                    light
                                </Button>
                                <div style={{width: 10}}/>
                                <Button
                                    color={'primary'}
                                    onClick={() => {
                                        setTyle('https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/globe_dark.jpg')
                                    }}
                                >
                                    dark
                                </Button>
                            </div>
                            <div style={{color: '#77BD25', fontWeight: 'bold', fontSize: 30,}}>
                                {cloudletLocationList.length.toString()} Cloudlets
                            </div>
                            <br/>
                            <br/>
                            <br/>
                            {cloudletLocationList.map((item: TypeCloudletMarker, index) => {

                                let AppList = item.AppNames.split(",");

                                return (
                                    <React.Fragment>
                                        <div
                                            style={{backgroundColor: cloudletIndex === index ? 'rgba(150,111,0,.5)' : null}}
                                            onClick={() => {
                                                //setInitialCoordinates([item.CloudletLocation.latitude, item.CloudletLocation.longitude])

                                                setCloudletIndex(index);

                                                setAnimationSequence(
                                                    [
                                                        {
                                                            animationDuration: 750,
                                                            coordinates: [item.CloudletLocation.latitude, item.CloudletLocation.longitude],
                                                            distanceRadiusScale: 2,
                                                            //easingFunction: ['Linear', 'None'],
                                                            easingFunction: ['Elastic', 'In'],
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
                                                {AppList.map((item2, index) => {
                                                    return (
                                                        <div style={{color: 'yellow', fontFamily: 'ubuntu'}}>
                                                            -{item2.toString().split("|")[0]}
                                                        </div>
                                                    )
                                                })}

                                            </div>
                                        </div>
                                        <br/>
                                        <br/>
                                    </React.Fragment>

                                )
                            })}

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
