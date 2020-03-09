// @flow
import * as React from 'react';
import {Table} from "semantic-ui-react";
import {Tooltip} from "antd";
import {PageMonitoringStyles, renderPlaceHolderCircular} from "../PageMonitoringCommonService";
import {CircularProgress} from "@material-ui/core";
import PageDevMonitoring from "../dev/PageDevMonitoring";
import {FixedSizeList} from "react-window";

const {Row, Cell, Body, Header, HeaderCell} = Table
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

export default class VirutalAppInstEventLogListContainer extends React.Component<Props, State> {


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
            //  alert(this.state.eventLogList.length)
        })
    }


    async componentWillReceiveProps(nextProps: Props, nextContext: any): void {

        if (this.props.eventLogList !== nextProps.eventLogList) {
            this.setState({
                eventLogList: nextProps.eventLogList,
            }, () => {
                //alert(JSON.stringify(this.state.eventLogList))

                //alert(this.state.eventLogList.length)
            })
        }

    }


    render() {

        let gridHeight = 305
        let gridWidth = window.innerWidth;

        let eventLogList = this.state.eventLogList;

        return (
            <>
                <div style={{
                    display: 'flex',
                    width: '100%',
                    height: 45
                }}>
                    <div className='page_monitoring_title' style={{
                        //backgroundColor: 'red',
                        flex: .13,
                        marginTop: 8,
                        alignSelf: 'center',

                    }}>
                        App Inst Event Log
                    </div>
                    <div style={PageMonitoringStyles.gridTitle2} className={'page_monitoring_title'}>
                        {!this.props.parent.state.loading && this.props.parent.state.currentAppInst.toString()}

                        {/*.split("|")[0].trim()*/}
                    </div>

                </div>
                <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing styles={{zIndex: 999999999999, overflowY: 'auto'}}>
                    <Table.Header className="viewListTableHeader" styles={{zIndex: 99999999999}}>
                        <Table.Row>
                            <Table.HeaderCell textAlign={'center'}>
                                INDEX
                            </Table.HeaderCell>
                            <Table.HeaderCell textAlign={'center'}>
                                TIME
                            </Table.HeaderCell>
                            <Table.HeaderCell textAlign={'center'}>
                                APP
                            </Table.HeaderCell>
                            <Table.HeaderCell textAlign={'center'}>
                                CLUSTER
                            </Table.HeaderCell>
                            <Table.HeaderCell textAlign={'center'}>
                                DEV
                            </Table.HeaderCell>
                            <Table.HeaderCell textAlign={'center'}>
                                CLOUDLET
                            </Table.HeaderCell>
                            <Table.HeaderCell textAlign={'center'}>
                                OPERATOR
                            </Table.HeaderCell>
                            <Table.HeaderCell textAlign={'center'}>
                                EVENT
                            </Table.HeaderCell>
                            <Table.HeaderCell textAlign={'center'}>
                                STATUS
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    {!this.props.parent.state.loading && this.state.eventLogList.length === 0 &&
                    <Table.Body className="tbBodyList">
                        <Table.Row warning={true} className='page_monitoring_popup_table_row' style={PageMonitoringStyles.noData2}>
                            <Table.Cell positive={false}>No Event Log</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                    }

                    <tbody style={{display: 'flex', marginTop: 0}}>
                    {this.props.parent.state.loading &&
                    <div
                        style={PageMonitoringStyles.center3}>

                        <CircularProgress style={{color: '#70b2bc', zIndex: 1, fontSize: 100}}/>

                    </div>
                    }

                    {!this.props.parent.state.loading && this.state.eventLogList !== undefined &&
                    <FixedSizeList
                        className="List"
                        height={gridHeight}
                        itemCount={this.state.eventLogList.length}
                        itemSize={64}
                        style={{backgroundColor: 'black', overFlowY: 'auto', display: 'flex', alignSelf: 'center'}}
                        width={gridWidth}
                    >
                        {({index, style}) => {
                            return (
                                <tr className='page_monitoring_popup_table_row' style={style}
                                >
                                    <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableData : PageMonitoringStyles.gridTableData2}>
                                        <div style={{marginTop: 10}}>
                                            {index}
                                        </div>
                                    </td>
                                    <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableData : PageMonitoringStyles.gridTableData2}>
                                        <div style={{marginTop: 10}}>
                                            {eventLogList[index][0].toString().split('T')[0]}
                                            {`\n\n`}
                                            {eventLogList[index][0].toString().split('T')[1].substring(0, 8)}
                                        </div>
                                    </td>
                                    <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableData : PageMonitoringStyles.gridTableData2}>
                                        <div style={{marginTop: 10}}>
                                            {eventLogList[index][1]}
                                        </div>
                                    </td>
                                    <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableData : PageMonitoringStyles.gridTableData2}>
                                        <div style={{marginTop: 10}}>
                                            {eventLogList[index][2]}
                                        </div>
                                    </td>
                                    <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableData : PageMonitoringStyles.gridTableData2}>
                                        <div style={{marginTop: 10}}>
                                            {eventLogList[index][3]}
                                        </div>
                                    </td>
                                    <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableData : PageMonitoringStyles.gridTableData2}>
                                        <div style={{marginTop: 10}}>
                                            {eventLogList[index][4]}
                                        </div>
                                    </td>
                                    <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableData : PageMonitoringStyles.gridTableData2}>
                                        <div style={{marginTop: 10}}>
                                            {eventLogList[index][5]}
                                        </div>
                                    </td>
                                    <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableData : PageMonitoringStyles.gridTableData2}>
                                        <div style={{marginTop: 10}}>
                                            {eventLogList[index][5]}
                                        </div>
                                    </td>
                                    <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableData : PageMonitoringStyles.gridTableData2}>
                                        <div style={{marginTop: 10}}>
                                            {eventLogList[index][5]}
                                        </div>
                                    </td>
                                </tr>

                            )
                        }}

                    </FixedSizeList>
                    }


                    </tbody>
                </Table>
            </>
        )
    };
};
