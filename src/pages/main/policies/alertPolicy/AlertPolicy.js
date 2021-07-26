import React from 'react';
import DataView from '../../../../container/DataView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';

import Reg from './Reg'
import { deleteAlertPolicy, keys, showAlertPolicy } from '../../../../services/modules/alertPolicy';
import { perpetual } from '../../../../helper/constant';
import { fields } from '../../../../services/model/format';
import { uiFormatter } from '../../../../helper/formatter';

class AlertPolicy extends React.Component {
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

    onRegClose = (isEdited) => {
        this.resetView()
    }

    onAdd = () => {
        this.updateState({ currentView: <Reg onClose={this.onRegClose} /> });
    }

    onUpdate = (action, data) => {
        this.updateState({ currentView: <Reg data={data} action='Update' onClose={this.onRegClose} /> })
    }

    onDelete = (data, success, errorInfo) => {
        if (!success, errorInfo) {
            let cloudlets = []
            if (data[fields.cloudlets]) {
                cloudlets = data[fields.cloudlets]
            }
            if (errorInfo.message === 'Policy in use by Cloudlet') {
                this.props.handleAlertInfo('error', `Policy in use by Cloudlet${cloudlets.length > 1 ? 's' : ''} ${cloudlets.map(cloudlet => {
                    return ' ' + cloudlet
                })}`)
            }
        }
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onUpdate, type: 'Edit' },
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteAlertPolicy, onFinish: this.onDelete, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteTrustPolicy, icon: 'delete', warning: 'delete all the selected policies', type: 'Edit' },
        ]
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === fields.severity) {
            return uiFormatter.RenderSeverity(data, isDetail)
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_ALERT_POLICY,
            headerLabel: 'Alert Policy',
            requestType: [showAlertPolicy],
            isRegion: true,
            nameField: fields.alertPolicyName,
            sortBy: [fields.region, fields.alertPolicyName],
            keys: this.keys,
            selection: true,
            onAdd: this.onAdd,
            formatData: this.dataFormatter,
            viewMode: undefined
        })
    }


    render() {
        const { currentView } = this.state
        return (
            <DataView id={perpetual.PAGE_ALERT_POLICY} resetView={this.resetView} actionMenu={this.actionMenu} currentView={currentView} requestInfo={this.requestInfo} groupActionMenu={this.groupActionMenu} />
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AlertPolicy));