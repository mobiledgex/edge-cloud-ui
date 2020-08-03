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
import GetAppRoundedIcon from '@material-ui/icons/GetAppRounded';
let _self = null;


class headerGlobalAudit extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            historyList: [],
            liveData:[],
            rawViewData: [],
            tabValue: 0,
            openDetail: false,
            isOpen: false,
            loading: false,
            limit:25
        }
        _self = this
        this.starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, dateUtil.startOfDay())
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

    getDataAudit = async (starttime, endtime, limit, isStart) => {
        this.setState({ loading: true })
        limit = limit ? limit : this.state.limit
        let mcRequest = await serverData.showSelf(_self, { starttime: starttime, endtime: endtime, limit: limit ? parseInt(limit) : 25 }, false)
        this.setState({ loading: false, limit:25 })
        if (mcRequest && mcRequest.response) {
            if (mcRequest.response.data.length > 0) {
                let response = mcRequest.response;
                let dataList = response.data
                dataList.map((data, index) => {
                    this.updateStatus(data)
                })
                if (starttime === this.starttime) {
                    if(isStart)
                    {
                        this.setState({ liveData: dataList })
                    }
                    else
                    {
                        this.setState(prevState=>({liveData:[...prevState.liveData, ...dataList]}))
                    }
                }
                else {
                    this.setState({ historyList: dataList })
                }
                
                // if (oldLogData[starttime] && (this.currenttime !== starttime || !isStart)) {
                //     oldDataList = [...oldLogData[starttime], ...dataList]
                // }
                // this.setState(prevState => ({
                //     logData: {
                //         ...prevState.logData,
                //         [starttime]: oldDataList
                //     }
                // }), ()=>{console.log('Rahul1234', this.state.logData)});
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

    loadData = (starttime, endtime, limit) => {
        let logData = this.state.logData
        this.getDataAudit(starttime, endtime, limit, true)
    }

    changeLimit = (e)=>
    {
        let value = e.target.value.trim()
        this.setState({limit: value.length > 0 ? parseInt(value) : value})
    }

    render() {
        const { historyList, liveData, isOpen, rawViewData, openDetail, loading } = this.state
        return (
            <React.Fragment>
                <IconButton style={{ backgroundColor: 'transparent' }} color='inherit' onClick={this.handleOpen}>
                    <TimelineOutlinedIcon fontSize='default' />
                </IconButton>
                <Drawer anchor={'right'} open={isOpen}>
                    <HeaderAuditLog dataList={liveData} historyList={historyList} detailView={this.onPopupDetail} close={this.handleClose}  onLoadData={this.loadData} loading={loading} />
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