import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
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


    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} groupActionMenu={this.groupActionMenu} />
        )
    }
};

export default withRouter(connect(null, null)(UserList));