import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { fields } from '../../../services/model/format';
import { keys, showUsers, deleteUser } from '../../../services/model/users';
import { HELP_USER_ROLES } from '../../../tutorial';
import { ACTION_DELETE } from '../../../container/Actions';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null,
            openAddUserView: false,
        }

        this.action = '';
        this.data = {}
        this.keys = keys();
    }

    /**Action menu block */
    getDeleteActionMessage = (action, data) => {
        return `Are you sure you want to remove ${data[fields.username]} from Organization ${data[fields.organizationName]}?`
    }

    actionMenu = () => {
        return [
            { id: ACTION_DELETE, label: 'Delete', onClick: deleteUser, dialogMessage: this.getDeleteActionMessage, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteUser, icon: 'delete', warning: 'remove selected user\'s from assigned organization', type: 'Edit' },
        ]
    }
    /*Action menu block*/

    requestInfo = () => {
        return ({
            id: 'userRole',
            headerLabel: 'Users & Roles',
            nameField: fields.username,
            requestType: [showUsers],
            sortBy: [fields.username],
            selection: true,
            keys: this.keys,
            viewMode: HELP_USER_ROLES,
            grouping: true
        })
    }

    /**
  * Customized data block
  **/

    roleMark = (data, isDetailView) => {
        let role = data[fields.role]
        if (isDetailView) {
            return role
        }
        else {
            let symbol = (role.indexOf('Admin') !== -1 && role.indexOf('Manager') !== -1) ? <div className="mark markA markS">S</div> :
                (role.indexOf('Developer') !== -1 && role.indexOf('Manager') !== -1) ?
                    <div className="mark markD markM">M</div> :
                    (role.indexOf('Developer') !== -1 && role.indexOf('Contributor') !== -1) ?
                        <div className="mark markD markC">C</div> :
                        (role.indexOf('Developer') !== -1 && role.indexOf('Viewer') !== -1) ?
                            <div className="mark markD markV">V</div> :
                            (role.indexOf('Operator') !== -1 && role.indexOf('Manager') !== -1) ?
                                <div className="mark markO markM">M</div> :
                                (role.indexOf('Operator') !== -1 && role.indexOf('Contributor') !== -1) ?
                                    <div className="mark markO markC">C</div> :
                                    (role.indexOf('Operator') !== -1 && role.indexOf('Viewer') !== -1) ?
                                        <div className="mark markO markV">V</div> : <div></div>

            return (
                <div>
                    <div className="markBox">{symbol}</div>
                    <label>{data[fields.role]}</label>
                </div>)
        }

    }

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.role) {
                key.customizedData = this.roleMark
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
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} groupActionMenu={this.groupActionMenu} />
        )
    }
};

export default withRouter(connect(null, null)(UserList));