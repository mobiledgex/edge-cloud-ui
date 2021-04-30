import React from 'react';
import MexListView from '../../../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';

import { fields } from '../../../../../services/model/format';
import { showAlertReceiver, deleteAlertReceiver, showAlertReceiverKeys } from '../../../../../services/model/alerts';
import Reg from './AlertReceiverReg';
import { Chip } from '@material-ui/core';
import WarningOutlineIcon from '@material-ui/icons/WarningOutlined';
import InfoOutlineIcon from '@material-ui/icons/InfoOutlined';
import ErrorOutlineIcon from '@material-ui/icons/ErrorOutline';
import { Icon } from 'semantic-ui-react';
import { HELP_ALERTS } from '../../../../../tutorial';
import { ACTION_DELETE } from '../../../../../constant/actions';
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

    actionMenu = () => {
        return [
            // { label: 'Update', onClick: this.onAdd, type: 'Edit' },
            { id: ACTION_DELETE, label: 'Delete', onClick: deleteAlertReceiver, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteAlertReceiver, icon: 'delete', warning: 'delete all the selected alerts', type: 'Edit' },
        ]
    }

    renderSeverity = (data, isDetailView) => {
        let id = data[fields.severity]
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
                    style={{ backgroundColor: color, width: 80 }}
                />
        )
    }

    renderType = (data, isDetailView) => {
        let id = data[fields.receiverAddress]
        let ids = id.split('#OS#')
        let label = ids[1]
        let icon = undefined
        switch (ids[0]) {
            case 'slack':
                icon = 'slack'
                break;
            case 'email':
                icon = 'mail'
                break;
        }

        return (
            isDetailView ? ids[1] :
                <div>{icon ? <Icon name={icon} size="large" /> : null}&nbsp;{label}</div>
        )
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === fields.severity) {
            return this.renderSeverity(data, isDetail)
        }
        else if (key.field === fields.receiverAddress) {
            return this.renderType(data, isDetail)
        }
    }

    requestInfo = () => {
        return ({
            id: 'Alerts',
            headerLabel: 'Alert Receivers',
            nameField: fields.alertname,
            requestType: [showAlertReceiver],
            sortBy: [fields.alertname],
            selection: true,
            viewMode: HELP_ALERTS,
            keys: this.keys,
            onAdd: this.onAdd,
            viewerEdit:true,
            grouping: false,
            formatData:this.dataFormatter
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} groupActionMenu={this.groupActionMenu} />
        )
    }
};

export default withRouter(connect(null, null)(AlertList));
