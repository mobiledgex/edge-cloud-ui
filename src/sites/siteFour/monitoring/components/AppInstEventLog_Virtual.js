// @flow
import * as React from 'react';
import {useEffect, useState} from 'react';
import PageDevMonitoring from "../dev/PageDevMonitoring";
import {FixedSizeList} from "react-window";

import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import {PageMonitoringStyles} from "../PageMonitoringCommonService";

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

let css = function () {
    let args = $.merge([true, {}], Array.prototype.splice.call(arguments, 0));
    return $.extend.apply(null, args);
}

export default function AppInstEventLog_Virtual(props) {
    //const [eventLogList, setEventLogList] = useState([]);
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    let gridHeight = 305
    let gridWidth = 415;


    useEffect(() => {

        console.log(`eventLogList====>`, props.eventLogList.length);


        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [props.eventLogList]);


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
                         fontFamily: 'Ubuntu',
                     }}
                >
                    App Inst Event Log
                </div>


            </div>
            <table size="small" aria-label="a dense table " style={{width: gridWidth, overflowX: 'scroll'}}
                   stickyHeader={true}>

                <thead style={{backgroundColor: 'red', fontFamily: 'Ubuntu', zIndex: 99999999999, width: gridWidth,}} fixedHeader={true}>
                <tr style={{display: 'flex', backgroundColor: 'grey'}}>
                    <td padding={'none'} align="center" style={{color: 'white', flex: .33}}>
                        TIME
                    </td>
                    <td padding={'none'} align="center" style={{color: 'white', flex: .33}}>
                        App
                    </td>
                    <td padding={'none'} align="center" style={{color: 'white', flex: .33}}>
                        Event[Status]
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
                    itemSize={30}
                    width={gridWidth}
                >
                    {({index, style}) => {
                        return (
                            <tr key={index} className='table0000001'
                                style={style}
                            >
                                <React.Fragment style={{backgroundColor: 'red'}}>
                                    <td padding={'none'} align="center" style={{width: 120, color: '#C0C6C8', backgroundColor: 'red', height: 30}}>
                                        {index}
                                    </td>
                                    <td padding={'none'} align="center" style={{width: 120, color: '#C0C6C8', backgroundColor: 'red', height: 30}}>
                                        sdfsdfsdfsdfsdf
                                    </td>
                                    <td padding={'none'} align="center" style={{width: 120, color: '#C0C6C8', backgroundColor: 'red', height: 30}}>
                                        sdfsdfsdfsdfsdfsd
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
