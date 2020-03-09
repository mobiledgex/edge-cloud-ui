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

        let gridHeight = 270
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
                        backgroundColor: 'transparent',
                        flex: .2,
                        marginTop: 8,
                        alignSelf: 'center',
                    }}>
                        App Inst Event Log
                    </div>
                    <div style={{
                        flex: .8,
                        marginRight: 70, alignItems: 'flex-start', marginTop: 8, color: 'yellow', alignSelf: 'center', justifyContent: 'flex-start'
                    }} className={'page_monitoring_title'}>
                        {this.props.parent.state.currentAppInst.toString()}

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
                    {this.state.eventLogList.length === 0 &&
                    <Table.Body className="tbBodyList">
                        <Table.Row warning={true} className='page_monitoring_popup_table_row' style={PageMonitoringStyles.noData2}>
                            <Table.Cell positive={false}>No Event Log</Table.Cell>
                        </Table.Row>
                    </Table.Body>
                    }

                    <table style={{display: 'flex', marginTop: 0}}>
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
                            itemSize={50}
                            style={{backgroundColor: 'black', overFlowY: 'auto'}}
                            width={gridWidth}
                        >
                            {({index, style}) => {
                                return (
                                    <tr className='page_monitoring_popup_table_row' style={style}

                                        onClick={async () => {

                                            //let dataSet = AppInst + " | " + item.Cloudlet.trim() + " | " + Cluster + " | " + Region;

                                         /*   let AppName = eventLogList[index][1]
                                            let Cloudlet = eventLogList[index][4]
                                            let Cluster = eventLogList[index][2]
                                            let currentAppInst = AppName + " | " + Cloudlet + " | " + Cluster + " | ";

                                            this.setState({
                                                loading: true,
                                            }, () => {
                                                this.props.handleAppInstDropdown(currentAppInst)
                                            })*/


                                        }}
                                    >
                                        <td style={{flex: .15, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                            {index}
                                        </td>
                                        <td style={{flex: .15, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                            {eventLogList[index][0].toString().split('T')[0]}
                                            {`\n\n`}
                                            {eventLogList[index][0].toString().split('T')[1].substring(0, 8)}
                                        </td>
                                        <td style={{flex: .15, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                            {eventLogList[index][1]}
                                        </td>
                                        <td style={{flex: .15, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                            {eventLogList[index][2]}
                                        </td>
                                        <td style={{flex: .15, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                            {eventLogList[index][3]}
                                        </td>
                                        <td style={{flex: .15, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                            {eventLogList[index][4]}
                                        </td>
                                        <td style={{flex: .15, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                            {eventLogList[index][5]}
                                        </td>
                                        <td style={{flex: .15, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                            {eventLogList[index][5]}
                                        </td>
                                        <td style={{flex: .15, backgroundColor: 'black', textAlign: 'center', height: 50}}>
                                            {eventLogList[index][5]}
                                        </td>
                                    </tr>

                                )
                            }}

                        </FixedSizeList>
                        }


                    </table>
                </Table>
            </>
        )
    };
};
