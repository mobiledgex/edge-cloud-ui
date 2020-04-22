import React, {useEffect, useState} from 'react';
import {Table} from "semantic-ui-react";
import {PageMonitoringStyles, renderPlaceHolderSkeleton} from "../PageMonitoringCommonService";
import '../PageMonitoring.css'


export default function ClusterEventLogListHook(props) {
    const [eventLogList, setEventLogList] = useState([]);

    useEffect(() => {
        if (props.eventLogList !== undefined) {

        } else {
            setEventLogList([])
        }
    }, [props.eventLogList]);

    return (
        <>
            <div style={{
                display: 'flex',
                width: '100%',
                height: 25
            }}>
                <div className='page_monitoring_title' style={{
                    flex: .6,
                    marginTop: 15,
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
                    <Table.Row style={PageMonitoringStyles.tableHeaderRow2}>
                        <Table.HeaderCell style={{flex: .3, padding: 0}}>
                            <div style={PageMonitoringStyles.gridHeaderSmallCenter}>
                                TIME
                            </div>
                        </Table.HeaderCell>
                        <Table.HeaderCell style={{flex: .4, padding: 0}}>
                            <div style={PageMonitoringStyles.gridHeaderSmall}>
                                <div>
                                    CLUSTER
                                </div>
                                <div>
                                    [CLOUDLET]
                                </div>
                            </div>
                        </Table.HeaderCell>
                        <Table.HeaderCell style={{flex: .3, padding: 0}}>
                            <div style={PageMonitoringStyles.gridHeaderSmallCenter}>
                                <div>
                                    EVENT
                                </div>
                                <div>
                                    [STATUS]
                                </div>
                            </div>
                        </Table.HeaderCell>

                    </Table.Row>
                </div>
                {!props.parent.state.loading && eventLogList.length === 0 &&
                <table style={{height: 155, width: 360, backgroundColor: 'transparent'}}>
                    <tr colspan={3} style={{height: 155, display: 'flex', fontSize: 15, justifyContent: 'center', alignItems: 'center', marginLeft: 0,}}>
                        No Event Log
                    </tr>
                </table>
                }
                {/*
                        "time",0  "cluster",1  "dev",2 "cloudlet",3 "operator",4 "flavor",5  "vcpu",6   "ram",7 "disk",8"other",9 "event",10"status",11
                   */}
                <Table.Body className="">
                    {!props.parent.state.loading ?
                        eventLogList.map((item, index) => {
                            return (
                                <Table.Row style={PageMonitoringStyles.tableRowFat} className='gridTableCell'>
                                    <Table.Cell style={{flex: .3, padding: 0, alignSelf: 'center'}}>
                                        <div style={PageMonitoringStyles.gridTableCell3Dash2}>
                                            {item[0].toString().split('T')[0]}
                                            {`\n\n`}
                                            {item[0].toString().split('T')[1].substring(0, 8)}
                                        </div>
                                    </Table.Cell>

                                    <Table.Cell style={{flex: .4, padding: 0}}>
                                        <div style={PageMonitoringStyles.gridTableCell3Dash}>
                                            <div>
                                                {item[1]}
                                            </div>
                                            <div>
                                                [{item[3]}]
                                            </div>
                                        </div>
                                    </Table.Cell>
                                    <Table.Cell style={{flex: .3, padding: 0}}>
                                        <div className={''} style={PageMonitoringStyles.gridTableCell3Dash1}>
                                            <div>
                                                {item[10]}
                                            </div>
                                            <div>
                                                {item[11]}
                                            </div>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            )
                        })
                        :
                        renderPlaceHolderSkeleton()
                    }
                </Table.Body>
            </Table>
        </>
    )

}
