import React from 'react';
import MexListView from '../../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';

import AutoScalePolicyReg from './autoScalePolicyReg'
import { keys, fields, showAutoScalePolicies, deleteAutoScalePolicy } from '../../../../services/model/autoScalePolicy';
import {HELP_SCALE_POLICY} from "../../../../tutorial";
import { ACTION_DELETE, ACTION_UPDATE } from '../../../../container/Actions';
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
        this.setState({ currentView: <AutoScalePolicyReg data={data} action='Update' onClose={this.onRegClose} /> })
    }

    actionMenu = () => {
        return [
            { id: ACTION_UPDATE, label: 'Update', onClick: this.onUpdate, type: 'Edit' },
            { id: ACTION_DELETE, label: 'Delete', onClick: deleteAutoScalePolicy, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteAutoScalePolicy, icon: 'delete', warning: 'delete all the selected policies', type: 'Edit' },
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
            selection:true,
            viewMode : HELP_SCALE_POLICY
        })
    }


    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} groupActionMenu={this.groupActionMenu}/>
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
