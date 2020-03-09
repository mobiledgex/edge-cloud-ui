import _ from 'lodash'
import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as serverData from '../../../services/model/serverData';
import AutoProvPolicyReg from './autoProvPolicyReg'
import { keys, showAutoProvPolicies } from '../../../services/model/autoProvisioningPolicy';
import { fields } from '../../../services/model/format';

class AutoProvPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.action = '';
        this.data = {}
    }

    onAddCloudlet = (data) => {
        this.data = data;
        this.action = 'Add'
        this.props.childPage(<AutoProvPolicyReg data={this.data} action={this.action} childPage={this.props.childPage}></AutoProvPolicyReg>)
    }

    onDeleteCloudlet = (data) => {
        this.data = data;
        this.action = 'Delete'
        this.props.childPage(<AutoProvPolicyReg data={this.data} action={this.action} childPage={this.props.childPage}></AutoProvPolicyReg>)
    }

    onDelete = async (data) => {
        let valid = false;
        let AutoProvPolicy = {
            key: { developer: data[fields.organizationName], name: data[fields.autoPolicyName] }
        }

        let requestData = {
            region: data[fields.region],
            AutoProvPolicy: AutoProvPolicy
        }
        let mcRequest = await serverData.deleteAutoProvPolicy(this, requestData)
        if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
            this.props.handleAlertInfo('success', `Auto Provisioning Policy ${data[fields.autoPolicyName]} deleted successfully`)
            valid = true;
        }
        return valid;
    }

    actionMenu = () => {
        return [{ label: 'Add Cloudlet', onClick: this.onAddCloudlet },
        { label: 'Delete Cloudlet', onClick: this.onDeleteCloudlet },
        { label: 'Delete', onClick: this.onDelete }]
    }

    requestInfo = () => {
        return ({
            headerLabel:'Auto Provisioning Policy',
            requestType: [showAutoProvPolicies],
            isRegion: true,
            sortBy: [fields.region, fields.autoPolicyName],
            keys:keys
        })
    }

    render() {
        return (
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
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AutoProvPolicy));
