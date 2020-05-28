// @flow
import * as React from 'react';
import {useEffect, useState} from 'react';
import PageDevMonitoring from "../view/PageDevOperMonitoringView";
import {FixedSizeList} from "react-window";
import '../common/PageMonitoringStyles.css'
import {Center} from "../common/PageMonitoringStyles";
import {renderPlaceHolderCircular} from "../service/PageMonitoringCommonService";

const FontAwesomeIcon = require('react-fontawesome')
type Props = {
    cloudletEventLogList: any,
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

export default function CloudletEventLogListHooks(props) {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    let itemHeight = 55

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [props.cloudletEventLogList]);

    function handleResize() {
        setWindowDimensions(getWindowDimensions());
    }

    function makeTableRowStyle(index, itemHeight) {
        return (
            {
                flex: .33,
                color: '#C0C6C8',
                backgroundColor: index % 2 === 0 ? '#1D2025' : '#22252C',
                height: itemHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
            }

        )

    }

    const headerStyle = {
        color: 'white', flex: .33,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
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
                    Cloudlet Event Log
                </div>

            </div>
            <table size="small" aria-label="a dense table " style={{width: '100%', overflowX: 'scroll', marginTop: -5}}
                   stickyHeader={true}>
                {!props.parent.state.loading &&
                <thead>
                <tr style={{display: 'flex', backgroundColor: '#303030', height: 40,}}>
                    <td padding={'none'} align="center" style={headerStyle}>
                        Time
                    </td>
                    <td padding={'none'} align="center" style={headerStyle}>
                        <div>
                            <div style={{color: ''}}>
                                Cloudlet
                            </div>
                            <div>
                                [Org]
                            </div>
                        </div>
                    </td>
                    <td padding={'none'} align="center" style={headerStyle}>
                        <div>
                            Event
                        </div>
                        <div>
                            [Status]
                        </div>
                    </td>
                    <td padding={'none'} align="center" style={{
                        color: 'white', flex: .03,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}>
                        <div>
                            &nbsp;
                        </div>
                    </td>
                </tr>
                </thead>
                }

                {/*##########################################*/}
                {/*     tableBody                            */}
                {/*##########################################*/}
                <tbody style={{width: 'auto', overflowX: 'scroll', marginTop: 50}}>
                {!props.parent.state.loading ?
                    <FixedSizeList
                        height={179}
                        itemCount={props.cloudletEventLogList.length}
                        itemSize={itemHeight}
                        width={'100%'}
                    >
                        {({index, style}) => {
                            return (
                                <tr key={index} className='fixedSizeListTableDiv'
                                    style={style}
                                >
                                    <React.Fragment>
                                        {/*time(date)*/}
                                        <td padding={'none'} align="center" valign={'center'}
                                            style={makeTableRowStyle(index, itemHeight)}
                                        >
                                            <div>
                                                <div style={{marginLeft: 2}}>
                                                    {props.cloudletEventLogList[index][0].toString().split('T')[0]}
                                                </div>
                                                <div style={{marginLeft: 2}}>
                                                    {props.cloudletEventLogList[index][0].toString().split('T')[1].substring(0, 8)}
                                                </div>
                                            </div>
                                        </td>
                                        {/*Cloudlet*/}
                                        <td padding={'none'} align="center"
                                            style={makeTableRowStyle(index, itemHeight)}
                                        >
                                            <div style={{color: 'white'}}>
                                                {props.cloudletEventLogList[index][1].toString().substring(0, 15)}
                                            </div>
                                            <div>
                                                [{props.cloudletEventLogList[index][2]}]
                                            </div>
                                        </td>
                                        {/*event[Status]*/}
                                        <td padding={'none'} align="center"
                                            style={makeTableRowStyle(index, itemHeight)}
                                        >
                                            <div>
                                                {props.cloudletEventLogList[index][3]}
                                            </div>
                                            <div>
                                                {props.cloudletEventLogList[index][4].toLowerCase() === 'up' ?
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
                    <Center style={{height: itemHeight, marginTop: 70}}>
                        {renderPlaceHolderCircular()}
                    </Center>
                }
                </tbody>
            </table>


        </div>
    )

};
