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
import {Card, IconButton, Toolbar, ButtonGroup} from '@material-ui/core';
import RefreshIcon from '@material-ui/icons/Refresh';

const sgmail = require('@sendgrid/mail')
const countryOptions = [
    { key: '24', value: 24, flag: '24', text: 'Last 24 hours' },
    { key: '18', value: 18, flag: '18', text: 'Last 18 hours' },
    { key: '12', value: 12, flag: '12', text: 'Last 12 hours' },
    { key: '6', value: 6, flag: '6', text: 'Last 6 hours' },
    { key: '1', value: 1, flag: '1', text: 'Last hour' },
]

const typeOptions = [{ key: 'all', value: 'all', flag: 'all', text: 'All' }]
const nameOptions = [{ key: 'all', value: 'all', flag: 'all', text: 'All' }]
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
            isLoading3: false,
            timesList: [],
            timeLineIndex: 0,
            tasksList: [],
            timelineList: [],
            currentTask: '',
            currentTaskTime: '',
            closeMap:false,
            statusList: [],
            statusCount: [],
            typeList:[],
            nameList:[],
            timelineSelectedIndex: 0,
            unCheckedErrorCount: 0,
            unCheckedErrorToggle: false,
            statusErrorToggle: false,
            statusNormalToggle: false,
            dropDownOnChangeValue: '',
            realtime: moment()
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

            setInterval(() => this.realtimeChange()), (1000*60)

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
                let storageSelectedTraceidList = JSON.parse(localStorage.getItem("selectedTraceid"))

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
                            let storageSelectedTraceidIndex = (storageSelectedTraceidList) ? storageSelectedTraceidList.findIndex(s => s === traceid) : (-1)
                            if(storageSelectedTraceidIndex === (-1)){
                                unCheckedErrorCount++
                            }
                            errorCount++
                        }
                        statusList.push({"status":status, "traceid":traceid});
                    }
                    statusCount.push({"errorCount":errorCount, "normalCount":normalCount})

                    let check = false
                    statusList.map((value) => {
                        if(storageSelectedTraceidList){
                            storageSelectedTraceidList.map((storage) => {
                                if(storage === value.traceid){
                                    check = true
                                }
                            })
                        }
                    })
                    if(!check || storageSelectedTraceidList.length > 200){
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

                this.setState({isLoading3 : true}, () => sgmail.send(msg)
                                                            .then(() => {
                                                                alert('success')
                                                                this.setStorageData(traceid, "trace")
                                                                this.setState({ openSendEmail: false, isLoading3 : false })
                                                            })
                                                            .catch((err) => {
                                                                alert('error -> ' + err)
                                                            })
                )
            }

        };

        componentWillUnmount() {
            this.setState({ mounted: false })

        }

        realtimeChange = () => {
            this.setState({realtime:moment()})
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
                } else if(nameArray[3] === 'restricted'){
                    item = nameArray[3] + nameArray[4].charAt(0).toUpperCase() + nameArray[4].slice(1) + nameArray[5].charAt(0).toUpperCase() + nameArray[5].slice(1)
                } else {
                    item = nameArray[3] + nameArray[4].charAt(0).toUpperCase() + nameArray[4].slice(1)
                }
            } else {
                item = nameArray[2]
            }
            return item
        }


        onHandleIndexClick = (value) => {
            this.setState({
                rawViewData: {},
                isLoading2: true,
            })
            let timelineDataOne = null
            this.state.rawAllData.map((data, index) => {

                if(value.traceid === data.traceid){
                    timelineDataOne = data
                }
            })
            this.setStorageData(timelineDataOne.traceid, "selected")
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
            let traceidList = [];
            let localStorageName = ""
            let storageTraceidList = []
            if(type === 'selected'){
                localStorageName = "selectedTraceid"
                storageTraceidList = JSON.parse(localStorage.getItem(localStorageName))
            } else if(type === 'trace'){
                localStorageName = "sendedTraceid"
                storageTraceidList = JSON.parse(localStorage.getItem(localStorageName))
            }
                console.log("20200423_____1 ")
                if (storageTraceidList) {
                    console.log("20200423_____2 ")
                    traceidList = storageTraceidList
                    let storageTraceidIndex = storageTraceidList.findIndex(s => s === data)
                    if(storageTraceidIndex === (-1)){
                        console.log("20200423_____3 ")
                        traceidList.push(data)
                        localStorage.setItem(localStorageName, JSON.stringify(traceidList))
                    }
                } else {
                    traceidList[0] = data
                    localStorage.setItem(localStorageName, JSON.stringify(traceidList))
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
            let storageSelectedTraceidList = JSON.parse(localStorage.getItem("selectedTraceid"))
            this.setState({closeMap:false})

            times.map((time, index) => {
                if(Date.parse(this.getParseDate(time)) === item){
                    this.setState({"timelineSelectedIndex" : i})
                    this.onHandleIndexClick({"value" : i, "traceid": status[index].traceid})
                    if(status[index].status !== 200){
                        if(storageSelectedTraceidList){
                            let storageSelectedTraceidIndex = (storageSelectedTraceidList) ? storageSelectedTraceidList.findIndex(s => s === status[index].traceid) : (-1)
                            if(storageSelectedTraceidIndex === (-1)){
                                this.setState({"unCheckedErrorCount" : this.state.unCheckedErrorCount - 1})
                            }
                        }
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

        onClickCavasCloseMap =()=> {
            this.setState({closeMap:true})
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

        dropDownOnNameChange = (e, v) => {
            let allData = this.state.rawAllData
            let timelineList = []
            let tasksList = []
            let timesList = []
            let statusList = []

            allData.map((allValue, allIndex) => {
                let taskValue = this.makeOper(allValue.operationname)
                let date = this.makeUTC(allValue.starttime)
                let time = this.makeNotUTC(allValue.starttime)
                let datetime = date + " " + time

                if (v.value === 'all') {
                    tasksList.push(taskValue)
                    timesList.push(datetime)
                    statusList.push({"status": allValue.status, "traceid": allValue.traceid})
                    this.setState({dropDownOnChangeValue:''})
                } else if (v.value === taskValue) {
                    tasksList.push(taskValue)
                    timesList.push(datetime)
                    statusList.push({"status": allValue.status, "traceid": allValue.traceid})
                    this.setState({dropDownOnChangeValue:v.value})
                }
            })

            timelineList.push({'timesList' : timesList ,'tasksList':tasksList, 'statusList': statusList})
            this.setState({timelineList: timelineList})
        }

        onClickUnCheckedError = () => {
            let unCheckedToggle = this.state.unCheckedErrorToggle
            let value = 'uncheck'
            let allData = this.state.rawAllData
            let timelineList = []
            let tasksList = []
            let timesList = []
            let statusList = []

            if(unCheckedToggle){
                value = 'all'
                this.setState({unCheckedErrorToggle: false})
            } else {
                this.setState({unCheckedErrorToggle: true})
            }

            allData.map((allValue, allIndex) => {
                let storageSelectedTraceidList = JSON.parse(localStorage.getItem("selectedTraceid"))
                let taskValue = this.makeOper(allValue.operationname)
                let date = this.makeUTC(allValue.starttime)
                let time = this.makeNotUTC(allValue.starttime)
                let datetime = date + " " + time

                if(value === 'all'){
                    tasksList.push(taskValue)
                    timesList.push(datetime)
                    statusList.push({"status":allValue.status, "traceid":allValue.traceid})
                    this.setState({dropDownOnChangeValue:''})
                } if(value === 'uncheck') {
                    if (allValue.status !== 200) {
                        let storageSelectedTraceidIndex = (storageSelectedTraceidList) ? storageSelectedTraceidList.findIndex(s => s === allValue.traceid) : (-1)
                        if (storageSelectedTraceidIndex === (-1)) {
                            tasksList.push(taskValue)
                            timesList.push(datetime)
                            statusList.push({"status": allValue.status, "traceid": allValue.traceid})
                        }
                    }
                    this.setState({dropDownOnChangeValue:'uncheck'})
                }
            })

            timelineList.push({'timesList' : timesList ,'tasksList':tasksList, 'statusList': statusList})
            this.setState({timelineList: timelineList})
        }

        onClickStatus = (status) => {
            let statusErrorToggle = this.state.statusErrorToggle
            let statusNormalToggle = this.state.statusNormalToggle
            let allData = this.state.rawAllData
            let timelineList = []
            let tasksList = []
            let timesList = []
            let statusList = []
            let value = "status"

            if(status === 'normal'){
                if(statusNormalToggle){
                    value = 'all'
                    this.setState({statusNormalToggle: false})
                } else {
                    this.setState({statusNormalToggle: true, statusErrorToggle: false})
                }
            } else if(status === 'error'){
                if(statusErrorToggle){
                    value = 'all'
                    this.setState({statusErrorToggle: false})
                } else {
                    this.setState({statusErrorToggle: true, statusNormalToggle: false})
                }
            } else {
                console.log("20200423___________ ")
                value = 'all'
                this.setState({statusErrorToggle: false, statusNormalToggle: false})
            }

            allData.map((allValue, allIndex) => {
                let taskValue = this.makeOper(allValue.operationname)
                let date = this.makeUTC(allValue.starttime)
                let time = this.makeNotUTC(allValue.starttime)
                let datetime = date + " " + time

                if(value === 'all'){
                    tasksList.push(taskValue)
                    timesList.push(datetime)
                    statusList.push({"status":allValue.status, "traceid":allValue.traceid})
                    this.setState({dropDownOnChangeValue:''})
                } else if(value === 'status'){
                    if (status === 'error' && allValue.status !== 200) {
                        tasksList.push(taskValue)
                        timesList.push(datetime)
                        statusList.push({"status": allValue.status, "traceid": allValue.traceid})
                    } else if (allValue.status === 200 && status === 'normal'){
                        tasksList.push(taskValue)
                        timesList.push(datetime)
                        statusList.push({"status": allValue.status, "traceid": allValue.traceid});
                    }
                    this.setState({dropDownOnChangeValue:status})
                }
            })

            timelineList.push({'timesList' : timesList ,'tasksList':tasksList, 'statusList': statusList})
            this.setState({timelineList: timelineList})
        }

        onCurrentClick = () => {
            let value = this.state.dropDownOnChangeValue

            console.log("20200423 " + value)

            if(value === ''){
                this.dropDownOnNameChange('name', {value:'all'})
            } else if(value === 'error' || value === 'normal'){
                this.onClickStatus(value)
            } else if(value === 'uncheck'){
                this.onClickUnCheckedError()
            } else {
                this.dropDownOnNameChange('name', value)
            }
        };


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
                                    <div>Current Coordinated Universal Time (UTC)</div>
                                    <div>{moment(this.state.realtime).utc().format("YYYY-MM-DDTHH:mm")}</div>
                                </div>
                                <div className="page_audit_history_option_period">
                                    <button className="page_audit_error_box" onClick={this.onCurrentClick}>
                                        <div className="page_audit_error_label">Current Time</div>
                                    </button>
                                </div>
                                <div className="page_audit_history_option_period">
                                    <ButtonGroup>
                                        <Button onClick={() => this.onClickStatus("all")}>All</Button>
                                        <Button onClick={() => this.onClickStatus("normal")}>Normal</Button>
                                        <Button onClick={() => this.onClickStatus("error")}>error</Button>
                                    </ButtonGroup>
                                    <button className="page_audit_error_box" onClick={() => this.onClickStatus("normal")}>
                                        <div className="page_audit_error_label">Normal</div>
                                        <div className="page_audit_error_number">{(this.state.statusCount.length)?this.state.statusCount[0].normalCount:0}</div>
                                    </button>
                                </div>
                                <div className="page_audit_history_option_period">
                                    <button className="page_audit_error_box" onClick={() => this.onClickStatus("error")}>
                                        <div className="page_audit_error_label">Error</div>
                                        <div className="page_audit_error_number">{(this.state.statusCount.length)?this.state.statusCount[0].errorCount:0}</div>
                                    </button>
                                </div>
                                <div className="page_audit_history_option_period">
                                    <button className="page_audit_error_box" onClick={this.onClickUnCheckedError}>
                                        <div className="page_audit_error_label">Unchecked Error</div>
                                        <div className="page_audit_error_number">{this.state.unCheckedErrorCount}</div>
                                    </button>
                                </div>
                                <div className="page_audit_history_option_period">
                                    <div className="page_audit_history_label">
                                        Name
                                    </div>
                                    <Dropdown
                                        className='dropDownName'
                                        placeholder='All'
                                        fluid
                                        search
                                        selection
                                        options={this.state.nameList}
                                        onChange={this.dropDownOnNameChange}
                                        style={{ width: 200 }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Toolbar>
                    <div className="mexListView">

                        <div  style={{width:this.getWidth(), height:(this.state.closeMap)? 'calc(100% - 20px)' : 'calc(50% - 27px)', overflow:'hidden'}}>
                            {(this.state.timesList.length > 0) ?
                                <CalendarTimeline
                                    timelineList={this.state.timelineList[0]}
                                    onItemSelectCallback={this.onItemSelect}
                                    onClickStatus={this.onClickStatus}
                                    onItemClickCloseMap={this.onCloseMap}
                                    onCanvasClickCloseMap={this.onClickCavasCloseMap}
                                    // onPopupEmail={this.onPopupEmail}
                                    timelineSelectedIndex={this.state.timelineSelectedIndex}
                                />
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
                {this.state.isLoading3 &&
                <FlexBox style={{ position: 'absolute', bottom: '54%', left: '5%', zIndex: 9999999 }}>
                    <CircularProgress style={{ color: '#1cecff', zIndex: 9999999, fontSize: 10 }}
                                      size={20} />
                </FlexBox>
                }
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
