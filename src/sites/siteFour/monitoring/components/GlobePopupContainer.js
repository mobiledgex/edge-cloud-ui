// @flow
import React, {useEffect, useState} from 'react';
import {Modal as AModal, Tabs} from "antd";
import '../PageMonitoring.css'
import ReactGlobe from "react-globe";
import type {TypeAppInstance, TypeCloudletMarker} from "../../../../shared/Types";

const {TabPane} = Tabs;
const FA = require('react-fontawesome')
type Props = {
    appInstanceListGroupByCloudlet: any,
};

export default function GlobePopupContainer(props) {

    const [cloudletLocationList, setCloudletLocationList] = useState([])
    //marketList
    const [markerList, setMarkerList] = useState([])

    useEffect(() => {
        console.log(`appInstanceListGroupByCloudlet====>`, props.appInstanceListGroupByCloudlet);

        let appInstanceListOnCloudlet = props.appInstanceListGroupByCloudlet

        makeAppInstLocation(appInstanceListOnCloudlet)

    }, [props.appInstanceListGroupByCloudlet, props.isOpenGlobe])

    function makeAppInstLocation(pAppInstanceListGroupByCloudlet) {
        let cloudletKeys = Object.keys(pAppInstanceListGroupByCloudlet)

        let newCloudLetLocationList = []
        let markerList = []

        ///////////////////
        cloudletKeys.map((key, outerIndex) => {

            let AppNames = ''
            let CloudletLocation = '';
            let Cloudlet = '';
            let ClusterInst = '';
            pAppInstanceListGroupByCloudlet[key].map((innerItem: TypeAppInstance, index) => {


                if (index === (pAppInstanceListGroupByCloudlet[key].length - 1)) {
                    AppNames += innerItem.AppName + " | " + innerItem.ClusterInst + " | " + innerItem.Region + " | " + innerItem.HealthCheck + " | " + innerItem.Version + " | " + innerItem.Operator
                } else {
                    AppNames += innerItem.AppName + " | " + innerItem.ClusterInst + " | " + innerItem.Region + " | " + innerItem.HealthCheck + " | " + innerItem.Version + " | " + innerItem.Operator + " , "
                }

                CloudletLocation = innerItem.CloudletLocation;
                Cloudlet = innerItem.Cloudlet;

            })


            markerList.push({
                id: outerIndex,
                Cloudlet: Cloudlet,
                AppNames: AppNames,
                color: 'gold',
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

        console.log(`newCloudLetLocationList====>`, newCloudLetLocationList);

        setCloudletLocationList(newCloudLetLocationList);
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
                        <ReactGlobe
                            markers={markerList}
                            //markerOptions={{renderer: markerRenderer}}
                            markerOptions={{
                                activeScale: 1.1,
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
                                        `${AppNames.toString()} \n (${marker.Cloudlet}) `
                                    )

                                },
                                radiusScaleRange: [0.01, 0.05],
                            }}
                        />
                        <div style={{position: 'absolute', right: 100, top: 100,}}>
                            <div style={{color: 'blue', fontWeight: 'bold', fontSize: 30,}}>
                                {cloudletLocationList.length.toString()}
                            </div>
                            {cloudletLocationList.map((item: TypeCloudletMarker, index) => {

                                let AppList = item.AppNames.split(",");

                                return (
                                    <React.Fragment>
                                        <div style={{display: 'flex'}}>
                                            <div>
                                                {item.Cloudlet}
                                            </div>
                                            <div style={{display: 'flex'}}>
                                                <div>
                                                    [{item.CloudletLocation.latitude},
                                                </div>
                                                <div>
                                                    {item.CloudletLocation.longitude}]
                                                </div>
                                            </div>

                                        </div>
                                        <div>
                                            {AppList.map(item2 => {
                                                return (
                                                    <div style={{color: 'red'}}>
                                                        {item2.toString()}
                                                    </div>
                                                )
                                            })}

                                        </div>
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
/*globeOptions={{
    texture:
        'https://raw.githubusercontent.com/chrisrzhou/react-globe/master/textures/globe_dark.jpg',
}}*/