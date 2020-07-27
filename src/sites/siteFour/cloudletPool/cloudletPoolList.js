import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';
import * as constant from '../../../constant';
import { fields } from '../../../services/model/format';
import { keys, showCloudletPools, deleteCloudletPool, multiDataRequest } from '../../../services/model/cloudletPool';
import { showCloudletPoolMembers } from '../../../services/model/cloudletPoolMember';
import { showCloudletLinkOrg } from '../../../services/model/cloudletLinkOrg';
import CloudletPoolReg from './cloudletPoolReg';
import {CloudletPoolTutor} from "../../../tutorial";

const cloudletPoolSteps = CloudletPoolTutor();

class ClouldetPoolList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.keys = Object.assign([], keys);
    }

    onAdd = () => {
        this.setState({ currentView: <CloudletPoolReg onClose={() => this.setState({ currentView: null })} /> });

    }

    /**Action menu block */
    onActionClick = (action, data) => {
        this.setState({ currentView: <CloudletPoolReg data={data} action={action.id} onClose={() => this.setState({ currentView: null })} /> });

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
            { id: constant.ADD_CLOUDLET, label: 'Add Cloudlet', onClick: this.onActionClick, type:'Edit' },
            { id: constant.DELETE_CLOUDLET, label: 'Delete Cloudlet', onClick: this.onActionClick, type:'Edit' },
            { id: constant.ADD_ORGANIZATION, label: 'Link Organization', onClick: this.onActionClick, type:'Edit' },
            { id: constant.DELETE_ORGANIZATION, label: 'Unlink Organization', onClick: this.onActionClick, type:'Edit' },
            { id: constant.DELETE, label: 'Delete', onClickInterept:this.showDeleteCloudletPool, onClick: deleteCloudletPool, type:'Edit' }
        ]
    }

    /*Action menu block*/

    requestInfo = () => {
        return ({
            id: 'CloudletPools',
            headerLabel: 'Cloudlet Pools',
            nameField: fields.poolName,
            requestType: [showCloudletPools, showCloudletPoolMembers, showCloudletLinkOrg],
            isRegion: true,
            sortBy: [fields.poolName],
            keys: this.keys,
            onAdd: this.onAdd,
            viewMode : cloudletPoolSteps.stepsCloudletPool
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={multiDataRequest} />
        )
    }
};

const mapStateToProps = (state) => {
    return {

    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ClouldetPoolList));
