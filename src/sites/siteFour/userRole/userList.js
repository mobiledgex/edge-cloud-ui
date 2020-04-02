import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { fields } from '../../../services/model/format';
import { keys, showUsers, deleteUser } from '../../../services/model/users';

class OrganizationList extends React.Component {
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

    /**
  * Customized data block
  **/

    roleMark = (data, isDetailView) => {
        if (isDetailView) {
            return data
        }
        else {
            let role = data[fields.role]
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

    componentWillMount() {
        this.customizedData()
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