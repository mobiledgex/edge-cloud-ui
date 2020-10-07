import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, InputAdornment, Input, Divider } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { Step, StepLabel, Stepper, Button } from '@material-ui/core';
import * as dateUtil from '../../../../utils/date_util'
import LinearProgress from '@material-ui/core/LinearProgress';

import CheckIcon from '@material-ui/icons/CheckRounded';
import SearchIcon from '@material-ui/icons/SearchRounded';
import HistoryLog from './HistoryLog';
import ClearAllOutlinedIcon from '@material-ui/icons/ClearAllOutlined';
class HeaderAuditLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: (-1),
            dayData: [],
            dataList: [],
            filterList:[],
            filterExpand: false,
            filterText:'',
            isOrg : false
        }
    }

    setAllView = (dummyConts, sId) => {
        if (dummyConts && dummyConts['traceid']) {
            return dummyConts
        }
        return {}
    }

    makeOper = (logName) => {
        let item = '';
        let nameArray = logName.substring(1).split("/").filter(name => name != 'ws');

        if (nameArray[2] === 'login') {
            item = nameArray[2]
        } else if (nameArray[2] === 'auth') {
            if (nameArray[3] === 'ctrl') {
                item = nameArray[4]
            } else if (nameArray[3] === 'restricted') {
                item = nameArray[3] + nameArray[4].charAt(0).toUpperCase() + nameArray[4].slice(1) + nameArray[5].charAt(0).toUpperCase() + nameArray[5].slice(1)
            } else {
                item = nameArray[3] + nameArray[4].charAt(0).toUpperCase() + nameArray[4].slice(1)
            }
        } else {
            item = nameArray[2]
        }
        return item.charAt(0).toUpperCase() + item.slice(1)
    }

    getStepLabel = (item, stepperProps) => {
        let storageSelectedTraceidList = JSON.parse(localStorage.getItem("selectedTraceid"));
        let data = item;
        let storageSelectedTraceidIndex = (-1);
        if (storageSelectedTraceidList) {
            storageSelectedTraceidIndex = (storageSelectedTraceidList) ? storageSelectedTraceidList.findIndex(s => s === data.traceid) : (-1)
        }

        return (
            <div>
                <div className='audit_timeline_Step'
                    style={{ backgroundColor: (data.status === 200) ? '#388e3c' : '#b71c1c' }}
                >
                    {(storageSelectedTraceidIndex !== (-1)) ?
                        <CheckIcon />
                        : null
                    }
                </div>
            </div>
        )
    }

    onClickViewDetail = (data) => {
        let rawViewData = (data) ? this.setAllView(data) : {};
        this.props.detailView(rawViewData)
    }

    handleExpandedChange = (index, traceid) => (event, newExpanded) => {
        //this.props.onItemSelected(traceid)
        this.setState({ expanded: newExpanded ? index : false });
    };

    expandablePanelSummary = (index, data) => (
        <AccordionSummary id="panel1a-header">
            <Step key={index}>
                <div className='audit_timeline_time' completed={undefined} icon='' active={undefined} expanded="false">
                    {dateUtil.unixTime(dateUtil.FORMAT_FULL_TIME, data.starttime)}<br />
                    {dateUtil.unixTime(dateUtil.FORMAT_AM_PM, data.starttime)}
                </div>
                <StepLabel StepIconComponent={(stepperProps) => {
                    return this.getStepLabel(data, stepperProps)
                }}>
                    <div className='audit_timeline_title'>{this.makeOper(data.operationname)}</div>
                    <div className='audit_timeline_traceID'>Trace ID : <span>{data.traceid}</span></div>
                </StepLabel>
            </Step>
        </AccordionSummary>
    )

    expandablePanelDetails = (data) => (
        <AccordionDetails>
            <div className='audit_timeline_detail_row'>
                <div className='audit_timeline_detail_left'>Start Time</div>
                <div className='audit_timeline_detail_right'>{dateUtil.unixTime(dateUtil.FORMAT_FULL_DATE_TIME, data.starttime)}</div>
            </div>
            <div className='audit_timeline_detail_row'>
                <div className='audit_timeline_detail_left'>Trace ID</div>
                <div className='audit_timeline_detail_right'>{data.traceid}</div>
            </div>
            <div className='audit_timeline_detail_row'>
                <div className='audit_timeline_detail_left'>Client IP</div>
                <div className='audit_timeline_detail_right'>{data.clientip}</div>
            </div>
            <div className='audit_timeline_detail_row'>
                <div className='audit_timeline_detail_left'>Duration</div>
                <div className='audit_timeline_detail_right'>{data.duration}</div>
            </div>
            <div className='audit_timeline_detail_row'>
                <div className='audit_timeline_detail_left'>Operation Name</div>
                <div className='audit_timeline_detail_right'>{this.makeOper(data.operationname)}</div>
            </div>
            <div className='audit_timeline_detail_row'>
                <div className='audit_timeline_detail_left'>Status</div>
                <div className='audit_timeline_detail_right' style={{ color: data.status === 200 ? '#4caf50' : '#E53935' }}>{data.status}</div>
            </div>
            <div className='audit_timeline_detail_button'>
                <Button onClick={() => this.onClickViewDetail(data)}>
                    VIEW DETAIL
                </Button>
            </div>
        </AccordionDetails>
    )

    renderStepper = (data, index) => {
        return (
            data.operationname ?
                <Accordion key={index} square expanded={this.state.expanded === index} onChange={this.handleExpandedChange(index, data.traceid)} last='' completed='' active={undefined}>
                    {this.expandablePanelSummary(index, data)}
                    {this.expandablePanelDetails(data)}
                </Accordion>
                :
                null
        )
    }

    onFilter = (filter) => {
        this.props.onLoadData(filter.starttime, filter.endtime, filter.limit)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.isOrg)
        {
            return {isOrg : nextProps.isOrg}
        }
        else if (prevState.filterExpand && nextProps.historyList !== prevState.dataList) {
            return { dataList: nextProps.historyList }
        }
        else if (nextProps.dataList !== prevState.dataList && !prevState.filterExpand) {
            return { dataList: nextProps.dataList }
        }
        return null
    }

    onFilterExpand = (flag) => {
        this.setState({ filterExpand: flag, dataList: flag ? [] : this.props.liveData })
        if(!flag)
        {
            this.props.clearHistory()
            this.props.onSelectedDate()
        }
    }

    onFilterValue = (e) => {
        let value = e ? e.target.value : this.state.filterText
        this.mapDetails = null
        let filterText = value.toLowerCase()
        let dataList = this.state.dataList
        let filterList = dataList.filter(data => {
            return data['operationname'].toLowerCase().includes(filterText)
        })
        if (value !== undefined) {
            this.setState({ filterText:value, filterList: filterList })
        }
        return filterList
    }

    onFilterClear = ()=>
    {
        this.setState({filterText:''}, ()=>{this.onFilterValue()})
    }

    render() {
        const { filterList, filterExpand, filterText, isOrg } = this.state
        return (
            <div className='audit_container'>
                <div>
                    <HistoryLog isOrg={isOrg} onFilter={this.onFilter} onClose={this.props.close} onExpand={this.onFilterExpand} onSelectedDate={this.props.onSelectedDate} />
                </div>
                <Input
                    size="small"
                    fullWidth
                    style={{ padding: '0 14px 0 14px' }}
                    value={filterText}
                    startAdornment={
                        <InputAdornment style={{ fontSize: 17 }} position="start">
                            <SearchIcon />
                        </InputAdornment>
                    }
                    endAdornment={
                        <InputAdornment position="end">
                            <ClearAllOutlinedIcon style={{ fontSize: 17 }} onClick={this.onFilterClear} />
                        </InputAdornment>
                    }
                    onChange = {this.onFilterValue}
                    placeholder={'Search'} />
                {!this.isOrg && this.props.loading && !filterExpand ? <LinearProgress /> : null}
                {!this.isOrg && this.props.historyLoading && filterExpand ? <LinearProgress /> : null}
                <Divider />
                {this.state.isOrg ? null : <div align={'right'}><h4 style={{padding:'10px 10px 0px 0px'}}><b>{this.props.selectedDate}</b></h4></div>}
                <div className={`${filterExpand ? 'audit_timeline_vertical_expand' : 'audit_timeline_vertical'}`}>
                    {
                        filterList && filterList.length > 0 ?
                            <Stepper className='audit_timeline_container' activeStep={filterList.length} orientation="vertical">
                                {filterList.map((data, index) => {
                                    return (
                                        this.renderStepper(data, index)
                                    )
                                })}
                            </Stepper> : null
                    }
                </div>
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState)
    {
        if(prevState.dataList !== this.state.dataList)
        {
            this.onFilterValue()
        }
    }

    componentDidMount() {
        this.props.clearHistory()
        if (this.props.isOrg) {
            this.setState({ dataList: this.props.historyList, filterList: this.props.historyList })
        }
        else {
            this.setState({ filterList: this.props.dataList })
        }
        this.props.onSelectedDate(dateUtil.currentTime(dateUtil.FORMAT_FULL_DATE))
    }
}


const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(null, mapDispatchProps)(HeaderAuditLog));
