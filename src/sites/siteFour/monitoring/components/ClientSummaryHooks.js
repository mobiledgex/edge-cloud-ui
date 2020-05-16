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
import '../common/MonitoringStyles.css'
import {numberWithCommas} from "../common/MonitoringUtils";
import {Paper} from "@material-ui/core";
import {convertByteToMegaGigaByte} from "../service/PageMonitoringCommonService";
import type {TypeClientStatus} from "../../../../shared/Types";

type Props = {
    filteredUsageList: any,
};

export default function ClientSummaryHooks(props) {

    useEffect(() => {
    }, [props.clientStatusList]);

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
                    Client Status Summary
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
                                APP INST
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                apporg
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                cellID
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                cloudlet
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                cloudletorg
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                ver
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                RegisterClientCount
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                FindCloudletCount
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                VerifyLocationCount
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody padding={'none'} style={{width: 'auto', overflowX: 'scroll'}}>
                        {props.filteredUsageList !== undefined && props.filteredUsageList.map((item: TypeClientStatus, index) => {
                            return (
                                <TableRow
                                    key={index}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? '#1e2025' : '#23252c',
                                        color: 'grey',
                                        height: 30,
                                    }}
                                >
                                    <TableCell padding={'default'} align="center"
                                               style={{width: 320, color: '#C0C6C8',}}>
                                        <div style={{
                                            display: "flex",
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            height: 30,
                                            padding: 0,
                                        }}>
                                            <div style={{
                                                marginBottom: 0,
                                                marginTop: 0,
                                                marginLeft: 20,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center'
                                            }}>
                                                {item.app}[{item.ver}]
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell padding={'default'} align="center"
                                               style={{width: 'auto', color: '#C0C6C8', marginLeft: 20,}}>
                                        <div style={{heiight: 15, padding: 0,}}>
                                            {item.apporg}
                                        </div>
                                    </TableCell>
                                    <TableCell padding={'default'} align="center"
                                               style={{width: 'auto', color: '#C0C6C8', marginLeft: 20,}}>
                                        <div style={{heiight: 15, padding: 0,}}>
                                            {item.cellID}
                                        </div>
                                    </TableCell>
                                    <TableCell padding={'default'} align="center"
                                               style={{width: 'auto', color: '#C0C6C8', marginLeft: 20,}}>
                                        <div style={{heiight: 15, padding: 0,}}>
                                            {item.cloudlet}
                                        </div>
                                    </TableCell>
                                    <TableCell padding={'default'} align="center"
                                               style={{width: 'auto', color: '#C0C6C8', marginLeft: 20,}}>
                                        <div style={{heiight: 15, padding: 0,}}>
                                            {item.cloudletorg}
                                        </div>
                                    </TableCell>
                                    <TableCell padding={'default'} align="center"
                                               style={{width: 'auto', color: '#C0C6C8', marginLeft: 20,}}>
                                        <div style={{heiight: 15, padding: 0,}}>
                                            {item.RegisterClientCount}
                                        </div>
                                    </TableCell>
                                    <TableCell padding={'default'} align="center"
                                               style={{width: 'auto', color: '#C0C6C8', marginLeft: 20,}}>
                                        <div style={{heiight: 15, padding: 0,}}>
                                            {item.FindCloudletCount}
                                        </div>
                                    </TableCell>
                                    <TableCell padding={'default'} align="center"
                                               style={{width: 'auto', color: '#C0C6C8', marginLeft: 20,}}>
                                        <div style={{heiight: 15, padding: 0,}}>
                                            {item.VerifyLocationCount}
                                        </div>
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
