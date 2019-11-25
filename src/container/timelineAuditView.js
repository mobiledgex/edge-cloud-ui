import React from 'react';
import HorizontalTimeline from 'react-horizontal-timeline';
import { Grid, Image, Header, Modal, Dropdown, Button } from 'semantic-ui-react';
import * as moment from 'moment';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import PopSendEmailView from '../container/popSendEmailView';

// TODO : https://codepen.io/AdamKimmerer/pen/RraRbb

/* eslint-disable max-len*/

const countryOptions = [
    { key: '24', value: '24', flag: '24', text: 'Last 24hours' },
    { key: '18', value: '18', flag: '18', text: 'Last 18hours' },
    { key: '12', value: '12', flag: '12', text: 'Last 12hours' },
    { key: '6', value: '6', flag: '6', text: 'Last 6hours' },
    { key: '1', value: '1', flag: '1', text: 'Last an hour' },

]
let listId = [];
let _self = null;
const jsonView = (jsonObj,self) => {
    return <ReactJson src={jsonObj} {...self.jsonViewProps} style={{width:'100%'}}/>
}

class TimelineAuditView extends React.Component {
    state = {
        value: 0,
        previous: 0,
        // timelineConfig
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
        dates:[],
        contData:[],
        rawAllData: [],
        rawViewData: [],
        requestData: [],
        responseData: [],
        currentTraceid:'traceId',
        selectedIndex:0,
        auditCount: 0,
        mounted: false,
        openSendEmail:false
    };
    constructor() {
        super();
        _self = this;
        this.sameTime = '0';
        this.addCount = 0;
    }

    jsonViewProps = {
        name:null,
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
        let makeTime = moment(newTime).utc().format('HH:mm:ss');
        if(makeTime === _self.sameTime) {
            _self.addCount ++;
            makeTime = moment(newTime+1000).utc().format('HH:mm:ss');
            //makeTime = moment(newTime).utc().format('HH:mm:ss.SSS') + "00"+ (_self.addCount < 10)? '0'+_self.addCount : _self.addCount;
        } else {
            _self.addCount = 0;
        }
        _self.sameTime = makeTime;
        return makeTime;
    }
    makeOper = (logName) => {
        let lastSub = logName.substring(logName.lastIndexOf('/')+1);
        return lastSub
    }
    onHandleIndexClick = (value) => {
        let selectedId = String(value.value);
        if(!selectedId) return;
        let selectedDom = document.getElementById(listId[selectedId])
        let selectChildNode = null
        if(selectedDom) {
            selectChildNode = selectedDom.childNodes
            // reset style of circle
            let oldSelected = document.getElementsByClassName('selectedCircle_timeline')
            // if(oldSelected.length) oldSelected.map((element) => {
            //     element.className = null;
            // })
            console.log('2019119 selet old..',oldSelected, ":", [...oldSelected])
            selectChildNode[1].className = 'selectedCircle_timeline'
        }

        _self.setAllView(_self.state.rawAllData[selectedId], selectedId)
        _self.setRequestView(_self.state.rawAllData[selectedId], selectedId)
        _self.setResponseView(_self.state.rawAllData[selectedId], selectedId)

        if(_self.state.rawAllData[selectedId]) _self.props.handleSelectedAudit(_self.state.rawAllData[selectedId]);
    }
    setAllView(dummyConts, sId) {
        if(dummyConts && dummyConts['traceid']) _self.setState({rawViewData:dummyConts, currentTraceid:dummyConts['traceid']})
    }
    setRequestView(dummyConts, sId) {

        if(dummyConts && dummyConts['request']) {
            if(dummyConts['request'].indexOf('{') > -1) {
                let dataLenght = dummyConts['request'].split('{"data":').length;
                if(dataLenght > 1) {
                    this.setState({requestData:{"data":dummyConts['request'].split('{"data":')}})
                } else {
                    this.setState({requestData:JSON.parse(dummyConts['request'])})
                }
            } else {
                this.setState({requestData:{'request':dummyConts['request']}})
            }
        }

    }
    setResponseView(dummyConts, sId) {

        if(dummyConts && dummyConts['response'].indexOf('{') > -1) {
            let dataLenght = dummyConts['response'].split('{"data":').length;
            if(dataLenght > 1) {
                this.setState({responseData:{"data":dummyConts['response'].split('{"data":')}})
                //this.setState({responseData:{"data":"test2222"}})
            } else {
                this.setState({responseData:JSON.parse((dummyConts['response'] !== "") ? dummyConts['response'] : {})})
            }

        }

    }
    makeLabel(listId, auditList) {
        setTimeout(() => {
            listId.map((li, i) => {
                let liDom = document.getElementById(li);
                //set text to date format
                let stdate = this.makeUTC(auditList[i]['starttime'])
                let sttime = this.makeNotUTC(auditList[i]['starttime'])
                console.log('20191025 sstime...', stdate +":"+sttime)
                let stNode = document.createTextNode(stdate+" "+sttime);
                stNode.className = 'ttime_'+i;
                let ttspan = document.createElement('span');
                ttspan.style.fontSize = "12px";
                ttspan.style.color = "#c5c6c8";
                // ttspan.style.position = 'absolute';
                ttspan.style.left = '0px';
                // ttspan.style.top = '40px';
                ttspan.style.width = 'max-content';
                ttspan.style.height = '50px'
                ttspan.appendChild(stNode);

                if(liDom) liDom.replaceChild(ttspan, liDom.childNodes[0]);

                // text for traceid

                let tId = auditList[i]['traceid'] +":"+i;
                let textNode = document.createTextNode(tId);
                textNode.className = 'text_'+i;

                //

                let span = document.createElement('span');
                span.style.fontSize = "16px";
                span.style.color = "#ffcf25";
                span.appendChild(textNode);


                // text for operation name
                let errorColor = auditList[i]['error'] !== "" ? "#ff0000" : "#e2e4e7";
                let contentContainer = document.createElement('div');
                contentContainer.className = 'lineContent_'+i;
                contentContainer.style.fontSize = "16px";
                contentContainer.style.color = errorColor;
                // contentContainer.style.position = "absolute";
                // contentContainer.style.top = "24px";
                let operNm = auditList[i]['operationname'];
                let contentNode = document.createTextNode(this.makeOper(operNm));

                contentContainer.appendChild(contentNode);

                let checkedCircle = localStorage.getItem('auditChecked');
                if(checkedCircle && JSON.parse(checkedCircle).length && liDom) {
                    JSON.parse(checkedCircle).map((check) => {
                        if(check === auditList[i]['traceid']){
                            let findCircle = liDom.childNodes;
                            findCircle[1].className = 'selectedCircle_timeline'
                        }
                    })
                }

                //
                if(liDom) {
                    liDom.appendChild(contentContainer)
                    //liDom.appendChild(span);
                    _self.onHandleIndexClick('0')
                }
            })
        }, 2000)
    }
    resultReceive(result) {
        alert(result)
    }
    onHandleClickTrace (tId, msg){

        // open popup window
        _self.setState({openSendEmail: true})

    }
    submitSendEmail = () => {
        alert('submit')
    }
    close = () => this.setState({ openSendEmail: false })
    componentWillReceiveProps(nextProps, nextContext) {

        if(!nextProps.mounted && !this.state.mounted) return;

        let dummys = [];
        let dummyConts = [];


        if(nextProps.data !== this.props.data) {
            /**
             * 오류가 발생할 수 있는 코드
             * reset data...
             * **/
            if(nextProps.mounted) {
                listId = [];
                this.setState({dates:dummys,rawViewData:dummyConts, rawAllData:dummyConts, auditCount:0, mounted:true, responseData:[], requestData:[]})
            }
            /** ***/
            if(nextProps.data.data && nextProps.data.data.length) {
                nextProps.data.data.map((item) => {
                    let stdate = this.makeUTC(item['starttime'])
                    let sttime = this.makeNotUTC(item['starttime'])
                    let composit = stdate+" "+sttime;
                    dummys.push(composit)
                    dummyConts.push(item)
                    listId.push('timeline-dot-'+composit);
                })
                console.log('20191018 will receive porps...', dummys,":", dummyConts)

                this.setState({dates:dummys, rawAllData:dummyConts, auditCount:nextProps.data.data.length, currentTraceid:dummyConts[this.state.selectedIndex]['traceid']})
                if(dummyConts[this.state.selectedIndex]) this.setAllView(dummyConts[this.state.selectedIndex], this.state.selectedIndex);
                if(dummyConts[this.state.selectedIndex]) this.setRequestView(dummyConts[this.state.selectedIndex], this.state.selectedIndex);
                if(dummyConts[this.state.selectedIndex]) this.setResponseView(dummyConts[this.state.selectedIndex], this.state.selectedIndex);
                this.makeLabel(listId, nextProps.data.data);
            }

            //get timeline comp
            let getTimeline = document.getElementsByClassName('page_audit_history_timeline');
            //let children = getTimeline.getChildren()
            console.log('20191021 child node...', getTimeline[0])
            if(getTimeline[0]){
                getTimeline[0].childNodes[0].className = "page_audit_history_timeline_container";
                getTimeline[0].childNodes[0].childNodes[0].className = "page_audit_history_timeline_container_wrapper"
            }


        }
        //submit form
        if(nextProps.onSubmit) {
            console.log('20191030 send mail contents == ', nextProps.sendingContent)
            // services.sendEmailAudit('SendMail',
            //     {fromEmail:'support@mobiledgex.com', toEmail:'', traceId:tId, message:msg, title: title},
            //     _self.resultReceive, _self)
        }

    }
    componentDidMount() {
        this.setState({mounted:true})

    }

    componentWillUnmount() {
        this.setState({mounted:false})
    }

    render() {
        const state = this.state;
        return (
            <div className="page_audit">
                <div className="page_audit_history">
                    <div className="page_audit_history_option">
                        {/*<div className="page_audit_history_option_counting">*/}
                            {/*<div className="page_audit_history_option_counting_title">Unchecked Error</div>*/}
                            {/*<div className="page_audit_history_option_counting_number">{this.state.auditCount}</div>*/}
                        {/*</div>*/}
                        <div></div>
                        <div className="page_audit_history_option_period">
                            <Dropdown
                                placeholder='Custom Time Range'
                                fluid
                                search
                                selection
                                options={countryOptions}
                                style={{width:200}}
                            />
                        </div>
                    </div>
                    <div className="page_audit_history_timeline">
                        {/* Bounding box for the Timeline */}

                        <HorizontalTimeline
                            fillingMotion={{ stiffness: state.fillingMotionStiffness, damping: state.fillingMotionDamping }}
                            index={this.state.value}
                            indexClick={(index) => {
                                this.onHandleIndexClick({ value: index, previous: this.state.value });
                            }}

                            isKeyboardEnabled={state.isKeyboardEnabled}
                            isTouchEnabled={state.isTouchEnabled}
                            labelWidth={state.labelWidth}
                            linePadding={state.linePadding}
                            maxEventPadding={state.maxEventPadding}
                            minEventPadding={state.minEventPadding}
                            slidingMotion={{ stiffness: state.slidingMotionStiffness, damping: state.slidingMotionDamping }}
                            styles={{
                                background: state.stylesBackground,
                                foreground: state.stylesForeground,
                                outline: state.stylesOutline
                            }}
                            values={ this.state.dates }
                            isOpenEnding={state.isOpenEnding}
                            isOpenBeginning={state.isOpenBeginning}
                        />
                    </div>
                    {/*<div className="page_audit_history_grid">*/}
                        {/*<CalendarTimeline></CalendarTimeline>*/}
                    {/*</div>*/}
                    {/*<div style={{minWidth:200}}>*/}
                        {/*<a className="ui label"  onClick={() => this.onHandleClickTrace(this.state.currentTraceid, this.state.rawViewData)}>*/}
                            {/*<i aria-hidden="true" className="mail icon"></i>*/}
                            {/*<span>{this.state.currentTraceid}</span>*/}
                        {/*</a>*/}
                    {/*</div>*/}
                </div>
                <div className="page_audit_code">
                    <div className="page_audit_code_left">
                        <div className="page_audit_code_rawviewer">
                            <div className="page_audit_code_rawviewer_title">
                                Raw Viewer
                            </div>
                            <div className="page_audit_code_rawviewer_codebox">
                                {(this.state.rawViewData) ? jsonView(this.state.rawViewData,this):null}
                            </div>
                        </div>
                    </div>
                    <div className="page_audit_code_right">
                        <div className="page_audit_code_request">
                            <div className="page_audit_code_request_title">
                                Request
                            </div>
                            <div className="page_audit_code_request_codebox">
                                {(this.state.requestData) ? jsonView(this.state.requestData, this):null}
                            </div>
                        </div>
                        <div className="page_audit_code_response">
                            <div className="page_audit_code_response_title">
                                Response
                            </div>
                            <div className="page_audit_code_response_codebox">
                                {(this.state.responseData) ? jsonView(this.state.responseData, this):null}
                            </div>
                        </div>
                    </div>
                </div>
                <SendEmailView dimmer={true} open={this.state.openSendEmail} close={this.close} callback={this.submitSendEmail}> </SendEmailView>
            </div>
        )
    }
}
const mapStateToProps = (state) => {

    let submitSuccess = false;
    let submitContent = null;
    if(state.form.fieldLevelValidation) {
        console.log('20191030 redux props.. ', state.form.fieldLevelValidation)
        if(state.form.fieldLevelValidation.submitSucceeded){
            submitSuccess = true;
            submitContent = state.form.fieldLevelValidation.registeredFields;
        }
    }

    return {
        onSubmit: submitSuccess,
        sendingContent: submitContent
    }

};

export default connect(mapStateToProps, null)(TimelineAuditView);



class SendEmailView extends React.Component {
    onSubmit = () => {
        this.setState({submitState:true})
    }
    onClear = () => {
        this.setState({clearState:true})
    }
    state = {
        submitState: false,
        clearState:false
    }

    render() {
        let {dimmer, open, close, callback} = this.props;
        return(
            <Modal dimmer={dimmer} open={open} onClose={close} closeIcon>
                <Modal.Header>New Email</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <PopSendEmailView ref={form => this.formReference = form} submitState={this.state.submitState} clearState={this.state.clearState}></PopSendEmailView>
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

