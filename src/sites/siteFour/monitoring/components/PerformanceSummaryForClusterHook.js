// @flow
import Ripples from "react-ripples";
import * as React from 'react';
import {useEffect} from 'react';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import {Progress} from "antd";
import {withStyles} from "@material-ui/core";
import '../PageMonitoring.css'
import {handleLegendAndBubbleClickedEvent, makeLineChartDataForCluster} from "../dev/PageDevMonitoringService";
import {HARDWARE_TYPE} from "../../../../shared/Constants";
import {Tooltip} from 'antd'
import {numberWithCommas} from "../PageMonitoringUtils";

type Props = {
    filteredUsageList: any,
};
const CustomTableRow = withStyles({
    root: {
        margin: 0,
        padding: 0,
    },
    body: {
        margin: 0,
        padding: 0,
    },
    sizeSmall: {
        margin: 0,
        padding: 0,
    }
})(TableRow);

function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
}


export default function PerformanceSummaryForClusterHook(props) {
    //const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    useEffect(() => {

        console.log("filteredUsageList===>", props.filteredUsageList);

    }, [props.filteredUsageList]);


    function handleRowClicked(item, hwType) {
        try {
            let clusterAndCloudlet = item.cluster.toString() + ' | ' + item.cloudlet.toString()
            let lineChartDataSet = makeLineChartDataForCluster(props.parent.state.filteredClusterUsageList, hwType, props.parent)
            clusterAndCloudlet = clusterAndCloudlet.toString().split(" | ")[0] + "|" + clusterAndCloudlet.toString().split(" | ")[1]
            handleLegendAndBubbleClickedEvent(props.parent, clusterAndCloudlet, lineChartDataSet)

        } catch (e) {
            console.log("error===>", e);
        }
    }


    return (
        <React.Fragment>
            <div style={{
                display: 'flex',
                width: '100%',
                height: 45
            }}>
                <Tooltip placement="top" title={'To view a chart of each hardware usage,\n' +
                'Click the cell.'}>
                    <div className='page_monitoring_title draggable'
                         style={{
                             flex: .2,
                             marginTop: 5,
                             fontFamily: 'Ubuntu',
                             //backgroundColor: 'red'
                         }}
                    >
                        {props.parent.state.currentClassification} Performance Summary
                    </div>
                    <div style={{flex: .7}}>
                    </div>
                </Tooltip>
            </div>
            <TableContainer
                style={{
                    height: 'auto',
                    fontFamily: 'Ubuntu',
                    backgroundColor: 'blue !important',
                    width: 'auto',
                    overflowX: 'scroll'
                }}
            >
                <Table size="small" aria-label="a dense table " style={{width: '100%', overflowX: 'scroll',}}
                       stickyHeader={true}>

                    <TableHead style={{backgroundColor: 'red', fontFamily: 'Ubuntu', fontSize: 20}} fixedHeader={true}>
                        <TableRow>
                            <TableCell padding={'none'} align="center" style={{}}>
                                CLUSTER
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
                                TCP CONN
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                TCP RETRANS
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                UDP REV
                            </TableCell>
                            <TableCell padding={'none'} align="center" style={{}}>
                                UDP SENT
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody padding={'none'} style={{width: 'auto', overflowX: 'scroll'}}>
                        {props.filteredUsageList !== undefined && props.filteredUsageList.map((item, index) => {
                            return (
                                <TableRow
                                    style={{
                                        backgroundColor: index % 2 === 0 ? '#1e2025' : '#23252c',
                                        color: 'grey',
                                        height: 30,
                                    }}
                                >

                                    <TableCell padding={'default'} align="center" style={{width: 320, color: '#C0C6C8',}}>
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
                                            <div style={{
                                                marginBottom: 0, marginTop: 0, marginLeft: 20, display: 'flex', alignItems: 'center', justifyContent: 'center'
                                            }}>
                                                {item.cluster.toString()}<br/>
                                                [{item.cloudlet.toString()}]
                                            </div>
                                        </div>
                                    </TableCell>

                                    {/*@desc:cpu*/}
                                    <TableCell padding={'default'} align="center" style={{width: 'auto', color: '#C0C6C8', marginLeft: 20,}}
                                               onClick={() => handleRowClicked(item, HARDWARE_TYPE.CPU)}
                                    >
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

                                    <TableCell padding={'default'} align="center" style={{width: 'auto', color: '#C0C6C8', marginLeft: 20,}}
                                               onClick={() => handleRowClicked(item, HARDWARE_TYPE.MEM)}
                                    >
                                        <div style={{heiight: 15, padding: 0,}}>
                                            <div>
                                                {numberWithCommas(item.sumMemUsage.toFixed(2)) + ' %'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'}
                                                          strokeWidth={10}
                                                          showInfo={false}
                                                          percent={item.sumMemUsage.toFixed(0)}
                                                          strokeColor={props.parent.state.chartColorList[index]}
                                                          status={'normal'}/>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell padding={'default'} align="center" style={{width: 'auto', color: '#C0C6C8', marginLeft: 20,}}
                                               onClick={() => handleRowClicked(item, HARDWARE_TYPE.DISK)}

                                    >
                                        <div style={{heiight: 15, padding: 0,}}>
                                            <div>
                                                {numberWithCommas(item.sumDiskUsage.toFixed(2)) + ' %'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'}
                                                          strokeWidth={10}
                                                          showInfo={false}
                                                          percent={item.sumDiskUsage.toFixed(0)}
                                                          strokeColor={props.parent.state.chartColorList[index]}
                                                          status={'normal'}/>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell
                                        onClick={() => handleRowClicked(item, HARDWARE_TYPE.RECVBYTES)}
                                        padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}>
                                        {numberWithCommas(item.sumRecvBytes.toFixed(2)) + ' '}
                                    </TableCell>
                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}
                                               onClick={() => handleRowClicked(item, HARDWARE_TYPE.SENDBYTES)}
                                    >
                                        {numberWithCommas(item.sumSendBytes.toFixed(2)) + ' '}
                                    </TableCell>

                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}
                                               onClick={() => handleRowClicked(item, HARDWARE_TYPE.TCPCONNS)}
                                    >
                                        {numberWithCommas(item.sumTcpConns.toFixed(2)) + ' '}
                                    </TableCell>
                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}
                                               onClick={() => handleRowClicked(item, HARDWARE_TYPE.TCPRETRANS)}
                                    >
                                        {numberWithCommas(item.sumTcpRetrans.toFixed(2)) + ' '}
                                    </TableCell>
                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}
                                               onClick={() => handleRowClicked(item, HARDWARE_TYPE.UDPRECV)}
                                    >
                                        {numberWithCommas(item.sumUdpRecv.toFixed(2)) + ' '}
                                    </TableCell>
                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}
                                               onClick={() => handleRowClicked(item, HARDWARE_TYPE.UDPSENT)}
                                    >
                                        {numberWithCommas(item.sumUdpSent.toFixed(2)) + ' '}
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
