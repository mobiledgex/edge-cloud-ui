import React, {useState} from 'react';
import '../common/PageMonitoringStyles.css'
import {FixedSizeList} from "react-window";
import {makeTableRowStyle, reduceString, renderTitle} from "../service/PageDevOperMonitoringService";
import {getWindowDimensions} from "../common/PageMonitoringUtils";
import {renderPlaceHolderLoader} from "../service/PageMonitoringCommonService";
import {Center} from "../common/PageMonitoringStyles";

const FontAwesomeIcon = require('react-fontawesome')

export default function ClusterEventLogList(props) {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    let itemHeight = 55


    const headerStyle = {
        color: 'white', flex: .33,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    }

    function renderHeader() {
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
        return (
            <tr key={index} className='fixedSizeListTableDiv'
                style={style}
            >
                <React.Fragment>
                    {/*DESC:time(date)*/}
                    <td padding={'none'} align="center" valign={'center'}
                        style={makeTableRowStyle(index, itemHeight)}
                    >
                        <div>
                            <div style={{marginLeft: 2}}>
                                {props.eventLogList[index][CLUSTER_COLUMN_INDEX.time].toString().split('T')[0]}
                            </div>
                            <div style={{marginLeft: 2}}>
                                {props.eventLogList[index][CLUSTER_COLUMN_INDEX.time].toString().split('T')[1].substring(0, 8)}
                            </div>
                        </div>
                    </td>
                    {/*DESC:CLUSTER*/}
                    <td padding={'none'} align="center"
                        style={makeTableRowStyle(index, itemHeight)}
                    >
                        <div style={{color: 'white'}}>
                            {reduceString(props.eventLogList[index][CLUSTER_COLUMN_INDEX.cluster], 15)}
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
    }

    return (
        <div>
            {renderTitle(props)}
            <table size="small" aria-label="a dense table " style={{width: '100%', overflowX: 'scroll', marginTop: -5}} stickyHeader={true}>
                {!props.parent.state.loading && renderHeader()}
                {!props.loading ?
                    <FixedSizeList
                        height={179}
                        itemCount={props.eventLogList.length}
                        itemSize={itemHeight}
                        width={'100%'}
                    >
                        {({index, style}) => {
                            return (renderTableRowOne(index, style))
                        }}
                    </FixedSizeList>
                    :
                    <Center style={{marginTop: 70}}>
                        {renderPlaceHolderLoader()}
                    </Center>
                }
            </table>
        </div>
    )

}
