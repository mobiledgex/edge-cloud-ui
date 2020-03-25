import 'react-hot-loader'
import React from 'react';
import { Button, Dropdown, Modal } from 'semantic-ui-react';
import * as moment from 'moment';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import 'semantic-ui-css/semantic.min.css'
import PopSendEmailView from './popSendEmailView';
import { withRouter } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as actions from "../actions";
import View from "react-flexbox";
import FlexBox from "flexbox-react";
import HorizontalTimelineKJ from "../components/horizontal_timeline_kj/Components/HorizontalTimeline";
import { hot } from "react-hot-loader/root";

const countryOptions = [
    { key: '24', value: '24', flag: '24', text: 'Last 24hours' },
    { key: '18', value: '18', flag: '18', text: 'Last 18hours' },
    { key: '12', value: '12', flag: '12', text: 'Last 12hours' },
    { key: '6', value: '6', flag: '6', text: 'Last 6hours' },
    { key: '1', value: '1', flag: '1', text: 'Last an hour' },

]
let timesList = [];
let _self = null;
const jsonView = (jsonObj, self) => {
    return <ReactJson src={jsonObj} {...self.jsonViewProps} style={{ width: '100%' }} />
}

const mapStateToProps = (state) => {
    let submitSuccess = false;
    let submitContent = null;
    if (state.form.fieldLevelValidation) {
        console.log('20191030 redux props.. ', state.form.fieldLevelValidation)
        if (state.form.fieldLevelValidation.submitSucceeded) {
            submitSuccess = true;
            submitContent = state.form.fieldLevelValidation.registeredFields;
        }
    }
    return {
        onSubmit: submitSuccess,
        sendingContent: submitContent,
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
            previous: 0,
            linePadding: 50,
            labelWidth: 170,
            isKeyboardEnabled: true,
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
            timesList: [],
            timeLineIndex: 0,
            tasksList: [],
            currentTask: '',
            currentTaskTime: '',
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

                if (!nextProps.location.search.toString().includes('org=')) {
                    await this.setState({
                        orgName: '',
                    })
                }
                if (nextProps.data.data && nextProps.data.data.length) {

                    nextProps.data.data.map((item) => {
                        let stdate = this.makeUTC(item['starttime'])
                        let sttime = this.makeNotUTC(item['starttime'])
                        let composit = stdate + " " + sttime;
                        dummys.push(composit)
                        dummyConts.push(item)
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
                        tasksList.push(this.makeOper(operName));
                    }

                    let newTimesList = []
                    for (let i in timesList) {
                        if (i < tasksList.length) {
                            newTimesList.push(timesList[i].toString().replace('timeline-dot-', ''))
                        }
                    }
                    await this.setState({
                        timesList: newTimesList,//@:todo: TimesList to display above the timeline Dot
                        tasksList: tasksList,//@:todo: 타임라인 Dot 위쪽에 표시해줄 tasksList
                        currentTask: tasksList[0],
                        currentTaskTime: timesList[0],
                        isLoading: false,
                    })
                    this.props.handleLoadingSpinner(false);
                    this.props.toggleLoading(false);


                }

            }
            //submit form
            if (nextProps.onSubmit) {
                console.log('20191030 send mail contents == ', nextProps.sendingContent)
            }

        };

        componentWillUnmount() {
            this.setState({ mounted: false })

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
            let lastSub = logName.substring(logName.lastIndexOf('/') + 1);
            return lastSub
        }


        onHandleIndexClick = (value) => {
            this.setState({
                rawViewData: {},
                isLoading2: true,
            })
            let selectedIndex = value.value;
            let timelineDataOne = this.state.rawAllData[selectedIndex]
            setTimeout(() => {
                this.setRequestView(timelineDataOne)
                this.setResponseView(timelineDataOne)
                this.setState({
                    rawViewData: timelineDataOne,
                    isLoading2: false,
                })
            }, 251)
        }





        setAllView(dummyConts, sId) {
            if (dummyConts && dummyConts['traceid']) _self.setState({
                rawViewData: dummyConts,
                currentTraceid: dummyConts['traceid']
            })
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


        getHeight = () => {
            return window.innerHeight - 72
        }

        render() {
            const state = this.state;
            return (
                <div className="page_audit" style={{height:this.getHeight()}}>
                    <div className="page_audit_history">
                        <div className="page_audit_history_option">
                            <div style={{ fontSize: 20, fontWeight: 'bold', color: 'white' }}>{this.state.orgName}</div>

                            <div className="page_audit_history_option_period">
                                <Dropdown
                                    placeholder='Custom Time Range'
                                    fluid
                                    search
                                    selection
                                    options={countryOptions}
                                    style={{ width: 200 }}
                                />
                            </div>
                        </div>
                        <div className="page_audit_history_timeline" >

                            <div
                                style={{
                                    height: 160,
                                    width: '100%',
                                    overflow: 'auto',
                                    marginTop: -50,
                                    marginBottom: 100,
                                    //backgroundColor: 'blue',
                                    display: 'block',

                                }}>

                                {this.props.isLoading &&
                                    <FlexBox style={{ position: 'absolute', top: '5%', zIndex: 9999999 }}>
                                        <CircularProgress style={{ color: '#77BD25', zIndex: 9999999, fontSize: 10 }}
                                            size={20} />
                                    </FlexBox>
                                }
                                {!this.state.isLoading && this.state.timesList.length !== 0 &&
                                    <HorizontalTimelineKJ
                                        labelWidth={250}
                                        getLabel={(date, task, index) => {
                                            return (
                                                <View column={true}>
                                                    <div
                                                        style={{
                                                            height: 15,
                                                            fontSize: 13,
                                                            borderWidth: 1,
                                                            borderColor: 'grey'
                                                        }}>
                                                        {date}
                                                    </div>
                                                    <FlexBox style={{
                                                        fontSize: 15,
                                                        fontWeight: '800',
                                                        color: 'orange',
                                                        marginTop: 5,
                                                        marginBottom: 0,
                                                        height: 30,
                                                        alignItems: 'flex-end',
                                                        justifyContent: 'center',
                                                    }}>
                                                        {task}
                                                    </FlexBox>
                                                </View>
                                            )
                                        }}
                                        index={this.state.timeLineIndex}
                                        indexClick={async (timeLineIndex) => {
                                            await this.setState({
                                                timeLineIndex: timeLineIndex,
                                                currentTask: this.state.tasksList[timeLineIndex],
                                                currentTaskTime: this.state.timesList[timeLineIndex],
                                            });

                                            this.onHandleIndexClick({ value: timeLineIndex, previous: this.state.value });
                                        }}
                                        values={this.state.timesList}
                                        tasks={this.state.tasksList}
                                        styles={{
                                            outline: '#dfdfdf',
                                            outline2: '#79BF14',
                                            background: '#f8f8f8',
                                            foreground: '#79BF14'
                                        }}
                                        linePadding={150}
                                        /* slidingMotion={{
                                             stiffness: 300,
                                             damping: 30,
                                         }}
                                         fillingMotion={{
                                             stiffness: 300,
                                             damping: 30,
                                         }}*/
                                        isKeyboardEnabled={true}
                                    />
                                }
                            </div>

                        </div>
                    </div>
                    <div className="page_audit_code">
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
                        callback={this.submitSendEmail}> </SendEmailView>
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
        let { dimmer, open, close, callback } = this.props;
        return (
            <Modal dimmer={dimmer} open={open} onClose={close} closeIcon>
                <Modal.Header>New Email</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <PopSendEmailView ref={form => this.formReference = form} submitState={this.state.submitState}
                            clearState={this.state.clearState}></PopSendEmailView>
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

