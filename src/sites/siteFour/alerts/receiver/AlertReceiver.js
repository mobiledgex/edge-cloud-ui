import React from 'react';
import MexListView from '../../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';

import { fields } from '../../../../services/model/format';
import { showAlertReceiver, deleteAlertReceiver, showAlertReceiverKeys } from '../../../../services/model/alerts';
import Reg from './AlertReceiverReg';
import * as constant from '../../../../constant'
import { Chip } from '@material-ui/core';
import WarningOutlineIcon from '@material-ui/icons/WarningOutlined';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { Icon } from 'semantic-ui-react';
import { HELP_ALERTS } from '../../../../tutorial';
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
        this.setState({ currentView: <Reg data={data} isUpdate={action ? true : false} onClose={this.onRegClose} /> });
    }

    onCloudletManifest = (action, data) => {
        this.setState({ currentView: <Reg data={data} isManifest={true} onClose={this.onRegClose} /> });
    }

    onCloudletManifestVisible = (data) => {
        return data[fields.infraApiAccess] === constant.INFRA_API_ACCESS_RESTRICTED
    }

    actionMenu = () => {
        return [
            // { label: 'Update', onClick: this.onAdd, type: 'Edit' },
            { label: 'Delete', onClick: deleteAlertReceiver, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteAlertReceiver, icon: 'delete', warning: 'delete all the selected alerts', type: 'Edit' },
        ]
    }

    requestInfo = () => {
        return ({
            id: 'Alerts',
            headerLabel: 'Alert Receivers',
            nameField: fields.alertname,
            requestType: [showAlertReceiver],
            sortBy: [fields.alertname],
            selection:true,
            viewMode: HELP_ALERTS,
            keys: this.keys,
            onAdd: this.onAdd,
            grouping: false
        })
    }

    renderSeverity = (data, isDetailView) => {
        let id = isDetailView ? data : data[fields.severity]
        let color = '#ff4444'
        let label = 'Error'
        let icon = <ErrorOutlineIcon />
        switch (id) {
            case 'info':
                label = 'Info'
                color = '#03A9F4'
                icon = <ErrorOutlineIcon />
                break;
            case 'error':
                label = 'Error'
                color = '#EF5350'
                icon = <InfoOutlineIcon />
                break;
            case 'warning':
                label = 'Warning'
                color = '#ffa034'
                icon = <WarningOutlineIcon />
                break;
        }

        return (
            isDetailView ? label :
            <Chip
                size="small" 
                icon={icon}
                label={label}
                style={{ backgroundColor: color, width:80}}
            />
        )
    }

    renderType = (data, isDetailView) => {
        let id = isDetailView ? data : data[fields.receiverAddress]
        let ids = id.split('#OS#')
        let color = '#ff4444'
        let label = ids[1]
        let icon = 'mail'
        switch (ids[0]) {
            case 'slack':
                color = '#33b5e5'
                icon = 'slack'
                break;
        }

        return (
            isDetailView ? ids[1] :
            <div><Icon name={icon} size="large"/>&nbsp;{label}</div>
        )
    }

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.severity) {
                key.customizedData = this.renderSeverity
            }
            else if (key.field === fields.receiverAddress) {
                key.customizedData = this.renderType
            }
        }
    }


    componentDidMount() {
        this.customizedData()
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} groupActionMenu={this.groupActionMenu}/>
        )
    }
};

export default withRouter(connect(null, null)(AlertList));
