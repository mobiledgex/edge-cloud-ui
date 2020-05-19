import React from 'react';
import {Dropdown, Icon, Image, Popup} from 'semantic-ui-react';
import {ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
//redux
import {connect} from 'react-redux';
import * as actions from '../actions';
import * as serviceMC from '../services/serviceMC';
import PopProfileViewer from '../container/popProfileViewer';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import {CircularProgress, IconButton, Step, StepLabel, Stepper, Button} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import Calendar from '../components/horizontal_calendar/Calendar';
import moment from "moment";
import type Moment from "moment";
import {green, red} from "@material-ui/core/colors";
import ReactJson from "react-json-view";
import OfflinePinIcon from "@material-ui/core/SvgIcon/SvgIcon";
import CheckIcon from '@material-ui/icons/Check';
import {
    StyleSheet,
    View,
} from 'react-native-web';

let _self = null;
const options = [
    { key: 'indivisual', value: 'indivisual', text: 'indivisual' },
    { key: 'group', value: 'group', text: 'group' }
]
class HeaderAuditLog extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.state = {
            tabValue: 0,
            expanded: (-1),
            groupExpanded: (-1),
            devData: [],
            dayData: [],
            groups: [],
            groupsErrorCount: 0,
            dropDownValue: "indivisual"
        }
    }

    componentDidMount() {
        let devData = this.props.devData;
        let dayData = [];
        let nowDay = parseInt(moment().utc().format("D"));

        devData.map((data, index) => {
            let day = parseInt(moment(this.makeUTC(data.starttime)).format("D"))
            if(nowDay === day){
                dayData.push(data)
            }
        })

        this.setState({
            devData: devData,
            dayData: dayData,
            unCheckedErrorCount: this.props.unCheckedErrorCount,
            errorCount: this.props.errorCount
        })
    }

    convertWSResponsetoJSON = (response)=>
    {
        let dataArray = response.split('\n');
        let data = '[';
        for(let i=0;i<dataArray.length;i++)
        {
            if(i>0)
            {
                data = data + ','
            }
            data = data.concat(dataArray[i])
        }
        data = data + ']'
        return data
    }

    setAllView = (dummyConts, sId) => {
        if (dummyConts && dummyConts['traceid']) {
                return dummyConts
        }
        return {}
    }

    setRequestView(dummyConts, sId) {

        if (dummyConts && dummyConts['request']) {
            if (dummyConts['request'].indexOf('{') > -1) {
                let dataLenght = dummyConts['request'].split('{"data":').length;
                if (dataLenght > 1) {
                    return {"data": dummyConts['request'].split('{"data":')}
                } else {
                    return JSON.parse(dummyConts['request'])
                }
            } else {
                return { 'request': dummyConts['request'] }
            }
        }
        else {
            return {}
        }
    }


    setResponseView(dummyConts, sId) {
        if (dummyConts.operationname.includes('/ws/')) {
            dummyConts.response = this.convertWSResponsetoJSON(dummyConts.response);
        }
        if (dummyConts && dummyConts['response'].indexOf('{') > -1) {
            let dataLenght = dummyConts['response'].split('{"data":').length;
            if (dataLenght > 1) {
                return { "data": dummyConts['response'].split('{"data":') }
            } else {
                return JSON.parse((dummyConts['response'] !== "") ? dummyConts['response'] : {})
            }
        }
        else {
            return {}
        }
    }

    makeUTC = (time) => {
        let newTime = moment(time).unix()
        return moment(newTime).utc().format("YYYY-MM-DDTHH:mm:ss")
    }

    makeOper = (logName) => {
        let item = '';
        let nameArray = logName.substring(1).split("/").filter(name => name != 'ws');

        if(nameArray[2] === 'login'){
            item = nameArray[2]
        } else if(nameArray[2] === 'auth'){
            if(nameArray[3] === 'ctrl'){
                item = nameArray[4]
            } else if(nameArray[3] === 'restricted'){
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
        if(storageSelectedTraceidList){
            storageSelectedTraceidIndex = (storageSelectedTraceidList) ? storageSelectedTraceidList.findIndex(s => s === data.traceid) : (-1)
        }

        return (
            <div>
                <div className='audit_timeline_Step'
                     style={{backgroundColor: (data.status === 200)?'#388e3c':'#b71c1c'}}
                >
                    {(storageSelectedTraceidIndex !== (-1))?
                        <CheckIcon />
                        :null
                    }
                </div>
            </div>
        )
    }

    onClickViewDetail = (data) => {
        let rawViewData = (data)?this.setAllView(data):{};
        let requestData = (data)?this.setRequestView(data):{};
        let responseData = (data)?this.setResponseView(data):{};

        this.props.detailView(rawViewData, requestData, responseData)
    }

    handleDateChange = (selectDate, index) => {
        let devData = this.state.devData;
        let dayData = [];

        devData.map((data, index) => {
            let date = moment(this.makeUTC(data.starttime)).format("YYYY-MM-DD");
            if(date === moment(selectDate).utc().format("YYYY-MM-DD")){
                dayData.push(data)
            }
        })

        if(this.state.dropDownValue === 'group') {
            this.dropDownOnChange(null, {value: "group"}, dayData)
        }

        this.setState({
            dayData:dayData,
            expanded: (-1)
        });
    };

    onSelectDate = (date: Moment, index) => {
        if(index !== (-1) && index < 61){
          this.handleDateChange(date, index)
        }
    };

    onClickClose = () => {
        this.props.close()
    };

    handleExpandedChange = (index, traceid) => (event, newExpanded) => {
        let dayData = this.state.dayData;
        this.props.onItemSelected(traceid)
        this.setState({expanded: newExpanded ? index : false});
    };

    handleGroupExpandedChange = (group, index, traceid) => (event, newExpanded) => {
        let dayData = this.state.dayData;
        this.props.onItemSelected(traceid)
        this.setState({groupExpanded: {expanded : newExpanded ? index : false, group: group}});
    };

    dropDownOnChange = (e, v, data) => {
        let dayData = (data)?data:this.state.dayData;
        let groups = [];

        if (v.value === 'group') {
            dayData.map((data, index) => {
                let renderValue = this.makeOper(data.operationname);
                let groupsIndex = groups.findIndex(g => g.title === renderValue)
                let groupsErrorCount = 0;

                if(groupsIndex === (-1)){

                    for(let i = 0; i < dayData.length; i++){
                        if(data.status !== 200){
                            groupsErrorCount++
                        }
                    }
                    groups.push({"title":renderValue, "errorCount":groupsErrorCount})
                }
            })

            groups.map((group, gIndex) => {
                groups[gIndex].data = []
                dayData.map((data, index) => {
                    let renderValue = this.makeOper(data.operationname);
                    if(group.title === renderValue){
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

    renderStapper = (data, index) => {
        return (

            data.operationname ?
                <ExpansionPanel square expanded={this.state.expanded === index} onChange={this.handleExpandedChange(index, data.traceid)}>
                    <ExpansionPanelSummary
                        id="panel1a-header"
                    >
                        <Step key={index}>
                            <div className='audit_timeline_time'>
                                {moment(this.makeUTC(data.starttime)).format("hh:mm:ss")}<br/>
                                {moment(this.makeUTC(data.starttime)).format("A")}
                            </div>
                            <StepLabel StepIconComponent={(stepperProps) => {
                                return this.getStepLabel(data, stepperProps)
                            }}>
                                <div className='audit_timeline_title'>{this.makeOper(data.operationname)}</div>
                                <div className='audit_timeline_traceID'>Trace ID : <span>{data.traceid}</span></div>
                            </StepLabel>
                        </Step>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div className='audit_timeline_detail_row'>
                            <div className='audit_timeline_detail_left'>Start Time</div>
                            <div className='audit_timeline_detail_right'>{moment(this.makeUTC(data.starttime)).format("YYYY-MM-DDTHH:mm:ss")}</div>
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
                            <div className='audit_timeline_detail_right' style={{color:data.status === 200? '#4caf50' : '#E53935' }}>{data.status}</div>
                        </div>
                        <div className='audit_timeline_detail_button'>
                            <Button onClick={() => this.onClickViewDetail(data)}>
                                VIEW DETAIL
                            </Button>
                        </div>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                :
                null
        )
    }

    renderGroupStapper = (data, index, group) => {
        let count = 0;
        data.map((d) => {(d.status !== 200)?count++:count})
        return (
            (group)?
                <div className='audit_timeline_group'>
                    <div className='audit_timeline_group_header'>
                        <div>{group.title}<span className='audit_timeline_group_bedge'>{(count > (-1)?count : 0)}</span></div>
                    </div>
                    <Stepper className='audit_timeline_container' activeStep={data.length} orientation="vertical">
                        {
                            data.map((item, itemIndex) => {
                                return (
                                    <ExpansionPanel square expanded={this.state.groupExpanded.expanded === itemIndex && this.state.groupExpanded.group === group.title} onChange={this.handleGroupExpandedChange(group.title, itemIndex, item.traceid)}>
                                        <ExpansionPanelSummary
                                            id="panel1a-header"
                                        >
                                            <Step key={itemIndex}>
                                                <div className='audit_timeline_time'>
                                                    {moment(this.makeUTC(item.starttime)).format("hh:mm:ss")}<br/>
                                                    {moment(this.makeUTC(item.starttime)).format("A")}
                                                </div>
                                                <StepLabel StepIconComponent={(stepperProps) => {
                                                    return this.getStepLabel(item, stepperProps)
                                                }}>
                                                    <div className='audit_timeline_title'>{this.makeOper(item.operationname)}</div>
                                                    <div className='audit_timeline_traceID'>Trace ID : <span>{item.traceid}</span></div>
                                                </StepLabel>
                                            </Step>
                                        </ExpansionPanelSummary>
                                        <ExpansionPanelDetails>
                                            <div className='audit_timeline_detail_row'>
                                                <div className='audit_timeline_detail_left'>Start Time</div>
                                                <div className='audit_timeline_detail_right'>{moment(this.makeUTC(item.starttime)).format("YYYY-MM-DDTHH:mm:ss")}</div>
                                            </div>
                                            <div className='audit_timeline_detail_row'>
                                                <div className='audit_timeline_detail_left'>Trace ID</div>
                                                <div className='audit_timeline_detail_right'>{item.traceid}</div>
                                            </div>
                                            <div className='audit_timeline_detail_row'>
                                                <div className='audit_timeline_detail_left'>Client IP</div>
                                                <div className='audit_timeline_detail_right'>{item.clientip}</div>
                                            </div>
                                            <div className='audit_timeline_detail_row'>
                                                <div className='audit_timeline_detail_left'>Duration</div>
                                                <div className='audit_timeline_detail_right'>{item.duration}</div>
                                            </div>
                                            <div className='audit_timeline_detail_row'>
                                                <div className='audit_timeline_detail_left'>Operation Name</div>
                                                <div className='audit_timeline_detail_right'>{this.makeOper(item.operationname)}</div>
                                            </div>
                                            <div className='audit_timeline_detail_row'>
                                                <div className='audit_timeline_detail_left'>Status</div>
                                                <div className='audit_timeline_detail_right' style={{color:item.status === 200? '#4caf50' : '#E53935' }}>{item.status}</div>
                                            </div>
                                            <div className='audit_timeline_detail_button'>
                                                <Button onClick={() => this.onClickViewDetail(item)}>
                                                    VIEW DETAIL
                                                </Button>
                                            </div>
                                        </ExpansionPanelDetails>
                                    </ExpansionPanel>
                                    )
                            })
                        }
                    </Stepper>
                </div>
                :null
        )
    }

    render() {
        const {dayData, groups} = this.state
        return (
            <div className='audit_container' style={{height:window.innerHeight - 48}}>
                <div className='audit_title'>
                    <div class="audit_title_label">Audit Logs</div>
                    <div className='audit_filter'>
                        <Dropdown
                            placeholder='indivisual'
                            fluid
                            search
                            selection
                            options={options}
                            onChange={this.dropDownOnChange}
                            style={{ width: 150 }}
                        />
                    </div>
                    <IconButton onClick={this.onClickClose}>
                        <CloseIcon />
                    </IconButton>
                </div>
                <div className='audit_calendar'>
                    <Calendar showDaysBeforeCurrent={30} showDaysAfterCurrent={30} onSelectDate={this.onSelectDate} />
                </div>
                <div className='audit_timeline_vertical'>
                    {
                        (groups.length > 0) ?
                            groups.map((group, gIndex) => {
                                return (
                                    this.renderGroupStapper(group.data, gIndex, group)
                                )
                            })
                            :
                            <Stepper className='audit_timeline_container' activeStep={dayData.length} orientation="vertical">
                                {dayData.map((data, index) => {
                                    return (
                                        this.renderStapper(data, index)
                                    )
                                })}
                            </Stepper>
                    }
                </div>
            </div>
        )
    }
}

function mapStateToProps(state) {
    return {
        user: state.user,
        userInfo: state.userInfo ? state.userInfo : null,
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) },
        handleInjectData: (data) => { dispatch(actions.injectData(data)) },
        handleChangeLoginMode: (data) => { dispatch(actions.changeLoginMode(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => {
            dispatch(actions.loadingSpinner(data))
        },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(HeaderAuditLog));
