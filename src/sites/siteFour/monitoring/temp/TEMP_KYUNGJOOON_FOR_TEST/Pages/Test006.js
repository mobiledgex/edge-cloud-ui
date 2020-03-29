import React from "react";


import {Grid, Table} from "semantic-ui-react";
import {Tooltip} from "antd";
import './../../../../../../css/index.css'
import './../../../../../../css/pages/monitoring.css'
import "./styles.css";

type Props = {};
type State = {};


export default class Test006 extends React.Component<Props, State> {
    render() {
        return (
            <Grid.Row className='site_content_body' style={{overflowY: 'auto', marginTop: -20}}>
                <div className="page_monitoring" style={{backgroundColor: 'transparent', height: 3250}}>
                    <div className='page_monitoring_dashboard_kyungjoon' style={{}}>
                        <React.Fragment style={{backgroundColor: 'red'}}>
                            <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing
                                   styles={{zIndex: 999999999999, backgroundColor: 'green'}}>
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
                                    <Table.Row className='page_monitoring_popup_table_row'
                                    >
                                        <Table.Cell>
                                            sdfksd;lfsd;lf
                                        </Table.Cell>

                                        <Table.Cell>
                                            sdfksd;lfsd;lf
                                        </Table.Cell>
                                        <Table.Cell>
                                            sdfksd;lfsd;lf
                                        </Table.Cell>
                                        <Table.Cell>
                                            sdfksd;lfsd;lf
                                        </Table.Cell>
                                        <Table.Cell>
                                            sdfksd;lfsd;lf
                                        </Table.Cell>
                                        <Table.Cell>
                                            sdfksd;lfsd;lf
                                        </Table.Cell>
                                        <Table.Cell>
                                            sdfksd;lfsd;lf
                                        </Table.Cell>
                                        <Table.Cell>
                                            sdfksd;lfsd;lf
                                        </Table.Cell>
                                        <Table.Cell>
                                            sdfksd;lfsd;lf
                                        </Table.Cell>
                                        <Table.Cell>
                                            sdfksd;lfsd;lf
                                        </Table.Cell>

                                    </Table.Row>
                                </Table.Body>
                            </Table>

                        </React.Fragment>
                    </div>
                </div>
            </Grid.Row>


        );
    };
};
