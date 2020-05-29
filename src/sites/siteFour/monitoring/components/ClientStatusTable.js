// @flow
import * as React from 'react';
import {useEffect} from 'react';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import '../common/PageMonitoringStyles.css'
import {Paper} from "@material-ui/core";
import type {TypeClientStatus} from "../../../../shared/Types";
import {renderPlaceHolderLoader} from "../service/PageMonitoringCommonService";

type Props = {
    clientStatusList: any,
};

export default function ClientStatusTable(props) {
    useEffect(() => {
    }, [props.clientStatusList]);

    function renderEmptyTable() {
        return (
            <TableRow
                style={{
                    backgroundColor: '#1e2025',
                    color: 'grey',
                    height: 30,
                }}
            >
                <TableCell padding={'none'} align="center" style={{fontSize: 15, color: 'orange', fontStyle: 'italic'}} colSpan={7}>
                    <div style={{fontSize: 28, color: 'orange'}}> No Data</div>
                </TableCell>
            </TableRow>
        )
    }

    function renderTableLoader() {
        return (
            <TableRow
                style={{
                    backgroundColor: '#1e2025',
                    color: 'grey',
                    height: 30,
                }}
            >
                <TableCell padding={'none'} align="center" style={{fontSize: 15, color: 'orange', fontStyle: 'italic'}} colSpan={7}>
                    {renderPlaceHolderLoader('sk')}
                </TableCell>
            </TableRow>
        )
    }

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
                    Client Status For App Inst
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


                    <TableHead style={{backgroundColor: 'red', fontFamily: 'Roboto', fontSize: 20}} fixedheader={true.toString()}>
                        <TableRow>
                            <TableCell padding={'none'} align="center" style={{}}>
                                App Inst
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                App Org
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                Cloudlet
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                Cloudlet Org
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                RegisterClient Count
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                FindCloudlet Count
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                VerifyLocation Count
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody padding={'none'} style={{width: 'auto', overflowX: 'scroll'}}>
                        {props.clientStatusList !== undefined && props.clientStatusList.map((item: TypeClientStatus, index) => {
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
                                               style={{width: 'auto', color: '#C0C6C8',}}>
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
                                                {item.app}&nbsp;[{item.ver}]
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
                        {props.parent.state.loadingForClientStatus ? renderTableLoader()
                            : props.clientStatusList.length === 0 ? renderEmptyTable() : null
                        }
                    </TableBody>

                </Table>
            </TableContainer>
        </React.Fragment>
    )
};
