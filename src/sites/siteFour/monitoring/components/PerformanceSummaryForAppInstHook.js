// @flow
import * as React from 'react';
import {useEffect} from 'react';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import {Progress} from "antd";
import '../PageMonitoring.css'
import {numberWithCommas} from "../PageMonitoringUtils";
import {Paper} from "@material-ui/core";
import {convertByteToMegaGigaByte} from "../PageMonitoringCommonService";

type Props = {
    filteredUsageList: any,
};

export default function PerformanceSummaryForAppInstHook(props) {

    useEffect(() => {
    }, [props.filteredUsageList]);


    return (
        <React.Fragment>
            <div
                className='.draggable'
                style={{
                    display: 'flex',
                    width: '100%',
                    height: 45
                }}
            >
                <div className='page_monitoring_title draggable'
                     style={{
                         flex: 1,
                         marginTop: 5,
                         //backgroundColor:'red'
                     }}
                >
                    App Inst Performance Summary
                </div>
            </div>
            <TableContainer
                component={Paper}
                style={{
                    height: 'auto',
                    backgroundColor: 'blue !important',
                    width: 'auto',
                    overflowX: 'scroll'
                }}
            >
                <Table size="small" aria-label="a dense table " style={{width: '100%', overflowX: 'scroll'}}
                       stickyHeader={true}>

                    <TableHead style={{backgroundColor: 'red', fontFamily: 'Roboto', fontSize: 20}} fixedHeader={true}>
                        <TableRow>
                            <TableCell padding={'none'} align="center" style={{}}>
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                APP INST
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                CPU
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                MEM
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                DISK
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                NETWORK RECV
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                NETWORK SENT
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                ACTIVE CONNECTION
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                HANDLED CONNECTION
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                ACCEPTS CONNECTION
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody padding={'none'} style={{width: 'auto', overflowX: 'scroll'}}>
                        {props.filteredUsageList !== undefined && props.filteredUsageList.map((item, index) => {
                            return (
                                <TableRow
                                    key={index}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? '#1e2025' : '#23252c',
                                        color: 'grey',
                                        height: 30,
                                    }}
                                >
                                    <TableCell padding={'default'} align="center" style={{width: 30, color: '#C0C6C8',}}>
                                        <div style={{
                                            marginBottom: 0,
                                            marginTop: 0,
                                            display: 'flex',
                                            alignItems: 'flex-start',
                                            justifyContent: 'center'
                                        }}>
                                            <div style={{
                                                backgroundColor: props.parent.state.chartColorList[index],
                                                width: 15,
                                                height: 15,
                                                borderRadius: 50,
                                            }}>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell padding={'default'} align="center" style={{width: 320, color: '#C0C6C8',}}>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 30,
                                            padding: 0,
                                        }}>
                                            <div style={{
                                                marginBottom: 0, marginTop: 0, marginLeft: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {item.appName.toString()}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell padding={'default'} align="center" style={{width: 'auto', color: '#C0C6C8', marginLeft: 20,}}>
                                        <div style={{heiight: 15, padding: 0,}}>
                                            <div>
                                                {item.sumCpuUsage.toFixed(2) + '%'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'}
                                                          strokeWidth={10}
                                                          showInfo={false}
                                                          percent={item.sumCpuUsage.toFixed(0)}
                                                          strokeColor={props.parent.state.chartColorList[index]}

                                                          status={'normal'}/>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell padding={'default'} align="center" style={{width: 'auto', color: '#C0C6C8', marginLeft: 20,}}>
                                        <div style={{heiight: 15, padding: 0,}}>
                                            <div>
                                                {convertByteToMegaGigaByte(item.sumMemUsage)}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell padding={'default'} align="center" style={{width: 'auto', color: '#C0C6C8', marginLeft: 20,}}>
                                        <div style={{heiight: 15, padding: 0,}}>
                                            <div>
                                                {convertByteToMegaGigaByte(item.sumDiskUsage)}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}>
                                        {numberWithCommas(convertByteToMegaGigaByte(item.sumRecvBytes.toFixed(0)))}
                                    </TableCell>
                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}>
                                        {numberWithCommas(convertByteToMegaGigaByte(item.sumSendBytes.toFixed(0)))}
                                    </TableCell>
                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}>
                                        {numberWithCommas(parseInt(item.sumActiveConnection.toFixed(0))) + ' '}
                                    </TableCell>
                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}>
                                        {numberWithCommas(parseInt(item.sumHandledConnection.toFixed(0))) + ' '}
                                    </TableCell>
                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}>
                                        {numberWithCommas(parseInt(item.sumAcceptsConnection.toFixed(0))) + ' '}
                                    </TableCell>
                                </TableRow>
                            )
                        })}


                    </TableBody>

                </Table>
            </TableContainer>
        </React.Fragment>
    )
};
