import React, {useEffect, useState} from 'react';
import '../common/PageMonitoringStyles.css'
import {Progress} from "antd";
import {Center} from "../common/PageMonitoringStyles";
import {CLASSIFICATION} from "../../../../shared/Constants";
import {changeClassficationTxt} from "../service/PageDevOperMonitoringService";

export default function DonutChartHooks(props) {
    const [count, setCount] = useState(-1);
    const [usageOne: any, setUsageOne] = useState(-1);
    const hwMarginTop = 15;
    const hwFontSize = 15;

    useEffect(() => {

        console.log(`filteredUsageList===>`, props.filteredUsageList);
        if (props.filteredUsageList !== undefined && props.filteredUsageList.length === 1) {
            setCount(props.filteredUsageList.length)
            setUsageOne(props.filteredUsageList[0])
        } else {
            setCount(-1);
        }

    }, [props.filteredUsageList]);

    const height = 200;


    return (
        <div>
            <div style={{
                display: 'flex',
                width: '100%',
                height: 45
            }}>
                <div className='page_monitoring_title draggable'
                     style={{
                         flex: 1,
                         marginTop: 10,
                         color: 'white'
                     }}
                >
                    Resource of {changeClassficationTxt(props.currentClassification)}
                </div>

            </div>
            <div style={{backgroundColor: 'transparent', height: '100%'}}>
                {count === 1 && props.currentClassification === CLASSIFICATION.CLOUDLET ?
                    <Center style={{height: height,}}>
                        <div>
                            <Progress
                                strokeColor={'red'}
                                type="circle"
                                width={100}
                                trailColor='#262626'
                                style={{fontSize: 10}}
                                percent={usageOne.usedVCpuCount / usageOne.maxVCpuCount * 100}
                                strokeWidth={10}
                                format={(percent, successPercent) => {
                                    return usageOne.usedVCpuCount + "/" + usageOne.maxVCpuCount;
                                }}
                            />
                            <div style={{marginTop: hwMarginTop, fontSize: hwFontSize}}>
                                vCPU
                            </div>
                        </div>
                        <div style={{width: 15}}/>
                        <div>
                            <Progress
                                strokeColor='blue'
                                type="circle"
                                width={100}
                                trailColor='#262626'
                                percent={Math.round(usageOne.usedMemUsage / usageOne.maxMemUsage * 100)}
                                strokeWidth={10}
                            />
                            <div style={{marginTop: hwMarginTop, fontSize: hwFontSize}}>
                                MEM
                            </div>
                        </div>
                        <div style={{width: 15}}/>
                        <div>
                            <Progress
                                strokeColor='green'
                                type="circle"
                                width={100}
                                trailColor='#262626'
                                percent={Math.ceil((usageOne.usedDiskUsage / usageOne.maxDiskUsage) * 100)}
                                strokeWidth={10}
                                format={(percent, successPercent) => {
                                    return usageOne.usedDiskUsage + "/" + usageOne.maxDiskUsage;
                                }}
                            />
                            <div style={{marginTop: hwMarginTop, fontSize: hwFontSize}}>
                                DISK
                            </div>
                        </div>
                    </Center>
                    : count === 1 && props.currentClassification === CLASSIFICATION.CLUSTER_FOR_OPER ? //@DESC: CLUSTER LEVEL FOR OPER
                        <Center style={{height: height,}}>
                            <div>
                                <Progress
                                    strokeColor={props.chartColorList[0]}
                                    type="circle"
                                    width={100}
                                    trailColor='#262626'
                                    style={{fontSize: 10}}
                                    percent={Math.round(usageOne.sumCpuUsage)}
                                    strokeWidth={10}

                                />
                                <div style={{marginTop: hwMarginTop, fontSize: hwFontSize}}>
                                    CPU
                                </div>
                            </div>
                            <div style={{width: 15}}/>
                            <div>
                                <Progress
                                    strokeColor={props.chartColorList[1]}
                                    type="circle"
                                    width={100}
                                    trailColor='#262626'
                                    percent={Math.round(usageOne.sumMemUsage)}
                                    strokeWidth={10}
                                />
                                <div style={{marginTop: hwMarginTop, fontSize: hwFontSize}}>
                                    MEM
                                </div>
                            </div>
                            <div style={{width: 15}}/>
                            <div>
                                <Progress
                                    strokeColor={props.chartColorList[2]}
                                    type="circle"
                                    width={100}
                                    trailColor='#262626'
                                    percent={Math.round(usageOne.sumDiskUsage)}
                                    strokeWidth={10}
                                />
                                <div style={{marginTop: hwMarginTop, fontSize: hwFontSize}}>
                                    DISK
                                </div>
                            </div>
                        </Center>
                        :
                        <Center style={{
                            fontSize: 22,
                            backgroundColor: 'rgba(157,255,255,.02)',
                            height: height,
                            flexDirection: 'column'
                        }}>
                            <div>
                                <div>
                                    No Available
                                </div>
                                <div style={{fontSize: 12}}>
                                    (It is shown only in one
                                    specific {changeClassficationTxt(props.currentClassification)})
                                </div>
                            </div>


                        </Center>
                }


            </div>
        </div>
    )

}
