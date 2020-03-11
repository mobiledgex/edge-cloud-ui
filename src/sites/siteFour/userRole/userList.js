import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { fields } from '../../../services/model/format';
import { keys, showUsers, deleteUser} from '../../../services/model/users';

class OrganizationList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null,
            openAddUserView: false,
        }

        this.action = '';
        this.data = {}
        this.keys = Object.assign([], keys);
    }

    /**Action menu block */
    actionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteUser }
        ]
    }
    /*Action menu block*/

    requestInfo = () => {
        return ({
            id: 'userRole',
            headerLabel: 'Users & Roles',
            nameField: fields.organizationName,
            requestType: [showUsers],
            sortBy: [fields.username],
            keys: this.keys,
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} />
        )
    }
};

const mapStateToProps = (state) => {
    return {
        roleInfo: state.roleInfo ? state.roleInfo.role : null,
        userRole: state.showUserRole ? state.showUserRole.role : null
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleUserRole: (data) => { dispatch(actions.showUserRole(data)) },
        handleRoleInfo: (data) => { dispatch(actions.roleInfo(data)) },
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(OrganizationList));