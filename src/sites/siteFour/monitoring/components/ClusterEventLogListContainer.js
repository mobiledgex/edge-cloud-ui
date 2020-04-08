// @flow
import * as React from 'react';
import {Table} from "semantic-ui-react";
import {Tooltip} from "antd";
import {PageMonitoringStyles} from "../PageMonitoringCommonService";

type Props = {
    eventLogList: any,

};
type State = {
    eventLogList: any,
};

export default class ClusterEventLogListContainer extends React.Component<Props, State> {


    constructor(props: Props) {
        super(props)
        this.state = {
            eventLogList: [],
        }
    }

    componentDidMount(): void {
        this.setState({
            eventLogList: this.props.eventLogList,
        }, () => {
            //alert(JSON.stringify(this.state.eventLogList))
        })
    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {

        if (this.props.eventLogList !== nextProps.eventLogList) {
            this.setState({
                eventLogList: nextProps.eventLogList,
            }, () => {
                //alert(JSON.stringify(this.state.eventLogList))
            })
        }

    }


    render() {
        return (
            <>
                <div style={{
                    display: 'flex',
                    width: '100%',
                    height: 25
                }}>
                    <div className='page_monitoring_title' style={{
                        flex: .38,
                        marginTop: 5,
                        fontFamily: 'Ubuntu'
                    }}>
                        Cluster Event Log
                    </div>
                    <div style={{flex: .4, marginRight: 70}}>
                    </div>

                </div>
                <Table basic='very' sortable striped celled fixed collapsing
                       styles={{zIndex: 999999999999}}>
                    <div>
                        <Table.Row style={PageMonitoringStyles.tableHeaderRow}>
                            <Table.HeaderCell style={{flex: .1}}>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    TIME
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{flex: .1}}>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    CLUSTER
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{flex: .1}}>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    DEV
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{flex: .2}}>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    CLOUDLET
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{flex: .1}}>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    OPERATOR
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{flex: .1}}>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    VCPU
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{flex: .1}}>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    RAM
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{flex: .1}}>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    DISK
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{flex: .1}}>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    EVENT
                                </div>
                            </Table.HeaderCell>
                            <Table.HeaderCell style={{flex: .1}}>
                                <div style={PageMonitoringStyles.gridHeader}>
                                    STATUS
                                </div>
                            </Table.HeaderCell>

                        </Table.Row>
                    </div>
                    {this.state.eventLogList.length === 0 &&
                    <Table.Body className="tbBodyList">
                        <Table.Row warning={true} className='page_monitoring_popup_table_row' style={PageMonitoringStyles.noData2}>
                            No Event Log
                        </Table.Row>
                    </Table.Body>
                    }

                    {/*
                        "time",0  "cluster",1  "dev",2 "cloudlet",3 "operator",4 "flavor",5  "vcpu",6   "ram",7 "disk",8"other",9 "event",10"status",11
                   */}
                    <Table.Body className="tbBodyList">
                        {this.state.eventLogList.map((item, index) => {
                            return (
                                <Table.Row style={PageMonitoringStyles.tableRowCompact}>
                                    <Table.Cell style={{flex: .1}}>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {item[0].toString().split('T')[0]}
                                            {`\n\n`}
                                            {item[0].toString().split('T')[1].substring(0, 8)}
                                        </div>
                                    </Table.Cell>

                                    <Table.Cell style={{flex: .1}}>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {item[1]}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell style={{flex: .1}}>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {item[2]}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell style={{flex: .2}}>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {item[3]}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell style={{flex: .1}}>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {item[5]}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell style={{flex: .1}}>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {item[6]}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell style={{flex: .1}}>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {item[7]}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell style={{flex: .1}}>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {item[8]}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell style={{flex: .1}}>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {item[10]}
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell style={{flex: .1}}>
                                        <div style={PageMonitoringStyles.gridTableCell2}>
                                            {item[11]}
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
