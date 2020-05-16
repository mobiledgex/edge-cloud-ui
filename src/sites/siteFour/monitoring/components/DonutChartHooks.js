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
        console.log(`filteredCloudletUsageList====>`, props.filteredCloudletUsageList);

        console.log(`filteredCloudletUsageList====length>`, props.filteredCloudletUsageList.length);

        if (props.filteredCloudletUsageList !== undefined && props.filteredCloudletUsageList.length === 1) {
            setCloudletCount(props.filteredCloudletUsageList.length)
            setCloudletUsageOne(props.filteredCloudletUsageList[0])
        } else {
            setCloudletCount(-1);
        }

    }, [props.filteredCloudletUsageList]);
    return (
        <>
            <div style={{backgroundColor: 'transparent'}}>
                {cloudletCount === 1 ?
                    <Center style={{height: 250,}}>

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
                            <div>
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
                            <div>
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
                                percent={Math.ceil(cloudletUsageOne.usedDiskUsage / cloudletUsageOne.maxDiskUsage * 100)}
                                strokeWidth={10}
                            />
                            <div>
                                DISK
                            </div>
                        </div>
                    </Center>
                    :
                    <Center style={{marginTop: 50, fontSize: 22}}>
                        no available
                    </Center>
                }


            </div>
        </>
    )

}
