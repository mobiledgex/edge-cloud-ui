// @flow
import * as React from 'react';
import {useEffect, useState} from 'react';
import {Empty} from 'antd';
import PageDevMonitoring from "../view/DevOperMonitoringView";
import {FixedSizeList} from "react-window";
import {reduceString} from "../service/PageMonitoringService";
import '../common/MonitoringStyles.css'

const FontAwesomeIcon = require('react-fontawesome')
type Props = {
    eventLogList: any,
    columnList: any,
    parent: PageDevMonitoring,
};

function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
}


export default function ClientStatusMetricContainer(props) {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    let itemHeight = 55

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [props.eventLogList]);

    function handleResize() {
        setWindowDimensions(getWindowDimensions());
    }

    function reduceEventName(eventName) {
        if (eventName !== undefined) {
            if (eventName.includes('HEALTH_CHECK')) {
                return eventName.replace('HEALTH_CHECK', 'HEALTH_CHK')
            } else if (eventName.includes('UPDATE')) {
                return eventName.replace('UPDATE', 'UPD')
            } else {
                return eventName;
            }
        }

    }


    return (
        <div style={{fontFamily: 'Roboto'}}>
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
                    App Inst Event Log
                </div>

            </div>
            <table size="small" aria-label="a dense table " style={{width: '100%', overflowX: 'scroll', marginTop: -10}}
                   stickyHeader={true}>

                <thead style={{backgroundColor: 'red', fontFamily: 'Roboto', zIndex: 99999999999,}}>
                <tr style={{display: 'flex', backgroundColor: '#303030'}}>
                    <td padding={'none'} align="center"
                        style={{
                            color: 'white', flex: .25,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        Time
                    </td>
                    <td padding={'none'} align="center"
                        style={{
                            color: 'white', flex: .5, display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <div>
                            App
                        </div>
                        <div>
                            <div style={{color: ''}}>
                                Cluster[Cloudlet]
                            </div>
                        </div>
                    </td>
                    <td padding={'none'} align="center"
                        style={{
                            color: 'white', flex: .25,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                        }}
                    >
                        <div>
                            Event
                        </div>
                        <div>
                            [Status]
                        </div>
                    </td>

                </tr>
                </thead>
                {/*todo:tableBody*/}
                {/*todo:tableBody*/}
                <tbody style={{width: 'auto', overflowX: 'scroll', marginTop: 50}}>
                {!props.parent.state.loading && props.eventLogList.length > 0 ?
                    <FixedSizeList
                        height={179}
                        itemCount={props.eventLogList.length}
                        itemSize={itemHeight}
                        width={'100%'}
                    >
                        {({index, style}) => {
                            return (
                                <tr key={index} className='table0000001'
                                    style={style}
                                >
                                    <React.Fragment>
                                        {/*time(date)*/}
                                        <td padding={'none'} align="center" valign={'center'}
                                            style={{
                                                flex: .25,
                                                color: '#C0C6C8',
                                                backgroundColor: index % 2 === 0 ? '#1D2025' : '#22252C',
                                                height: itemHeight,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexDirection: 'column',
                                            }}>
                                            <div style={{}}>
                                                <div style={{marginLeft: 2}}>
                                                    {props.eventLogList[index][0].toString().split('T')[0]}
                                                </div>
                                                <div style={{marginLeft: 2}}>
                                                    {props.eventLogList[index][0].toString().split('T')[1].substring(0, 8)}
                                                </div>
                                            </div>
                                        </td>
                                        {/*App*/}
                                        <td padding={'none'} align="center"
                                            style={{
                                                flex: .5,
                                                color: '#C0C6C8',
                                                backgroundColor: index % 2 === 0 ? '#1D2025' : '#22252C',
                                                height: itemHeight
                                            }}>
                                            <React.Fragment>
                                                <div style={{color: 'white'}}>
                                                    {props.eventLogList[index][1].toString().substring(0, 15)} {/*-{AppInst}*/}
                                                    &nbsp;[{props.eventLogList[index][2]}] {/*version*/}
                                                </div>
                                                <div style={{fontSize: 12,}}>
                                                    <div>
                                                        {reduceString(props.eventLogList[index][3], 30)} {/*cluster*/}
                                                    </div>
                                                    <div style={{color: 'yellow'}}>
                                                        [{reduceString(props.eventLogList[index][5], 30)}] {/*cloudlet*/}
                                                    </div>
                                                </div>
                                            </React.Fragment>
                                        </td>
                                        {/*event[Status]*/}
                                        <td padding={'none'} align="center"
                                            style={{
                                                flex: .25,
                                                color: '#C0C6C8',
                                                backgroundColor: index % 2 === 0 ? '#1D2025' : '#22252C',
                                                height: itemHeight,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                flexDirection: 'column',

                                            }}>
                                            <div style={{fontSize: 10}}>
                                                {reduceEventName(props.eventLogList[index][8])}
                                            </div>
                                            <div>
                                                {props.eventLogList[index][9].toLowerCase() === 'up' ?
                                                    <FontAwesomeIcon
                                                        name="arrow-up" style={{
                                                        fontSize: 15,
                                                        color: 'green',
                                                        cursor: 'pointer',
                                                        marginTop: 2
                                                    }}
                                                    />
                                                    :
                                                    <FontAwesomeIcon
                                                        name="arrow-down" style={{
                                                        fontSize: 15,
                                                        color: 'red',
                                                        cursor: 'pointer',
                                                        marginTop: 2
                                                    }}
                                                    />
                                                }

                                            </div>
                                        </td>
                                    </React.Fragment>

                                </tr>
                            )
                        }}

                    </FixedSizeList>
                    :
                    <div style={{
                        justifyContent: 'center',
                        alignSelf: 'center',
                        alignItems: 'center',
                        fontSize: 15,
                        display: 'flex'
                    }}>
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                    </div>
                }
                </tbody>
            </table>


        </div>
    )

};
