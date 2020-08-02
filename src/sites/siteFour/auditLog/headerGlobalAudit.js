import React from 'react';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import TimelineOutlinedIcon from '@material-ui/icons/TimelineOutlined';
import * as serverData from '../../../services/model/serverData';
import PopDetailViewer from '../../../container/popDetailViewer';
import { IconButton, Drawer, Button, TextField } from '@material-ui/core';
import HeaderAuditLog from "./HeaderAuditLog"
import * as dateUtil from '../../../utils/date_util'
let _self = null;


class headerGlobalAudit extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            logData: {},
            rawViewData: [],
            tabValue: 0,
            openDetail: false,
            isOpen: false,
            loading: false,
            limit:25
        }
        _self = this
        this.currenttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, dateUtil.startOfDay())
        this.starttime = this.currenttime
        this.endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, dateUtil.endOfDay())
    }

    componentDidMount() {
        this.readyToData()
    }

    getDataAuditOrg = async (orgName) => {
        let mcRequest = await serverData.showAuditOrg(_self, { "org": orgName })
        if (mcRequest && mcRequest.response) {
            if (mcRequest.response.data.length > 0) {
                this.setState({ isOpen: true, logData: mcRequest.response.data })
            }
            else {
                this.props.handleAlertInfo('error', 'No logs found')
            }
        }
    }

    // componentDidUpdate(prevProps, prevState) {
    //     let serverRequestCount = parseInt(localStorage.getItem('ServerRequestCount'))
    //     if(serverRequestCount > 0)
    //     {
    //         this.readyToData()
    //     }
    //     if(this.props.showAuditLogWithOrg && prevProps.showAuditLogWithOrg !== this.props.showAuditLogWithOrg)
    //     {
    //         this.getDataAuditOrg(this.props.showAuditLogWithOrg)
    //     }
    // }

    // readyToData() {
    //     this.setState({logData: [], loading:true})
    //     this.getDataAudit();
    //     localStorage.setItem('ServerRequestCount', 0)
    // }

    updateStatus = (data) => {
        if (data.operationname.includes('/ws/') || data.operationname.includes('/wss/')) {
            data.status = data.response.includes('"code":400') ? 400 : data.status
        }
    }

    getDataAudit = async (starttime, endtime, isStart) => {
        this.setState({ loading: true })
        let limit = this.state.limit
        let mcRequest = await serverData.showSelf(_self, { starttime: starttime, endtime: endtime, limit: limit ? limit : 25 }, false)
        this.setState({ loading: false, limit:25 })
        if (mcRequest && mcRequest.response) {
            if (mcRequest.response.data.length > 0) {
                let response = mcRequest.response;
                let dataList = response.data
                dataList.map((data, index) => {
                    this.updateStatus(data)
                })
                let oldLogData = this.state.logData
                let oldDataList = []
                if (oldLogData[starttime] && (this.currenttime !== starttime || !isStart)) {
                    oldDataList = [...oldLogData[starttime], ...dataList]
                }
                else {
                    
                    oldDataList = dataList
                }
                this.setState(prevState => ({
                    logData: {
                        ...prevState.logData,
                        [starttime]: oldDataList
                    }
                }));
            }
        }
    }

    onPopupDetail = (rawViewData) => {
        this.setState({
            rawViewData: rawViewData,
            openDetail: true
        })
    }

    closeDetail = () => {
        this.setState({ openDetail: false })
    }

    handleOpen = () => {
        this.setState({ isOpen: true});
    }

    handleClose = () => {
        this.setState({ isOpen: false });
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        // if (nextProps.showAuditLogWithOrg) {
        //     nextProps.handleShowAuditLog(undefined)
        //     return { logData: [] }
        // }
        return null
    }

    loadMore = () => {
        let logData = this.state.logData
        if (logData[this.starttime]) {
            let dataList = logData[this.starttime]
            let time = dateUtil.convertToUnix(dataList[dataList.length-1].starttime)
            this.endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, time)
        }
        this.getDataAudit(this.starttime, this.endtime)
    }

    loadData = (starttime, endtime) => {
        this.starttime = starttime
        this.endtime = endtime
        let logData = this.state.logData
        if(logData[starttime] === undefined || this.currenttime === this.starttime)
        {
            this.getDataAudit(starttime, endtime, true)
        }
    }

    changeLimit = (e)=>
    {
        let value = e.target.value.trim()
        this.setState({limit: value.length > 0 ? parseInt(value) : value})
    }

    render() {
        const { logData, isOpen, rawViewData, openDetail, loading } = this.state
        return (
            <React.Fragment>
                <IconButton style={{ backgroundColor: 'transparent' }} color='inherit' onClick={this.handleOpen}>
                    <TimelineOutlinedIcon fontSize='default' />
                </IconButton>
                <Drawer anchor={'right'} open={isOpen}>
                    <HeaderAuditLog dataList={logData} detailView={this.onPopupDetail} close={this.handleClose}  onLoadData={this.loadData} loading={loading} />
                    <Button style={{width:'100%', height:30, marginTop:10}} onClick={() => { this.loadMore() }}>Fetch&nbsp;&nbsp;
                        <TextField type={'number'} onClick={(e)=>{e.stopPropagation();}} style={{color:'black', width:50}} value={this.state.limit} onChange={this.changeLimit}/> More Logs
                    </Button>
                </Drawer>
                <PopDetailViewer
                    rawViewData={rawViewData}
                    dimmer={false}
                    open={openDetail}
                    close={this.closeDetail}
                />
            </React.Fragment>
        )
    }

    componentDidMount() {
        this.getDataAudit(this.starttime, this.endtime);
    }
}

function mapStateToProps(state) {
    return {
        showAuditLogWithOrg: state.showAuditLog.audit
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleShowAuditLog: (data) => { dispatch(actions.showAuditLog(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(headerGlobalAudit));