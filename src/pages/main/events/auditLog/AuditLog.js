import React from 'react';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { showAudits } from '../../../../services/modules/audit'
import LeftView from "./LeftView"
import * as dateUtil from '../../../../utils/date_util'
import { responseValid } from '../../../../services/service';
import { defaultRange } from '../helper/constant';
import '../style.css'
import { redux_org } from '../../../../helper/reduxData';
import { sendAuthRequest } from '../../../../services/model/serverWorker';
import sortBy from 'lodash/sortBy';
import { fields } from '../../../../services/model/format';
import { showOrganizations } from '../../../../services/modules/organization';
class AuditLog extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false
        this.state = {
            dataList: [],
            isOrg: false,
            loading: false,
            toggle:false,
            selectedDate: dateUtil.currentTime(dateUtil.FORMAT_FULL_DATE),
            orgList:undefined
        }
        defaultRange(this)
        this.type = this.props.type
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

    getDataAudit = async (starttime, endtime, limit = 25, tags = {}, org = undefined) => {
        if (this._isMounted) {
            this.setState({ loading: true, dataList: [] })
        }
        let match = { tags }
        let mc = await showAudits(this, { starttime, endtime, limit: parseInt(limit), type: this.type, match }, org, false)
        if (this._isMounted) {
            this.setState({ loading: false, limit: 25 })
        }
        if (responseValid(mc)) {
            let dataList = mc.response.data
            this.setState({ dataList, toggle: !this.state.toggle })
        }
    }

    handleClose = () => {
        this.props.close()
    }

    onFetchData = (filter) => {
        const { range, tags, limit, org } = filter
        this.starttime = range.from
        this.endtime = range.to
        this.getDataAudit(this.starttime, this.endtime, limit, tags, org)
    }

    render() {
        const { selectedDate, dataList, loading, isOrg, toggle, orgList} = this.state
        return (
            <React.Fragment>
                <LeftView type={this.type} isOrg={isOrg} toggle={toggle} dataList={dataList} orgList={orgList} fetchData={this.onFetchData} close={this.handleClose} loading={loading} selectedDate={selectedDate} onSelectedDate={this.updateSelectedDate} />
            </React.Fragment>
        )
    }

    fetchDefaultData = () => {
        if (this._isMounted) {
            this.setState({ dataList: [] }, () => {
                defaultRange(this)
                this.getDataAudit(this.starttime, this.endtime);
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        // this.isPrivate = this.props.privateAccess
        // if (this.props.showAuditLogWithOrg && prevProps.showAuditLogWithOrg !== this.props.showAuditLogWithOrg) {
        //     if (this.type === this.props.showAuditLogWithOrg.type && this.type === 'audit') {
        //         this.getDataAudit(this.starttime, this.endtime, 25, {}, this.props.showAuditLogWithOrg.org)
        //     }
        //     this.props.handleShowAuditLog(null)
        // }
    }

    orgResponse = (mc) => {
        if (responseValid(mc)) {
            const organizationList = sortBy(mc.response.data, [item => item[fields.organizationName]], ['asc']);
            this.setState({ orgList: organizationList })
        }
    }

    componentDidMount() {
        this._isMounted = true;
        if (redux_org.isAdmin(this)) {
            sendAuthRequest(this, showOrganizations(), this.orgResponse)
        }
        this.fetchDefaultData()
    }

    componentWillUnmount = () => {
        this._isMounted = false
    }
}

function mapStateToProps(state) {
    return {
        showAuditLogWithOrg: state.showAuditLog.audit,
        organizationInfo: state.organizationInfo.data
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleShowAuditLog: (data) => { dispatch(actions.showAuditLog(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AuditLog));