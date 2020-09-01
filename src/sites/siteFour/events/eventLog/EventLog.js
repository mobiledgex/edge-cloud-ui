import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import SearchFilter from '../../auditLog/SearchFilter'
import { Paper, Tabs, Tab, IconButton, List, ListItem, Card, CardHeader } from '@material-ui/core';

import * as dateUtil from '../../../../utils/date_util'
import uuid from 'uuid'
import GamesOutlinedIcon from '@material-ui/icons/GamesOutlined';
import StorageOutlinedIcon from '@material-ui/icons/StorageOutlined';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import HistoryLog from '../../auditLog/HistoryLog';
import MexCalendar from './MexCalendar'

class EventLog extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            dataList: {},
            tabValue: 0,
            fullScreen: false,
            activeIndex:0,
            calendarList:[],
            groupList:[]
        }
    }

    onFilterExpand = (flag) => {
    }

    static getDerivedStateFromProps(props, state) {

        if (props.liveData !== state.dataList) {
            return { dataList: props.liveData }
        }
        return null
    }

    iconView = (type) => {
        switch (type) {
            case 'clusterinst':
                return <StorageOutlinedIcon />
            case 'appinst':
                return <GamesOutlinedIcon />
            default:
                return <GamesOutlinedIcon />
        }
    }

    onTabChange = (event, value) => {
        this.setState({ tabValue: value })
    }

    detailedView = () => {

    }

    formatCalendarData = (dataList, columns, colorType) => {
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
        this.setState({calendarList:formattedList, groupList:groupList})
        return formattedList
    }

    handleFullScreenView = (eventInfo, columns, colorType, activeIndex) => {
        this.formatCalendarData(eventInfo, columns, colorType)
        this.setState(prevState => ({ fullScreen: true, activeIndex : activeIndex}), () => {
            this.props.fullScreenView(this.state.fullScreen)
        })
    }

    stepperView = (eventData, i) => {
        let columns = eventData.columns
        let colorType = eventData.colorType
        let eventList = eventData.values
        return eventList.map((event, j) => {
            let latestData = event[0]
            return (
                <Card key={j} style={{backgroundColor:this.state.fullScreen && this.state.activeIndex === j ? '#1E2123' : 'transparent'}}>
                    <CardHeader
                        title={
                            <List>
                                {columns.map((item, i) => {
                                    return item.visible ? <ListItem key={i}>
                                        <h6><strong>{item.label}</strong>{`: ${latestData[i]}`}</h6>
                                    </ListItem> : false
                                })}

                            </List>
                        }
                        action={
                            <IconButton aria-label="developer" onClick={() => this.handleFullScreenView(event, columns, colorType, j)}>
                                <ArrowForwardIosIcon style={{ fontSize: 20, color: '#76ff03' }} />
                            </IconButton>
                        }
                    />
                </Card>
            )
        })
    }

    render() {
        const { dataList, tabValue, fullScreen, calendarList, groupList } = this.state
        
        return (
            <div style={{ height: '100%' }}>
                <div style={{ width: 450, display: 'inline-block', height:'100%',backgroundColor:'#292C33', verticalAlign: 'top', overflow:'auto' }}>
                    <Paper square>
                        <Tabs
                            value={tabValue}
                            onChange={this.onTabChange}
                            variant="fullWidth">
                            {Object.keys(dataList).map((eventType, i) => {
                                return <Tab key={i} label={eventType} />
                            })}
                        </Tabs>
                        <div style={{ position: 'absolute', right: 0, top: 2 }} onClick={this.props.close}>
                            <IconButton>
                                <ArrowForwardIosIcon fontSize={'small'} />
                            </IconButton>
                        </div>
                    </Paper>
                    <br />
                    <br /><br />
                    {Object.keys(dataList).map((eventType, i) => {
                        let eventList = dataList[eventType]
                        return tabValue === i ? this.stepperView(eventList, i) : null
                    })}
                </div>
                {fullScreen ?
                    <div style={{ width: 'calc(100vw - 452px)',height:'100%', display: 'inline-block', backgroundColor:'#1E2123'}}>
                        <MexCalendar dataList={calendarList} groupList={groupList}/>
                    </div> : null}
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState) {
    }

    componentWillUnmount() {
        this.props.fullScreenView(false)
    }
}


const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(null, mapDispatchProps)(EventLog));