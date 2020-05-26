import 'react-hot-loader'
import React from 'react';
import {Button, Dropdown, Modal, Icon} from 'semantic-ui-react';
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
import {IconButton, Toolbar, ButtonGroup, Button as ButtonM} from '@material-ui/core';
import OfflinePinIcon from '@material-ui/icons/OfflinePin';
import RefreshIcon from '@material-ui/icons/Refresh';

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
            nameList:[],
            timelineSelectedIndex: 0,
            unCheckedErrorCount: 0,
            unCheckedErrorToggle: false,
            statusErrorToggle: false,
            statusNormalToggle: false,
            dropDownStatusValue: '',
            dropDownNameValue: '',
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
            this.interval = null
            this.mapzoneStyle = [
                {display:'block', marginTop:20, width:'100%', height: '100%', overflowY: 'scroll'},
                {display:'block', marginTop:20, width:'100%', height: 'fit-content',}
            ]

        }

        componentWillMount() {
            if (this.props.history.location.search === 'pg=audits') {
                this.setState({
                    isLoading: true,
                })
            }
        }

        componentDidMount() {
            let subPaths = this.props.history.location.search
            let subPath = ''
            let subParam = []
            if (subPaths.indexOf('&org=') > (-1)) {
                let paths = subPaths.split('&')
                subPath = paths[0]
                subParam = paths[1].split('=')
            }
            if(subParam[0] === 'org'){
                this.setState({
                    orgName: subParam[1]
                })
            }

            this.interval = setInterval(() => this.realtimeChange(), (1000*60))

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
                    let nameOptions = [{ key: 'all', value: 'all', text: 'All' }]

                    //todo: Extract only the TaskName to display at the top of the timeline.
                    for (let i in auditList) {
                        let operName = auditList[i].operationname;
                        let makeOperName = this.makeOper(operName)
                        tasksList.push(makeOperName);

                        let nameIndex = nameOptions.findIndex(t => t.value === makeOperName)
                        if(nameIndex === (-1)){
                            nameOptions.push({
                                key: makeOperName, value: makeOperName, text: makeOperName
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
                    this.onHandleIndexClick({traceid:statusList[0].traceid})

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
                    }

                    let timelineList = []

                    timelineList.push({'timesList' : newTimesList ,'tasksList':tasksList, 'statusList': statusList})

                    await this.setState({
                        timelineList: timelineList,
                        timesList: newTimesList,//@:todo: TimesList to display above the timeline Dot
                        statusCount: statusCount,
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

        };

        componentWillUnmount() {
            if(this.interval) clearInterval(this.interval)
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
            let storageSelectedTraceidList = JSON.parse(localStorage.getItem("selectedTraceid"))
            this.state.rawAllData.map((data, index) => {
                if(value.traceid === data.traceid){
                    timelineDataOne = data
                }
            })
            if(timelineDataOne) {
                this.setStorageData(timelineDataOne.traceid, "selected")
                if (timelineDataOne.status !== 200) {
                    if (storageSelectedTraceidList) {
                        let storageSelectedTraceidIndex = (storageSelectedTraceidList) ? storageSelectedTraceidList.findIndex(s => s === timelineDataOne.traceid) : (-1)
                        if (storageSelectedTraceidIndex === (-1)) {
                            this.setState({"unCheckedErrorCount": this.state.unCheckedErrorCount - 1})
                        }
                    }
                }
            } else {
                this.setState({
                    isLoading2: false,
                })
                return;
            }
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
            let localStorageName = "selectedTraceid"
            let storageTraceidList = JSON.parse(localStorage.getItem(localStorageName))

            if (storageTraceidList) {
                traceidList = storageTraceidList
                let storageTraceidIndex = storageTraceidList.findIndex(s => s === data)
                if(storageTraceidIndex === (-1)){
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
            let times = this.state.timelineList[0].timesList
            let status = this.state.timelineList[0].statusList
            let storageSelectedTraceidList = JSON.parse(localStorage.getItem("selectedTraceid"))
            this.setState({closeMap:false})


            times.map((time, index) => {
                if(this.getParseDate(time).valueOf() === item.valueOf()){
                    this.setState({"timelineSelectedIndex" : i})
                    this.onHandleIndexClick({"value" : i, "traceid": status[index].traceid})
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

        dropDownOnChangeStatusCount = (list, v) => {
            let normalCount = 0;
            let errorCount = 0;

            list.map((value, index)=>{
                if(this.makeOper(value.operationname) === v.value){
                    (value.status === 200)?normalCount++ : errorCount++
                } else if(v.value === 'all'){
                    (value.status === 200)?normalCount++ : errorCount++
                }
            })

            return {normalCount:normalCount, errorCount:errorCount}
        }

        dropDownOnNameChange = (e, v, current) => {
            let allData = this.state.rawAllData
            let statusCount = []
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

                    this.setState({dropDownNameValue:''})
                } else if (v.value === taskValue) {
                    tasksList.push(taskValue)
                    timesList.push(datetime)
                    statusList.push({"status": allValue.status, "traceid": allValue.traceid})
                    this.setState({dropDownNameValue:v.value})
                }
            })

            statusCount.push(this.dropDownOnChangeStatusCount(allData, v))
            if(statusList.length)this.onHandleIndexClick({traceid:statusList[0].traceid})
            timelineList.push({'timesList' : timesList ,'tasksList':tasksList, 'statusList': statusList, 'current':current})
            this.setState({timelineList: timelineList, statusErrorToggle: false, statusNormalToggle: false, unCheckedErrorToggle:false, statusCount: statusCount, timelineSelectedIndex: 0})
        }

        onClickUnCheckedError = (e, current) => {
            let unCheckedToggle = (e === 'all')?false:this.state.unCheckedErrorToggle
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
                    this.setState({dropDownStatusValue:''})
                } if(value === 'uncheck') {
                    if (allValue.status !== 200) {
                        let storageSelectedTraceidIndex = (storageSelectedTraceidList) ? storageSelectedTraceidList.findIndex(s => s === allValue.traceid) : (-1)
                        if (storageSelectedTraceidIndex === (-1)) {
                            tasksList.push(taskValue)
                            timesList.push(datetime)
                            statusList.push({"status": allValue.status, "traceid": allValue.traceid})
                        }
                    }
                    this.setState({dropDownStatusValue:'uncheck'})
                }
            })

            if(statusList.length)this.onHandleIndexClick({traceid:statusList[0].traceid})
            timelineList.push({'timesList' : timesList ,'tasksList':tasksList, 'statusList': statusList, 'current':current})
            this.setState({timelineList: timelineList, statusErrorToggle:false, statusNormalToggle:false, dropDownNameValue: '', timelineSelectedIndex: 0})
        }

        onClickStatus = (status, current) => {
            let statusErrorToggle = this.state.statusErrorToggle
            let statusNormalToggle = this.state.statusNormalToggle
            let nameValue = this.state.dropDownNameValue
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
                value = 'all'
                this.setState({statusErrorToggle: false, statusNormalToggle: false})
            }


            allData.map((allValue, allIndex) => {
                let taskValue = this.makeOper(allValue.operationname)
                let date = this.makeUTC(allValue.starttime)
                let time = this.makeNotUTC(allValue.starttime)
                let datetime = date + " " + time

                if(value === 'all'){
                    if(nameValue === taskValue){
                        tasksList.push(taskValue)
                        timesList.push(datetime)
                        statusList.push({"status":allValue.status, "traceid":allValue.traceid})
                    } else if(nameValue === '') {
                        tasksList.push(taskValue)
                        timesList.push(datetime)
                        statusList.push({"status":allValue.status, "traceid":allValue.traceid})
                    }
                    this.setState({dropDownStatusValue:''})
                } else if(value === 'status') {
                    if(nameValue === taskValue){
                        if (status === 'error' && allValue.status !== 200) {
                            tasksList.push(taskValue)
                            timesList.push(datetime)
                            statusList.push({"status": allValue.status, "traceid": allValue.traceid})
                        } else if (allValue.status === 200 && status === 'normal'){
                            tasksList.push(taskValue)
                            timesList.push(datetime)
                            statusList.push({"status": allValue.status, "traceid": allValue.traceid});
                        }
                    } else if(nameValue === '') {
                        if (status === 'error' && allValue.status !== 200) {
                            tasksList.push(taskValue)
                            timesList.push(datetime)
                            statusList.push({"status": allValue.status, "traceid": allValue.traceid})
                        } else if (allValue.status === 200 && status === 'normal'){
                            tasksList.push(taskValue)
                            timesList.push(datetime)
                            statusList.push({"status": allValue.status, "traceid": allValue.traceid});
                        }
                    }
                    this.setState({dropDownStatusValue:status})
                }
            });

            if(statusList.length)this.onHandleIndexClick({traceid:statusList[0].traceid})
            timelineList.push({'timesList' : timesList ,'tasksList':tasksList, 'statusList': statusList, 'current':current})
            this.setState({timelineList: timelineList, unCheckedErrorToggle:false, timelineSelectedIndex: 0})
        }

        onCurrentClick = () => {
            let statusValue = this.state.dropDownStatusValue
            let nameValue = this.state.dropDownNameValue

            if(statusValue === '' && nameValue === ''){
                this.dropDownOnNameChange('name', {value:'all'}, true)
            } else if(statusValue === '' && nameValue !== ''){
                this.dropDownOnNameChange('name', {value:nameValue}, true)
            } else if(statusValue === 'error' || statusValue === 'normal'){
                this.onClickStatus(statusValue, true)
            } else if(statusValue === 'uncheck'){
                this.onClickUnCheckedError("all", true)
            }
        };

        onRefreshClick = () => {
            this.refreshData()
        }


        getWidth = () => {
            return localStorage.getItem("navigation") == 0 ? window.innerWidth - 90 : window.innerWidth - 280
        }

        refreshData = ()=>
        {
            this.setState({rawAllData:[], rawViewData :[], requestData: [], responseData: [], currentTraceid: 'traceId', isLoading2: false, nameList: [], dropDownNameValue: ''})
            this.props.refreshData()
        }

        render() {
            return (
                <div style={{display:'flex', height:'100%', flexDirection: 'column'}}>
                    <Toolbar style={{paddingRight:0}}>
                        <label className='content_title_label'>Audit Logs</label>
                        <div style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{this.state.orgName}</div>
                        <div className="page_audit_history">
                            <div className="page_audit_history_option">
                                <div className="page_audit_history_option_period option_name">
                                    <div className="page_audit_history_label">
                                        Name
                                    </div>
                                    <Dropdown
                                        className="dropdownName"
                                        placeholder='All'
                                        fluid
                                        search
                                        selection
                                        value={this.state.dropDownNameValue}
                                        options={this.state.nameList}
                                        onChange={this.dropDownOnNameChange}
                                    />
                                </div>
                                <div className="page_audit_history_option_period option_error_check">
                                    <ButtonGroup>
                                        <ButtonM onClick={() => this.onClickStatus("all")}
                                                 className={this.state.statusNormalToggle === false && this.state.statusErrorToggle === false ? "button_on" : "button_off"}>
                                            <div className="page_audit_error_label">All</div>
                                            <div className="page_audit_badge_number all">
                                                {(this.state.statusCount.length)?this.state.statusCount[0].normalCount + this.state.statusCount[0].errorCount:0}
                                            </div>
                                        </ButtonM>
                                        <ButtonM onClick={() => this.onClickStatus("normal")}
                                                 className={this.state.statusNormalToggle === true ? "button_on" : "button_off"}>
                                            <div className="page_audit_error_label">Normal</div>
                                            <div className="page_audit_badge_number normal">
                                                {(this.state.statusCount.length)?this.state.statusCount[0].normalCount:0}
                                            </div>
                                        </ButtonM>
                                        <ButtonM onClick={() => this.onClickStatus("error")}
                                                 className={this.state.statusErrorToggle === true ? "button_on" : "button_off"}>
                                            <div className="page_audit_error_label">Error</div>
                                            <div className="page_audit_badge_number error">
                                                {(this.state.statusCount.length)?this.state.statusCount[0].errorCount:0}
                                            </div>
                                        </ButtonM>
                                    </ButtonGroup>
                                </div>
                                <div className="page_audit_history_option_period option_unchecked">
                                    <button className="page_audit_error_box with_button" >
                                        <div className="page_audit_error_label">Unchecked Error</div>
                                        <div className="page_audit_badge_number">{this.state.unCheckedErrorCount}</div>
                                    </button>
                                    <button className="page_audit_error_button"  onClick={this.onClickUnCheckedError}>
                                        <OfflinePinIcon fontSize='small' style={{marginTop:5}}/>
                                    </button>
                                </div>
                                <div className="page_audit_history_option_period option_current">
                                    <div className="page_audit_error_box with_button" onClick={this.onCurrentClick}>
                                        <div className="page_audit_error_label">(UTC) {moment(this.state.realtime).utc().format("YYYY-MM-DDTHH:mm")}</div>
                                    </div>
                                    <button className="page_audit_error_button"  onClick={this.onCurrentClick}>Go</button>
                                </div>

                                <IconButton aria-label="refresh" onClick={this.onRefreshClick} style={{marginLeft:10}}>
                                    <RefreshIcon style={{ color: '#76ff03' }} />
                                </IconButton>
                            </div>
                        </div>
                    </Toolbar>
                    <div className="mexListView">

                        <div className='page_audit_timeline_area'
                             style={{width:this.getWidth(), height:(this.state.closeMap)? 'calc(100% - 20px)' : 'calc(50% - 27px)', overflow:'hidden'}}>
                            {(this.state.timesList.length > 0) ?
                                <CalendarTimeline
                                    timelineList={this.state.timelineList[0]}
                                    onItemSelectCallback={this.onItemSelect}
                                    onClickStatus={this.onClickStatus}
                                    onItemClickCloseMap={this.onCloseMap}
                                    onCanvasClickCloseMap={this.onClickCavasCloseMap}
                                    onPopupEmail={this.onPopupEmail}
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
