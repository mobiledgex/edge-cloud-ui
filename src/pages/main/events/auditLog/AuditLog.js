/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';
import { showAudits } from '../../../../services/modules/audit'
import LeftView from "./LeftView"
import * as dateUtil from '../../../../utils/date_util'
import { defaultRange } from '../helper/constant';
import { redux_org } from '../../../../helper/reduxData';
import { sendAuthRequest } from '../../../../services/worker/serverWorker';
import sortBy from 'lodash/sortBy';
import { localFields } from '../../../../services/fields';
import { showOrganizations } from '../../../../services/modules/organization';
import { responseValid } from '../../../../services/config';
import '../style.css'

class AuditLog extends Component {
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
            <Fragment>
                <LeftView type={this.type} isOrg={isOrg} toggle={toggle} dataList={dataList} orgList={orgList} fetchData={this.onFetchData} close={this.handleClose} loading={loading} selectedDate={selectedDate} onSelectedDate={this.updateSelectedDate} />
            </Fragment>
        )
    }

    fetchDefaultData = () => {
        if (this._isMounted) {
            this.setState({ dataList: [] }, () => {
                defaultRange(this)
                const { data } = this.props
                if (data) {
                    const { starttime, endtime, type } = data
                    this.starttime = starttime ?? this.starttime
                    this.endtime = endtime ?? this.endtime
                    this.type = type ?? this.type
                }
                this.getDataAudit(this.starttime, this.endtime);
            })
        }
    }

    orgResponse = (mc) => {
        if (responseValid(mc)) {
            const orgList = sortBy(mc.response.data, [item => item[localFields.organizationName]], ['asc']);
            this.setState({ orgList })
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