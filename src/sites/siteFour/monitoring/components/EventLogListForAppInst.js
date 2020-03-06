// @flow
import * as React from 'react';
import {Table} from "semantic-ui-react";
import {Tooltip} from "antd";
import {PageMonitoringStyles, renderPlaceHolderCircular} from "../PageMonitoringCommonService";
import {CircularProgress} from "@material-ui/core";

type Props = {
    eventLogList: any,
    columnList: any,
};
type State = {
    eventLogList: any,
    columnList: any,
    loading: boolean,
};

export default class EventLogListForAppInst extends React.Component<Props, State> {


    constructor(props: Props) {
        super(props)
        this.state = {
            eventLogList: [],
            columnList: [],
            loading: false,
        }
    }

    componentDidMount(): void {
        this.setState({
            eventLogList: this.props.eventLogList.values,
            columnList: this.props.eventLogList.columns,
        }, () => {
            //alert(JSON.stringify(this.state.eventLogList))
        })
    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {

        if (this.props.eventLogList.values !== nextProps.eventLogList.values) {
            this.setState({
                eventLogList: nextProps.eventLogList.values,
                columnList: nextProps.eventLogList.columns,
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
                        App Inst Event Log
                    </div>
                    <div style={{flex: .4, marginRight: 70}}>
                    </div>

                </div>
                <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing
                       styles={{zIndex: 999999999999}}>
                    <Table.Header className="viewListTableHeader" styles={{zIndex: 99999999999}}>
                        <Table.Row>
                            {this.state.columnList.map(item => {
                                return (
                                    <Table.HeaderCell>
                                        {item.toUpperCase()}
                                    </Table.HeaderCell>
                                )
                            })}
                        </Table.Row>
                    </Table.Header>
                    {this.state.eventLogList.length === 0 &&
                    <Table.Body className="tbBodyList">
                        <Table.Row warning={true} className='page_monitoring_popup_table_row' style={PageMonitoringStyles.noData2}>
                            No Event Log
                        </Table.Row>
                    </Table.Body>
                    }

                    <Table.Body isSorted={true} className="tbBodyList">
                        {this.state.loading &&
                        renderPlaceHolderCircular()
                        }

                        {this.state.eventLogList.map((item, index) => {
                            return (
                                <Table.Row className='page_monitoring_popup_table_row'
                                           onClick={async () => {

                                               //let dataSet = AppInst + " | " + item.Cloudlet.trim() + " | " + Cluster + " | " + Region;

                                               let AppName = item[1]
                                               let Cloudlet = item[4]
                                               let Cluster = item[2]
                                               let currentAppInst = AppName + " | " + Cloudlet + " | " + Cluster + " | ";

                                               this.setState({
                                                   loading: true,
                                               }, () => {
                                                   this.props.handleAppInstDropdown(currentAppInst)
                                               })


                                           }}
                                >
                                    <Table.Cell>
                                        {item[0].toString().split('T')[0]}
                                        {`\n\n`}
                                        {item[0].toString().split('T')[1].substring(0, 8)}
                                    </Table.Cell>
                                    <Tooltip
                                        placement="topLeft"
                                        title={
                                            <div>
                                                <p>{item[1]}</p>
                                            </div>
                                        }
                                    >
                                        <Table.Cell>
                                            {item[1]}
                                        </Table.Cell>
                                    </Tooltip>
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
                                </Table.Row>
                            )
                        })}
                    </Table.Body>
                </Table>
            </>


        )
    };
};
