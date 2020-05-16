import React, {useEffect, useState} from 'react';
import {Table} from "semantic-ui-react";
import '../common/MonitoringStyles.css'


export default function FindCloudletHook(props) {
    const [eventLogList, setEventLogList] = useState([]);

    useEffect(() => {
        if (props.eventLogList !== undefined) {

        } else {
            setEventLogList([])
        }
    }, [props.eventLogList]);

    return (
        <>
            <div style={{
                display: 'flex',
                width: '100%',
                height: 25
            }}>
                <div className='page_monitoring_title' style={{
                    flex: .6,
                    marginTop: 15,
                }}>
                    Cluster Event Log
                </div>
                <div style={{flex: .4, marginRight: 70}}>
                </div>

            </div>
            <div>
                sdlkflsdkflsdkflksdlfksldkflk
            </div>
        </>
    )

}
