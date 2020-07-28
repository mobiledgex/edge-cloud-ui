import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
//redux
import * as actions from '../../../../actions';
//reg
import AutoProvPolicyReg from './autoProvPolicyReg'
//model
import { fields } from '../../../../services/model/format';
import * as constant from '../../../../constant';
import { keys, showAutoProvPolicies, deleteAutoProvPolicy, multiDataRequest } from '../../../../services/model/autoProvisioningPolicy';
import { showApps } from '../../../../services/model/app';
//list
import MexListView from '../../../../container/mex_table/MexListView';
import { PolicyTutor } from "../../../../tutorial";


const policySteps = PolicyTutor();

class AutoProvPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
    }

    onRegClose = (isEdited) => {
        this.setState({ currentView: null })
    }

    onAdd = (action, data) => {
        this.setState({ currentView: <AutoProvPolicyReg data={data} isUpdate={action ? true : false} onClose={this.onRegClose} /> });
    }

    onAddCloudlet = (action, data) => {
        this.setState({ currentView: <AutoProvPolicyReg data={data} action={constant.ADD_CLOUDLET} onClose={this.onRegClose} /> });
    }

    onDeleteCloudlet = (action, data) => {
        this.setState({ currentView: <AutoProvPolicyReg data={data} action={constant.DELETE_CLOUDLET} onClose={this.onRegClose} /> });
    }

    onDeleteCloudletVisible = (data) => {
        return data[fields.cloudletCount] > 0
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
            { label: 'Update', onClick: this.onAdd, type:'Edit' },
            { label: 'Add Cloudlet', onClick: this.onAddCloudlet, type:'Edit' },
            { label: 'Delete Cloudlet', visible: this.onDeleteCloudletVisible, onClick: this.onDeleteCloudlet, type:'Edit' },
            { label: 'Delete', onClick: deleteAutoProvPolicy, onFinish: this.onDelete, type:'Edit' }]
    }

    requestInfo = () => {
        return ({
            headerLabel: 'Auto Provisioning Policy',
            nameField: fields.autoPolicyName,
            requestType: [showAutoProvPolicies, showApps],
            isRegion: true,
            sortBy: [fields.region, fields.autoPolicyName],
            keys: keys,
            onAdd: this.onAdd,
            viewMode: policySteps.stepsPolicy
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
    return {}
};
const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AutoProvPolicy));
