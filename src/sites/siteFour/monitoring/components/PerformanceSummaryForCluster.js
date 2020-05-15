// @flow
import * as React from 'react';
import {useEffect} from 'react';
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableBody from "@material-ui/core/TableBody";
import TableContainer from "@material-ui/core/TableContainer";
import {Progress, Tooltip} from "antd";
import '../common/PageMonitoring.css'
import {handleLegendAndBubbleClickedEvent, makeLineChartData} from "../service/PageDevMonitoringService";
import {HARDWARE_TYPE} from "../../../../shared/Constants";
import {numberWithCommas} from "../common/PageMonitoringUtils";
import {convertByteToMegaGigaByte, convertToMegaGigaForNumber} from "../common/PageMonitoringCommonService";

type Props = {
    filteredUsageList: any,
};

function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
}

export default function PerformanceSummaryForCluster(props: Props) {
    //const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    useEffect(() => {
    }, [props.filteredUsageList]);


    function handleRowClicked(item, hwType) {
        try {
            let clusterAndCloudlet = item.cluster.toString() + ' | ' + item.cloudlet.toString()
            let lineChartDataSet = makeLineChartData(props.parent.state.filteredClusterUsageList, hwType, props.parent)
            clusterAndCloudlet = clusterAndCloudlet.toString().split(" | ")[0] + "|" + clusterAndCloudlet.toString().split(" | ")[1]
            handleLegendAndBubbleClickedEvent(props.parent, clusterAndCloudlet, lineChartDataSet)
        } catch (e) {
        }
    }


    return (
        <React.Fragment>
            <div
                className='draggable'
                style={{
                    display: 'flex',
                    width: '100%',
                    height: 45,
                    //backgroundColor: 'red'
                }}
            >
                <Tooltip placement="top" title={'To view a chart of each hardware usage,\n' +
                'Click the cell.'}>
                    <div className='page_monitoring_title draggable'
                         style={{
                             flex: .2,
                             marginTop: 5,
                             //backgroundColor: 'red'
                         }}
                    >
                        {props.parent.state.currentClassification} Performance Summary
                    </div>
                    <div style={{flex: .7}} className='draggable'>
                    </div>
                </Tooltip>
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
                <Table size="small" aria-label="a dense table " style={{width: '100%', overflowX: 'scroll',}}
                       stickyHeader={true}>

                    <TableHead style={{backgroundColor: 'red', fontFamily: 'Roboto', fontSize: 20}} fixedHeader={true}>
                        <TableRow>
                            <TableCell padding={'none'} align="center" style={{}}>
                            </TableCell>
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
                                        {numberWithCommas(convertByteToMegaGigaByte(item.sumRecvBytes.toFixed(0)))}
                                    </TableCell>
                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}
                                               onClick={() => handleRowClicked(item, HARDWARE_TYPE.SENDBYTES)}
                                    >
                                        {numberWithCommas(convertByteToMegaGigaByte(item.sumSendBytes.toFixed(0)))}
                                    </TableCell>

                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}
                                               onClick={() => handleRowClicked(item, HARDWARE_TYPE.TCPCONNS)}
                                    >
                                        {numberWithCommas(convertToMegaGigaForNumber(item.sumTcpConns.toFixed(0)))}
                                    </TableCell>
                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}
                                               onClick={() => handleRowClicked(item, HARDWARE_TYPE.TCPRETRANS)}
                                    >
                                        {numberWithCommas(convertToMegaGigaForNumber(item.sumTcpRetrans.toFixed(0)))}
                                    </TableCell>
                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}
                                               onClick={() => handleRowClicked(item, HARDWARE_TYPE.UDPRECV)}
                                    >

                                        {numberWithCommas(convertToMegaGigaForNumber(item.sumUdpRecv.toFixed(0)))}
                                    </TableCell>
                                    <TableCell padding={'none'} align="center" style={{width: 'auto', color: '#C0C6C8'}}
                                               onClick={() => handleRowClicked(item, HARDWARE_TYPE.UDPSENT)}
                                    >
                                        {numberWithCommas(convertToMegaGigaForNumber(item.sumUdpSent.toFixed(0)))}
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
