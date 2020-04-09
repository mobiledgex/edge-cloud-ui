import * as React from 'react';
import PageDevMonitoring from "../dev/PageDevMonitoring";
import TableContainer from "@material-ui/core/TableContainer";
import Paper from "@material-ui/core/Paper";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import Table from "@material-ui/core/Table";
import {useEffect, useState} from "react";
import {CircularProgress} from "@material-ui/core";
import {
    renderPlaceHolderCircular3
} from "../PageMonitoringCommonService";

const {Row, Cell, Body, Header, HeaderCell} = Table
type Props = {
    eventLogList: any,
    columnList: any,
    parent: PageDevMonitoring,
};

export default function AppInstEventLogListHook(props) {


    useEffect(() => {
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
            <TableContainer component={Paper}
                            style={{width: 380, height: 250, fontFamily: 'Ubuntu', backgroundColor: 'blue !important'}}>
                <Table size="small" aria-label="a dense table " style={{}} stickyHeader={true}>
                    <TableHead style={{backgroundColor: 'red', fontFamily: 'Ubuntu',}} fixedHeader={true}>
                        <TableRow>
                            <TableCell padding={'none'} align="center" style={{width: 120}}>
                                TIME
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{width: 120}}>
                                App
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{width: 120}}>
                                Event[Status]
                            </TableCell>

                        </TableRow>
                    </TableHead>
                    <TableBody style={{}}>
                        {props.eventLogList.map((item, index) => (
                            <TableRow key={index}
                                      style={{
                                          backgroundColor: index % 2 === 0 ? '#1e2025' : '#23252c',
                                          color: 'grey'
                                      }}>
                                <TableCell padding={'none'} align="center" style={{width: 120, color: '#C0C6C8'}}>
                                    <div>
                                        {item[0].toString().split('T')[0]}
                                    </div>
                                    <div>
                                        {item[0].toString().split('T')[1].substring(0, 8)}
                                    </div>
                                </TableCell>
                                <TableCell padding={'none'} align="center" style={{width: 120, color: '#C0C6C8'}}>
                                    <div>
                                        {item[1].toString().substring(0, 20)}
                                    </div>
                                    <div>
                                        {item[1].toString().substring(20, item[1].toString().length)}
                                    </div>
                                </TableCell>
                                <TableCell padding={'none'} align="center" style={{width: 120, color: '#C0C6C8'}}>
                                    <div>
                                        {item[9]}
                                    </div>
                                    <div>
                                        [{item[10]}]
                                    </div>
                                </TableCell>

                            </TableRow>
                        ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
};
