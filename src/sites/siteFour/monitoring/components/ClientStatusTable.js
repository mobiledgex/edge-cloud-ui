// @flow
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import '../common/PageMonitoringStyles.css'
import {Paper} from "@material-ui/core";
import type {TypeClientStatus} from "../../../../shared/Types";
import {renderBarLoader, renderSmallProgressLoader} from "../service/PageMonitoringCommonService";
import {Checkbox} from 'antd';
import {MEX_PROMETHEUS_APPNAME} from "../../../../shared/Constants";

type Props = {
    clientStatusList: any,
};

export default function ClientStatusTable(props) {
    const bodyRef = useRef();
    const tableRef = useRef();
    const [hideMexPrometeusAppName, setHideMexPrometeusAppName] = useState(false);
    const [clientStatusList, setClientStatusList] = useState(undefined)
    const [currentClientStatusList, setCurrentClientStatusList] = useState(undefined)
    const [clientStatusListWithoutMexPrometeusAppName, setClientStatusListWithoutMexPrometeusAppName] = useState(undefined)

    useEffect(() => {
        setClientStatusList(props.clientStatusList)
        let clientStatusListWithoutMEXPrometheusAppName = props.clientStatusList.filter((item, index) => {
            if (item.app !== MEX_PROMETHEUS_APPNAME) {
                return item;
            }
        })

        setClientStatusListWithoutMexPrometeusAppName(clientStatusListWithoutMEXPrometheusAppName)
        setCurrentClientStatusList(props.clientStatusList)

        if (!hideMexPrometeusAppName) {
            setCurrentClientStatusList(props.clientStatusList)
        } else {
            setCurrentClientStatusList(clientStatusListWithoutMEXPrometheusAppName)
        }

    }, [props.clientStatusList]);

    useEffect(() => {

        if (!hideMexPrometeusAppName) {
            setCurrentClientStatusList(clientStatusList)
        } else {
            setCurrentClientStatusList(clientStatusListWithoutMexPrometeusAppName)
        }
    }, [hideMexPrometeusAppName]);

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

    function renderHeaderForClientStatusForAppInst() {
        return (
            <div className='page_monitoring_title_area draggable' style={{backgroundColor: 'transparent'}}>
                <div className='page_monitoring_title_for_table' onClick={() => {
                }}>
                    Client Status For App Instances {props.loading ?
                    <div style={{marginLeft: 5,}}>
                        <div style={{}}>
                            {renderSmallProgressLoader(0)}
                        </div>
                    </div> : `[${currentClientStatusList !== undefined ? currentClientStatusList.length : null}]`}

                    <div style={{marginLeft: 50, zIndex: 999999}}>
                        <Checkbox
                            style={{zIndex: 999999}}
                            onChange={() => {

                                setHideMexPrometeusAppName(!hideMexPrometeusAppName)

                            }}
                            checked={hideMexPrometeusAppName}
                        >Hide MexPrometheusAppName</Checkbox>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div ref={bodyRef}>
            {props.loading && (<div>{renderBarLoader(false)}</div>)}
            {renderHeaderForClientStatusForAppInst()}
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
                        {currentClientStatusList !== undefined && currentClientStatusList.map((item: TypeClientStatus, index) => {
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
                        {currentClientStatusList !== undefined && currentClientStatusList.length === 0 ? renderEmptyTable() : null}
                    </TableBody>

                </Table>
            </TableContainer>
        </div>
    )
};
