import React from 'react';
import MexListView from '../../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';

import { fields } from '../../../../services/model/format';
import { showAlertReceiver, deleteAlertReceiver, showAlertReceiverKeys  } from '../../../../services/model/alerts';
import Reg from './AlertReceiverReg';
import * as constant from '../../../../constant'

class AlertList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.action = '';
        this.data = {};
        this.keys = showAlertReceiverKeys();
    }

    onRegClose = (isEdited) => {
        this.setState({ currentView: null })
    }

    onAdd = (action, data) => {
        this.setState({ currentView: <Reg data={data} isUpdate={action ? true : false} onClose={this.onRegClose}/> });
    }

    onCloudletManifest = (action, data) => {
        this.setState({ currentView: <Reg data={data} isManifest={true} onClose={this.onRegClose}/> });
    }

    onCloudletManifestVisible = (data) => {
        return data[fields.infraApiAccess] === constant.INFRA_API_ACCESS_RESTRICTED
    }

    actionMenu = () => {
        return [
            { label: 'Update', onClick: this.onAdd, type: 'Edit' },
            { label: 'Delete', onClick: deleteAlertReceiver, type: 'Edit' }
        ]
    }

    requestInfo = () => {
        return ({
            id: 'Alerts',
            headerLabel: 'Alerts',
            nameField: fields.alertname,
            requestType: [showAlertReceiver],
            sortBy: [fields.alertname],
            keys: this.keys,
            onAdd: this.onAdd,
            grouping: false
        })
    }

    componentDidMount() {
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()}/>
        )
    }
};

export default withRouter(connect(null, null)(AlertList));
