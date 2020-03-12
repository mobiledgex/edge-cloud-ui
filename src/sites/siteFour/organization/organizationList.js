import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { fields } from '../../../services/model/format';
import { keys, showOrganizations, deleteOrganization, additionalDetail } from '../../../services/model/organization';
import OrganizationReg from './siteFour_page_createOrga';
import PopAddUserViewer from '../../../container/popAddUserViewer';
import * as serverData from '../../../services/model/serverData'
import { Button } from '@material-ui/core';

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

    onAdd = () => {
        this.setState({ currentView: <OrganizationReg /> })
    }

    /**Action menu block */

    gotoUrl(site, subPath) {
        let mainPath = site;
        this.props.history.push({
            pathname: site,
            search: subPath
        });
        this.props.history.location.search = subPath;
        this.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })
    }

    onAudit = (data) => {
        let orgName = data[fields.organizationName];
        this.gotoUrl('/site4', 'pg=audits&org=' + orgName)
    }

    onAddUser = (data) => {
        this.data = data;
        this.setState({ openAddUserView: true })
    }

    onCloseAddUser = () => {
        this.data = null;
        this.setState({ openAddUserView: false })
    }

    actionMenu = () => {
        return [
            { label: 'Audit', onClick: this.onAudit },
            { label: 'Add User', onClick: this.onAddUser },
            { label: 'Delete', onClick: deleteOrganization }
        ]
    }

    /*Action menu block*/

    /*
        Manage Block
    **/

    getManage = (data) => {
        return (
            <Button size='mini' compact style={{ width: 100, backgroundColor: localStorage.selectOrg === data[fields.organizationName] ? '#559901' : 'grey', color: 'white' }}>
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
        return ({
            id: 'Organizations',
            headerLabel: 'Organizations',
            nameField: fields.organizationName,
            requestType: [showOrganizations],
            sortBy: [fields.organizationName],
            keys: this.keys,
            onAdd: this.onAdd,
            additionalDetail: additionalDetail
        })
    }

    getUserRoles = async (key) => {
        let isAdmin = false;
        let userRoles = await serverData.getUserRoles(this)
        if (userRoles) {

            this.props.handleRoleInfo(userRoles)
            for(let i=0;i<userRoles.length;i++)
            {
                let userRole = userRoles[i]
                if (userRole.role.indexOf('Admin') > -1) {
                    this.props.handleUserRole(userRole.role);
                    localStorage.setItem('selectRole', userRole.role)
                    isAdmin = true
                    break;
                }
            }
        }
        if(!isAdmin)
        {
            key.visible = true;
            key.customizedData = this.getManage;
        }
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

    componentWillMount() {
        this.customizedData()
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <div style={{ width: '100%' }}>
                    <PopAddUserViewer data={this.data} open={this.state.openAddUserView}
                        close={this.onCloseAddUser}></PopAddUserViewer>
                    <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} onClick={this.onListViewClick} />
                </div>
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