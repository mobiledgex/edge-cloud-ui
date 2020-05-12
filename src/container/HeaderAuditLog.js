import React from 'react';
import {Button, Dropdown, Icon, Popup} from 'semantic-ui-react';
import {ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
//redux
import {connect} from 'react-redux';
import * as actions from '../actions';
import * as serviceMC from '../services/serviceMC';
import PopProfileViewer from '../container/popProfileViewer';
import AccountCircleOutlinedIcon from '@material-ui/icons/AccountCircleOutlined';
import {CircularProgress, IconButton, Step, StepLabel, Stepper} from '@material-ui/core';
import Calendar from '../components/horizontal_calendar/Calendar';
import moment from "moment";
import type Moment from "moment";
import {green, red} from "@material-ui/core/colors";
import ReactJson from "react-json-view";
import OfflinePinIcon from "@material-ui/core/SvgIcon/SvgIcon";
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
                <div style={{
                    backgroundColor: (data.status === 200)?green[500]:red[500],
                    borderRadius: '50%',
                    width: 20,
                    height: 20,
                    fontSize: 10
                    }}>
                    {(storageSelectedTraceidIndex !== (-1))?"VV":null}
                </div>
            </div>
        )
    }

    onClickViewDetail = (index) => {
        let dayData = this.state.dayData;

        let rawViewData = (dayData[index])?this.setAllView(dayData[index], index):{};
        let requestData = (dayData[index])?this.setRequestView(dayData[index], index):{};
        let responseData = (dayData[index])?this.setResponseView(dayData[index], index):{};

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

    handleExpandedChange = (index) => (event, newExpanded) => {
        let dayData = this.state.dayData;
        this.props.onItemSelected(dayData[index].traceid, index)
        this.setState({expanded: newExpanded ? index : false});
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
                <ExpansionPanel square expanded={this.state.expanded === index} onChange={this.handleExpandedChange(index)}>
                    <ExpansionPanelSummary
                        id="panel1a-header"
                    >
                        <Step key={index}>
                            <p style={{"float": "left"}}>{moment(this.makeUTC(data.starttime)).format("HH:mm:ss")}</p>
                            <StepLabel StepIconComponent={(stepperProps) => {
                                return this.getStepLabel(data, stepperProps)
                            }}><p>{this.makeOper(data.operationname)}</p></StepLabel>
                        </Step>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                        <div >
                            start time : {moment(this.makeUTC(data.starttime)).format("YYYY-MM-DDTHH:mm:ss")}<br />
                            trace id : {data.traceid}<br />
                            client ip : {data.clientip}<br />
                            duration : {data.duration}<br />
                            operator name : {this.makeOper(data.operationname)}<br />
                            status : {data.status}
                        </div>
                        <button onClick={() => this.onClickViewDetail(index)}>
                            view detail
                        </button>
                    </ExpansionPanelDetails>
                </ExpansionPanel>
                :
                null
        )
    }

    renderGroupStapper = (data, index, group) => {
        let count = data.findIndex(d => d.status !== 200)
        return (
            (group)?
                <div>
                    <p>{group.title} </p>
                    <p>{(count > (-1)?count : 0)}</p>
                    {
                        data.map((item, itemIndex) => {
                            return (
                                <ExpansionPanel square expanded={this.state.expanded === itemIndex} onChange={this.handleExpandedChange(itemIndex)}>
                                    <ExpansionPanelSummary
                                        id="panel1a-header"
                                    >
                                        <Step key={itemIndex}>
                                            <p style={{"float": "left"}}>{moment(this.makeUTC(item.starttime)).format("HH:mm:ss")}</p>
                                            <StepLabel StepIconComponent={(stepperProps) => {
                                                return this.getStepLabel(item, stepperProps)
                                            }}><p>{this.makeOper(item.operationname)}</p></StepLabel>
                                        </Step>
                                    </ExpansionPanelSummary>
                                    <ExpansionPanelDetails>
                                        <div >
                                            start time : {moment(this.makeUTC(item.starttime)).format("YYYY-MM-DDTHH:mm:ss")}<br />
                                            trace id : {item.traceid}<br />
                                            client ip : {item.clientip}<br />
                                            duration : {item.duration}<br />
                                            operation name : {this.makeOper(item.operationname)}<br />
                                            status : {item.status}
                                        </div>
                                        <button onClick={() => this.onClickViewDetail(itemIndex)}>
                                            view detail
                                        </button>
                                    </ExpansionPanelDetails>
                                </ExpansionPanel>
                                )
                        })
                    }
                </div>
                :null
        )
    }

    render() {
        const {dayData, groups} = this.state
        return (
            <div style={{"backgroundColor":"black", "width":"500px", "height":"1000px", "overflow":"scroll"}}>
                <strong>Audit Log</strong><button onClick={this.onClickClose}>X</button>
                <Dropdown
                    placeholder='indivisual'
                    fluid
                    search
                    selection
                    options={options}
                    onChange={this.dropDownOnChange}
                    style={{ width: 150 }}
                />
                <div>
                    <View style={styles.container}>
                        <Calendar showDaysBeforeCurrent={30} showDaysAfterCurrent={30} onSelectDate={this.onSelectDate} />
                    </View>
                    <Stepper activeStep={dayData.length} orientation="vertical">
                        {
                            (groups.length > 0) ?
                                groups.map((group, gIndex) => {
                                    return (
                                        this.renderGroupStapper(group.data, gIndex, group)
                                    )
                                })
                            : dayData.map((data, index) => {
                                return (
                                    this.renderStapper(data, index)
                                )
                            })
                        }
                    </Stepper>
                </div>
            </div>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#3F53B1',
        paddingTop: 20,
        width:500, maxWidth:500
    },
});

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
