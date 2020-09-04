import React from 'react';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import * as serverData from '../../../../services/model/serverData';
import PopDetailViewer from '../../../../container/popDetailViewer';
import { Drawer } from '@material-ui/core';
import HeaderAuditLog from "./HeaderAuditLog"
import * as dateUtil from '../../../../utils/date_util'
let _self = null;

const CON_LIMIT = 25
class headerGlobalAudit extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            historyList: [],
            liveData: [],
            rawViewData: [],
            isOrg:false,
            openDetail: false,
            isOpen: false,
            loading: false,
            historyLoading: false,
            selectedDate: dateUtil.currentTime(dateUtil.FORMAT_FULL_DATE)
        }
        _self = this
        this.intervalId = undefined
        this.starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, dateUtil.startOfDay())
        this.endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, dateUtil.endOfDay())
    }

    getDataAuditOrg = async (orgName) => {
        let mcRequest = await serverData.showAuditOrg(_self, { "org": orgName })
        if (mcRequest && mcRequest.response) {
            if (mcRequest.response.data.length > 0) {
                this.setState({ isOpen: true, historyList: mcRequest.response.data, isOrg: true })
            }
            else {
                this.props.handleAlertInfo('error', 'No logs found')
            }
        }
    }

    updateStatus = (data) => {
        if (data.operationname.includes('/ws/') || data.operationname.includes('/wss/')) {
            data.status = data.response.includes('"code":400') ? 400 : data.status
        }
    }

    updateSelectedDate = (date) => {
        this.setState({ selectedDate: date ? date :  dateUtil.currentTime(dateUtil.FORMAT_FULL_DATE)})
    }

    clearHistory = () =>
    {
        this.setState({historyList:[]})
    }

    loadMore = () => {
        let dataList = this.state.liveData
        let time = dateUtil.convertToUnix(dataList[dataList.length - 1].starttime)
        let endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, time)
        this.getDataAudit(this.starttime, endtime)
    }

    getDataAudit = async (starttime, endtime, limit, isLive, orgTime) => {
        isLive ? this.setState({ loading: true }) : this.setState({ historyLoading: true })
        limit = limit ? limit : CON_LIMIT
        let mcRequest = await serverData.showSelf(_self, { starttime: starttime, endtime: endtime, limit: parseInt(limit) }, false)
        this.setState({ historyLoading: false, loading: false, limit: 25 })
        if (mcRequest && mcRequest.response) {
            if (mcRequest.response.data.length > 0) {
                let response = mcRequest.response;
                let dataList = response.data
                dataList = dataList.filter((data, index) => {
                    this.updateStatus(data)
                    return orgTime ? data.starttime > orgTime : true
                })
                if (isLive) {
                    let newDataList = [...dataList, ...this.state.liveData]
                    if(newDataList && newDataList.length > 250)
                    {
                        newDataList.splice(251, newDataList.length - 251);
                    }
                    this.setState({ liveData: newDataList })
                }
                else {
                    this.setState({ historyList: dataList })
                }
            }
            else
            {
                if(!isLive)
                {
                    this.setState({historyList:[]})
                }
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

    handleClose = () => {
        this.props.close()
        this.setState({ isOpen: false });
    }

    loadData = (starttime, endtime, limit) => {
        this.getDataAudit(starttime, endtime, limit)
    }

    static getDerivedStateFromProps(props, state) {
        if (props.open) {
            return { isOpen: props.open, isOrg : false  }
        }
        return null
    }

    render() {
        const { selectedDate, historyList, liveData, isOpen, rawViewData, openDetail, loading, historyLoading, isOrg} = this.state
        return (
            <React.Fragment>
                <Drawer anchor={'right'} open={isOpen}>
                    <HeaderAuditLog isOrg={isOrg} dataList={liveData} historyList={historyList} detailView={this.onPopupDetail} close={this.handleClose} onLoadData={this.loadData} loading={loading} historyLoading={historyLoading} selectedDate={selectedDate} onSelectedDate={this.updateSelectedDate} clearHistory={this.clearHistory}/>
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

    componentDidUpdate(prevProps, prevState) {
        if(this.props.showAuditLogWithOrg && prevProps.showAuditLogWithOrg !== this.props.showAuditLogWithOrg)
        {
            this.getDataAuditOrg(this.props.showAuditLogWithOrg)
            this.props.handleShowAuditLog(null)
        }
    }

    componentDidMount() {
        this.getDataAudit(this.starttime, this.endtime, CON_LIMIT, true);
        this.intervalId = setInterval(() => {
            let dataList = this.state.liveData
            let time = dataList.length > 0 ? dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, dateUtil.convertToUnix(dataList[0].starttime)) : this.starttime
            let orgTime = dataList.length > 0 ? dataList[0].starttime : undefined
            this.getDataAudit(time, this.endtime, CON_LIMIT, true, orgTime)
        }, 10 * 1000);
    }

    componentWillUnmount = () => {
        clearInterval(this.intervalId);
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