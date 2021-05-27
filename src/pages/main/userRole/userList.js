import React from 'react';
import DataView from '../../../container/DataView';
import { withRouter } from 'react-router-dom';
import { fields } from '../../../services/model/format';
import { keys, showUsers, deleteUser } from '../../../services/model/users';
import { HELP_USER_ROLES } from '../../../tutorial';
import { ACTION_DELETE } from '../../../constant/actions';
import { PAGE_USER_ROLES } from '../../../constant';
import { connect } from 'react-redux';
import { redux_org } from '../../../helper/reduxData';

class UserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            openAddUserView: false,
        }
        this._isMounted = false
        this.action = '';
        this.data = {}
        this.keys = keys();
    }

    /**Action menu block */
    getDeleteActionMessage = (action, data) => {
        return `Are you sure you want to remove ${data[fields.username]} from Organization ${data[fields.organizationName]}?`
    }

    onDeleteAction = (type, action, data) => {
        if (this.props.roleInfo && !redux_org.isAdmin(this)) {
            let roleInfoList = this.props.roleInfo;
            for (let roleInfo of roleInfoList) {
                if (roleInfo[fields.organizationName] === data[fields.organizationName]) {
                    return !roleInfo.role.includes('Manager')
                }
            }
        }
        return false
    }

    actionMenu = () => {
        return [
            { id: ACTION_DELETE, label: 'Delete', onClick: deleteUser, dialogMessage: this.getDeleteActionMessage, disable: this.onDeleteAction, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteUser, icon: 'delete', warning: 'remove selected user\'s from assigned organization', type: 'Edit' },
        ]
    }

    requestInfo = () => {
        return ({
            id: PAGE_USER_ROLES,
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
            <DataView id={PAGE_USER_ROLES} actionMenu={this.actionMenu} requestInfo={this.requestInfo} groupActionMenu={this.groupActionMenu} />
        )
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }
};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data,
        roleInfo: state.roleInfo ? state.roleInfo.role : null
    }
};

export default withRouter(connect(mapStateToProps, null)(UserList));
