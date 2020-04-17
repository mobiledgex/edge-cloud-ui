// @flow
import * as React from 'react';
import {Table} from "semantic-ui-react";
import {Progress} from "antd";
import type {TypeClusterUsageList} from "../../../../shared/Types";
import {PageMonitoringStyles} from "../PageMonitoringCommonService";
import {handleLegendAndBubbleClickedEvent, makeLineChartDataForCluster} from "../dev/PageDevMonitoringService";
import Tooltip from "antd/es/tooltip";

type Props = {
    filteredUsageList: any,
};
type State = {
    filteredUsageList: any,
};

export default class PerformanceSummaryTableContainer extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props)
        this.state = {
            filteredUsageList: [],
        }
    }

    componentDidMount(): void {
        this.setState({
            filteredUsageList: this.props.filteredUsageList,
        }, () => {
            console.log("clusterUsageList===>", this.state.filteredUsageList);
        })
    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {
        if (this.props.filteredUsageList !== nextProps.filteredUsageList) {
            this.setState({
                filteredUsageList: nextProps.filteredUsageList,
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
        return (
            <>
                <div
                    className='draggable'
                    style={{
                        display: 'flex',
                        width: '100%',
                        height: 45
                    }}>
                    <div className='page_monitoring_title'
                         style={{
                             flex: 1,
                             marginTop: 5,
                             fontFamily: 'Ubuntu',
                             //backgroundColor:'red'
                         }}
                    >
                        Cluster Performance Summary
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
                        {this.state.filteredUsageList.map((item: TypeClusterUsageList, index) => {
                            return (
                                <Table.Row
                                    style={PageMonitoringStyles.tableRow}
                                    //onClick={() => this.handleRowClicked(item)}
                                >

                                    <Tooltip placement="topLeft" title={item.cluster.toString() + "\n[" + item.cloudlet.toString() + "]"}>
                                        <Table.Cell>
                                            <div style={{display: "flex",}}>
                                                {/*desc: ##############*/}
                                                {/*desc: circle area   */}
                                                {/*desc: ##############*/}
                                                <div style={{backgroundColor: 'yellow', marginBottom: 5, marginTop: 5, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                                    <div style={{
                                                        backgroundColor: this.props.parent.state.chartColorList[index],
                                                        width: 15,
                                                        height: 15,
                                                        borderRadius: 50,
                                                    }}>
                                                    </div>
                                                </div>
                                                <div style={PageMonitoringStyles.gridTableCellAlignLeft}>
                                                    {item.cluster.toString().substring(0, 15) + ".."}<br/>[{item.cloudlet.toString().substring(0, 15) + ".."}]
                                                </div>
                                            </div>
                                        </Table.Cell>
                                    </Tooltip>

                                    <Table.Cell>
                                        <div>
                                            <div style={PageMonitoringStyles.cellFirstRow}>
                                                {item.sumCpuUsage.toFixed(2) + '%'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'}
                                                          strokeWidth={10}
                                                          showInfo={false}
                                                          percent={item.sumCpuUsage.toFixed(0)}
                                                          strokeColor={this.props.parent.state.chartColorList[index]}

                                                          status={'normal'}/>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <div style={PageMonitoringStyles.cellFirstRow}>
                                                {numberWithCommas(item.sumMemUsage.toFixed(2)) + ' %'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'}
                                                          strokeWidth={10}
                                                          showInfo={false}
                                                          percent={item.sumMemUsage.toFixed(0)}
                                                          strokeColor={this.props.parent.state.chartColorList[index]}
                                                          status={'normal'}/>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <div style={PageMonitoringStyles.cellFirstRow}>
                                                {numberWithCommas(item.sumDiskUsage.toFixed(2)) + ' %'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'}
                                                          strokeWidth={10}
                                                          showInfo={false}
                                                          percent={item.sumDiskUsage.toFixed(0)}
                                                          strokeColor={this.props.parent.state.chartColorList[index]}
                                                          status={'normal'}/>
                                            </div>
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
                                    <Table.Cell>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {numberWithCommas(item.sumUdpSent.toFixed(2)) + ' '}
                                        </div>
                                    </Table.Cell>

                                </Table.Row>

                            )
                        })}
                    </Table.Body>
                </Table>
            </>


        )
    };
};
