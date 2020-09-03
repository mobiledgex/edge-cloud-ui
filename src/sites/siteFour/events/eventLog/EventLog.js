import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import SearchFilter from '../SearchFilter'
import { Paper, Tabs, Tab, IconButton } from '@material-ui/core';

import * as dateUtil from '../../../../utils/date_util'
import uuid from 'uuid'
import CloseIcon from '@material-ui/icons/Close';
import MexCalendar from './MexCalendar'
import { FixedSizeList } from 'react-window';

const colorType = (value) => {
    switch (value) {
        case 'UP':
        case 'HEALTH_CHECK_OK':
            return '#66BB6A'
        case 'RESERVED':
            return '#66BB6A'
        case 'UNRESERVED':
            return '#FF7043'
        case 'DOWN':
        case 'HEALTH_CHECK_FAIL':
        case 'DELETED':
            return '#EF5350'
        default:
            return undefined
    }
}

const formatCalendarData = (dataList, columns) => {
    let formattedList = []
    let time = columns[0]
    let groupList = []
    for (let k = 0; k < columns.length; k++) {
        let column = columns[k]
        if (column.detailedView) {
            groupList.push({ id: k, title: column.label, rightTitle: column.label, bgColor: "#FFF" })
            for (let i = dataList.length - 1; i >= 0; i--) {
                let data = dataList[i]
                let color = colorType(data[k])
                color = color ? color : i % 2 === 0 ? '#9F6BD3' : '#B990E1'
                let calendar = {
                    id: uuid(),
                    group: k,
                    title: data[k],
                    className: "item-weekend",
                    bgColor: color,
                    selectedBgColor: "rgba(167, 116, 219, 1)",
                    start: dateUtil.timeInMilli(data[0]),
                    end: dateUtil.timeInMilli(data[0])
                }
                let j = i - 1
                for (; j >= 0; j--) {
                    let nextData = dataList[j]
                    if (data[k] !== nextData[k]) {
                        break;
                    }
                }
                i = j + 1
                calendar.end = dateUtil.timeInMilli(j < 0 ? dateUtil.currentTimeInMilli() : dataList[j][0])
                formattedList.push(calendar)
            }
        }

    }
    return { formattedList, groupList }
}

class EventLog extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            dataList: {},
            tabValue: 0,
            activeIndex: 0,
            calendarList: [],
            groupList: [],
            infiniteHeight: 200,
        }
    }

    onFilterExpand = (flag) => {
    }

    static getDerivedStateFromProps(props, state) {
        if (props.liveData !== state.dataList) {
            let data = { formattedList: [], groupList: [] }
            let keys = Object.keys(props.liveData)
            if (keys.length > 0) {
                let eventType = keys[state.tabValue]
                let eventData = props.liveData[eventType]
                if (eventData) {
                    let values = eventData.values
                    let eventKey = Object.keys(values)[0]
                    data = formatCalendarData(values[eventKey], eventData.columns)
                }
            }
            return { dataList: props.liveData, calendarList: data.formattedList, groupList: data.groupList }
        }
        return null
    }

    onTabChange = (tabIndex, dataList) => {
        let eventType = Object.keys(dataList)[tabIndex]
        let eventData = dataList[eventType]
        let values = eventData.values
        let eventKey = Object.keys(values)[0]
        let data = formatCalendarData(values[eventKey], eventData.columns)
        this.setState({ tabValue: tabIndex, calendarList: data.formattedList, groupList: data.groupList })
    }

    onEventTimeLine = (eventInfo, columns, activeIndex) => {
        let data = formatCalendarData(eventInfo, columns)
        this.setState({ activeIndex: activeIndex, calendarList: data.formattedList, groupList: data.groupList })
    }

    renderRow = (virtualProps) => {
        const { data, index, style } = virtualProps;
        let dataList = data.dataList
        let keys = data.keys
        let columns = data.columns
        let latestData = dataList[keys[index]][0]
        return (
            <div key={index} style={style}>
                <div style={{ pointer: 'cursor', borderRadius: 5, border: '1px solid #E0E0E1', margin: '0 10px 10px 10px', padding: 10, backgroundColor: this.state.activeIndex === index ? '#1E2123' : 'transparent' }} onClick={() => this.onEventTimeLine(dataList[keys[index]], columns, index)}>
                    <div style={{ display: 'inline-block' }}>{columns.map((item, i) => {
                        return item.visible ?
                            <p style={{ fontSize: 12 }} key={i}><strong>{item.label}</strong>{`: ${latestData[i]}`}</p> : false
                    })}
                    </div>
                </div>
            </div>
        );
    }

    stepperView = (eventType, eventData, i) => {
        let columns = eventData.columns
        let eventList = eventData.values
        let keys = Object.keys(eventList)
        let itemSize = eventType === 'clusterinst' ? 160 : eventType === 'appinst' ? 247 : 133
        return (
            <FixedSizeList key={i} className={'no-scrollbars'} height={this.state.infiniteHeight} itemSize={itemSize} itemCount={keys.length} itemData={{ columns: columns, keys: keys, dataList: eventList }}>
                {this.renderRow}
            </FixedSizeList>
        )
    }

    render() {
        const { dataList, tabValue, calendarList, groupList } = this.state

        return (
            <div style={{ height: '100%' }} id='event_log'>
                <div style={{ width: 450, display: 'inline-block', height: '100%', backgroundColor: '#292C33', verticalAlign: 'top', overflow: 'auto' }}>
                    <Paper square>
                        <Tabs
                            TabIndicatorProps={{
                                style: {
                                    backgroundColor: '#76ff03'
                                }
                            }}
                            value={tabValue}
                            onChange={(e, value) => this.onTabChange(value, dataList)}
                            variant="fullWidth">
                            {Object.keys(dataList).map((eventType, i) => {
                                return <Tab key={i} label={eventType} />
                            })}
                        </Tabs>
                        <div style={{ position: 'absolute', right: 0, top: 2 }} onClick={this.props.close}>
                            <IconButton>
                                <CloseIcon style={{ color: '#76ff03' }} />
                            </IconButton>
                        </div>
                    </Paper>
                    <br />
                    {Object.keys(dataList).map((eventType, i) => {
                        let eventList = dataList[eventType]
                        return tabValue === i ? this.stepperView(eventType, eventList, i) : null
                    })}
                </div>
                <div style={{ width: 'calc(100vw - 452px)', height: '100%', display: 'inline-block', backgroundColor: '#1E2123' }}>
                    <MexCalendar dataList={calendarList} groupList={groupList} />
                </div>
            </div>
        )
    }

    componentDidMount() {
        this.setState({ infiniteHeight: document.getElementById('event_log').clientHeight - 70 })
        if (Object.keys(this.state.dataList).length > 0) {
            this.onTabChange(this.state.activeIndex, this.state.dataList)
        }
    }

    componentDidUpdate(prevProps, prevState) {

    }

    componentWillUnmount() {
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(null, mapDispatchProps)(EventLog));