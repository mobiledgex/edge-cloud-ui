import React from 'react';
import {Button, Icon, Popup} from 'semantic-ui-react';
import Check from "@material-ui/icons/Check";
import {AppBar, Tabs, Tab, ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails} from '@material-ui/core';
import {withRouter} from 'react-router-dom';
//redux
import {connect} from 'react-redux';
import * as actions from '../actions';
import * as serviceMC from '../services/serviceMC';
import PopDetailViewer from '../container/popDetailViewer';
import PopSecondDetailViewer from '../container/popSecondDetailViewer';
import ShowChartIcon from '@material-ui/icons/ShowChart';
import {CircularProgress, IconButton, Step, StepLabel, Stepper} from '@material-ui/core';
import {CODE_FAILED, CODE_FAILED_403, CODE_FINISH} from "../hoc/stepper/mexMessageMultiStream";
import moment from "moment";
import ErrorIcon from "@material-ui/core/SvgIcon/SvgIcon";
import {green} from "@material-ui/core/colors";
import HeaderAuditLog from "./HeaderAuditLog"


let _self = null;
let rgn = ['US', 'EU'];
class headerGlobalAudit extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.state = {
            devData: [],
            rawViewData: [],
            requestData: [],
            responseData: [],
            unCheckedErrorCount: 0,
            errorCount: 0,
            tabValue: 0,
            openDetail: false,
            secondRawViewData: [],
            secondRequestData: [],
            secondResponseData: [],
            secondOpenDetail:false,
            isOpen: false
        }
    }

    componentDidMount() {
        if (this.props.location && this.props.location.search) {
            this.readyToData(this.props.location.search)
        }
    }

    componentWillMount() {

    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let storageSelectedTraceidList = JSON.parse(localStorage.getItem("selectedTraceid"))
        let devData = this.state.devData
        let errorCount = 0;
        let unCheckedErrorCount = 0;

        devData.map((data, index) => {
            let status = data.status;
            let traceid = data.traceid;
            if(status !== 200){
                errorCount++
                let storageSelectedTraceidIndex = (storageSelectedTraceidList) ? storageSelectedTraceidList.findIndex(s => s === traceid) : (-1)
                if(storageSelectedTraceidIndex === (-1)){
                    unCheckedErrorCount++
                }
            }
        })

        this.state.errorCount = errorCount
        this.state.unCheckedErrorCount = unCheckedErrorCount
    }

    readyToData(subPaths) {
        let subPath = '';
        let subParam = null;
        if (subPaths.indexOf('&org=') > -1) {
            let paths = subPaths.split('&')
            subPath = paths[0];
            subParam = paths[1];
        }
        this.setState({devData: []})
        this.setState({page: subPath, OrganizationName: subParam})
        this.props.handleLoadingSpinner(true);
        // get audits data
        this.getDataAudit(subParam);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    getDataAudit = async (orgName) => {
        this.props.handleLoadingSpinner(true);
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({devData: []})
        this._cloudletDummy = [];
        _self.loadCount = 0;

        if (orgName) {
            serviceMC.sendRequest(_self, {token:store.userToken, method:serviceMC.getEP().SHOW_AUDIT_ORG, data:{"org": this.makeOga(orgName)}}, this.receiveResult)
        } else {
            serviceMC.sendRequest(_self, {token: store.userToken, method:serviceMC.getEP().SHOW_SELF, data: '{}'}, _self.receiveResult)
        }
    }

    receiveResult = (mcRequest) => {
        if (mcRequest) {
            if (mcRequest.response) {
                if (mcRequest.response.data.length > 0) {
                    let response = mcRequest.response;
                    let request = mcRequest.request;
                    _self.setState({ devData: response.data, auditMounted: true })
                    if (rgn.length == this.loadCount - 1) {
                        return
                    }
                }
                else{
                    this.props.handleAlertInfo('error',"Data Not Present")
                }
            }
        }
        _self.props.toggleLoading(false);
        _self.props.handleLoadingSpinner(false);
    }

    onItemSelected = (item, i) => {
        let devData = this.state.devData
        let storageSelectedTraceidList = JSON.parse(localStorage.getItem("selectedTraceid"))

        devData.map((data, index) => {
            if(data.traceid === item) {
                this.setStorageData(data.traceid)
                if(data.status !== 200) {
                    if(storageSelectedTraceidList){
                        let storageSelectedTraceidIndex = (storageSelectedTraceidList) ? storageSelectedTraceidList.findIndex(s => s === data.traceid) : (-1)
                        if(storageSelectedTraceidIndex === (-1)){
                            this.setState({"unCheckedErrorCount" : this.state.unCheckedErrorCount - 1})
                        }
                    }
                }
            }
        })
    }

    setStorageData = (data) => {
        let traceidList = [];
        let storageTraceidList = this.resetStorageData()

        if (storageTraceidList) {
            traceidList = storageTraceidList
            let storageTraceidIndex = storageTraceidList.findIndex(s => s === data)
            if(storageTraceidIndex === (-1)){
                traceidList.push(data)
                localStorage.setItem("selectedTraceid", JSON.stringify(traceidList))
            }
        } else {
            traceidList[0] = data
            localStorage.setItem("selectedTraceid", JSON.stringify(traceidList))
        }
    }

    resetStorageData() {
        let storageTraceidList = JSON.parse(localStorage.getItem("selectedTraceid"))
        let devData = this.state.devData
        let unSelectedStorageTraceid = 0

        if(storageTraceidList){
            devData.map((data, index) => {
                let storageTraceidIndex = storageTraceidList.findIndex(s => s === data.traceid)
                if(storageTraceidIndex !== (-1)){
                    unSelectedStorageTraceid++
                }
            })

            if(unSelectedStorageTraceid === 0){
                localStorage.removeItem('selectedTraceid')
            }
        }
        return JSON.parse(localStorage.getItem("selectedTraceid"))
    }

    onPopupDetail = (rawViewData, requestData, responseData) => {
        if(this.state.openDetail){
            this.setState({
                secondRawViewData:rawViewData,
                secondRequestData:requestData,
                secondResponseData:responseData,
                secondOpenDetail:true
            })
        } else {
            this.setState({
                rawViewData:rawViewData,
                requestData:requestData,
                responseData:responseData,
                openDetail:true
            })
        }
    }

    closeDetail = () => {
        this.setState({openDetail:false, secondOpenDetail:false})
    }

    secondCloseDetail = () => {
        this.setState({secondOpenDetail:false})
    }

    handleOpen = () => {
        this.setState({ isOpen: true });
    }

    handleClose = () => {
        this.setState({ isOpen: false });
    }

    render() {
        return (

            <div>
                <Popup
                    inverted
                    trigger={
                        <IconButton color='inherit' onClick={(e) => { this.setState({ anchorEl: e.currentTarget }) }}>
                            <ShowChartIcon fontSize='default'/>
                            <div className='audit_bedge' >{this.state.errorCount}</div>
                        </IconButton>
                    }
                    content={<HeaderAuditLog devData={this.state.devData} onItemSelected={this.onItemSelected} detailView={this.onPopupDetail} close={this.handleClose} />}
                    on='click'
                    position='bottom center'
                    style={{right:'0 !important', left: 'auto !important'}}
                    className="table_actions_popup gnb_profile"
                    basic
                    open={this.state.isOpen}
                    onOpen={this.handleOpen}
                />
                <PopDetailViewer
                    rawViewData={this.state.rawViewData}
                    requestData={this.state.requestData}
                    responseData={this.state.responseData}
                    dimmer={false}
                    open={this.state.openDetail}
                    close={this.closeDetail}
                />
                <PopDetailViewer
                    rawViewData={this.state.secondRawViewData}
                    requestData={this.state.secondRequestData}
                    responseData={this.state.secondResponseData}
                    dimmer={false}
                    open={this.state.secondOpenDetail}
                    close={this.secondCloseDetail}
                />
            </div >
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(headerGlobalAudit));
