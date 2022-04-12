/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import DataView from '../../../../../hoc/datagrid/DataView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';

import { localFields } from '../../../../../services/fields';
import { showAlertReceiver, deleteAlertReceiver, showAlertReceiverKeys } from '../../../../../services/modules/alerts';

import Reg from './Reg';
import { Icon } from 'semantic-ui-react';
import { HELP_ALERTS } from '../../../../../tutorial';
import { perpetual } from '../../../../../helper/constant';
import { uiFormatter } from '../../../../../helper/formatter';
class AlertList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this._isMounted = false
        this.action = '';
        this.data = {};
        this.keys = showAlertReceiverKeys();
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
        this.updateState({ currentView: <Reg data={data} isUpdate={action ? true : false} onClose={this.onRegClose} /> });
    }

    actionMenu = () => {
        return [
            // { label: 'Update', onClick: this.onAdd, type: 'Edit' },
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteAlertReceiver, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteAlertReceiver, icon: 'delete', warning: 'delete all the selected alerts', type: 'Edit' },
        ]
    }

    renderType = (data, isDetailView) => {
        let id = data[localFields.receiverAddress]
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
        if (key.field === localFields.severity) {
            return uiFormatter.RenderSeverity(data, isDetail)
        }
        else if (key.field === localFields.receiverAddress) {
            return this.renderType(data, isDetail)
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_ALERTS,
            headerLabel: 'Alert Receivers',
            nameField: localFields.alertname,
            requestType: [showAlertReceiver],
            sortBy: [localFields.alertname],
            selection: true,
            viewMode: HELP_ALERTS,
            keys: this.keys,
            onAdd: this.onAdd,
            viewerEdit: true,
            grouping: false,
            formatData: this.dataFormatter
        })
    }

    render() {
        const {currentView} = this.state
        return (
            <DataView id={perpetual.PAGE_ALERTS} resetView={this.resetView} actionMenu={this.actionMenu} currentView={currentView}requestInfo={this.requestInfo} groupActionMenu={this.groupActionMenu} />
        )
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }
};

export default withRouter(connect(null, null)(AlertList));
