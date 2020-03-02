// @flow
import * as React from 'react';
import {Table} from "semantic-ui-react";
import {Tooltip} from "antd";

type Props = {
    eventLogList: any,

};
type State = {
    eventLogList: any,
};

export default class EventLogList extends React.Component<Props, State> {


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
                    height: 45
                }}>
                    <div className='page_monitoring_title' style={{
                        backgroundColor: 'transparent',
                        flex: .38,
                        marginTop: 5,
                    }}>
                        Cluster Event Log
                    </div>
                    <div style={{flex: .4, marginRight: 70}}>
                    </div>

                </div>
                <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing
                       styles={{zIndex: 999999999999}}>
                    <Table.Header className="viewListTableHeader" styles={{zIndex: 99999999999}}>
                        <Table.Row>
                            <Table.HeaderCell>
                                TIME
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                CLUSTER
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                DEV
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                CLOUDLET
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                OPERATOR
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                FLAVOR
                            </Table.HeaderCell>

                            <Table.HeaderCell>
                                VCPU
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                RAM
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                DISK
                            </Table.HeaderCell>
                          {/*  <Table.HeaderCell>
                                other
                            </Table.HeaderCell>*/}
                            <Table.HeaderCell>
                                EVENT
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                STATUS
                            </Table.HeaderCell>

                        </Table.Row>
                    </Table.Header>
                    <Table.Body className="tbBodyList">
                        {this.state.eventLogList.map((item, index) => {
                            return (
                                <Table.Row className='page_monitoring_popup_table_row'
                                           onClick={() => {
                                           }}
                                >
                                    {/*
                                    "time",0
                                    "cluster",1
                                    "dev",2
                                    "cloudlet",3
                                    "operator",4
                                    "flavor",5
                                    "vcpu",6
                                    "ram",7
                                    "disk",8
                                    "other",9
                                    "event",10
                                    "status",11
                                */}
                                    <Table.Cell>
                                        {item[0].toString().split('T')[0]}
                                        {`\n\n`}
                                        {item[0].toString().split('T')[1].substring(0, 8)}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item[1]}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item[2]}
                                    </Table.Cell>
                                    <Tooltip
                                        placement="topLeft"
                                        title={
                                            <div>
                                                <p>{item[3]}</p>
                                            </div>
                                        }
                                    >
                                        <Table.Cell>
                                            {item[3]}
                                        </Table.Cell>
                                    </Tooltip>

                                    <Table.Cell>
                                        {item[4]}
                                    </Table.Cell>
                                    <Tooltip
                                        placement="topLeft"
                                        title={
                                            <div>
                                                <p>{item[5]}</p>
                                            </div>
                                        }
                                    >
                                        <Table.Cell>
                                            {item[5]}
                                        </Table.Cell>
                                    </Tooltip>

                                    <Table.Cell>
                                        {item[6]}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item[7]}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item[8]}
                                    </Table.Cell>
                                    {/*<Table.Cell>
                                        {item[9]}
                                    </Table.Cell>*/}
                                    <Table.Cell>
                                        {item[10]}
                                    </Table.Cell>
                                    <Table.Cell>
                                        {item[11]}
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
