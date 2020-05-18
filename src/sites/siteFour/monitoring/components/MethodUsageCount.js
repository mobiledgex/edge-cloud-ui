import React, {useEffect, useState} from 'react';
import '../common/PageMonitoringStyles.css'
import {Center, CenterMethodCount} from "../common/PageMonitoringStyles";
import type {TypeClientStatus} from "../../../../shared/Types";
import {CircularProgress} from "@material-ui/core";

const height = 200;
const outerDiv = {flex: .33, border: '0.5px solid grey', height: height, backgroundColor: '#262626', margin: 2}

export default function MethodUsageCount(props) {
    const [countReady, setCountReady] = useState(false);
    const [FindCloudletCountTotal, setFindCloudletCountTotal] = useState(false);
    const [RegisterClientCountTotal, setRegisterClientCountTotal] = useState(false);
    const [VerifyLocationCountTotal, setVerifyLocationCountTotal] = useState(false);

    useEffect(() => {
        if (props.clientStatusList !== undefined) {
            setClientStatusCount()
        }

    }, [props.clientStatusList]);

    function setClientStatusCount() {
        let temp1Count = 0;
        let temp2Count = 0;
        let temp3Count = 0;
        props.clientStatusList.map((item: TypeClientStatus, index) => {
            temp1Count += item.FindCloudletCount
            temp2Count += item.RegisterClientCount
            temp3Count += item.VerifyLocationCount
        })

        setFindCloudletCountTotal(temp1Count)
        setRegisterClientCountTotal(temp2Count)
        setVerifyLocationCountTotal(temp3Count)
        setCountReady(true)
    }


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
                    Method Usage Count
                </div>

            </div>
            <div style={{
                height: '100%',
                //backgroundColor: 'red'
            }}>
                <CenterMethodCount style={{height: height}}>
                    <div style={outerDiv}>
                        <Center style={{fontSize: 20, height: height / 2}}>
                            Find
                            <br/>
                            Cloudlet
                        </Center>
                        <div style={{marginTop: 5, color: 'green', fontSize: 40, fontWeight: 'bold'}}>
                            {countReady ? FindCloudletCountTotal : <CircularProgress size={'small'}/>}
                        </div>
                    </div>
                    <div style={outerDiv}>
                        <Center style={{fontSize: 20, height: height / 2}}>
                            Register
                            <br/>
                            Client
                        </Center>
                        <div style={{marginTop: 5, color: 'orange', fontSize: 40, fontWeight: 'bold'}}>
                            {countReady ? RegisterClientCountTotal : <CircularProgress size={'small'}/>}
                        </div>
                    </div>
                    <div style={outerDiv}>
                        <Center style={{fontSize: 20, height: height / 2}}>
                            Verify
                            <br/>
                            Location
                        </Center>
                        <div style={{marginTop: 5, color: '#0783FF', fontSize: 40, fontWeight: 'bold'}}>
                            {countReady ? VerifyLocationCountTotal : <CircularProgress size={'small'}/>}

                        </div>
                    </div>
                </CenterMethodCount>
            </div>
        </div>
    )

}
