import React from 'react';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { showAudits } from '../../../../services/model/events'
import PopDetailViewer from '../../../../container/popDetailViewer';
import { Drawer } from '@material-ui/core';
import HeaderAuditLog from "./HeaderAuditLog"
import * as dateUtil from '../../../../utils/date_util'
import cloneDeep from 'lodash/cloneDeep'
import { ADMIN } from '../../../../constant';
import { getOrganization } from '../../../../services/model/format';
let _self = null;

const CON_LIMIT = 25
class headerGlobalAudit extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false
        _self = this;
        this.state = {
            historyList: [],
            liveData: [],
            rawViewData: [],
            isOrg: false,
            openDetail: false,
            isOpen: false,
            loading: false,
            historyLoading: false,
            selectedDate: dateUtil.currentTime(dateUtil.FORMAT_FULL_DATE)
        }
        _self = this
        this.intervalId = undefined
        this.starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, dateUtil.startOfDay())
        this.endtime = dateUtil.currentUTCTime(dateUtil.FORMAT_FULL_T_Z)
        this.type = this.props.type
    }

    getDataAuditOrg = async (orgName) => {
        let mcRequest = await showAudits(_self, { match: { orgs: [orgName] }, type: 'audit' })
        if (mcRequest && mcRequest.response) {
            if (mcRequest.response.data.length > 0) {
                if (this._isMounted) {
                    this.setState({ isOpen: true, historyList: mcRequest.response.data, isOrg: true })
                }
            }
            else {
                this.props.handleAlertInfo('error', 'No logs found')
            }
        }
    }

    updateStatus = (data) => {
        let mtags = data.mtags
        if (data.name.includes('/ws/') || data.name.includes('/wss/')) {
            mtags.status = mtags.response.includes('"code":400') ? 400 : mtags.status
        }
    }

    updateSelectedDate = (date) => {
        this.setState({ selectedDate: date ? date : dateUtil.currentTime(dateUtil.FORMAT_FULL_DATE) })
    }

    clearHistory = () => {
        this.setState({ historyList: [] })
    }

    loadMore = () => {
        let dataList = this.state.liveData
        let time = dateUtil.utcTime(dataList[dataList.length - 1].starttime)
        let endtime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, time)
        this.getDataAudit(this.starttime, endtime)
    }

    getDataAudit = async (starttime, endtime, limit, isLive, orgTime) => {
        if (this._isMounted) {
            isLive ? this.setState({ loading: true }) : this.setState({ historyLoading: true })
        }
        limit = limit ? limit : CON_LIMIT
        let mcRequest = await showAudits(_self, { starttime: starttime, endtime: endtime, limit: parseInt(limit), type: this.type }, false)
        if (this._isMounted) {
            this.setState({ historyLoading: false, loading: false, limit: 25 })
        }
        if (mcRequest && mcRequest.response) {
            if (mcRequest.response.data.length > 0) {
                let response = mcRequest.response;
                let dataList = response.data
                dataList = dataList.filter((data, index) => {
                    this.updateStatus(data)
                    return orgTime ? data.timestamp > orgTime : true
                })
                if (isLive) {
                    let newDataList = [...dataList, ...this.state.liveData]
                    if (newDataList && newDataList.length > 250) {
                        newDataList.splice(251, newDataList.length - 251);
                    }
                    if (this._isMounted) {
                        this.setState({ liveData: newDataList })
                    }
                }
                else {
                    if (this._isMounted) {
                        this.setState({ historyList: dataList })
                    }
                }
            }
            else {
                if (!isLive && this._isMounted) {
                    this.setState({ historyList: [] })
                }
            }
        }
    }

    onPopupDetail = (rawViewData) => {
        if (this._isMounted) {
            this.setState({
                rawViewData: rawViewData,
                openDetail: true
            })
        }
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
            return { isOpen: props.open, isOrg: false }
        }
        return null
    }

    render() {
        const { selectedDate, historyList, liveData, isOpen, rawViewData, openDetail, loading, historyLoading, isOrg } = this.state
        return (
            <React.Fragment>
                <Drawer anchor={'right'} open={isOpen}>
                    <HeaderAuditLog type={this.type} isOrg={isOrg} dataList={liveData} historyList={historyList} detailView={this.onPopupDetail} close={this.handleClose} onLoadData={this.loadData} loading={loading} historyLoading={historyLoading} selectedDate={selectedDate} onSelectedDate={this.updateSelectedDate} clearHistory={this.clearHistory} />
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
        if (this.props.userRole && prevProps.userRole !== this.props.userRole) {
            if (this.props.userRole.includes(ADMIN)) {
                this.initAudit(this.starttime, this.endtime, false)
            }
            else {
                this.starttime = dateUtil.utcTime(dateUtil.FORMAT_FULL_T_Z, dateUtil.startOfDay())
                this.endtime = dateUtil.currentUTCTime(dateUtil.FORMAT_FULL_T_Z)
                if (this._isMounted) {
                    this.setState({ liveData: [] })
                }
                this.initAudit(this.starttime, this.endtime, false)
            }
        }

        if (this.props.showAuditLogWithOrg && prevProps.showAuditLogWithOrg !== this.props.showAuditLogWithOrg) {
            if (this.type === this.props.showAuditLogWithOrg.type && this.type === 'audit') {
                this.getDataAuditOrg(this.props.showAuditLogWithOrg.org)
            }
            else if (this.type === this.props.showAuditLogWithOrg.type && this.type === 'event') {
                this.setState({ isOpen: true })
            }
        }
        if (prevState.isOpen !== this.state.isOpen) {
            if (this.state.isOpen) {
                this.starttime = cloneDeep(this.endtime)
                this.endtime = dateUtil.currentUTCTime(dateUtil.FORMAT_FULL_T_Z)
                this.initAudit(this.starttime, this.endtime, true)
            }
            else {
                clearInterval(this.intervalId)
            }
        }
        this.props.handleShowAuditLog(null)
    }

    initAudit = (starttime, endtime, enableInterval) => {
        this.getDataAudit(starttime, endtime, CON_LIMIT, true);
        if (enableInterval) {
            this.intervalId = setInterval(() => {
                let dataList = this.state.liveData
                let orgTime = dataList.length > 0 ? dataList[0].starttime : undefined
                this.starttime = cloneDeep(this.endtime)
                this.endtime = dateUtil.currentUTCTime(dateUtil.FORMAT_FULL_T_Z)
                this.getDataAudit(this.starttime, this.endtime, CON_LIMIT, true, orgTime)
            }, 10 * 2000);
        }
    }

    componentDidMount() {
        this._isMounted = true
        let userRole = this.props.userRole
        if (getOrganization() || (userRole && userRole.includes(ADMIN))) {
            this.initAudit(this.starttime, this.endtime, false)
        }
    }

    componentWillUnmount = () => {
        this._isMounted = false
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }
}

function mapStateToProps(state) {
    return {
        showAuditLogWithOrg: state.showAuditLog.audit,
        userRole: state.showUserRole ? state.showUserRole.role : null,
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