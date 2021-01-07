import React from 'react';
import MexListView from '../../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';

import TrustPolicyReg from './trustPolicyReg'
import { keys, fields, showTrustPolicies, deleteTrustPolicy, multiDataRequest } from '../../../../services/model/trustPolicy';
import { showCloudlets } from '../../../../services/model/cloudlet';
import {HELP_TRUST_POLICY} from "../../../../tutorial";
class TrustPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.keys = keys();
    }

    onRegClose = (isEdited)=>
    {
        this.setState({ currentView: null })
    }

    onAdd = () => {
        this.setState({ currentView: <TrustPolicyReg onClose={this.onRegClose} /> });
    }

    onUpdate = (action, data) => {
        this.setState({ currentView: <TrustPolicyReg data={data} action='Update' onClose={this.onRegClose}/> })
    }

    onDelete = (data, success, errorInfo)=>
    {
        if(!success, errorInfo)
        {
            if (errorInfo.message === 'Policy in use by Cloudlet') {
                this.props.handleAlertInfo('error', `Policy in use by Cloudlet${data[fields.cloudlets].length > 1 ? 's' : ''} ${data[fields.cloudlets].map(cloudlet=>{
                    return ' ' + cloudlet
                })}`)
            }
        }
    }

    actionMenu = () => {
        return [
            { label: 'Update', onClick: this.onUpdate, type:'Edit' },
            { label: 'Delete', onClick: deleteTrustPolicy, onFinish: this.onDelete, type:'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteTrustPolicy, icon: 'delete', warning: 'delete all the selected policies', type: 'Edit' },
        ]
    }

    requestInfo = () => {
        return ({
            headerLabel: 'Trust Policy',
            requestType: [showTrustPolicies, showCloudlets],
            isRegion: true,
            nameField: fields.trustPolicyName,
            sortBy: [fields.region, fields.trustPolicyName],
            keys: this.keys,
            selection:true,
            onAdd: this.onAdd,
            viewMode : HELP_TRUST_POLICY
        })
    }


    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()}  multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu}/>
        )
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(null, mapDispatchProps)(TrustPolicy));