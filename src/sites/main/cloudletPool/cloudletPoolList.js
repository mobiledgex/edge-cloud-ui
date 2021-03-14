import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';
import * as constant from '../../../constant';
import { fields } from '../../../services/model/format';
import { keys, showCloudletPools, deleteCloudletPool, multiDataRequest } from '../../../services/model/cloudletPool';
import { showCloudletLinkOrg } from '../../../services/model/cloudletLinkOrg';
import CloudletPoolReg from './cloudletPoolReg';
import {HELP_CLOUDLET_POOL_LIST} from "../../../tutorial";
class ClouldetPoolList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.keys = keys();
    }

    onAdd = () => {
        this.setState({ currentView: <CloudletPoolReg onClose={() => this.setState({ currentView: null })} /> });
    }

    /**Action menu block */
    onActionClick = (action, data) => {
        this.setState({ currentView: <CloudletPoolReg data={data} isUpdate={action ? true : false} action={action.id} onClose={() => this.setState({ currentView: null })} /> });
    }

    showDeleteCloudletPool = (action, data) => {
        let valid = true
        if(data[fields.organizationCount] !== 0)
        {
            this.props.handleAlertInfo('error', 'Please unlink all organizations before deleting cloudlet pool');
            valid = false
        }
        return valid;
    }

    actionMenu = () => {
        return [
            { id: constant.ADD_CLOUDLET, label: 'Update', onClick: this.onActionClick, type:'Edit' },
            { id: constant.ADD_ORGANIZATION, label: 'Link Organization', onClick: this.onActionClick, type:'Edit' },
            { id: constant.DELETE_ORGANIZATION, label: 'Unlink Organization', onClick: this.onActionClick, type:'Edit' },
            { id: constant.DELETE, label: 'Delete', onClickInterept:this.showDeleteCloudletPool, onClick: deleteCloudletPool, type:'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteCloudletPool, icon: 'delete', warning: 'delete all the selected cloudlet pool', type: 'Edit' },
        ]
    }

    /*Action menu block*/

    requestInfo = () => {
        return ({
            id: 'CloudletPools',
            headerLabel: 'Cloudlet Pools',
            nameField: fields.poolName,
            requestType: [showCloudletPools, showCloudletLinkOrg],
            isRegion: true,
            sortBy: [fields.poolName],
            selection:true,
            keys: this.keys,
            onAdd: this.onAdd,
            viewMode : HELP_CLOUDLET_POOL_LIST
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu}/>
        )
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(ClouldetPoolList));