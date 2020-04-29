// @flow
import * as React from 'react';
import {useEffect, useState} from 'react';
import PageDevMonitoring from "../dev/PageDevMonitoring";
import {FixedSizeList} from "react-window";

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


export default function AppInstEventLogListHookVirtualScroll(props) {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    let itemHeight = 35

    useEffect(() => {
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [props.eventLogList]);

    function handleResize() {
        setWindowDimensions(getWindowDimensions());
    }


    return (
        <div style={{fontFamily: 'ubuntu'}}>
            <div style={{
                display: 'flex',
                width: '100%',
                height: 45
            }}>
                <div className='page_monitoring_title draggable'
                     style={{
                         flex: 1,
                         marginTop: 10,
                         fontFamily: 'Ubuntu',
                     }}
                >
                    App Inst Event Log
                </div>

            </div>
            <table size="small" aria-label="a dense table " style={{width: '100%', overflowX: 'scroll', marginTop: -10}}
                   stickyHeader={true}>

                <thead style={{backgroundColor: 'red', fontFamily: 'Ubuntu', zIndex: 99999999999,}}>
                <tr style={{display: 'flex', backgroundColor: '#303030'}}>
                    <td padding={'none'} align="center" style={{color: 'white', flex: .25}}>
                        TIME
                    </td>
                    <td padding={'none'} align="center" style={{color: 'white', flex: .4}}>
                        APP
                    </td>
                    <td padding={'none'} align="center" style={{color: 'white', flex: .35}}>
                        EVENT[STATUS]
                    </td>

                </tr>
                </thead>
                {/*todo:tableBody*/}
                {/*todo:tableBody*/}
                <tbody style={{width: 'auto', overflowX: 'scroll', marginTop: 50}}>
                {!props.parent.state.loading &&
                <FixedSizeList
                    height={185}
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
                                    {/*111111*/}
                                    <td padding={'none'} align="center"
                                        style={{flex: .25, color: '#C0C6C8', backgroundColor: index % 2 === 0 ? '#1D2025' : '#22252C', height: itemHeight}}>
                                        <div style={{marginLeft: 2}}>
                                            {props.eventLogList[index][0].toString().split('T')[0]}
                                        </div>
                                        <div style={{marginLeft: 2}}>
                                            {props.eventLogList[index][0].toString().split('T')[1].substring(0, 8)}
                                        </div>
                                    </td>
                                    {/*222222*/}
                                    <td padding={'none'} align="center"
                                        style={{flex: .4, color: '#C0C6C8', backgroundColor: index % 2 === 0 ? '#1D2025' : '#22252C', height: itemHeight}}>
                                        {windowDimensions.width <= 1440 ?
                                            <React.Fragment>
                                                <div>
                                                    {props.eventLogList[index][1].toString().substring(0, 15)} {/*-{index}*/}

                                                </div>
                                                <div>
                                                    {props.eventLogList[index][1].toString().substring(15, props.eventLogList[index][1].toString().length)}
                                                </div>
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                <div>
                                                    {props.eventLogList[index][1].toString().substring(0, 20)} {/*-{index}*/}

                                                </div>
                                                <div>
                                                    {props.eventLogList[index][1].toString().substring(20, props.eventLogList[index][1].toString().length)}
                                                </div>
                                            </React.Fragment>
                                        }
                                    </td>
                                    {/*333333*/}
                                    <td padding={'none'} align="center"
                                        style={{flex: .35, color: '#C0C6C8', backgroundColor: index % 2 === 0 ? '#1D2025' : '#22252C', height: itemHeight,}}>
                                        <div>
                                            {props.eventLogList[index][8]}
                                        </div>
                                        <div>
                                            {/*[]*/}

                                            {props.eventLogList[index][9].toLowerCase() === 'up' ?
                                                <FontAwesomeIcon
                                                    name="arrow-up" style={{fontSize: 15, color: 'green', cursor: 'pointer', marginTop: 2}}
                                                />
                                                :
                                                <FontAwesomeIcon
                                                    name="arrow-down" style={{fontSize: 15, color: 'red', cursor: 'pointer', marginTop: 2}}
                                                />
                                            }

                                        </div>
                                    </td>
                                </React.Fragment>

                            </tr>
                        )
                    }}

                </FixedSizeList>
                }
                </tbody>
            </table>


        </div>
    )

};
