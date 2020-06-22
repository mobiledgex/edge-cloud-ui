import React from 'react';
import {withRouter} from 'react-router-dom';
//redux
import {connect} from 'react-redux';
import * as actions from '../actions';
import TimelineOutlinedIcon from '@material-ui/icons/TimelineOutlined';
import * as serverData from '../services/model/serverData';
import PopDetailViewer from '../container/popDetailViewer';
import {IconButton, Drawer} from '@material-ui/core';
import HeaderAuditLog from "./HeaderAuditLog"


let _self = null;


class headerGlobalAudit extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            devData: [],
            rawViewData: [],
            unCheckedErrorCount: 0,
            errorCount: 0,
            tabValue: 0,
            openDetail: false,
            isOpen: false
        }
        this.fullLogData = []
    }

    componentDidMount() {
        this.readyToData()
    }

    getDataAuditOrg = async (orgName) => {
        let mcRequest = await serverData.showAuditOrg(_self, { "org": orgName })
        if (mcRequest && mcRequest.response) {
            if (mcRequest.response.data.length > 0) {
                this.setState({ isOpen:true, devData: mcRequest.response.data })
            }
            else{
                this.props.handleAlertInfo('error', 'No logs found')
            }
        }
    }

    componentDidUpdate(prevProps, prevState) {
        let serverRequestCount = parseInt(localStorage.getItem('ServerRequestCount'))
        if(serverRequestCount > 0)
        {
            this.readyToData()
        }
        if(this.props.showAuditLogWithOrg && prevProps.showAuditLogWithOrg !== this.props.showAuditLogWithOrg)
        {
            this.getDataAuditOrg(this.props.showAuditLogWithOrg)
        }
    }

    readyToData() {
        this.setState({devData: []})
        this.getDataAudit();
        localStorage.setItem('ServerRequestCount', 0)
    }

    updateStatus = (data) => {
        if (data.operationname.includes('/ws/') || data.operationname.includes('/wss/')) {
            data.status = data.response.includes('"code":400') ? 400 : data.status
        }
    }

    getDataAudit = async () => {
        this.setState({devData: []})
        let mcRequest = await serverData.showSelf(_self, {}, false)
        if (mcRequest && mcRequest.response) {
            if (mcRequest.response.data.length > 0) {
                let response = mcRequest.response;
                this.fullLogData = response.data
                _self.setState({ devData: response.data })

                let storageSelectedTraceidList = JSON.parse(localStorage.getItem("selectedTraceid"))
                let devData = this.state.devData
                let errorCount = 0;
                let unCheckedErrorCount = 0;

                devData.map((data, index) => {
                    this.updateStatus(data)
                    let status = data.status;
                    let traceid = data.traceid;
                    if (status !== 200) {
                        errorCount++
                        let storageSelectedTraceidIndex = (storageSelectedTraceidList) ? storageSelectedTraceidList.findIndex(s => s === traceid) : (-1)
                        if (storageSelectedTraceidIndex === (-1)) {
                            unCheckedErrorCount++
                        }
                    }
                })
                this.setState({ errorCount: errorCount, unCheckedErrorCount: unCheckedErrorCount })
            }
        }
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
                            this.setState(prevState=>({unCheckedErrorCount : prevState.unCheckedErrorCount - 1}))
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

    onPopupDetail = (rawViewData) => {
        this.setState({
            rawViewData: rawViewData,
            openDetail: true
        })
    }

    closeDetail = () => {
        this.setState({openDetail:false})
    }

    handleOpen = () => {
        this.setState({ isOpen: true, devData:this.fullLogData });
    }

    handleClose = () => {
        this.setState({ isOpen: false });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        if(nextProps.showAuditLogWithOrg)
        {
            nextProps.handleShowAuditLog(undefined)
            return {devData: []}
        }
        return null
    }

    render() {
        let auditLogs = this.state.devData
        return (
            auditLogs && auditLogs.length > 0 ?
                <React.Fragment>
                    <IconButton color='inherit' onClick={this.handleOpen}>
                        <TimelineOutlinedIcon fontSize='default' />
                        {this.state.errorCount > 0 ? <div className='audit_bedge' >{this.state.errorCount}</div> : null}
                    </IconButton>
                    <Drawer anchor={'right'} open={this.state.isOpen}>
                        <HeaderAuditLog devData={this.state.devData} onItemSelected={this.onItemSelected} detailView={this.onPopupDetail} close={this.handleClose} />
                    </Drawer>
                    <PopDetailViewer
                        rawViewData={this.state.rawViewData}
                        dimmer={false}
                        open={this.state.openDetail}
                        close={this.closeDetail}
                    />
                </React.Fragment> : null
        )
    }
}

function mapStateToProps(state) {
    return {
        showAuditLogWithOrg : state.showAuditLog.audit
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => {dispatch(actions.loadingSpinner(data))},
        handleShowAuditLog: (data) => {dispatch(actions.showAuditLog(data))},
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(headerGlobalAudit));
