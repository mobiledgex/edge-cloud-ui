// @flow
import * as React from 'react';
import {Table} from "semantic-ui-react";
import {PageMonitoringStyles} from "../PageMonitoringCommonService";
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

export default class VirtualAppInstEventLogListContainer extends React.Component<Props, State> {

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
        let gridWidth = window.innerWidth * 0.9;
        let eventLogList = this.state.eventLogList;

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
                        App Inst Event Log
                    </div>
                    <div style={{flex: .4, marginRight: 70}}>
                    </div>

                </div>
                <div style={{marginTop: 15}}>
                    <Table className="" basic='very' sortable striped celled fixed collapsing styles={{zIndex: 999999999999, overflowY: 'hidden'}}>
                        <div>
                            <Table.Row style={PageMonitoringStyles.tableHeaderRow}>
                                <Table.HeaderCell textAlign={'center'}>
                                    <div style={PageMonitoringStyles.gridHeader}>
                                        TIME
                                    </div>
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
                        </div>
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

                        {/*Desc:tableBody*/}
                        {/*Desc:tableBody*/}
                        {/*Desc:tableBody*/}
                        {!this.props.parent.state.loading && this.state.eventLogList !== undefined &&
                        <FixedSizeList
                            height={190}
                            itemCount={this.state.eventLogList.length}
                            itemSize={50}
                            style={{backgroundColor: 'black', display: 'flex', alignSelf: 'center', marginTop: 0, marginRight: 0, overFlowY: 'auto'}}
                            width={gridWidth}
                        >
                            {({index, style}) => {
                                return (
                                    <div style={{}}>
                                        <tr className='' style={style}>
                                            <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableCell3 : PageMonitoringStyles.gridTableCell4}>
                                                <div>
                                                    {eventLogList[index][0].toString().split('T')[0]}
                                                    {`\n\n`}
                                                    {eventLogList[index][0].toString().split('T')[1].substring(0, 8)}
                                                </div>
                                            </td>
                                            <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableCell3 : PageMonitoringStyles.gridTableCell4}>
                                                <div>
                                                    {eventLogList[index][1]}
                                                </div>
                                            </td>
                                            <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableCell3 : PageMonitoringStyles.gridTableCell4}>
                                                <div>
                                                    {eventLogList[index][2]}
                                                </div>
                                            </td>
                                            <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableCell3 : PageMonitoringStyles.gridTableCell4}>
                                                <div>
                                                    {eventLogList[index][3]}
                                                </div>
                                            </td>
                                            <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableCell3 : PageMonitoringStyles.gridTableCell4}>
                                                <div>
                                                    {eventLogList[index][4]}
                                                </div>
                                            </td>
                                            <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableCell3 : PageMonitoringStyles.gridTableCell4}>
                                                <div>
                                                    {eventLogList[index][5]}
                                                </div>
                                            </td>
                                            <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableCell3 : PageMonitoringStyles.gridTableCell4}>
                                                <div>
                                                    {eventLogList[index][5]}
                                                </div>
                                            </td>
                                            <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableCell3 : PageMonitoringStyles.gridTableCell4}>
                                                <div>
                                                    {eventLogList[index][5]}
                                                </div>
                                            </td>
                                        </tr>
                                    </div>

                                )
                            }}

                        </FixedSizeList>
                        }
                        </tbody>
                    </Table>
                </div>
            </>
        )
    };
};
