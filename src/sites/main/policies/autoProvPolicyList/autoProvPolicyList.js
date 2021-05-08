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
import DataView from '../../../../container/DataView';
import { HELP_POLICY_LIST } from "../../../../tutorial";
import { ACTION_DELETE, ACTION_UPDATE } from '../../../../constant/actions';
class AutoProvPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this._isMounted = false
        this.keys = keys()
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    resetView = () => {
        this.updateState({ currentView: null })
    }

    onRegClose = (isEdited) => {
        this.resetView()
    }

    onAdd = (action, data) => {
        this.updateState({ currentView: <AutoProvPolicyReg data={data} isUpdate={action ? true : false} onClose={this.onRegClose} /> });
    }

    onAddCloudlet = (action, data) => {
        this.updateState({ currentView: <AutoProvPolicyReg data={data} action={constant.ADD_CLOUDLET} onClose={this.onRegClose} /> });
    }

    onDeleteCloudlet = (action, data) => {
        this.updateState({ currentView: <AutoProvPolicyReg data={data} action={constant.DELETE_CLOUDLET} onClose={this.onRegClose} /> });
    }

    onDeleteCloudletVisible = (data) => {
        return data[fields.cloudletCount] > 0
    }

    onDelete = (data, success, errorInfo) => {
        if (!success, errorInfo) {
            if (errorInfo.message === 'Policy in use by App') {
                let appInfo = ''
                let length = 0
                if (data[fields.apps]) {
                    let apps = data[fields.apps]
                    length = apps.length
                    apps.map((app, i) => {
                        appInfo = appInfo + app
                        if (i !== length - 1) {
                            appInfo = appInfo + ', '
                        }
                    })
                }
                this.props.handleAlertInfo('error', `Policy in use by App${length > 1 ? 's' : ''} ${appInfo}`)
            }
        }
    }

    actionMenu = () => {
        return [
            { id: ACTION_UPDATE, label: 'Update', onClick: this.onAdd, type: 'Edit' },
            { label: 'Add Cloudlet', onClick: this.onAddCloudlet, type: 'Edit' },
            { label: 'Delete Cloudlet', visible: this.onDeleteCloudletVisible, onClick: this.onDeleteCloudlet, type: 'Edit' },
            { id: ACTION_DELETE, label: 'Delete', onClick: deleteAutoProvPolicy, onFinish: this.onDelete, type: 'Edit' }]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteAutoProvPolicy, icon: 'delete', warning: 'delete all the selected policies', type: 'Edit' },
        ]
    }

    requestInfo = () => {
        return ({
            id: constant.PAGE_AUTO_PROVISIONING_POLICY,
            headerLabel: 'Auto Provisioning Policy',
            nameField: fields.autoPolicyName,
            requestType: [showAutoProvPolicies, showApps],
            isRegion: true,
            sortBy: [fields.region, fields.autoPolicyName],
            selection: true,
            keys: this.keys,
            onAdd: this.onAdd,
            viewMode: HELP_POLICY_LIST
        })
    }

    render() {
        const {currentView } = this.state
        return (
            <DataView id={PAGE_AUTO_PROVISIONING_POLICY} resetView={this.resetView} actionMenu={this.actionMenu} currentView={currentView} requestInfo={this.requestInfo} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu} />
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AutoProvPolicy));