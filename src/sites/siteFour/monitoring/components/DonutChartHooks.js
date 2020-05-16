import React, {useEffect, useState} from 'react';
import '../common/MonitoringStyles.css'
import "./CarbonChart.css";
import {Progress} from "antd";
import {Center, Center0001} from "../common/MonitoringStyles";
import type {TypeCloudletUsage} from "../../../../shared/Types";

export default function DonutChartHooks(props) {
    const [cloudletCount, setCloudletCount] = useState(-1);
    const [cloudletUsageOne: TypeCloudletUsage, setCloudletUsageOne] = useState(-1);

    useEffect(() => {
        if (props.filteredCloudletUsageList !== undefined && props.filteredCloudletUsageList.length === 1) {
            setCloudletCount(props.filteredCloudletUsageList.length)
            setCloudletUsageOne(props.filteredCloudletUsageList[0])
        } else {
            setCloudletCount(-1);
        }

    }, [props.filteredCloudletUsageList]);

    const height=150;

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
                   Resource of Cloudlet
                </div>

            </div>
            <div style={{backgroundColor: 'transparent', height: '100%'}}>
                {cloudletCount === 1 ?
                    <Center style={{height: height,}}>
                        <div>
                            <Progress
                                strokeColor={'red'}
                                type="circle"
                                width={100}
                                trailColor='#262626'
                                style={{fontSize: 10}}
                                percent={cloudletUsageOne.usedVCpuCount / cloudletUsageOne.maxVCpuCount * 100}
                                strokeWidth={10}
                                format={(percent, successPercent) => {

                                    console.log(`format==1==>`, percent);
                                    console.log(`format==2==>`, successPercent);
                                    return cloudletUsageOne.usedVCpuCount + "/" + cloudletUsageOne.maxVCpuCount;
                                }}
                            />
                            <div style={{marginTop: 5}}>
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
                                percent={Math.ceil(cloudletUsageOne.usedMemUsage / cloudletUsageOne.maxMemUsage * 100)}
                                strokeWidth={10}
                            />
                            <div style={{marginTop: 5}}>
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
                                percent={Math.ceil((cloudletUsageOne.usedDiskUsage / cloudletUsageOne.maxDiskUsage) * 100)}
                                strokeWidth={10}
                                format={(percent, successPercent) => {

                                    console.log(`format==1==>`, percent);
                                    console.log(`format==2==>`, successPercent);
                                    return cloudletUsageOne.usedDiskUsage + "/" + cloudletUsageOne.maxDiskUsage;
                                }}
                            />
                            <div style={{marginTop: 5}}>
                                DISK
                            </div>
                        </div>
                    </Center>
                    :
                    <Center style={{
                        fontSize: 22,
                        backgroundColor: 'rgba(157,255,255,.02)',
                        height: height
                    }}>
                        no available
                    </Center>
                }


            </div>
        </div>
    )

}
