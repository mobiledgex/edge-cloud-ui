import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { LinearProgress, Divider, Grid, Tooltip } from '@material-ui/core';
import * as dateUtil from '../../../../utils/date_util'
import uuid from 'uuid'
import MexCalendar from '../../../../hoc/calendar/MexCalendar'
import { fields } from '../../../../services/model/format';
import { redux_org } from '../../../../helper/reduxData';
import SelectMenu from '../../../../hoc/selectMenu/SelectMenu'
import { FixedSizeList } from 'react-window';
import { Icon } from '../../../../hoc/mexui';
import Toolbar, { ACION_SEARCH, ACTION_CLOSE, ACTION_PICKER, ACTION_REFRESH, ACTION_TAB } from './Toolbar';
import { timeRangeInMin } from '../../../../hoc/mexui/Picker';
import { DEFAULT_DURATION_MINUTES } from './constant';

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

//format data whic is supported by react-calendar-timline
const formatCalendarData = (dataList, columns) => {
    if (dataList && dataList.length > 0) {
        let formattedList = []
        let time = columns[0]
        let groupList = []
        let colorSelector = '#9F6BD3'
        for (let k = 0; k < columns.length; k++) {
            let column = columns[k]
            if (column && column.detailedView) {
                groupList.push({ id: k, title: column.label, rightTitle: column.label, bgColor: "#FFF" })

                for (let i = dataList.length - 1; i >= 0; i--) {
                    let data = dataList[i]
                    let color = colorType(data[k])
                    colorSelector = colorSelector === '#9F6BD3' ? '#B990E1' : '#9F6BD3'
                    color = color ? color : colorSelector

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
    else {
        return { formattedList: [], groupList: [] }
    }
}

//search filter support
const filterData = (filterText, dataList, tabValue) => {
    let keys = Object.keys(dataList)
    let eventType = keys[tabValue]
    if (dataList[eventType]) {
        let columns = dataList[eventType].columns
        let dataFilterList = []
        Object.keys(dataList[eventType].values).map(data => {
            if (data.includes(filterText)) {
                dataFilterList[data] = dataList[eventType].values[data]
            }
        })
        let filteredTab = { columns: columns, values: dataFilterList }
        let filterList = {}
        keys.map(key => {
            if (key !== eventType) {
                filterList[key] = dataList[key]
            }
            else {
                filterList[key] = filteredTab
            }
        })
        let eventKey = Object.keys(dataFilterList)[0]
        let formattedData = formatCalendarData(dataFilterList[eventKey], columns)
        formattedData.filterList = filterList
        return formattedData
    }
    else {
        return { filterList: [], formattedList: [], groupList: [] }
    }
}

class EventLog extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            dataList: {},
            filterList: {},
            tabValue: 0,
            activeIndex: 0,
            calendarList: [],
            groupList: [],
            infiniteHeight: 200,
            filterText: ''
        }
        this.range = timeRangeInMin(DEFAULT_DURATION_MINUTES)
    }

    onFilter = (value) => {
        value = value ? value.toLowerCase() : ''
        this.setState({ filterText: value })
        let data = filterData(value, this.state.dataList, this.state.tabValue)
        this.setState({ filterList: data.filterList, calendarList: data.formattedList, groupList: data.groupList, activeIndex: 0 })
    }

    onTabChange = (tabIndex) => {
        let dataList = this.state.dataList
        let eventType = Object.keys(dataList)[tabIndex]
        let eventData = dataList[eventType]
        let values = eventData.values
        let eventKey = Object.keys(values)[0]
        let data = formatCalendarData(values[eventKey], eventData.columns)
        this.setState({ tabValue: tabIndex, calendarList: data.formattedList, groupList: data.groupList, filterText: '', filterList: dataList, activeIndex: 0 })
    }

    onEventTimeLine = (eventInfo, columns, activeIndex) => {
        let data = formatCalendarData(eventInfo, columns)
        this.setState({ activeIndex: activeIndex, calendarList: data.formattedList, groupList: data.groupList })
    }

    formatData = (field, data, index) => {
        switch (field) {
            case fields.time:
                return dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, data[index])
            case fields.appName:
                return `${data[index]} [${data[index + 1]}]`
            case fields.clusterName:
                return `${data[index]} [${data[index + 1]}]`
            case fields.cloudletName:
                return `${data[index]} [${data[index + 1]}]`
        }
    }

    renderRow = (virtualProps) => {
        const { data, index, style } = virtualProps;
        const { height } = style
        let dataList = data.dataList
        let keys = data.keys
        let columns = data.columns
        let latestData = dataList[keys[index]][0]
        return (
            <div key={index} style={style}>
                <Grid container style={{ cursor: 'pointer', borderRadius: 5, padding: 10, backgroundColor: this.state.activeIndex === index ? '#1E2123' : 'transparent' }} onClick={() => this.onEventTimeLine(dataList[keys[index]], columns, index)}>
                    <Grid item xs={11}>
                        {
                            columns.map((column, i) => {
                                if (column) {
                                    let value = column.format ? this.formatData(column.field, latestData, i) : latestData[i]
                                    return column && column.visible ?
                                        <React.Fragment key={i}>
                                            <div style={{ fontSize: 13, marginBottom: 8, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                                <strong>{`${column.detailedView && column.visible ? 'Current' : ''} ${column.label}`}</strong>
                                                <Tooltip title={<strong style={{ fontSize: 13 }}>{value}</strong>}>
                                                    <span style={{ fontWeight: 500 }}>{`: ${value}`}</span>
                                                </Tooltip>
                                            </div>
                                        </React.Fragment> : null
                                }
                            })
                        }
                    </Grid>
                    <Grid item xs={1}>
                        {this.state.activeIndex === index ? <div style={{ position: 'absolute', top: height / 2.4, right: 10 }} align='right'>
                            <Icon>arrow_forward_ios</Icon>
                        </div> : null}
                    </Grid>
                </Grid>
                <Divider />
            </div>
        );
    }

    dataView = (eventType, eventData) => {
        if (eventData) {
            let columns = eventData.columns
            let eventList = eventData.values
            let keys = Object.keys(eventList)
            let itemSize = eventType === 'clusterinst' ? 178 : eventType === 'appinst' ? 203 : 177
            return (
                <FixedSizeList className={'no-scrollbars'} height={this.state.infiniteHeight} itemSize={itemSize} itemCount={keys.length} itemData={{ columns: columns, keys: keys, dataList: eventList }}>
                    {this.renderRow}
                </FixedSizeList>
            )
        }
    }

    customRender = () => {
        return (
            redux_org.isAdmin(this) ? <div className='calendar-dropdown-select'>
                <SelectMenu search={true} labelKey={fields.organizationName} dataList={this.props.organizationList} onChange={this.props.onOrgChange} placeholder='Select Organization' default={this.props.selectedOrg} />
            </div> : null)
    }

    onToolbarChange = (action, value) => {
        switch (action) {
            case ACION_SEARCH:
                this.onFilter(value)
                break;
            case ACTION_PICKER:
                this.range = value
                this.props.fetchData(value)
                break;
            case ACTION_REFRESH:
                this.props.fetchData(timeRangeInMin(this.range.duration))
                break;
            case ACTION_CLOSE:
                this.props.close()
                break;
            case ACTION_TAB:
                this.onTabChange(value)
                break; 
        }
    }

    render() {
        const { filterList, tabValue, calendarList, groupList } = this.state
        const { endRange} = this.props
        const keys = Object.keys(filterList)
        return (
            <Grid container style={{ height: '100%' }} id='event_log'>
                <Grid item xs={3} style={{ display: 'inline-block', height: '100%', backgroundColor: '#292C33', verticalAlign: 'top', overflow: 'auto' }}>
                    {this.props.loading ? <LinearProgress /> : null}
                    <Toolbar data={keys} onChange={this.onTabChange} onChange={this.onToolbarChange}>
                        {this.dataView(keys[tabValue], filterList[keys[tabValue]])}
                        <div style={{ paddingLeft: 20, position: 'absolute', bottom: 5 }} align="left">
                            <p style={{ fontSize: 14 }}><strong>Last Requested</strong>{`: ${dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, endRange)}`}</p>
                        </div>
                    </Toolbar>
                </Grid>
                <Grid item xs={9} style={{ height: '100%', display: 'inline-block', backgroundColor: '#1E2123', paddingLeft: 20 }}>
                    <MexCalendar dataList={calendarList} groupList={groupList} customRender={this.customRender} />
                </Grid>
            </Grid>
        )
    }

    updateHeight = () => {
        let element = document.getElementById('event_log')
        if (element) {
            this.setState({ infiniteHeight: document.getElementById('event_log').clientHeight - 140 })
        }
    }

    componentDidUpdate(preProps, preState) {
        const { toggle, liveData } = this.props
        if (toggle !== preProps.toggle && liveData.length > 0) {
            let dataObject = {}
            liveData.forEach(item => {
                let key = Object.keys(item)[0]
                if (dataObject[key]) {
                    dataObject[key].values = { ...dataObject[key].values, ...item[key].values }
                }
                else {
                    dataObject[key] = item[key]
                }
            })
            let data = filterData(this.state.filterText, dataObject, this.state.tabValue)
            this.setState({ dataList: dataObject, filterList: data.filterList, calendarList: data.formattedList, groupList: data.groupList })
        }
    }

    componentDidMount() {
        if (Object.keys(this.state.dataList).length > 0) {
            this.onTabChange(this.state.activeIndex, this.state.dataList)
        }
        this.updateHeight()
        window.addEventListener("resize", this.updateHeight)
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(EventLog));