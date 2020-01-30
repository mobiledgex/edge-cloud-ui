import 'react-hot-loader'
import React from 'react';
import { Button, Dropdown, Icon, Modal } from 'semantic-ui-react';
import * as moment from 'moment';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import 'semantic-ui-css/semantic.min.css'
import PopSendEmailView from '../container/popSendEmailView';
import { withRouter } from "react-router-dom";
import CircularProgress from "@material-ui/core/CircularProgress";
import * as actions from "../actions";
import View from "react-flexbox";
import FlexBox from "flexbox-react";
import HorizontalTimelineKJ from "../components/horizontal_timeline_kj/Components/HorizontalTimeline";
import { hot } from "react-hot-loader/root";
import CalendarTimeline from "../components/timeline/calendarTimeline";

const countryOptions = [
    { key: '24', value: '24', flag: '24', text: 'Last 24 hours' },
    { key: '18', value: '18', flag: '18', text: 'Last 18 hours' },
    { key: '12', value: '12', flag: '12', text: 'Last 12 hours' },
    { key: '6', value: '6', flag: '6', text: 'Last 6 hours' },
    { key: '1', value: '1', flag: '1', text: 'Last hour' },

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
    class TimelineAuditViewNew extends React.Component {
        state = {
            value: 0,
            previous: 0,
            minEventPadding: 20,
            maxEventPadding: 100,
            linePadding: 50,
            labelWidth: 170,
            fillingMotionStiffness: 150,
            fillingMotionDamping: 25,
            slidingMotionStiffness: 150,
            slidingMotionDamping: 25,
            stylesBackground: 'transparent',
            stylesForeground: '#454952',
            stylesOutline: '#454952',
            isTouchEnabled: true,
            isKeyboardEnabled: true,
            isOpenEnding: true,
            isOpenBeginning: true,
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
            currentTask: '',
            currentTaskTime: '',
            closeMap:false,
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
                {margin:'0 0 10px 0', padding: '5px 15px 15px', alignItems:'center', flexDirection:'column', height:'500px', width:'100%', overflow:'scroll'},
                {margin:'0 0 10px 0', padding: '5px 15px 15px', alignItems:'center', flexDirection:'column', height:'28px', width:'100%'}
                // {margin:'0 0 10px 0', padding: '5px 15px 15px', alignItems:'center', display:'flex', flexDirection:'column'},
                // {margin:'0 0 10px 0', padding: '5px 15px 15px', alignItems:'center', display:'flex', flexDirection:'column', height:'28px'}
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


        makeUnixUTC = (time) => {
            let newTime = moment(time).unix()
            return moment(newTime).utc().format('YYYY/MM/DD HH:mm:ss.SSS')
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
            // localStorage.removeItem('selectedTime')
            localStorage.setItem("selectedTime", this.setStorageData(timelineDataOne.starttime))
            setTimeout(() => {
                this.setRequestView(timelineDataOne)
                this.setResponseView(timelineDataOne)
                this.setState({
                    rawViewData: timelineDataOne,
                    isLoading2: false,
                })
            }, 251)
        }


        setStorageData(data) {
            let storageDatas = []
            storageDatas.push(JSON.parse(localStorage.getItem("selectedTime")))

            if(storageDatas){
                let a=0
                storageDatas.map( (storage, index) => {
                    if(data === storage){
                        a = 1
                    }
                })
                if(a !== 1){
                    storageDatas.push(data)
                }
            } else {
                storageDatas.push(data)
                console.log("20200130_123" + storageDatas)
            }


            return JSON.stringify(storageDatas)
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

        setResponseView(dummyConts, sId) {

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

        onItemSelect = (item, i) => {
            let value = '';
            let times = this.state.timesList
            times.map((time, index) => {
                if(new Date(time).getTime() === item){
                    this.setState({"timeLineIndex" : i})
                    this.onHandleIndexClick({"value" : i})
                }
            })
        }


        onPopupEmail = () => {
            this.setState({openSendEmail: true})
        }

        onCloseMap =()=> {
            let close = !this.state.closeMap;
            this.setState({closeMap:close})
        }

        close = () => this.setState({ openSendEmail: false })


        render() {
            const state = this.state;
            return (
                <div className="page_audit">
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
                        <div className="page_audit_history_timeline">

                            <div
                                className="page_audit_timeline"
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
                                        labelWidth={200}
                                        getLabel={(date, task, index) => {
                                            return (
                                                <View column={true}>
                                                    <div style={{
                                                        display: 'flex',
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
                                                    </div>
                                                    <div
                                                        style={{
                                                            height: 15,
                                                            fontSize: 13,
                                                            borderWidth: 1,
                                                            borderColor: 'grey'
                                                        }}>
                                                        {date}
                                                    </div>
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
                    <div className="round_panel" style={(!this.state.closeMap)?this.mapzoneStyle[0]:this.mapzoneStyle[1]}>
                        {/*<div className="round_panel" style={{width:'100%'}}>*/}
                        <div style={{margin:'0 0 5px 0', cursor:'pointer', display:'flex', alignItems:'column', justifyContent:'center'}} onClick={this.onCloseMap}>
                            <span style={{color:'#c8c9cb'}}>{(this.state.closeMap)?'Show timeline':'Hide timeline'}</span>
                            <Icon name={(this.state.closeMap)?'angle down':'angle up'}/>
                        </div>
                        <div>
                            {(this.state.timesList.length > 0) ?<CalendarTimeline timesList={this.state.timesList} tasksList={this.state.tasksList} callback={this.onItemSelect} timelineDataOne={(this.state.rawViewData) ? this.state.rawViewData : null}/>:null}
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
                    {/*<Button onClick={this.onPopupEmail}>*/}
                    {/*    Email*/}
                    {/*</Button>*/}
                    <SendEmailView dimmer={true} open={this.state.openSendEmail} close={this.close}
                                   callback={this.submitSendEmail} rawViewData={this.state.rawViewData}> </SendEmailView>
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
        let {dimmer, open, close, callback, rawViewData} = this.props;
        return (
            <Modal dimmer={dimmer} open={open} onClose={close} closeIcon>
                <Modal.Header>New E-mail</Modal.Header>
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

