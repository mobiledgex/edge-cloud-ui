import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import HistoryLog from '../../auditLog/HistoryLog'
import SearchFilter from '../../auditLog/SearchFilter'
import { Paper, Tabs, Tab, Stepper, Accordion, AccordionSummary, Step, StepLabel, Typography, IconButton, Grid } from '@material-ui/core';

import * as dateUtil from '../../../../utils/date_util'

import GamesOutlinedIcon from '@material-ui/icons/GamesOutlined';
import StorageOutlinedIcon from '@material-ui/icons/StorageOutlined';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { fields } from '../../../../services/model/format';
import MexCalendar from './MexCalendar'

class EventLog extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            dataList: {},
            tabValue: 0,
            fullScreen: false,
            calendarList:[]
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

    stepperView = (eventList) => {
        return (
            <Stepper className='audit_timeline_container' activeStep={eventList.length} orientation="vertical">
                {eventList.map((data, j) => (
                    <Accordion key={j}>
                        <AccordionSummary id={`event_${j}`}>

                            {/* <Step>
                                <div className='audit_timeline_time' completed={undefined} icon='' active={undefined} expanded="false">
                                    {dateUtil.unixTime(dateUtil.FORMAT_FULL_TIME, data.time)}<br />
                                    {dateUtil.unixTime(dateUtil.FORMAT_AM_PM, data.time)}
                                </div>
                            </Step>
                            <StepLabel StepIconComponent={()=>(<div className='audit_timeline_Step'
                                    style={{ backgroundColor: '#388e3c' }}
                                >
                                    
                                </div>)}>
                                
                                <div className='audit_timeline_title'>{data.status}</div>
                            </StepLabel> */}
                        </AccordionSummary>
                    </Accordion>
                ))}
            </Stepper>
        )
    }

    detailedView = () => {

    }

    formatCalendarData = (dataList, key) => {
        let formattedList = []
        let length = dataList.length
        for (let i = length - 1; i >= 0; i--) {
            let data = dataList[i]
            let calendar = {
                id: i,
                group: key,
                title: data[key],
                start: dateUtil.timeInMilli(data.time),
                end: dateUtil.timeInMilli(data.time)
            }
            let j = i - 1
            for (; j >= 0; j--) {
                let nextData = dataList[j]
                if (data[key] !== nextData[key]) {
                    break;
                }
            }
            i = j+1
            calendar.end = dateUtil.timeInMilli(dataList[j<0 ? j+1: j].time)
            formattedList.push(calendar)
        }
        return formattedList
    }

    handleFullScreenView = (eventList) => {
        let calendarList = this.formatCalendarData(eventList, 'status')
        console.log('Rahul1234', calendarList)
        this.setState({calendarList:calendarList})
        this.setState(prevState => ({ fullScreen: !prevState.fullScreen }), () => {
            this.props.fullScreenView(this.state.fullScreen)
        })
    }

    stepperView2 = (eventList, i) => {
        return (
            <Accordion key={i}>
                <AccordionSummary>
                    <Typography>{eventList[1].cluster}</Typography>
                    <IconButton onClick={()=>this.handleFullScreenView(eventList)}><ArrowForwardIosIcon /></IconButton>
                </AccordionSummary>
            </Accordion>
        )
    }

    render() {
        const { dataList, tabValue, fullScreen, calendarList } = this.state
        return (
            <Grid container>
                <Grid item className='audit_container' xs={fullScreen ? 2 : 12}>
                    <Paper square>
                        <Tabs
                            value={tabValue}
                            onChange={this.onTabChange}
                            variant="fullWidth">
                            {Object.keys(dataList).map((eventType, i) => {
                                return <Tab key={i} label={eventType} />
                            })}
                        </Tabs>
                    </Paper>
                    <br />
                    <SearchFilter />
                    <br /><br />
                    {Object.keys(dataList).map((eventType, i) => {
                        let eventList = dataList[eventType]
                        return tabValue === i ? this.stepperView2(eventList, i) : null
                    })}
                </Grid >
                {fullScreen ?
                    <Grid item xs={10}>
                        <MexCalendar dataList={calendarList}/>
                    </Grid> : null
                }
            </Grid>
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