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

import { Button, Box, Card, IconButton, Typography, CardHeader } from '@material-ui/core';
import { HELP_ORG_LIST } from "../../../tutorial";
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import { Icon } from 'semantic-ui-react';
import { ACTION_DELETE, ACTION_DISABLE, ACTION_EDGE_BOX_ENABLE, ACTION_LABEL, ACTION_UPDATE, ACTION_WARNING } from '../../../container/Actions';
import { sendRequest } from '../monitoring/services/service'
import { LS_ORGANIZATION_INFO, ls_setOrganizationInfo } from '../../../helper/ls';

class OrganizationList extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false
        this.state = {
            currentView: null,
            tableHeight: isViewer() ? undefined : 280
        }
        this.action = '';
        this.data = {}
        this.keys = keys()
    }

    onRegClose = (isEdited) => {
        this.customizedData()
        this.setState({ currentView: null })
    }

    onAddUser = (action, data) => {
        this.setState({ currentView: <OrganizationReg data={data} action={action ? 'AddUser' : null} onClose={this.onRegClose} /> });
    }

    onAdd = (type) => {
        this.setState({ currentView: <OrganizationReg onClose={this.onRegClose} type={type} /> });
    }

    onUpdate = (action, data) => {
        this.setState({ currentView: <OrganizationReg data={data} isUpdate={true} onClose={this.onRegClose} /> });
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

    edgeboxOnlyVisibility = (data)=>{
        return isAdmin()
    }

    actionMenu = () => {
        return [
            { label: 'Audit', onClick: this.onAudit },
            { label: 'Add User', onClick: this.onAddUser, type: 'Edit' },
            { id: ACTION_EDGE_BOX_ENABLE, label: this.onPreEdgebox, visible:this.edgeboxOnlyVisibility, type: 'Edit', warning: this.onPreEdgebox, disable: this.onPreEdgebox, onClick: this.onEdgebox },
            { id: ACTION_UPDATE, label: 'Update', onClick: this.onUpdate, type: 'Edit' },
            { id: ACTION_DELETE, label: 'Delete', onClick: deleteOrganization, onFinish: this.onDelete, type: 'Edit' }
        ]
    }

    /*Action menu block*/

    /*
        Manage Block
    **/

    getManage = (data) => {
        return (
            <Button size={'small'}
                className='buttonManage'
                style={{ width: 100, backgroundColor: localStorage.selectOrg === data[fields.organizationName] ? '#559901' : 'grey', color: 'white' }}>
                <label>Manage</label>
            </Button>)
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
        if (this.props.roleInfo) {
            let roleInfoList = this.props.roleInfo;
            for (let i = 0; i < roleInfoList.length; i++) {
                let roleInfo = roleInfoList[i];
                if (roleInfo.org === data[fields.organizationName]) {
                    this.props.handlePrivateAccess(undefined)
                    let privateAccess = await constant.validatePrivateAccess(this, roleInfo.role)
                    this.props.handlePrivateAccess(privateAccess)
                    localStorage.setItem('selectOrg', data[fields.organizationName])
                    localStorage.setItem('selectRole', roleInfo.role)
                    this.props.handleUserRole(roleInfo.role)
                    this.cacheOrgInfo(data, roleInfo)
                    if (this._isMounted) {
                        this.forceUpdate()
                    }
                    break;
                }
            }
        }
        this.setState({ tableHeight: isViewer() ? undefined : 280 })
    }
    /*
        Manage Block
    **/


    onListViewClick = (key, data) => {
        switch (key.field) {
            case fields.manage:
                this.onManage(key, data)
        }
    }

    requestInfo = () => {
        return ({
            id: 'Organizations',
            headerLabel: 'Organizations',
            nameField: fields.organizationName,
            requestType: [showOrganizations],
            sortBy: [fields.organizationName],
            keys: this.keys,
            additionalDetail: shared.additionalDetail,
            viewMode: HELP_ORG_LIST,
            grouping: true
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

    getUserRoles = async (key) => {
        let isAdmin = false;
        let mcRequest = await serverData.showUserRoles(this)
        if (mcRequest && mcRequest.response) {
            let userRoles = mcRequest.response.data
            this.props.handleRoleInfo(userRoles)
            for (let i = 0; i < userRoles.length; i++) {
                let userRole = userRoles[i]
                if (userRole.role.indexOf('Admin') > -1) {
                    isAdmin = true
                    break;
                }
            }
        }
        if (!isAdmin) {
            key.visible = true;
            key.customizedData = this.getManage;
        }
        else {
            key.visible = false;
        }
        if (this._isMounted) {
            this.forceUpdate()
        }
    }

    edgeboxOnly = (data, isDetail) => {
        let edgeboxOnly = data[fields.edgeboxOnly]
        let isOperator = data[fields.type].includes(constant.OPERATOR.toLowerCase())
        if (isDetail) {
            return edgeboxOnly ? constant.YES : constant.NO
        }
        else {
            return <Icon name={edgeboxOnly ? 'check' : 'close'} style={{ color: isOperator ? edgeboxOnly ? constant.COLOR_GREEN : constant.COLOR_RED : '#9E9E9E' }} />
        }
    }

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.manage) {
                this.getUserRoles(key)
            }
            else if (key.field === fields.edgeboxOnly) {
                key.customizedData = this.edgeboxOnly
            }
        }
    }

    /**
     * Customized data block
     * ** */

    componentDidMount() {
        this._isMounted = true
        this.customizedData()
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
