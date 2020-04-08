// @flow
import * as React from 'react';
import {Table} from "semantic-ui-react";
import {PageMonitoringStyles} from "../PageMonitoringCommonService";
import {CircularProgress} from "@material-ui/core";
import PageDevMonitoring from "../dev/PageDevMonitoring";
import {FixedSizeList} from "react-window";
import '../PageMonitoring.css'

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

export default class MiniAppInstEventLogListContainerForVirtualScroll extends React.Component<Props, State> {

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
                             flex: .6,
                             marginTop: 10,
                             fontFamily: 'Ubuntu',
                             //backgroundColor: 'red',
                         }}
                    >
                        App Inst Event Log
                    </div>
                    <div style={{flex: .4, marginRight: 70}}>
                    </div>

                </div>
                <div style={{marginTop: 11}}>
                    <Table className="" basic='very' sortable striped celled fixed collapsing styles={{zIndex: 999999999999, overflowY: 'hidden'}}>
                        <div>
                            <Table.Row style={PageMonitoringStyles.tableHeaderRow}>
                                <Table.HeaderCell textAlign={'center'}>
                                    <div style={PageMonitoringStyles.gridHeader}>
                                        TIME
                                    </div>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign={'center'}>
                                    <div style={PageMonitoringStyles.gridHeader}>
                                        APP
                                    </div>
                                </Table.HeaderCell>
                                <Table.HeaderCell textAlign={'center'}>
                                    <div style={PageMonitoringStyles.gridHeader}>
                                        EVENT[STATUS]
                                    </div>
                                </Table.HeaderCell>
                                {/* <Table.HeaderCell textAlign={'center'}>
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
                                </Table.HeaderCell>*/}
                            </Table.Row>
                        </div>
                        {!this.props.parent.state.loading && this.state.eventLogList.length === 0 &&
                        <table style={{height: 190, width: 400, backgroundColor: 'transparent'}}>
                            <tr colspan={3} style={{height: 190, display: 'flex', fontSize: 15, justifyContent: 'center', alignItems: 'center', marginLeft: 10,}}>
                                no data
                            </tr>
                        </table>
                        }

                        <tbody style={{display: 'flex', marginTop: 0}}>
                        {this.props.parent.state.loading &&
                        <div
                            style={PageMonitoringStyles.center4}>
                            <CircularProgress style={{color: '#70b2bc', zIndex: 1, fontSize: 100}}/>
                        </div>
                        }

                        {/*Desc:tableBody*/}
                        {/*Desc:tableBody*/}
                        {/*Desc:tableBody*/}
                        {!this.props.parent.state.loading && this.state.eventLogList !== undefined &&
                        <FixedSizeList
                            height={190}//desc:table_Body_Height
                            itemCount={this.state.eventLogList.length}
                            itemSize={50}
                            style={{backgroundColor: 'black', display: 'flex', alignSelf: 'center', marginTop: 0, marginRight: 0, overFlowY: 'auto'}}
                            width={400}
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
                                            {/*appName*/}
                                            <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableCell3 : PageMonitoringStyles.gridTableCell4}>
                                                <div>
                                                    {eventLogList[index][1].toString().substring(0, 15) + ".."}
                                                </div>
                                            </td>
                                            <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableCell3 : PageMonitoringStyles.gridTableCell4}>
                                                {/*event*/}
                                                <div>
                                                    <div>
                                                        {eventLogList[index][5]}
                                                    </div>
                                                    {/*Status*/}
                                                    <div>
                                                        [{eventLogList[index][6]}]
                                                    </div>
                                                </div>
                                            </td>
                                            {/* <td style={index % 2 === 0 ? PageMonitoringStyles.gridTableCell3 : PageMonitoringStyles.gridTableCell4}>
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
                                            </td>*/}
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
