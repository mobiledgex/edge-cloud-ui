// @flow
import * as React from 'react';
import {useEffect, useRef} from 'react';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import '../common/PageMonitoringStyles.css'
import {Paper} from "@material-ui/core";
import type {TypeClientStatus} from "../../../../shared/Types";
import {renderBarLoader, renderPlaceHolderHorizontalLoader, renderSmallProgressLoader} from "../service/PageMonitoringCommonService";
import CircularProgress from "@material-ui/core/CircularProgress";

type Props = {
    clientStatusList: any,
};

export default function ClientStatusTable(props) {
    const bodyRef = useRef();
    const tableRef = useRef();

    useEffect(() => {
    }, [props.clientStatusList]);

    function renderEmptyTable() {
        return (
            <TableRow
                style={{
                    //backgroundColor: '#1e2025',
                    color: 'grey',
                    height: 50,
                }}
            >
                <TableCell padding={'none'} align="center" style={{fontSize: 15, color: '#57AA27',}}
                           colSpan={7} rowSpan={4}>
                    <div style={{fontSize: 17, color: '#57aa27'}}> No Data Available</div>
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
                <TableCell padding={'none'} align="center" style={{fontSize: 15, color: 'orange', fontStyle: 'italic'}}
                           colSpan={7}>
                    {renderPlaceHolderHorizontalLoader('sk')}
                </TableCell>
            </TableRow>
        )
    }

    function renderHeader() {
        return (
            <div
                className='.draggable'
                style={{
                    display: 'flex',
                    width: '100%',
                    height: 45,

                }}
            >
                <div className='page_monitoring_title'
                     style={{
                         flex: 1,
                         marginTop: 5,
                         color: 'white',
                         display: 'flex',
                     }}
                >
                    Client Status For App Inst {props.loading ?
                    <div style={{marginLeft: 5,}}>
                        <div style={{}}>
                            {renderSmallProgressLoader(0)}
                        </div>
                    </div> : `[${props.clientStatusList.length}]`}
                </div>
            </div>
        )
    }

    return (
        <div ref={bodyRef}>
            {props.loading && (<div>{renderBarLoader(false)}</div>)}
            {renderHeader()}
            <TableContainer
                component={Paper}
                style={{
                    height: '210px',
                    backgroundColor: 'blue !important',
                    width: 'auto',
                }}
            >
                <Table ref={tableRef} size="small" aria-label="a dense table "
                       style={{width: '100%',}}
                       stickyHeader={true}
                >

                    <TableHead style={{backgroundColor: '#303030', fontFamily: 'Roboto', fontSize: 20}}
                               fixedheader={true.toString()}>
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
                    <TableBody padding={'none'} style={{width: 'auto', overflow: 'auto !important'}}>
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
                        {props.clientStatusList.length === 0 ? renderEmptyTable() : null}
                    </TableBody>

                </Table>
            </TableContainer>
        </div>
    )
};
