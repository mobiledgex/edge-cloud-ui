import React from 'react';
import MexListView from '../../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';

import PrivacyPolicyReg from './privacyPolicyReg'
import { keys, fields, showPrivacyPolicies, deletePrivacyPolicy, multiDataRequest } from '../../../../services/model/privacyPolicy';
import { showApps } from '../../../../services/model/app';
import {HELP_POLICY_LIST} from "../../../../tutorial";
class PrivacyPolicy extends React.Component {
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
        this.setState({ currentView: <PrivacyPolicyReg onClose={this.onRegClose} /> });
    }

    onUpdate = (action, data) => {
        this.setState({ currentView: <PrivacyPolicyReg data={data} action='Update' onClose={this.onRegClose}/> })
    }

    onDelete = (data, success, errorInfo)=>
    {
        if(!success, errorInfo)
        {
            if (errorInfo.message === 'Policy in use by App') {
                this.props.handleAlertInfo('error', `Policy in use by App${data[fields.apps].length > 1 ? 's' : ''} ${data[fields.apps]}`)
            }
        }
    }

    actionMenu = () => {
        return [
            { label: 'Update', onClick: this.onUpdate, type:'Edit' },
            { label: 'Delete', onClick: deletePrivacyPolicy, onFinish: this.onDelete, type:'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deletePrivacyPolicy, icon: 'delete', warning: 'delete all the selected policies', type: 'Edit' },
        ]
    }

    requestInfo = () => {
        return ({
            headerLabel: 'Privacy Policy',
            requestType: [showPrivacyPolicies, showApps],
            isRegion: true,
            nameField: fields.privacyPolicyName,
            sortBy: [fields.region, fields.privacyPolicyName],
            keys: this.keys,
            selection:true,
            onAdd: this.onAdd,
            viewMode : HELP_POLICY_LIST
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

export default withRouter(connect(null, mapDispatchProps)(PrivacyPolicy));