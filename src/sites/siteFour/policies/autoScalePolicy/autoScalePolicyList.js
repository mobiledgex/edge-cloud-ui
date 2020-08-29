import React from 'react';
import MexListView from '../../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';

import AutoScalePolicyReg from './autoScalePolicyReg'
import { keys, fields, showAutoScalePolicies, deleteAutoScalePolicy } from '../../../../services/model/autoScalePolicy';
import {HELP_POLICY_LIST} from "../../../../tutorial";
class AutoScalePolicy extends React.Component {
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
        this.setState({ currentView: <AutoScalePolicyReg onClose={this.onRegClose} /> });
    }

    onUpdate = (action, data) => {
        this.setState({ currentView: <AutoScalePolicyReg data={data} action='Update' onClose={this.onRegClose}/> })
    }

    actionMenu = () => {
        return [
            { label: 'Update', onClick: this.onUpdate, type:'Edit' },
            { label: 'Delete', onClick: deleteAutoScalePolicy, type:'Edit' }
        ]
    }

    requestInfo = () => {
        return ({
            headerLabel: 'Auto Scale Policy',
            requestType: [showAutoScalePolicies],
            isRegion: true,
            nameField: fields.autoScalePolicyName,
            sortBy: [fields.region, fields.autoScalePolicyName],
            keys: this.keys,
            onAdd: this.onAdd,
            viewMode : HELP_POLICY_LIST
        })
    }


    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} />
        )
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(null, mapDispatchProps)(AutoScalePolicy));
