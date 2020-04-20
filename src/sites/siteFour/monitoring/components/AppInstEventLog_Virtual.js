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


export default function AppInstEventLog_Virtual(props) {
    //const [eventLogList, setEventLogList] = useState([]);
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    let gridHeight = 305
    let gridWidth = window.innerWidth * 0.9;


    useEffect(() => {

        console.log(`eventLogList====>`, props.eventLogList.length);


        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [props.eventLogList]);


    return (
        <>
            <div style={{
                display: 'flex',
                width: '100%',
                height: 45
            }}>
                <div className='page_monitoring_title'
                     style={{
                         flex: .38,
                         marginTop: 5,
                         fontFamily: 'Ubuntu',
                         fontSize: 15,
                     }}
                >
                    App Inst Event Log
                </div>
                <div style={{flex: .4, marginRight: 70}}>
                </div>

            </div>
            <table
                style={{
                    height: 220,
                    fontFamily: 'Ubuntu',
                    backgroundColor: 'blue !important',
                    width: 'auto',
                    overflowX: 'scroll'
                }}>
                <tr size="small" aria-label="a dense table " style={{width: '100%', overflowX: 'scroll'}}
                    stickyHeader={true}>

                    <th style={{backgroundColor: 'red', fontFamily: 'Ubuntu',}} fixedHeader={true}>
                        <tr>
                            <td padding={'none'} align="center" style={{}}>
                                TIME
                            </td>
                            <td padding={'none'} align="center" style={{}}>
                                App
                            </td>
                            <td padding={'none'} align="center" style={{}}>
                                Event[Status]
                            </td>

                        </tr>
                    </th>

                </tr>
                {/*todo:tableBody*/}
                {/*todo:tableBody*/}
                {/*todo:tableBody*/}
                {/*todo:tableBody*/}
                <tbody style={{width: 'auto', overflowX: 'scroll'}}>
                {!props.parent.state.loading &&
                <FixedSizeList
                    height={250}
                    itemCount={props.eventLogList.length}
                    itemSize={5}
                    style={{backgroundColor: 'black', display: 'flex', alignSelf: 'center', marginTop: 0, marginRight: 0, height: 1500}}
                    width={gridWidth}
                >
                    {({index, style}) => {
                        return (
                            <tr
                                key={index}
                                style={style}

                            >
                                <td padding={'none'} align="center" style={{width: 120, color: '#C0C6C8', height: 50}}>
                                    <div>
                                        {props.eventLogList[index][0].toString().split('T')[0]}
                                    </div>
                                    <div>
                                        {props.eventLogList[index][0].toString().split('T')[1].substring(0, 8)}
                                    </div>
                                </td>
                                <td padding={'none'} align="center" style={{width: 120, color: '#C0C6C8'}}>
                                    <React.Fragment>
                                        <div>
                                            {props.eventLogList[index][1].toString().substring(0, 20)}

                                        </div>
                                        <div>
                                            {props.eventLogList[index][1].toString().substring(20, props.eventLogList[index][1].toString().length)}
                                        </div>
                                    </React.Fragment>
                                </td>
                                <td padding={'none'} align="center" style={{width: 120, color: '#C0C6C8'}}>
                                    <div>
                                        {props.eventLogList[index][9]}
                                    </div>
                                    <div>
                                        [{props.eventLogList[index][10]}]
                                    </div>
                                </td>
                            </tr>
                        )
                    }}

                </FixedSizeList>
                }
                </tbody>
            </table>

        </>
    )

};
