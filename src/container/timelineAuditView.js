import React from 'react';
import HorizontalTimeline from 'react-horizontal-timeline';
import { Grid, Image, Header, Menu, Dropdown, Button } from 'semantic-ui-react';
import * as moment from 'moment';
import ReactJson from 'react-json-view';

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
        maxEventPadding: 120,
        linePadding: 100,
        labelWidth: 100,
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
        selectedIndex:0,
        auditCount: 0,
        mounted: false
    };
    constructor() {
        super();
        _self = this;

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
    makeUTC = (time) => {
        let newTime = moment(time).unix()
        return moment(newTime).utc().format('YYYY/MM/DD HH:mm:ss')
    }
    makeOper = (logName) => {
        let lastSub = logName.substring(logName.lastIndexOf('/')+1);
        return lastSub
    }
    onHandleIndexClick = (value) => {
        let selectedId = parseInt(value.value);
        console.log('20191018 selet..', selectedId)
        if(value.value) {
            //_self.setState({selectedIndex: selectedId, value:selectedId})
        }
        _self.setAllView(_self.state.rawAllData[selectedId], selectedId)
        _self.setRequestView(_self.state.rawAllData[selectedId], selectedId)
        _self.setResponseView(_self.state.rawAllData[selectedId], selectedId)
    }
    setAllView(dummyConts, sId) {
        this.setState({rawViewData:dummyConts})
    }
    setRequestView(dummyConts, sId) {

        if(dummyConts && dummyConts['request'] && dummyConts['request'].indexOf('{') > -1) {
            let dataLenght = dummyConts['request'].split('{"data":').length;
            if(dataLenght > 1) {
                this.setState({requestData:{"data":dummyConts['request'].split('{"data":')}})
                //this.setState({requestData:{"data":'test1111'}})
            } else {
                this.setState({requestData:JSON.parse(dummyConts['request'])})
            }
        } else {
            //alert(dummyConts['request'])
            this.setState({requestData:{'request':dummyConts['request']}})
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
                let sttime = this.makeUTC(auditList[i]['starttime'])
                let stNode = document.createTextNode(sttime);
                stNode.className = 'ttime_'+i;
                let ttspan = document.createElement('span');
                ttspan.style.fontSize = "12px";
                ttspan.style.color = "#c5c6c8";
                ttspan.style.position = 'absolute';
                ttspan.style.left = '0px';
                ttspan.style.top = '40px';
                ttspan.style.width = 'max-content';
                ttspan.appendChild(stNode);

                if(liDom) liDom.replaceChild(ttspan, liDom.childNodes[0]);

                // text for traceid
                /*
                let tId = auditList[i]['traceid'];
                let textNode = document.createTextNode(tId);
                textNode.className = 'text_'+i;
                */
                //
                /*
                let span = document.createElement('span');
                span.style.fontSize = "16px";
                span.style.color = "#ffcf25";
                span.appendChild(textNode);
                */

                // text for operation name
                let errorColor = auditList[i]['error'] !== "" ? "#ff0000" : "#e2e4e7";
                let contentContainer = document.createElement('div');
                contentContainer.className = 'lineContent_'+i;
                contentContainer.style.fontSize = "16px";
                contentContainer.style.color = errorColor;
                contentContainer.style.position = "absolute";
                contentContainer.style.top = "24px";
                let operNm = auditList[i]['operationname'];
                let contentNode = document.createTextNode(this.makeOper(operNm));

                contentContainer.appendChild(contentNode);


                //
                if(liDom) {
                    liDom.appendChild(contentContainer)
                    //liDom.appendChild(span);
                }
            })
        }, 1000)
    }
    componentWillReceiveProps(nextProps, nextContext) {

        if(!nextProps.mounted && !this.state.mounted) return;

        let dummys = [];
        let dummyConts = [];
        listId = [];

        if(nextProps.data !== this.props.data) {
            /**
             * 오류가 발생할 수 있는 코드
             * reset data...
             * **/
            if(nextProps.mounted) {
                this.setState({dates:dummys,rawViewData:dummyConts, rawAllData:dummyConts, auditCount:0, mounted:true})
            }
            /** ***/
            if(nextProps.data.data && nextProps.data.data.length) {
                nextProps.data.data.map((item) => {
                    dummys.push(this.makeUTC(item['starttime']))
                    dummyConts.push(item)
                    listId.push('timeline-dot-'+this.makeUTC(item['starttime']));
                })
                console.log('20191018 will receive porps...', dummys,":", dummyConts)

                this.setState({dates:dummys, rawAllData:dummyConts, auditCount:nextProps.data.data.length})
                if(dummyConts[this.state.selectedIndex]) this.setAllView(dummyConts[this.state.selectedIndex], this.state.selectedIndex);
                if(dummyConts[this.state.selectedIndex]) this.setRequestView(dummyConts[this.state.selectedIndex], this.state.selectedIndex);
                if(dummyConts[this.state.selectedIndex]) this.setResponseView(dummyConts[this.state.selectedIndex], this.state.selectedIndex);
                this.makeLabel(listId, nextProps.data.data);
            }



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
                        <div className="page_audit_history_option_counting">
                            <div className="page_audit_history_option_counting_title">Unchecked Error</div>
                            <div className="page_audit_history_option_counting_number">{this.state.auditCount}</div>
                        </div>
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
                    <div className="page_audit_history_grid">
                        Grid
                    </div>
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
            </div>
        )
    }
}


export default TimelineAuditView;
