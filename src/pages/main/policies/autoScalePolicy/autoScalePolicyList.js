import React from 'react';
import DataView from '../../../../container/DataView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';

import AutoScalePolicyReg from './autoScalePolicyReg'
import { keys, fields, showAutoScalePolicies, deleteAutoScalePolicy } from '../../../../services/model/autoScalePolicy';
import {HELP_SCALE_POLICY} from "../../../../tutorial";
import { ACTION_DELETE, ACTION_UPDATE } from '../../../../constant/actions';
import { PAGE_AUTO_SCALE_POLICY } from '../../../../constant';
class AutoScalePolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this._isMounted = false
        this.keys = keys();
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    resetView = () => {
        this.updateState({ currentView: null })
    }

    onRegClose = (isEdited)=>
    {
        this.resetView()
    }

    onAdd = () => {
        this.updateState({ currentView: <AutoScalePolicyReg onClose={this.onRegClose} /> });
    }

    onUpdate = (action, data) => {
        this.updateState({ currentView: <AutoScalePolicyReg data={data} action='Update' onClose={this.onRegClose} /> })
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
            id:PAGE_AUTO_SCALE_POLICY,
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
        const {currentView } = this.state
        return (
            <DataView id={PAGE_AUTO_SCALE_POLICY} resetView={this.resetView} actionMenu={this.actionMenu} currentView={currentView} requestInfo={this.requestInfo} groupActionMenu={this.groupActionMenu} />
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
        organizationInfo: state.organizationInfo.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AutoScalePolicy));