import React, {useEffect} from 'react';
import '../common/PageMonitoringStyles.css'
import {FixedSizeList} from "react-window";
import {makeTableRowStyle, reduceString, renderTitle} from "../service/PageMonitoringService";
import {renderBarLoader, renderEmptyMessageBox} from "../service/PageMonitoringCommonService";
import {PageMonitoringStyles} from "../common/PageMonitoringStyles";
import {FORMAT_FULL_DATE, FORMAT_FULL_TIME, time} from "../../../../utils/date_util";

const FontAwesomeIcon = require('react-fontawesome')

export default function ClusterEventLogList(props) {
    let itemHeight = 55

    const headerStyle = {
        color: 'white', flex: .33,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    }


    useEffect(() => {
    }, [props.eventLogList]);


    function renderHeader() {
        try {
            return (
                <thead>
                <tr style={{display: 'flex', backgroundColor: '#303030', height: 40,}}>
                    <td padding={'none'} align="center" style={headerStyle}>
                        Time
                    </td>
                    <td padding={'none'} align="center" style={headerStyle}>
                        <div>
                            <div style={{color: ''}}>
                                Cluster
                            </div>
                            <div>
                                [Org]
                            </div>
                        </div>
                    </td>
                    <td padding={'none'} align="center" style={headerStyle}>
                        <div>
                            Event
                        </div>
                        <div>
                            [Status]
                        </div>
                    </td>

                    {/*todo: empty column*/}
                    {/*todo: empty column*/}
                    {/*todo: empty column*/}
                    <td padding={'none'} align="center" style={{
                        color: 'white', flex: .03,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                    }}>
                        <div>
                            &nbsp;
                        </div>
                    </td>
                </tr>
                </thead>
            )
        } catch (e) {
            throw new Error(e)
        }
    }

    const CLUSTER_COLUMN_INDEX = {
        "time": 0,
        "cluster": 1,
        "clusterorg": 2,
        "cloudlet": 3,
        "cloudletorg": 4,
        "flavor": 5,
        "vcpu": 6,
        "ram": 7,
        "disk": 8,
        "other": 9,
        "event": 10,
        "status": 11,
    }


    function renderTableRowOne(index, style) {
        try {
            let eventLog = props.eventLogList[index]
            return (
                <tr key={index} className='fixedSizeListTableDiv'
                    style={style}
                >
                    <React.Fragment>
                        {/*DESC:time(date)*/}
                        <td padding={'none'} align="center" valign={'center'}
                            style={makeTableRowStyle(index, itemHeight)}
                        >
                            <React.Fragment>
                                <div style={{marginLeft: 2}}>
                                    {time(FORMAT_FULL_DATE, eventLog[CLUSTER_COLUMN_INDEX.time])}
                                </div>
                                <div style={{marginLeft: 2}}>
                                    {time(FORMAT_FULL_TIME, eventLog[CLUSTER_COLUMN_INDEX.time])}
                                </div>
                            </React.Fragment>
                        </td>
                        {/*DESC:CLUSTER*/}
                        <td padding={'none'} align="center"
                            style={makeTableRowStyle(index, itemHeight)}
                        >
                            <div style={{color: 'white'}}>
                                {reduceString(props.eventLogList[index][CLUSTER_COLUMN_INDEX.cluster], 20)}
                            </div>
                            <div>
                                [{props.eventLogList[index][CLUSTER_COLUMN_INDEX.clusterorg]}]
                            </div>
                        </td>
                        {/*DESC:event[Status]*/}
                        <td padding={'none'} align="center"
                            style={makeTableRowStyle(index, itemHeight)}
                        >
                            <div>
                                {props.eventLogList[index][CLUSTER_COLUMN_INDEX.event]}
                            </div>
                            <div>
                                {props.eventLogList[index][CLUSTER_COLUMN_INDEX.status].toLowerCase() === 'up' ?
                                    <FontAwesomeIcon
                                        name="arrow-up" style={{
                                        fontSize: 15,
                                        color: 'green',
                                        cursor: 'pointer',
                                        marginTop: 2
                                    }}
                                    />
                                    :
                                    <FontAwesomeIcon
                                        name="arrow-down" style={{
                                        fontSize: 15,
                                        color: 'red',
                                        cursor: 'pointer',
                                        marginTop: 2
                                    }}
                                    />
                                }

                            </div>
                        </td>
                    </React.Fragment>
                </tr>
            )
        } catch (e) {
            throw new Error(e)
        }
    }

    return (
        <React.Fragment>
            {props.loading && <div>
                {renderBarLoader()}
            </div>}
            {renderTitle(props)}
            {props.eventLogList.length === 0 && !props.loading &&
            <div style={{marginTop: 70}}>
                {renderEmptyMessageBox("No Data Available")}
            </div>
            }
            <table size="small" aria-label="a dense table"
                   className='thinScrBar'
                   style={PageMonitoringStyles.miniTableGrid}
                   stickyheader={true.toString()}>
                {props.eventLogList.length !== 0 && !props.loading && renderHeader()}
                {!props.loading ?
                    <FixedSizeList
                        height={179}
                        itemCount={props.eventLogList !== undefined ? props.eventLogList.length : 0}
                        itemSize={itemHeight}
                        width={'100%'}
                    >
                        {({index, style}) => {
                            return (renderTableRowOne(index, style))
                        }}
                    </FixedSizeList>
                    : null
                }
            </table>
        </React.Fragment>
    )

}
