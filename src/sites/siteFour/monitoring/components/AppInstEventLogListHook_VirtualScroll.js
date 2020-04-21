// @flow
import * as React from 'react';
import {useEffect, useState} from 'react';
import PageDevMonitoring from "../dev/PageDevMonitoring";
import {FixedSizeList} from "react-window";

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


export default function AppInstEventLogListHook_VirtualScroll(props) {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    let itemHeight = 35
    let gridWidth = window.innerWidth / 5;

    useEffect(() => {

        console.log(`eventLogListlength====>`, props.eventLogList.length);


        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [props.eventLogList]);


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

                <thead style={{backgroundColor: 'red', fontFamily: 'Ubuntu', zIndex: 99999999999,}} fixedHeader={true}>
                <tr style={{display: 'flex', backgroundColor: '#303030'}}>
                    <td padding={'none'} align="center" style={{color: 'white', flex: .2}}>
                        TIME
                    </td>
                    <td padding={'none'} align="center" style={{color: 'white', flex: .4}}>
                        APP
                    </td>
                    <td padding={'none'} align="center" style={{color: 'white', flex: .4}}>
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
                                <React.Fragment style={{backgroundColor: 'red'}}>
                                    <td padding={'none'} align="center" style={{flex: .2, color: '#C0C6C8', backgroundColor: index % 2 === 0 ? '#1D2025' : '#22252C', height: itemHeight}}>
                                        <div>
                                            {props.eventLogList[index][0].toString().split('T')[0]}
                                        </div>
                                        <div>
                                            {props.eventLogList[index][0].toString().split('T')[1].substring(0, 8)}
                                        </div>
                                    </td>
                                    <td padding={'none'} align="center" style={{flex: .4, color: '#C0C6C8', backgroundColor: index % 2 === 0 ? '#1D2025' : '#22252C', height: itemHeight}}>
                                        {windowDimensions.width <= 1440 ?
                                            <React.Fragment>
                                                <div>
                                                    {props.eventLogList[index][1].toString().substring(0, 15)}

                                                </div>
                                                <div>
                                                    {props.eventLogList[index][1].toString().substring(15, props.eventLogList[index][1].toString().length)}
                                                </div>
                                            </React.Fragment>
                                            :
                                            <React.Fragment>
                                                <div>
                                                    {props.eventLogList[index][1].toString().substring(0, 20)}

                                                </div>
                                                <div>
                                                    {props.eventLogList[index][1].toString().substring(20, props.eventLogList[index][1].toString().length)}
                                                </div>
                                            </React.Fragment>
                                        }
                                    </td>
                                    <td padding={'none'} align="center" style={{flex: .4, color: '#C0C6C8', backgroundColor: index % 2 === 0 ? '#1D2025' : '#22252C', height: itemHeight,}}>
                                        <div>
                                            {props.eventLogList[index][9]}
                                        </div>
                                        <div>
                                            [{props.eventLogList[index][10]}]
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
