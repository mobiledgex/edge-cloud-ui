// @flow
import * as React from 'react';
import {useEffect, useRef, useState} from 'react';
import PageMonitoringView from "../view/PageMonitoringView";
import {FixedSizeList} from "react-window";
import '../common/PageMonitoringStyles.css'
import {renderBarLoader} from "../service/PageMonitoringCommonService";
import {makeTableRowStyle, reduceString, renderTitle} from "../service/PageMonitoringService";

const FontAwesomeIcon = require('react-fontawesome')
type Props = {
    cloudletEventLogList: any,
    columnList: any,
    parent: PageMonitoringView,
    currentCloudlet: string,
};

function getWindowDimensions() {
    const {innerWidth: width, innerHeight: height} = window;
    return {
        width,
        height
    };
}

export default function CloudletEventLogList(props) {
    const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());
    let itemHeight = 55
    const bodyRef = useRef();
    const [length, setLength] = useState(0);

    useEffect(() => {
        setLength(props.cloudletEventLogList)
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);

    }, [props.cloudletEventLogList]);


    function handleResize() {
        setWindowDimensions(getWindowDimensions());
    }

    const headerStyle = {
        color: 'white', flex: .33,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
    }

    function changeToShortPhrase(title) {
        if (title === 'UPDATE_START') {
            return "UPD_START"
        } else if (title === 'UPDATE_COMPLETE') {
            return "UPD_CMPLT"
        } else if (title === 'UPDATE_ERROR') {
            return "UPD_ERR"
        } else {
            return title;
        }
    }


    function renderTableRow(index, style) {
        return (
            <tr key={index} className='fixedSizeListTableDiv'
                style={style}
            >
                <React.Fragment>
                    {/*time(date)*/}
                    <td padding={'none'} align="center" valign={'center'}
                        style={makeTableRowStyle(index, itemHeight)}
                    >
                        <div>
                            <div style={{marginLeft: 2}}>
                                {props.cloudletEventLogList[index][0].toString().split('T')[0]}
                            </div>
                            <div style={{marginLeft: 2}}>
                                {props.cloudletEventLogList[index][0].toString().split('T')[1].substring(0, 8)}
                            </div>
                        </div>
                    </td>
                    {/*Cloudlet[org]*/}
                    <td padding={'none'} align="center"
                        style={makeTableRowStyle(index, itemHeight)}
                    >
                        <div style={{color: 'white'}}>
                            {reduceString(props.cloudletEventLogList[index][1], 35)}
                        </div>
                        <div>
                            [{props.cloudletEventLogList[index][2]}]
                        </div>
                    </td>
                    {/*event[Status]*/}
                    <td padding={'none'} align="center"
                        style={makeTableRowStyle(index, itemHeight)}
                    >
                        <div>
                            {changeToShortPhrase(props.cloudletEventLogList[index][3])}
                        </div>
                        <div>
                            {props.cloudletEventLogList[index][4].toLowerCase() === 'up' ?
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

    function renderTableHead() {

        return (
            <thead>
            <tr style={{display: 'flex', backgroundColor: '#303030', height: 40,}}>
                <td padding={'none'} align="center" style={headerStyle}>
                    Time
                </td>
                <td padding={'none'} align="center" style={headerStyle}>
                    <div>
                        <div style={{color: ''}}>
                            Cloudlet
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

    function renderEmptyTableForCloudletEventLog() {
        return (

            <div padding={'none'} align="center"
                 style={{fontSize: 15, color: '#57AA27', height: '100%', marginTop: 80}}>
                <div style={{fontSize: 17, color: '#57aa27'}}> No Data Available</div>
            </div>
        )
    }

    return (
        <div ref={bodyRef}>
            {props.loading &&
            <div>
                {renderBarLoader()}
            </div>
            }
            {renderTitle(props)}

            {props.cloudletEventLogList.length === 0 ?
                renderEmptyTableForCloudletEventLog()
                :
                <table size="small" aria-label="a dense table "
                       style={{width: '100%', overflowX: 'scroll', marginTop: -5}} stickyheader={true.toString()}>
                    {!props.parent.state.loading && renderTableHead()}
                    {/*##########################################*/}
                    {/*     tableBody                            */}
                    {/*##########################################*/}
                    <tbody style={{width: 'auto', overflowX: 'scroll', marginTop: 50}}>
                    {!props.parent.state.loading ?
                        <FixedSizeList
                            height={179}
                            itemCount={props.cloudletEventLogList.length}
                            itemSize={itemHeight}
                            width={'100%'}
                        >
                            {({index, style}) => (
                                renderTableRow(index, style)
                            )}

                        </FixedSizeList>
                        : null

                    }

                    </tbody>
                </table>
            }


        </div>
    )

};
