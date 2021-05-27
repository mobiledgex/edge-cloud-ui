import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant';
import { fields, isAdmin, isViewer } from '../../../services/model/format';
import { keys, showOrganizations, deleteOrganization, edgeboxOnlyAPI } from '../../../services/model/organization';
import OrganizationReg from './organizationReg';
import * as serverData from '../../../services/model/serverData'
import * as shared from '../../../services/model/shared';

import { Box, Card, IconButton, Typography, CardHeader } from '@material-ui/core';
import { HELP_ORG_LIST } from "../../../tutorial";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { ACTION_DELETE, ACTION_DISABLE, ACTION_EDGE_BOX_ENABLE, ACTION_LABEL, ACTION_UPDATE, ACTION_WARNING } from '../../../constant/actions';
import { sendRequest } from '../monitoring/services/service'
import { LS_ORGANIZATION_INFO } from '../../../helper/ls';
import { uiFormatter } from '../../../helper/formatter'
class OrganizationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null,
            tableHeight: isViewer() ? undefined : 280,
            loading: undefined
        }
        this._isMounted = false
        this.action = '';
        this.data = {}
        this.keys = keys()
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    onRegClose = (isEdited) => {
        this.updateState({ currentView: null })
    }

    onAddUser = (action, data) => {
        this.updateState({ currentView: <OrganizationReg data={data} action={action ? 'AddUser' : null} onClose={this.onRegClose} /> });
    }

    onAdd = (type) => {
        this.updateState({ currentView: <OrganizationReg onClose={this.onRegClose} type={type} /> });
    }

    onUpdate = (action, data) => {
        this.updateState({ currentView: <OrganizationReg data={data} isUpdate={true} onClose={this.onRegClose} /> });
    }

    customToolbar = () =>
    (
        isViewer() ? null : <Box display='flex'>
            <Card style={{ margin: 10, width: '50%', maxHeight: 200, overflow: 'auto' }}>
                <CardHeader
                    avatar={
                        <IconButton aria-label="developer" disabled={true}>
                            <img src='/assets/images/handset-sdk-green.svg' alt="MobiledgeX" />
                        </IconButton>
                    }
                    title={
                        <Typography>
                            Create Organization to Run Apps on Telco Edge (Developers)
                        </Typography>
                    }
                    // subheader="Dynamically scale and deploy applications on Telco Edge geographically close to your end-users. Deploying to MobiledgeX's cloudlets provides applications the advantage of low latency, which can be extremely useful for real-time applications such as Augmented Reality, Mobile Gaming, Self-Driving Cars, Drones, etc."
                    action={
                        <IconButton aria-label="developer" onClick={() => { this.onAdd(constant.DEVELOPER) }}>
                            <ArrowForwardIosIcon style={{ fontSize: 20, color: '#76ff03' }} />
                        </IconButton>
                    }
                />
            </Card>
            <Card style={{ margin: 10, width: '50%', maxHeight: 200, overflow: 'auto' }}>
                <CardHeader
                    avatar={
                        <IconButton aria-label="operator" disabled={true}>
                            <img src='/assets/images/cloudlet-green.svg' alt="MobiledgeX" />
                        </IconButton>
                    }
                    title={
                        <Typography>
                            Create Organization to Host Telco Edge (Operators)
                        </Typography>
                    }
                    // subheader='Register your cloudlet by providing MobiledgeX with a pool of compute resources and access to the OpenStack API endpoint by specifying a few required parameters, such as dynamic IP addresses, cloudlet names, location of cloudlets, certs, and more, using the Edge-Cloud Console. MobiledgeX relies on this information to remotely access the cloudlets to determine resource requirements as well as dynamically track usage.'
                    action={
                        <IconButton aria-label="operator" onClick={() => { this.onAdd(constant.OPERATOR) }}>
                            <ArrowForwardIosIcon style={{ fontSize: 20, color: '#76ff03' }} />
                        </IconButton>
                    }
                />
            </Card>
        </Box>
    )

    /**Action menu block */
    onAudit = (action, data) => {
        this.props.handleShowAuditLog({ type: 'audit', org: data[fields.organizationName] })
    }

    onDelete = (data, success) => {
        if (success && data[fields.organizationName] === localStorage.getItem('selectOrg')) {
            localStorage.removeItem('selectRole')
            localStorage.removeItem('selectOrg')
            this.props.handleUserRole(undefined)
            if (this._isMounted) {
                this.forceUpdate()
            }
        }
    }

    onEdgebox = async (action, data, callback) => {
        let mc = await sendRequest(this, edgeboxOnlyAPI(data))
        if (mc && mc.response && mc.response.status === 200) {
            this.props.handleAlertInfo('success', `Edgebox ${data[fields.edgeboxOnly] ? 'disabled' : 'enabled'} successfully for organization ${data[fields.organizationName]}`)
            callback(mc)
        }
    }

    onPreEdgebox = (type, action, data) => {
        switch (type) {
            case ACTION_LABEL:
                return data[fields.edgeboxOnly] ? 'Disable Edgebox' : 'Enable Edgebox'
            case ACTION_WARNING:
                return `${data[fields.edgeboxOnly] ? 'disable' : 'enable'} edgebox feature for`
            case ACTION_DISABLE:
                return data[fields.type].includes(constant.DEVELOPER.toLowerCase())
        }
    }

    edgeboxOnlyVisibility = (data) => {
        return isAdmin()
    }

    actionMenu = () => {
        return [
            { label: 'Audit', onClick: this.onAudit },
            { label: 'Add User', onClick: this.onAddUser, type: 'Edit' },
            { id: ACTION_EDGE_BOX_ENABLE, label: this.onPreEdgebox, visible: this.edgeboxOnlyVisibility, type: 'Edit', warning: this.onPreEdgebox, disable: this.onPreEdgebox, onClick: this.onEdgebox },
            { id: ACTION_UPDATE, label: 'Update', onClick: this.onUpdate, type: 'Edit' },
            { id: ACTION_DELETE, label: 'Delete', onClick: deleteOrganization, onFinish: this.onDelete, type: 'Edit' }
        ]
    }

    cacheOrgInfo = (data, roleInfo) => {
        let organizationInfo = {}
        organizationInfo[fields.organizationName] = data[fields.organizationName]
        organizationInfo[fields.type] = data[fields.type]
        organizationInfo[fields.edgeboxOnly] = data[fields.edgeboxOnly]
        organizationInfo[fields.role] = roleInfo[fields.role]
        organizationInfo[fields.username] = roleInfo[fields.username]
        this.props.handleOrganizationInfo(organizationInfo)
        localStorage.setItem(LS_ORGANIZATION_INFO, JSON.stringify(organizationInfo))
    }

    onManage = async (key, data) => {
        this.updateState({ loading: data[fields.organizationName] })
        if (this.props.roleInfo) {
            let roleInfoList = this.props.roleInfo;
            for (let roleInfo of roleInfoList) {
                if (roleInfo.org === data[fields.organizationName]) {
                    this.props.handlePrivateAccess(undefined)
                    localStorage.setItem('selectOrg', data[fields.organizationName])
                    localStorage.setItem('selectRole', roleInfo.role)
                    this.props.handleUserRole(roleInfo.role)
                    let privateAccess = await constant.validatePrivateAccess(this, roleInfo.role)
                    this.props.handlePrivateAccess(privateAccess)
                    this.cacheOrgInfo(data, roleInfo)
                    break;
                }
            }
        }
        this.updateState({ tableHeight: isViewer() ? undefined : 280, loading: undefined })
    }

    onListViewClick = (key, data) => {
        switch (key.field) {
            case fields.manage:
                this.onManage(key, data)
        }
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === fields.manage) {
            return <uiFormatter.Manage loading={this.state.loading} data={data} key={key} detail={isDetail} />
        }
        else if (key.field === fields.edgeboxOnly) {
            return uiFormatter.edgeboxOnly(key, data, isDetail)
        }
    }

    requestInfo = () => {
        return ({
            id: constant.PAGE_ORGANIZATIONS,
            headerLabel: 'Organizations',
            nameField: fields.organizationName,
            requestType: [showOrganizations],
            sortBy: [fields.organizationName],
            keys: this.keys,
            additionalDetail: shared.additionalDetail,
            viewMode: HELP_ORG_LIST,
            grouping: true,
            formatData: this.dataFormatter
        })
    }

    render() {
        const { tableHeight } = this.state
        return (
            this.state.currentView ? this.state.currentView :
                <div style={{ width: '100%', height: '100%' }}>
                    <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} onClick={this.onListViewClick} customToolbar={this.customToolbar} tableHeight={tableHeight} />
                </div>
        )
    }

    getUserRoles = async () => {
        let isAdmin = false;
        let mc = await serverData.showUserRoles(this)
        if (mc && mc.response && mc.response.status === 200) {
            let userRoles = mc.response.data
            this.props.handleRoleInfo(userRoles)
            let clearStorage = true
            for (let i = 0; i < userRoles.length; i++) {
                let userRole = userRoles[i]
                if (userRole.role.indexOf('Admin') > -1) {
                    isAdmin = true
                    clearStorage = false
                    break;
                }
                else if (userRole.org === localStorage.getItem('selectOrg')) {
                    clearStorage = false
                }
            }

            if (clearStorage) {
                localStorage.removeItem('selectOrg')
                localStorage.removeItem('selectRole')
            }
        }

        this.keys = this.keys.map(key => {
            if (key.field === fields.manage) {
                key.visible = !isAdmin
            }
            return key
        })

        if (this._isMounted) {
            this.forceUpdate()
        }
    }

    fetchRole = async () => {
        let mc = await serverData.showUserRoles(this)
        if (mc && mc.response && mc.response.status === 200) {
            this.props.handleRoleInfo(mc.response.data)
        }
    }

    componentDidUpdate(preProp, preState) {
        if (this.state.currentView !== preState.currentView && this.state.currentView === null) {
            this.fetchRole()
        }
    }

    /**
     * Customized data block
     * ** */

    componentDidMount() {
        this._isMounted = true
        this.getUserRoles()
    }

    componentWillUnmount() {
        this._isMounted = false
    }


};

const mapStateToProps = (state) => {
    return {
        roleInfo: state.roleInfo ? state.roleInfo.role : null
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleUserRole: (data) => { dispatch(actions.showUserRole(data)) },
        handleRoleInfo: (data) => { dispatch(actions.roleInfo(data)) },
        handleShowAuditLog: (data) => { dispatch(actions.showAuditLog(data)) },
        handlePrivateAccess: (data) => { dispatch(actions.privateAccess(data)) },
        handleOrganizationInfo: (data) => { dispatch(actions.organizationInfo(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(OrganizationList));
