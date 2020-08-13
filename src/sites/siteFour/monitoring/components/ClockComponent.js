// @flow
import * as React from 'react';
import {useEffect, useState} from 'react';
import '../common/PageMonitoringStyles.css'
import ClockCore from "./ClockCore";
import {Center} from "../common/PageMonitoringStyles";

export default function ClockComponent(props) {
    const [windowDimensions, setWindowDimensions] = useState(0);
    let itemHeight = 55

    useEffect(() => {


    }, []);


    function renderTitle() {
        return (
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
                    Korea Standard Time
                </div>

            </div>
        )
    }


    return (
        <div>
            {renderTitle()}
            <Center style={{height: 160}}>
                <ClockCore
                    //format={'hh-mm'}
                />
            </Center>
        </div>
    )

};
