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
import {Empty} from "antd";
import {renderPlaceHolderLoader} from "../service/PageMonitoringCommonService";

type Props = {
    clientStatusList: any,
};

export default function ClientStatusTableHooks(props) {

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
                    Client status For App Inst
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
                                App Org.
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                Cloudlet
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                Cloudlet Org.
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
                        {props.clientStatusList.length === 0 &&
                        <TableRow
                            style={{
                                backgroundColor: '#1e2025',
                                color: 'grey',
                                height: 30,
                            }}
                        >
                            <TableCell padding={'none'} align="center" style={{fontSize: 15, color: 'orange', fontStyle: 'italic'}} colSpan={7}>
                                {!props.parent.state.loading ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE}/>
                                    : renderPlaceHolderLoader('sk')

                                }
                            </TableCell>
                        </TableRow>}
                    </TableBody>

                </Table>
            </TableContainer>
        </React.Fragment>
    )
};
