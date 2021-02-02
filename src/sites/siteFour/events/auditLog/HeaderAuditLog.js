import React from 'react';
import { Accordion, AccordionSummary, AccordionDetails, InputAdornment, Input, Divider, Chip, IconButton } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { Step, StepLabel, Stepper, Button } from '@material-ui/core';
import * as dateUtil from '../../../../utils/date_util'
import LinearProgress from '@material-ui/core/LinearProgress';
import SearchIcon from '@material-ui/icons/SearchRounded';
import HistoryLog from './HistoryLog';
import ClearAllOutlinedIcon from '@material-ui/icons/ClearAllOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const makeOper = (logName) => {
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

const formatDate = (data) => {
    return dateUtil.time(dateUtil.FORMAT_FULL_DATE_TIME, data)
}


const auditKeys = [
    { label: 'Start Time', field: 'timestamp', formatData: formatDate, detail: true },
    { label: 'Trace ID', field: 'traceid', mtags: true, detail: true },
    { label: 'Client IP', field: 'remote-ip', mtags: true, detail: true },
    { label: 'Duration', field: 'duration', mtags: true, detail: true },
    { label: 'Operation Name', field: 'name', formatData: makeOper, detail: true, filter: true },
    { label: 'Status', field: 'status', mtags: true, detail: true },
]

const eventKeys = [
    { label: 'Start Time', field: 'timestamp', formatData: formatDate, detail: true },
    { label: 'Host Name', field: 'hostname', mtags: true, detail: true },
    { label: 'Line No', field: 'lineno', mtags: true, detail: true },
    { label: 'Node', field: 'node', mtags: true, detail: true },
    { label: 'Node Region', field: 'noderegion', mtags: true, detail: true },
    { label: 'Node Type', field: 'nodetype', mtags: true, detail: true },
    { label: 'Trace ID', field: 'traceid', mtags: true, detail: true },
    { label: 'Span ID', field: 'spanid', mtags: true, detail: true },
    { label: 'Duration', field: 'duration', mtags: true, detail: true },
    { label: 'State', field: 'state', mtags: true, detail: true },
    { label: 'Name', field: 'name', filter: true, detail: false },
    { label: 'App', field: 'app', mtags: true, filter: true, detail: false },
    { label: 'Version', field: 'appver', mtags: true, filter: true, detail: false },
    { label: 'Developer', field: 'apporg', mtags: true, filter: true, detail: false },
    { label: 'Cloudlet', field: 'cloudlet', mtags: true, filter: true, detail: false },
    { label: 'Operator', field: 'cloudletorg', mtags: true, filter: true, detail: false },
    { label: 'Cluster', field: 'cluster', mtags: true, filter: true, detail: false },
]

const getKeys = (type) => {
    return type === 'audit' ? auditKeys : eventKeys
}

class HeaderAuditLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: (-1),
            dayData: [],
            dataList: [],
            filterList: [],
            filterExpand: false,
            filterText: '',
            isOrg: false,
            showFilterData:false
        }
        this.type = this.props.type
    }

    setAllView = (mtags, sId) => {
        if (mtags && mtags['traceid']) {
            return mtags
        }
        return {}
    }


    getStepLabel = (data, stepperProps) => {
        return (
            <div>
                <div className='audit_timeline_Step'
                    style={{ backgroundColor: data.status ? (data.status === '200') ? '#388e3c' : '#b71c1c' : '#9d9d9d'}}
                >
                </div>
            </div>
        )
    }

    onClickViewDetail = (data) => {
        let rawViewData = (data.mtags) ? this.setAllView(data.mtags) : {};
        this.props.detailView(rawViewData)
    }

    handleExpandedChange = (index, traceid) => (event, newExpanded) => {
        //this.props.onItemSelected(traceid)
        this.setState({ expanded: newExpanded ? index : false });
    };

    eventHeader = (data) => {
        let mtags = data.mtags
        return ( 
            <div>
                <h4><b>{data['name']}</b><span className='audit_timeline_traceID'>{dateUtil.time(dateUtil.FORMAT_FULL_TIME_12_A, data.timestamp)}</span></h4>
                <div style={{marginTop:5}}></div>
                {mtags['appver'] ? <Chip variant="outlined" size="small" label={`App: ${mtags['app']} [${mtags['appver']}] -  ${mtags['apporg']}`}  style={{marginBottom:5, marginRight:5}}/> : null}
                {mtags['cluster'] ? <Chip variant="outlined" size="small" label={`Cluster: ${mtags['cluster']} - ${mtags['clusterorg']}`}  style={{marginBottom:5, marginRight:5}}/> : null}
                {mtags['cloudlet'] ? <Chip variant="outlined" size="small" label={`Cloudlet: ${mtags['cloudlet']} - ${mtags['cloudletorg']}`}  style={{marginBottom:5, marginRight:5}}/> : null}
                <br/>
                <br/>
            </div>
        )
    }

    auditHeader = (data, index) => {
        let mtags = data.mtags
        return (
            <Step key={index}>
                <div className='audit_timeline_time' completed={undefined} icon='' active={undefined} expanded="false">
                    {dateUtil.time(dateUtil.FORMAT_FULL_TIME_12, data.timestamp)}<br />
                    {dateUtil.time(dateUtil.FORMAT_AM_PM, data.timestamp)}
                </div>
                <StepLabel StepIconComponent={(stepperProps) => {
                    return this.getStepLabel(mtags, stepperProps)
                }}>
                    <div className='audit_timeline_title'>{makeOper(data.name)}</div>
                    <div className='audit_timeline_traceID'>Trace ID : <span>{mtags.traceid}</span></div>
                </StepLabel>
            </Step>
        )
    }

    expandablePanelSummary = (index, data) => {
        return (
            <AccordionSummary key={index} id="panel1a-header" style={{ height: '100%' }} expandIcon={<ExpandMoreIcon />}>
                {this.type === 'event' ? this.eventHeader(data) : this.auditHeader(data, index)}
            </AccordionSummary>
        )
    }

    expandablePanelDetails = (data) => {
        let mtags = data.mtags
        return (
            <AccordionDetails>
                {getKeys(this.type).map((key, i) => {
                    let value = key.mtags ? mtags[key.field] : data[key.field]
                    return (
                        key.detail && value ? <div key={i} className='audit_timeline_detail_row'>
                            <div className='audit_timeline_detail_left'>{key.label}</div>
                            <div className='audit_timeline_detail_right'>{key.formatData ? key.formatData(value) : value}</div>
                        </div>
                            : null
                    )
                })}
                {this.type === 'audit' ? <div className='audit_timeline_detail_button'>
                    <Button onClick={() => this.onClickViewDetail(data)}>
                        VIEW DETAIL
                </Button>
                </div> : null}
            </AccordionDetails>)
    }

    renderStepper = (data, index) => {
        return (
            data.name ?
                <Accordion key={index} square expanded={this.state.expanded === index} onChange={this.handleExpandedChange(index, data.traceid)} last='' completed='' active={undefined}>
                    {this.expandablePanelSummary(index, data)}
                    {this.expandablePanelDetails(data)}
                </Accordion>
                :
                null
        )
    }

    onFilter = (filter) => {
        this.props.onLoadData(filter.starttime, filter.endtime, filter.limit, filter.tags)
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if (nextProps.isOrg) {
            return { isOrg: nextProps.isOrg }
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
        if (!flag) {
            this.props.clearHistory()
            this.props.onSelectedDate()
        }
    }

    onFilterValue = (e) => {
        let value = e ? e.target.value : this.state.filterText
        this.mapDetails = null
        let filterText = value.toLowerCase()
        let dataList = this.state.dataList
        let filterCount = 0
        let keys = getKeys(this.type)
        let filterList = dataList.filter(data => {
            let mtags = data.mtags
            let valid = keys.map(key=>{
                let dataValue = key.mtags ? mtags[key.field] : data[key.field]
                if (key.filter) {
                    filterCount = + 1
                    let tempData = dataValue ? dataValue: ''
                    return tempData.toLowerCase().includes(filterText)
                }
            })
            return filterCount === 0 || valid.includes(true)
        })
        if (value !== undefined) {
            this.setState({ filterText: value, filterList: filterList })
        }
        return filterList
    }

    onFilterClear = () => {
        this.setState({ filterText: '' }, () => { this.onFilterValue() })
    }

    onHideFilter = (flag)=>{
        this.setState({showFilterData:flag})
    }

    render() {
        const { filterList, filterExpand, filterText, isOrg, showFilterData } = this.state
        return (
            <div className='audit_container'>
                <div>
                    <HistoryLog isOrg={isOrg} onFilter={this.onFilter} onClose={this.props.close} onExpand={this.onFilterExpand} onSelectedDate={this.props.onSelectedDate} onHideFilter={this.onHideFilter}/>
                </div>
                {showFilterData || !filterExpand ? <React.Fragment>
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
                        onChange={this.onFilterValue}
                        placeholder={'Search'} />
                    {!this.isOrg && this.props.loading && !filterExpand ? <LinearProgress /> : null}
                    {!this.isOrg && this.props.historyLoading && filterExpand ? <LinearProgress /> : null}
                    <Divider />
                    {this.state.isOrg ? null : <div align={'right'}><h4 style={{ padding: '10px 10px 0px 0px' }}><b>{this.props.selectedDate}</b></h4></div>}
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
                </React.Fragment> : null}
            </div>
        )
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevState.dataList !== this.state.dataList) {
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
