import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { fields } from '../../../services/model/format';
import { keys, showOrganizations, deleteOrganization } from '../../../services/model/organization';
import OrganizationReg from './organizationReg';
import * as serverData from '../../../services/model/serverData'
import * as shared from '../../../services/model/shared';

import { Button } from '@material-ui/core';
import {organizationTutor} from "../../../tutorial";

const orgaSteps = organizationTutor();
class OrganizationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
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

    onAdd = (action, data) => {
        this.setState({ currentView: <OrganizationReg data={data} isUpdate={action ? true : false} onClose={this.onRegClose} /> });
    }

    /**Action menu block */
    onAudit = (action, data) => {
        this.props.handleShowAuditLog(data[fields.organizationName])
    }

    onDelete = (data, success) => {
        if (success && data[fields.organizationName] === localStorage.getItem('selectOrg')) {
            localStorage.removeItem('selectRole')
            localStorage.removeItem('selectOrg')
            this.props.handleUserRole(undefined)
            this.forceUpdate()
        }
    }

    actionMenu = () => {
        return [
            { label: 'Audit', onClick: this.onAudit },
            { label: 'Add User', onClick: this.onAddUser, type:'Edit' },
            { label: 'Update', onClick: this.onAdd, type:'Edit' },
            { label: 'Delete', onClick: deleteOrganization, onFinish: this.onDelete, type:'Edit' }
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

    onManage = (key, data) => {
        if (this.props.roleInfo) {
            let roleInfoList = this.props.roleInfo;
            for (let i = 0; i < roleInfoList.length; i++) {
                let roleInfo = roleInfoList[i];
                if (roleInfo.org === data[fields.organizationName]) {
                    this.props.handleUserRole(roleInfo.role)
                    localStorage.setItem('selectOrg', data[fields.organizationName])
                    localStorage.setItem('selectRole', roleInfo.role)
                    this.forceUpdate()
                    break;
                }
            }
        }
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
        let mode = (localStorage.selectRole === 'AdminManager')? orgaSteps.stepsOrgDataAdmin : orgaSteps.stepsOrgDataDeveloper ;

        return ({
            id: 'Organizations',
            headerLabel: 'Organizations',
            nameField: fields.organizationName,
            requestType: [showOrganizations],
            sortBy: [fields.organizationName],
            keys: this.keys,
            onAdd: this.onAdd,
            additionalDetail: shared.additionalDetail,
            viewMode: mode
        })
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
                    this.props.handleUserRole(userRole.role);
                    localStorage.setItem('selectRole', userRole.role)
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
        this.forceUpdate()
    }

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.manage) {
                this.getUserRoles(key)
            }
        }
    }

    /**
     * Customized data block
     * ** */

    componentDidMount() {
        this.customizedData()
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <div style={{ width: '100%', height:'100%' }}>
                    <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} onClick={this.onListViewClick} />
                </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        roleInfo: state.roleInfo ? state.roleInfo.role : null,
        userRole: state.showUserRole ? state.showUserRole.role : null,
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleUserRole: (data) => { dispatch(actions.showUserRole(data)) },
        handleRoleInfo: (data) => { dispatch(actions.roleInfo(data)) },
        handleShowAuditLog: (data) => {dispatch(actions.showAuditLog(data))},
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(OrganizationList));
