import React from 'react'
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import SearchFilter from '../../auditLog/SearchFilter'
import { Paper, Tabs, Tab, Stepper, Accordion, AccordionSummary, Step, StepLabel, Typography, IconButton, Grid, List, ListItem, ListItemText, Card, CardHeader } from '@material-ui/core';

import * as dateUtil from '../../../../utils/date_util'
import uuid from 'uuid'
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

    formatCalendarData = (data) => {
        let formattedList = []
        let columns = data.columns
        let dataList = data.values
        let colorType = data.colorType
        let time = columns[0]
        let groupList = []
        for (let k = 0; k < columns.length; k++) {
            let column = columns[k]
            if (column.detailedView) {
                groupList.push({ id: k, title: column.label, rightTitle: column.label, bgColor: "#FFF" })
                for (let i = dataList.length - 1; i >= 0; i--) {
                    let data = dataList[i]
                    let calendar = {
                        id: uuid(),
                        group: k,
                        title: data[k],
                        className: "item-weekend",
                        bgColor: colorType(data[k]),
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
        console.log('Rahul1234', formattedList)
        this.setState({calendarList:formattedList, groupList:groupList})
        return formattedList
    }

    handleFullScreenView = (eventInfo) => {
        this.formatCalendarData(eventInfo)
        this.setState(prevState => ({ fullScreen: !prevState.fullScreen }), () => {
            this.props.fullScreenView(this.state.fullScreen)
        })
    }

    stepperView2 = (eventList, i) => {
        console.log('Rahul1234', eventList)
        return eventList.map((event, j) => {
            let latestData = event.values[0]
            return (
                <Card key={j}>
                    <CardHeader
                        title={
                            <List>
                                {event.columns.map((item, i) => {
                                    return item.visible ? <ListItem key={i}>
                                        <h6><strong>{item.label}</strong>{`: ${latestData[i]}`}</h6>
                                    </ListItem> : false
                                })}

                            </List>
                        }
                        action={
                            <IconButton aria-label="developer" onClick={() => this.handleFullScreenView(event)}>
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
                <div style={{ width: 450, display: 'inline-block', height:'100%',backgroundColor:'#292C33', verticalAlign: 'top' }}>
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
                </div>
                {fullScreen ?
                    <div style={{ width: 'calc(100vw - 452px)',height:'100%', display: 'inline-block', backgroundColor:'#292C33'}}>
                        <MexCalendar dataList={calendarList} groupList={groupList}/>
                    </div> : null}
            </div>
            // <Grid container>
            //     <Grid item className='audit_container' xs={fullScreen ? 2 : 12}>
            //         <Paper square>
            //             <Tabs
            //                 value={tabValue}
            //                 onChange={this.onTabChange}
            //                 variant="fullWidth">
            //                 {Object.keys(dataList).map((eventType, i) => {
            //                     return <Tab key={i} label={eventType} />
            //                 })}
            //             </Tabs>
            //         </Paper>
            //         <br />
            //         <SearchFilter />
            //         <br /><br />
            //         {Object.keys(dataList).map((eventType, i) => {
            //             let eventList = dataList[eventType]
            //             return tabValue === i ? this.stepperView2(eventList, i) : null
            //         })}
            //     </Grid >
            //     {fullScreen ?
            //         <Grid item xs={10}>
            //             <MexCalendar dataList={calendarList}/>
            //         </Grid> : null
            //     }
            // </Grid>
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