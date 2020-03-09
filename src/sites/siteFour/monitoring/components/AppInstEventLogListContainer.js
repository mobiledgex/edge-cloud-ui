// @flow
import * as React from 'react';
import {Table} from "semantic-ui-react";
import {Tooltip} from "antd";
import {PageMonitoringStyles, renderPlaceHolderCircular} from "../PageMonitoringCommonService";
import {CircularProgress} from "@material-ui/core";
import PageDevMonitoring from "../dev/PageDevMonitoring";

type Props = {
    eventLogList: any,
    columnList: any,
    parent: PageDevMonitoring,
};
type State = {
    eventLogList: any,
    columnList: any,
    loading: boolean,
};

export default class AppInstEventLogListContainer extends React.Component<Props, State> {


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
                        flex: .2,
                        marginTop: 8,
                        alignSelf: 'center',
                    }}>
                        App Inst Event Log
                    </div>
                    <div style={{
                        flex: .8,
                        marginRight: 70, alignItems: 'flex-start', marginTop: 8, color: 'yellow', alignSelf: 'center',
                    }} className={'page_monitoring_title'}>
                        {this.props.parent.state.currentAppInst}
                    </div>

                </div>
                <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing styles={{zIndex: 999999999999, overflowY: 'auto'}}>
                    <Table.Header className="viewListTableHeader" styles={{zIndex: 99999999999}}>
                        <Table.Row>
                            <Table.HeaderCell>
                                TIME
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                APP
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
                                EVENT
                            </Table.HeaderCell>
                            <Table.HeaderCell>
                                STATUS
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {this.state.eventLogList.length === 0 &&
                    <Table.Body className="tbBodyList">
                        <Table.Row warning={true} className='page_monitoring_popup_table_row' style={PageMonitoringStyles.noData2}>
                            <Table.Cell positive={false}>No Event Log</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                    }

                    <Table.Body isSorted={true} className="tbBodyList">
                        {this.props.parent.state.loading &&
                        renderPlaceHolderCircular()
                        }
                        {!this.props.parent.state.loading && this.state.eventLogList !== undefined && this.state.eventLogList.map((item, index) => {
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
                                            {/*todo:appInst*/}
                                            {item[1]}
                                        </Table.Cell>
                                    </Tooltip>
                                    <Table.Cell>
                                        {/*todo:Cluster*/}
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
