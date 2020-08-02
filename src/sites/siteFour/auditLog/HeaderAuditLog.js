import React from 'react';
import { Dropdown } from 'semantic-ui-react';
import { Accordion, AccordionSummary, AccordionDetails, Box } from '@material-ui/core';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { IconButton, Step, StepLabel, Stepper, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Calendar from '../../../components/horizontal_calendar/Calendar';
import * as dateUtil from '../../../utils/date_util'
import CheckIcon from '@material-ui/icons/Check';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import RefreshIcon from '@material-ui/icons/Refresh';
import LinearProgress from '@material-ui/core/LinearProgress';
import * as serverData from '../../../services/model/serverData';

const options = [
    { key: 'Individual', value: 'Individual', text: 'Individual' },
    { key: 'Group', value: 'Group', text: 'Group' }
]


class HeaderAuditLog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            expanded: (-1),
            groupExpanded: (-1),
            groupParentExpanded:(-1),
            dayData: [],
            groups: [],
            groupsErrorCount: 0,
            dropDownValue: "Individual",
            starttime : dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, dateUtil.startOfDay())
        }
        this.endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, dateUtil.endOfDay())
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

    handleDateChange = (selectedDate, index) => {
        let starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, selectedDate.startOf('day').valueOf())
        this.setState({starttime: starttime})
        this.endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, selectedDate.endOf('day').valueOf())
        this.props.onLoadData(starttime, this.endtime)
    };

    onSelectDate = (date, index) => {
        if (index !== (-1) && index < 61) {
            this.handleDateChange(date, index)
        }
    };

    onClickClose = () => {
        this.props.close()
    };

    handleExpandedChange = (index, traceid) => (event, newExpanded) => {
        //this.props.onItemSelected(traceid)
        this.setState({ expanded: newExpanded ? index : false });
    };

    handleGroupParentExpandedChange = (index) =>  {
        this.setState(prevState=>({ groupParentExpanded: prevState.groupParentExpanded === index ? (-1) : index }));
    };

    handleGroupExpandedChange = (group, index, traceid) => (event, newExpanded) => {
        //this.props.onItemSelected(traceid)
        this.setState({ groupExpanded: { expanded: newExpanded ? index : false, group: group } });
    };

    dropDownOnChange = (e, v, data) => {
        let dayData = (data) ? data : this.state.dayData;
        let groups = [];

        if (v.value === 'Group') {
            dayData.map((data, index) => {
                let renderValue = this.makeOper(data.operationname);
                let groupsIndex = groups.findIndex(g => g.title === renderValue)
                let groupsErrorCount = 0;

                if (groupsIndex === (-1)) {

                    for (let i = 0; i < dayData.length; i++) {
                        if (data.status !== 200) {
                            groupsErrorCount++
                        }
                    }
                    groups.push({ "title": renderValue, "errorCount": groupsErrorCount })
                }
            })

            groups.map((group, gIndex) => {
                groups[gIndex].data = []
                dayData.map((data, index) => {
                    let renderValue = this.makeOper(data.operationname);
                    if (group.title === renderValue) {
                        groups[gIndex].data.push(data)
                    }
                })
            })
        } else {
            groups = []
        }

        this.setState({
            dropDownValue: v.value,
            groups: groups,
            expanded: (-1)
        });
    }

    expandablePanelSummary = (index, data) => (
        <AccordionSummary id="panel1a-header">
            <Step key={index}>
                <div className='audit_timeline_time' completed={undefined} icon='' active={undefined} expanded="false">
                    {dateUtil.unixTime(dateUtil.FORMAT_FULL_TIME, data.starttime)}<br />
                    {dateUtil.unixTime(dateUtil.FORMAT_AM_PM,data.starttime)}
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

    renderGroupStepper = (data, index, group) => {
        let errorCount = 0;
        data.map((d) => { (d.status !== 200) ? errorCount++ : errorCount })
        return (
            (group) ?
                <div key={index} className='audit_timeline_group'>
                    <Accordion expanded={this.state.groupParentExpanded === index} onChange={(e)=>{this.handleGroupParentExpandedChange(index)}}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            id="panel1a-header"
                        >
                            <div className='audit_timeline_group_header'>
                                <h4>{group.title}
                                    {errorCount > 0 ?<span className='audit_timeline_group_bedge'>{(errorCount > (-1) ? errorCount : 0)}</span> : null}
                                </h4>
                            </div>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stepper className='audit_timeline_container' activeStep={data.length} orientation="vertical">
                                {
                                    data.map((item, itemIndex) => {
                                        return (
                                            <Accordion last='' active={undefined} completed='' key={itemIndex} square expanded={this.state.groupExpanded.expanded === itemIndex && this.state.groupExpanded.group === group.title} onChange={this.handleGroupExpandedChange(group.title, itemIndex, item.traceid)}>
                                                {this.expandablePanelSummary(itemIndex, item)}
                                                {this.expandablePanelDetails(item)}
                                            </Accordion>
                                        )
                                    })
                                }
                            </Stepper>
                        </AccordionDetails>
                    </Accordion>
                </div>
                : null
        )
    }

    render() {
        const { starttime, groups } = this.state
        let dataList = this.props.dataList[starttime]
        return (
            <div className='audit_container' style={{ height: window.innerHeight - 48 }}>
                <div className='audit_title'>
                    <div className="audit_title_label">Audit Logs</div>
                    <div className='audit_filter'>
                        <Box p={1}>
                            <Dropdown
                                button
                                placeholder='Individual'
                                fluid
                                search
                                selection
                                options={options}
                                onChange={this.dropDownOnChange}
                                style={{ width: 150, height: 30 }}
                            />
                        </Box>
                    </div>
                    <IconButton onClick={this.onClickClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className='audit_calendar'>
                    <Calendar showDaysBeforeCurrent={30} showDaysAfterCurrent={30} onSelectDate={this.onSelectDate} />
                </div>
                {this.props.loading ? <LinearProgress /> : null}
                <div className='audit_timeline_vertical'>
                    {
                        (groups.length > 0) ?
                            groups.map((group, gIndex) => {
                                return (
                                    this.renderGroupStepper(group.data, gIndex, group)
                                )
                            })
                            :
                            dataList && dataList.length > 0 ? <Stepper className='audit_timeline_container' activeStep={dataList.length} orientation="vertical">
                                {dataList.map((data, index) => {
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
}


const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(null, mapDispatchProps)(HeaderAuditLog));
