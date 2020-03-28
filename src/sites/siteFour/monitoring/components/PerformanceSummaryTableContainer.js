// @flow
import * as React from 'react';
import {HARDWARE_TYPE} from "../../../../shared/Constants";
import {Table} from "semantic-ui-react";
import {Progress, Tooltip} from "antd";
import type {TypeClusterUsageList} from "../../../../shared/Types";
import {numberWithCommas} from "../PageMonitoringCommonService";
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
            }, () => {
                //alert(JSON.stringify(this.state.eventLogList))
            })
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
                    <div className='page_monitoring_title' style={{
                        backgroundColor: 'transparent',
                        flex: .38,
                        marginTop: 5,
                    }}>
                        Performance Summary
                    </div>
                    <div style={{flex: .4, marginRight: 70}}>
                    </div>

                </div>
                <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing
                       styles={{zIndex: 999999999999}}>
                    <Table.Header className="viewListTableHeader" styles={{zIndex: 99999999999}}>
                        <Table.Row>
                            <Table.HeaderCell>
                                Cluster
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                CPU(%)
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                MEM
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                DISK
                            </Table.HeaderCell>
                            <Tooltip
                                placement="topLeft"
                                title={
                                    <div>
                                        <p>NETWORK RECV</p>
                                    </div>
                                }
                            >
                                <Table.HeaderCell>
                                    NETWORK RECV
                                </Table.HeaderCell>
                            </Tooltip>

                            <Tooltip
                                placement="topLeft"
                                title={
                                    <div>
                                        <p>NETWORK SENT</p>
                                    </div>
                                }
                            >
                                <Table.HeaderCell>
                                    NETWORK SENT
                                </Table.HeaderCell>
                            </Tooltip>

                            <Table.HeaderCell>
                                TCP CONN
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                TCP RETRANS
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                UDP REV
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                UDP SENT
                            </Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>
                    <Table.Body className="tbBodyList"
                    >
                        {clusterUsageList.map((item: TypeClusterUsageList, index) => {
                            return (
                                <Table.Row className='page_monitoring_popup_table_row'

                                           onClick={() => {
                                               try {
                                                   let cluster_cloudlet = item.cluster.toString() + ' | ' + item.cloudlet.toString()
                                                   let lineChartDataSet = makeLineChartDataForCluster(this.props.parent.state.filteredClusterUsageList, this.props.parent.state.currentHardwareType, this.props.parent)
                                                   cluster_cloudlet = cluster_cloudlet.toString().split(" | ")[0] + "|" + cluster_cloudlet.toString().split(" | ")[1]
                                                   handleLegendAndBubbleClickedEvent(this.props.parent, cluster_cloudlet, lineChartDataSet)

                                               } catch (e) {

                                               }
                                           }}
                                >
                                    <Table.Cell>
                                        {item.cluster}<br/>[{item.cloudlet}]
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <div>
                                                {item.sumCpuUsage.toFixed(2) + '%'}
                                            </div>
                                            <div>
                                                <Progress style={{width: '100%'}} strokeLinecap={'square'} strokeWidth={10}
                                                          showInfo={false}
                                                          percent={(item.sumCpuUsage / this.props.parent.state.maxCpu * 100)}
                                                    //percent={(item.sumCpuUsage / _this.state.gridInstanceListCpuMax) * 100}
                                                          strokeColor={'#29a1ff'} status={'normal'}/>
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <div>
                                            <div>
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
                                        {numberWithCommas(item.sumDiskUsage.toFixed(2)) + ' %'}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.sumRecvBytes.toFixed(2)) + ' '}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.sumSendBytes.toFixed(2)) + ' '}
                                    </Table.Cell>

                                    <Table.Cell>
                                        {numberWithCommas(item.sumTcpConns.toFixed(2)) + ' '}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.sumTcpRetrans.toFixed(2)) + ' '}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.sumUdpRecv.toFixed(2)) + ' '}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {numberWithCommas(item.sumUdpSent.toFixed(2)) + ' '}
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
