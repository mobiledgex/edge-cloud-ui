// @flow
import * as React from 'react';
import {HARDWARE_TYPE} from "../../../../shared/Constants";
import {Table} from "semantic-ui-react";
import {Progress, Tooltip} from "antd";
import type {TypeClusterUsageList} from "../../../../shared/Types";
import {numberWithCommas, PageMonitoringStyles} from "../PageMonitoringCommonService";
import {handleLegendAndBubbleClickedEvent, makeLineChartDataForCluster, sortUsageListByTypeForCluster} from "../dev/PageDevMonitoringService";

type Props = {
    clusterUsageList: any,
};
type State = {
    clusterUsageList: any,
};

export default class PerformanceSummaryTableContainer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            clusterUsageList: [],
        }
    }

    componentDidMount(): void {
        this.setState({
            clusterUsageList: this.props.clusterUsageList,
        }, () => {
            //alert(JSON.stringify(this.state.eventLogList))
        })
    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        if (this.props.clusterUsageList !== nextProps.clusterUsageList) {
            this.setState({
                clusterUsageList: nextProps.clusterUsageList,
            });
        }
    }

    handleRowClicked(item) {
        try {
            let clusterAndCloudlet = item.cluster.toString() + ' | ' + item.cloudlet.toString()
            let lineChartDataSet = makeLineChartDataForCluster(this.props.parent.state.filteredClusterUsageList, this.props.parent.state.currentHardwareType, this.props.parent)
            clusterAndCloudlet = clusterAndCloudlet.toString().split(" | ")[0] + "|" + clusterAndCloudlet.toString().split(" | ")[1]
            handleLegendAndBubbleClickedEvent(this.props.parent, clusterAndCloudlet, lineChartDataSet)

        } catch (e) {
            console.log("error===>", e);
        }
    }

    render() {
        let clusterUsageList = sortUsageListByTypeForCluster(this.state.clusterUsageList, HARDWARE_TYPE.CPU)
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
                             fontFamily: 'Ubuntu'
                         }}
                    >
                        Performance Summary
                    </div>
                    <div style={{flex: .4, marginRight: 70}}>
                    </div>

                </div>
                <Table className="" basic='very' sortable striped celled fixed collapsing
                       styles={{zIndex: 999999999999}}>
                    <div>
                        <Table.Row style={PageMonitoringStyles.tableHeaderRow}>
                            <Table.HeaderCell>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    Cluster
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    CPU(%)
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    MEM
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    DISK
                                </div>
                            </Table.HeaderCell>

                            <Table.HeaderCell>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    NETWORK RECV
                                </div>
                            </Table.HeaderCell>


                            <Table.HeaderCell>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    NETWORK SENT
                                </div>
                            </Table.HeaderCell>

                            <Table.HeaderCell>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    TCP CONN
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    TCP RETRANS
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    UDP REV
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    UDP SENT
                                </div>
                            </Table.HeaderCell>
                        </Table.Row>
                    </div>
                    <Table.Body className="tbBodyList"
                    >
                        {clusterUsageList.map((item: TypeClusterUsageList, index) => {
                            return (
                                <Table.Row
                                    style={PageMonitoringStyles.tableRow}
                                    onClick={() => this.handleRowClicked(item)}
                                >
                                    <Table.Cell>
                                        <div style={PageMonitoringStyles.gridTableCellAlignLeft}>
                                            {item.cluster.toString().substring(0, 15) + ".."}<br/>[{item.cloudlet.toString().substring(0, 15) + ".."}]
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <div style={PageMonitoringStyles.cellFirstRow}>
                                                {item.sumCpuUsage.toFixed(2) + '%'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'} strokeWidth={10}
                                                          showInfo={false}
                                                          percent={(item.sumCpuUsage / this.props.parent.state.maxCpu * 100)}
                                                          strokeColor={'#29a1ff'} status={'normal'}/>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <div style={PageMonitoringStyles.cellFirstRow}>
                                                {numberWithCommas(item.sumMemUsage.toFixed(2)) + ' %'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'} strokeWidth={10}
                                                          showInfo={false}
                                                          percent={(item.sumMemUsage / this.props.parent.state.maxMem * 100)}
                                                          strokeColor={'#29a1ff'} status={'normal'}/>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {numberWithCommas(item.sumDiskUsage.toFixed(2)) + ' %'}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {numberWithCommas(item.sumRecvBytes.toFixed(2)) + ' '}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {numberWithCommas(item.sumSendBytes.toFixed(2)) + ' '}
                                        </div>
                                    </Table.Cell>

                                    <Table.Cell>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {numberWithCommas(item.sumTcpConns.toFixed(2)) + ' '}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {numberWithCommas(item.sumTcpRetrans.toFixed(2)) + ' '}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {numberWithCommas(item.sumUdpRecv.toFixed(2)) + ' '}
                                        </div>
                                    </Table.Cell>
                                  {/*  <Table.Cell>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {numberWithCommas(item.sumUdpSent.toFixed(2)) + ' '}
                                        </div>
                                    </Table.Cell>*/}

                                </Table.Row>

                            )
                        })}
                    </Table.Body>
                </Table>
            </>


        )
    };
};
