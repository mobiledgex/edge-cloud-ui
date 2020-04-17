import 'react-hot-loader'
import React from 'react';
import { Button, Dropdown, Modal, Icon } from 'semantic-ui-react';
import * as moment from 'moment';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import 'semantic-ui-css/semantic.min.css'
import PopSendEmailView from './popSendEmailView';
import { withRouter } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as actions from "../actions";
import FlexBox from "flexbox-react";
import CalendarTimeline from "../components/timeline/calendarTimeline";
import { hot } from "react-hot-loader/root";
import {Card, IconButton, Toolbar} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

const sgmail = require('@sendgrid/mail')
const countryOptions = [
    { key: '24', value: 24, flag: '24', text: 'Last 24 hours' },
    { key: '18', value: 18, flag: '18', text: 'Last 18 hours' },
    { key: '12', value: 12, flag: '12', text: 'Last 12 hours' },
    { key: '6', value: 6, flag: '6', text: 'Last 6 hours' },
    { key: '1', value: 1, flag: '1', text: 'Last hour' },
]
let _self = null;
const jsonView = (jsonObj, self) => {
    return <ReactJson src={jsonObj} {...self.jsonViewProps} style={{ width: '100%' }} />
}

const mapStateToProps = (state) => {
    let submitSuccess = false;
    let submitContent = null;
    let submitValues = null;
    if (state.form.fieldLevelValidation) {
        console.log('20191030 redux props.. ', state.form.fieldLevelValidation)
        if (state.form.fieldLevelValidation.submitSucceeded) {
            submitSuccess = true;
            submitContent = state.form.fieldLevelValidation.registeredFields;
            submitValues = state.form.fieldLevelValidation.values;
        }
    }
    return {
        onSubmit: submitSuccess,
        sendingContent: submitContent,
        sendingValues:submitValues,
        loading: state.loadingSpinner.loading,
        isLoading: state.LoadingReducer.isLoading,
    }

};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => {
            dispatch(actions.loadingSpinner(data))
        },
        toggleLoading: (data) => {
            dispatch(actions.toggleLoading(data))
        },
    };
};

export default hot(withRouter(connect(mapStateToProps, mapDispatchProps)(
    class TimelineAuditView extends React.Component {
        state = {
            value: 0,
            dates: [],
            contData: [],
            rawAllData: [],
            rawViewData: [],
            requestData: [],
            responseData: [],
            currentTraceid: 'traceId',
            selectedIndex: 0,
            auditCount: 0,
            mounted: false,
            openSendEmail: false,
            orgName: '',
            isLoading: false,
            isLoading2: false,
            timesList: [],
            timeLineIndex: 0,
            tasksList: [],
            timelineList: [],
            currentTask: '',
            currentTaskTime: '',
            closeMap:true,
            storageTimeList: [],
            statusList: [],
            statusCount: [],
            typeList:[],
            nameList:[],
            timelineSelectedIndex: 0,
            unCheckedErrorCount: 0,
            unCheckedErrorToggle: false
        };
        jsonViewProps = {
            name: null,
            theme: "monokai",
            collapsed: false,
            collapseStringsAfter: 15,
            onAdd: false,
            onEdit: false,
            onDelete: false,
            displayObjectSize: true,
            enableClipboard: true,
            indentWidth: 4,
            displayDataTypes: false,
            iconStyle: "triangle"
        }

        constructor(props) {
            super(props);
            _self = this;
            this.sameTime = '0';
            this.addCount = 0;

            this.mapzoneStyle = [
                {display:'block', marginTop:20, width:'100%', height: '100%', overflowY: 'scroll'},
                {display:'block', marginTop:20, width:'100%', height: 'fit-content',}
            ]

            sgmail.setApiKey('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')
        }

        componentWillMount() {
            if (this.props.history.location.search === 'pg=audits') {
                this.setState({
                    isLoading: true,
                })
            }
        }

        componentDidMount() {
            if (this.props.location.state !== undefined) {
                let orgName = this.props.location.state.orgName;
                this.setState({
                    orgName
                })
            }
            this.setState({
                mounted: true,
            });
        }

        componentWillReceiveProps = async (nextProps, nextContext) => {
            let dummys = [];
            let dummyConts = [];
            if (nextProps.data !== this.props.data) {
                this.props.toggleLoading(true);
                this.setState({
                    timesList: [],
                    tasksList: [],
                    isLoading: true,
                })
                let storageTimeList = JSON.parse(localStorage.getItem("selectedTime"))

                if (!nextProps.location.search.toString().includes('org=')) {
                    await this.setState({
                        orgName: '',
                    })
                }

                let timesList = []
                let newTimesList = []
                if (nextProps.data.data && nextProps.data.data.length) {

                    nextProps.data.data.map((item) => {
                        let stdate = this.makeUTC(item['starttime'])
                        let sttime = this.makeNotUTC(item['starttime'])
                        let composit = stdate + " " + sttime;
                        dummys.push(composit)
                        dummyConts.push(item)
                        newTimesList.push(composit)
                        timesList.push('timeline-dot-' + composit);
                    })

                    this.setState({
                        dates: dummys,
                        rawAllData: dummyConts,
                        auditCount: nextProps.data.data.length,
                        currentTraceid: dummyConts[this.state.selectedIndex]['traceid']
                    })
                    if (dummyConts[this.state.selectedIndex]) this.setAllView(dummyConts[this.state.selectedIndex], this.state.selectedIndex);
                    if (dummyConts[this.state.selectedIndex]) this.setRequestView(dummyConts[this.state.selectedIndex], this.state.selectedIndex);
                    if (dummyConts[this.state.selectedIndex]) this.setResponseView(dummyConts[this.state.selectedIndex], this.state.selectedIndex);


                    let auditList = nextProps.data.data;
                    let tasksList = []

                    //todo: Extract only the TaskName to display at the top of the timeline.
                    let typeOptions = [{ key: 'all', value: 'all', flag: 'all', text: 'All' }]
                    let nameOptions = [{ key: 'all', value: 'all', flag: 'all', text: 'All' }]
                    for (let i in auditList) {
                        let operName = auditList[i].operationname;
                        let makeOperName = this.makeOper(operName)
                        tasksList.push(makeOperName);

                        let nameIndex = nameOptions.findIndex(t => t.value === makeOperName)
                        if(nameIndex === (-1)){
                            nameOptions.push({
                                key: makeOperName, value: makeOperName, flag: makeOperName, text: makeOperName
                            })
                        }

                        let renderValue = this.typeRender(this.makeOper(operName))
                        let typesIndex = typeOptions.findIndex(t => t.value === renderValue)

                        if(typesIndex === (-1)){
                            typeOptions.push({
                                 key: renderValue, value: renderValue, flag: renderValue, text: renderValue
                            })
                        }
                    }

                    let statusList = []
                    let statusCount = []
                    let errorCount = 0
                    let unCheckedErrorCount = 0
                    let normalCount = 0

                    for (let i in auditList) {
                        let status = auditList[i].status;
                        let traceid = auditList[i].traceid;
                        if(auditList[i].status === 200){
                            normalCount++
                        } else {
                            let makeDate = this.makeUTC(auditList[i].starttime)
                            let makeTime = this.makeNotUTC(auditList[i].starttime)
                            let newDate =  this.getParseDate(makeDate + " " + makeTime)
                            let storageTimeIndex = (storageTimeList) ? storageTimeList.findIndex(s => this.getParseDate(s).valueOf() === newDate.valueOf()) : (-1)
                            if(storageTimeIndex === (-1)){
                                unCheckedErrorCount++
                            }
                            errorCount++
                        }
                        statusList.push({"status":status, "traceid":traceid});
                    }
                    statusCount.push({"errorCount":errorCount, "normalCount":normalCount})

                    let check = false
                    newTimesList.map((time) => {
                        if(storageTimeList){
                            storageTimeList.map((storage) => {
                                if(new Date(storage).getTime() === new Date(time).getTime()){
                                    check = true
                                }
                            })
                        }
                    })
                    if(!check || storageTimeList.length > 200){
                        localStorage.removeItem('selectedTime')
                        localStorage.removeItem('sendedTraceid')
                    }

                    let timelineList = []

                    timelineList.push({'timesList' : newTimesList ,'tasksList':tasksList, 'statusList': statusList})

                    await this.setState({
                        timelineList: timelineList,
                        timesList: newTimesList,//@:todo: TimesList to display above the timeline Dot
                        statusCount: statusCount,
                        typeList: typeOptions,
                        nameList: nameOptions,
                        unCheckedErrorCount: unCheckedErrorCount,
                        currentTask: timelineList[0].tasksList[0],
                        currentTaskTime: timelineList[0].timesList[0],
                        isLoading: false,
                    })
                    this.props.handleLoadingSpinner(false);
                    this.props.toggleLoading(false);


                }

            }
            //submit form
            if (nextProps.onSubmit) {
                console.log('20191030 send mail contents == ', nextProps)
                let msg = nextProps.sendingValues
                let traceid = null;

                nextProps.data.data.map((v, i) => {
                    if(nextProps.sendingValues.html.indexOf(v.traceid) > (-1)){
                        traceid = v.traceid
                    }
                })

                this.setState({}, () => sgmail.send(msg)
                                                            .then(() => {
                                                                console.log('success')
                                                                this.setStorageData(traceid, "trace")
                                                                this.setState({ openSendEmail: false })
                                                            })
                                                            .catch((err) => {
                                                                console.log('error = ' + err)
                                                            })
                )
            }

        };

        componentWillUnmount() {
            this.setState({ mounted: false })

        }

        typeRender(value) {
            let renderValue = null
            value = value.toLowerCase()

            if(value.indexOf('cloudletpool') > (-1)){
                renderValue = 'CloudletPool'
            } else if(value.indexOf('cloudlet') > (-1)){
                renderValue = 'Cloudlet'
            } else if(value.indexOf('cluster') > (-1)){
                renderValue = 'Cluster'
            } else if(value.indexOf('appinst') > (-1)){
                renderValue = 'AppInst'
            } else if(value.indexOf('app') > (-1)){
                renderValue = 'App'
            } else if(value.indexOf('audit') > (-1)){
                renderValue = 'Audit'
            } else if(value.indexOf('login') > (-1)){
                renderValue = 'Login'
            } else if(value.indexOf('user') > (-1)){
                renderValue = 'User'
            } else {
                renderValue = 'Other'
            }
            return renderValue
        }

        makeUTC = (time) => {
            let newTime = moment(time).unix()
            return moment(newTime).utc().format('YYYY/MM/DD')
        }

        makeNotUTC = (time) => {
            let newTime = moment(time).unix();
            let makeTime = moment(newTime).utc().format('HH:mm:ss:SSS');
            if (makeTime === _self.sameTime) {
                _self.addCount++;
                makeTime = moment(newTime + 1000).utc().format('HH:mm:ss');
                //makeTime = moment(newTime).utc().format('HH:mm:ss.SSS') + "00"+ (_self.addCount < 10)? '0'+_self.addCount : _self.addCount;
            } else {
                _self.addCount = 0;
            }
            _self.sameTime = makeTime;
            return makeTime;
        }

        makeOper = (logName) => {
            // let lastSub = logName.substring(logName.lastIndexOf('/') + 1);
            let item = '';
            let nameArray = logName.substring(1).split("/").filter(name => name != 'ws');

            if(nameArray[2] === 'login'){
                item = nameArray[2]
            } else if(nameArray[2] === 'auth'){
                if(nameArray[3] === 'ctrl'){
                    item = nameArray[4]
                } else {
                    item = nameArray[3] + nameArray[4].charAt(0).toUpperCase() + nameArray[4].slice(1)
                }
            }
            return item
        }


        onHandleIndexClick = (value) => {
            this.setState({
                rawViewData: {},
                isLoading2: true,
            })
            let selectedIndex = value.value;
            let timelineDataOne = this.state.rawAllData[selectedIndex]
            this.setStorageData(timelineDataOne.starttime, "time")
            setTimeout(() => {
                this.setRequestView(timelineDataOne)
                this.setResponseView(timelineDataOne)
                this.setState({
                    rawViewData: timelineDataOne,
                    isLoading2: false,
                })
            }, 251)
        }

        setStorageData(data, type) {
            if(type === 'time'){
                let timeList = [];
                let storageTimeList = JSON.parse(localStorage.getItem("selectedTime"))
                let makeDate = this.makeUTC(data)
                let makeTime = this.makeNotUTC(data)
                let newDate =  this.getParseDate(makeDate + " " + makeTime)

                if (storageTimeList) {
                    timeList = storageTimeList
                    let storageTimeIndex = storageTimeList.findIndex(s => Date.parse(s) === newDate.valueOf())
                    if(storageTimeIndex === (-1)){
                        timeList.push(newDate)
                        localStorage.setItem("selectedTime", JSON.stringify(timeList))
                    }
                } else {
                    timeList[0] = newDate
                    localStorage.setItem("selectedTime", JSON.stringify(timeList))
                }
            } else if(type === 'trace'){
                let traceList = []
                let storageTraceList = JSON.parse(localStorage.getItem("sendedTraceid"))

                if (storageTraceList) {
                    traceList = storageTraceList
                    let storageTraceIndex = storageTraceList.findIndex(s => s.traceid === data)
                    if(storageTraceIndex === (-1)){
                        traceList.push(data)
                        localStorage.setItem("sendedTraceid", JSON.stringify(traceList))
                    }
                } else {
                    traceList[0] = data
                    localStorage.setItem("sendedTraceid", JSON.stringify(traceList))
                }
            }
        }

        setAllView(dummyConts, sId) {
            if (dummyConts && dummyConts['traceid']) {
                _self.setState({
                rawViewData: dummyConts,
                currentTraceid: dummyConts['traceid']
            })
        }
        }

        getParseDate = item => {
            let parseDate = item;
            parseDate = moment(item, "YYYY-MM-DD HH:mm:ss");
            return parseDate;
        };

        onItemSelect = (item, i) => {
            let value = '';
            let times = this.state.timelineList[0].timesList
            let status = this.state.timelineList[0].statusList

            times.map((time, index) => {
                if(Date.parse(this.getParseDate(time)) === item){
                    this.setState({"timelineSelectedIndex" : i})
                    this.onHandleIndexClick({"value" : i})
                    if(status[index].status !== 200){
                        this.setState({"unCheckedErrorCount" : this.state.unCheckedErrorCount - 1})
                    }
                }
            })
        }

        onPopupEmail = () => {
            setTimeout(() => {
                this.setState({openSendEmail: true})
            }, 251)
        }

        onCloseMap =()=> {
            let close = !this.state.closeMap;
            this.setState({closeMap:close})
        }

        setRequestView(dummyConts, sId) {

            if (dummyConts && dummyConts['request']) {
                if (dummyConts['request'].indexOf('{') > -1) {
                    let dataLenght = dummyConts['request'].split('{"data":').length;
                    if (dataLenght > 1) {
                        this.setState({ requestData: { "data": dummyConts['request'].split('{"data":') } })
                    } else {
                        this.setState({ requestData: JSON.parse(dummyConts['request']) })
                    }
                } else {
                    this.setState({ requestData: { 'request': dummyConts['request'] } })
                }
            }
            else {
                this.setState({ requestData: {} })
            }

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

        setResponseView(dummyConts, sId) {
            if (dummyConts.operationname.includes('/ws/')) {
                dummyConts.response = this.convertWSResponsetoJSON(dummyConts.response);
            }
            if (dummyConts && dummyConts['response'].indexOf('{') > -1) {
                let dataLenght = dummyConts['response'].split('{"data":').length;
                if (dataLenght > 1) {
                    this.setState({ responseData: { "data": dummyConts['response'].split('{"data":') } })
                } else {
                    this.setState({ responseData: JSON.parse((dummyConts['response'] !== "") ? dummyConts['response'] : {}) })
                }
            }
            else {
                this.setState({ responseData: {} })
            }

        }

        submitSendEmail = () => {
            alert('submit')
        }
        close = () => this.setState({ openSendEmail: false })

        dropDownOnChange = (e, v) => {
            let allData = this.state.rawAllData
            let timelineList = []
            let tasksList = []
            let timesList = []
            let statusList = []

            allData.map((allValue, allIndex) => {
                let storageTimeList = JSON.parse(localStorage.getItem("selectedTime"))
                let taskValue = this.makeOper(allValue.operationname)
                let task = (e === 'type')? this.typeRender(allValue.operationname):taskValue
                let date = this.makeUTC(allValue.starttime)
                let time = this.makeNotUTC(allValue.starttime)
                let datetime = date + " " + time
                let newDate = this.getParseDate(datetime)
                let status = allValue.status
                let traceid = allValue.traceid;

                if(v.value === 'all' || v.value === 'All'){
                    tasksList.push(taskValue)
                    timesList.push(datetime)
                    statusList.push({"status":status, "traceid":traceid});
                } else if(task === v.value){
                    tasksList.push(taskValue)
                    timesList.push(datetime)
                    statusList.push({"status":status, "traceid":traceid});
                } else if(v.value > 0){
                    let newDate = (moment().valueOf() - (v.value * 1000 * 3600))
                    if(newDate < datetime.valueOf()){
                        tasksList.push(task)
                        timesList.push(datetime)
                        statusList.push({"status":status, "traceid":traceid});
                    }
                } else if(v.value === 'uncheck'){
                    if(status !== 200){
                        let storageTimeIndex = (storageTimeList) ? storageTimeList.findIndex(s => Date.parse(s) === newDate.valueOf()) : (-1)
                        if(storageTimeIndex === (-1)){
                            tasksList.push(taskValue)
                            timesList.push(datetime)
                            statusList.push({"status":status, "traceid":traceid});
                        }
                    }
                }
            })

            timelineList.push({'timesList' : timesList ,'tasksList':tasksList, 'statusList': statusList})
            this.setState({timelineList: timelineList})
        }

        dropDownOnNameChange = (e, v) => {
            this.dropDownOnChange('name', v)

        }

        dropDownOnTypeChange = (e, v) => {
            this.dropDownOnChange('type', v)
        }

        // dropDownOnDateChange = (e, v) => {
        //     this.dropDownOnChange('date', v)
        // }

        onClickUnCheckedError = (e, v) => {
            let unCheckedToggle = this.state.unCheckedErrorToggle
            let value = {'value':'uncheck'}
            if(unCheckedToggle){
                value = {'value':'all'}
                this.setState({unCheckedErrorToggle: false})
            } else {
                this.setState({unCheckedErrorToggle: true})
            }
            this.dropDownOnChange(null,value)
        }


        getWidth = () => {
            return localStorage.getItem("navigation") == 0 ? window.innerWidth - 90 : window.innerWidth - 280
        }

        refreshData = ()=>
        {
            this.setState({rawAllData:[], rawViewData :[], requestData: [], responseData: [], currentTraceid: 'traceId', isLoading2: false})
            this.props.refreshData()
        }

        render() {
            return (
                <div style={{display:'flex', height:'100%', flexDirection: 'column'}}>
                    <Toolbar>
                        <label className='content_title_label'>Audit Logs</label>
                        <div className="page_audit_history">
                            <div className="page_audit_history_option">
                                <div style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{this.state.orgName}</div>
                                <div className="page_audit_history_option_period">
                                    <button className="page_audit_error_box" onClick={this.onClickUnCheckedError}>
                                        <div className="page_audit_error_label">Unchecked Error</div>
                                        <div className="page_audit_error_number">{this.state.unCheckedErrorCount}</div>
                                    </button>
                                </div>
                                <div className="page_audit_history_option_period">
                                    <div className="page_audit_history_label">
                                        Type
                                    </div>
                                    <Dropdown
                                        placeholder='All'
                                        fluid
                                        search
                                        selection
                                        options={this.state.typeList}
                                        onChange={this.dropDownOnTypeChange}
                                        style={{ width: 200 }}
                                    />
                                </div>
                                <div className="page_audit_history_option_period">
                                    <div className="page_audit_history_label">
                                        Name
                                    </div>
                                    <Dropdown
                                        placeholder='All'
                                        fluid
                                        search
                                        selection
                                        options={this.state.nameList}
                                        onChange={this.dropDownOnNameChange}
                                        style={{ width: 200 }}
                                    />
                                </div>
                                {/*<div className="page_audit_history_option_period">*/}
                                {/*    <div className="page_audit_history_label">*/}
                                {/*        Date Range*/}
                                {/*    </div>*/}
                                {/*    <Dropdown*/}
                                {/*        placeholder='Custom Time Range'*/}
                                {/*        fluid*/}
                                {/*        search*/}
                                {/*        selection*/}
                                {/*        options={countryOptions}*/}
                                {/*        onChange={this.dropDownOnDateChange}*/}
                                {/*        style={{ width: 200, height:30 }}*/}
                                {/*    />*/}
                                {/*    <IconButton aria-label="refresh">*/}
                                {/*        <RefreshIcon style={{ color: '#76ff03', marginTop:-6 }} onClick={(e)=>{this.refreshData()}}/>*/}
                                {/*    </IconButton>*/}
                                {/*</div>*/}
                            </div>
                        </div>
                    </Toolbar>
                    <div className="mexListView">

                        <div  style={{width:this.getWidth(), height:(this.state.closeMap)? 'calc(100% - 20px)' : 'calc(50% - 27px)', overflow:'hidden'}}>
                            {(this.state.timesList.length > 0) ?
                                <CalendarTimeline timelineList={this.state.timelineList[0]} onItemSelectCallback={this.onItemSelect} onPopupEmail={this.onPopupEmail} statusCount={this.state.statusCount} timelineSelectedIndex={this.state.timelineSelectedIndex}/>
                                :null
                            }
                        </div>
                        <div style={{margin:'5px 0', cursor:'pointer', display:'flex', alignItems:'column', justifyContent:'center'}} onClick={this.onCloseMap}>
                            <span style={{color:'#c8c9cb'}}>{(this.state.closeMap)?'Show':'Hide'}</span>
                            <Icon name={(this.state.closeMap)?'angle up':'angle down'}/>
                        </div>
                        <div className="page_audit_code" style={{display:(this.state.closeMap)?'none':'flex', height: '50%'}}>
                            <div className="page_audit_code_left">
                                <div className="page_audit_code_rawviewer">
                                    <div className="page_audit_code_rawviewer_title">
                                        Raw Viewer
                                    </div>
                                    {this.state.isLoading2 &&
                                    <FlexBox style={{ position: 'absolute', bottom: '54%', left: '5%', zIndex: 9999999 }}>
                                        <CircularProgress style={{ color: '#1cecff', zIndex: 9999999, fontSize: 10 }}
                                                          size={20} />
                                    </FlexBox>
                                    }
                                    <div className="page_audit_code_rawviewer_codebox">
                                        {(this.state.rawViewData) ? jsonView(this.state.rawViewData, this) : null}
                                    </div>
                                </div>
                            </div>
                            <div className="page_audit_code_right">
                                <div className="page_audit_code_request">
                                    <div className="page_audit_code_request_title">
                                        Request
                                    </div>
                                    <div className="page_audit_code_request_codebox">
                                        {(this.state.requestData) ? jsonView(this.state.requestData, this) : null}
                                    </div>
                                </div>
                                <div className="page_audit_code_response">
                                    <div className="page_audit_code_response_title">
                                        Response
                                    </div>
                                    <div className="page_audit_code_response_codebox">
                                        {(this.state.responseData) ? jsonView(this.state.responseData, this) : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <SendEmailView dimmer={true} open={this.state.openSendEmail} close={this.close}
                                       callback={this.submitSendEmail} rawViewData={this.state.rawViewData}/>

                    </div>
                </div>
            )
        }
    }
)))

class SendEmailView extends React.Component {
    onSubmit = () => {
        console.log('20200401')
        this.setState({ submitState: true })
    }
    onClear = () => {
        this.setState({ clearState: true })
    }
    state = {
        submitState: false,
        clearState: false
    }

    render() {
        let { dimmer, open, close, callback, rawViewData } = this.props;
        return (
            <Modal dimmer={dimmer} open={open} onClose={close} closeIcon>
                <Modal.Header>New Email</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <PopSendEmailView ref={form => this.formReference = form} submitState={this.state.submitState}
                                          clearState={this.state.clearState} rawViewData={rawViewData}></PopSendEmailView>
                    </Modal.Description>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={this.onClear}>
                        Clear
                    </Button>
                    <Button
                        positive
                        icon='checkmark'
                        labelPosition='right'
                        content="Submit"
                        onClick={this.onSubmit}
                    />
                </Modal.Actions>
            </Modal>
        )
    }
}
