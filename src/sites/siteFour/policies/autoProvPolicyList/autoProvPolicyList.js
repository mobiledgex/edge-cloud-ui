import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
//redux
import * as actions from '../../../../actions';
//reg
import AutoProvPolicyReg from './autoProvPolicyReg'
//model
import { fields } from '../../../../services/model/format';
import { keys, showAutoProvPolicies, deleteAutoProvPolicy } from '../../../../services/model/autoProvisioningPolicy';
//list
import MexListView from '../../../../container/MexListView';

class AutoProvPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
    }

    onRegClose = (isEdited)=>
    {
        this.setState({ currentView: null })
    }

    onAdd = () => {
        this.setState({ currentView: <AutoProvPolicyReg onClose={this.onRegClose}/> });
        this.props.handleViewMode( true )
    }

    onAddCloudlet = (action, data) => {
        this.setState({ currentView: <AutoProvPolicyReg data={data} action={'Add'} onClose={this.onRegClose}/> });
        this.props.handleViewMode( true )
    }

    onDeleteCloudlet = (action, data) => {
        this.setState({ currentView: <AutoProvPolicyReg data={data} action={'Delete'} onClose={this.onRegClose}/> });
        this.props.handleViewMode( true )
    }

    actionMenu = () => {
        return [{ label: 'Add Cloudlet', onClick: this.onAddCloudlet },
        { label: 'Delete Cloudlet', onClick: this.onDeleteCloudlet },
        { label: 'Delete', onClick: deleteAutoProvPolicy }]
    }

    requestInfo = () => {
        return ({
            headerLabel: 'Auto Provisioning Policy',
            nameField: fields.autoPolicyName,
            requestType: [showAutoProvPolicies],
            isRegion: true,
            sortBy: [fields.region, fields.autoPolicyName],
            keys: keys,
            onAdd: this.onAdd
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
    return {}
};
const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AutoProvPolicy));
