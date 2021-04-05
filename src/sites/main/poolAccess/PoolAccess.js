import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';
import * as constant from '../../../constant';
import { fields } from '../../../services/model/format';
import { deleteCloudletPool } from '../../../services/model/cloudletPool';
import { sendRequest } from '../monitoring/services/service'
import { keys, showConfirmation, showInvitation, multiDataRequest, deleteConfirmation, createConfirmation } from '../../../services/model/privateCloudletAccess';
import { Icon } from 'semantic-ui-react';

class ClouldetPoolList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.keys = keys();
    }

    onDeleteVisible = (data) => {
        return data[fields.invite] && data[fields.confirm]
    }

    onCreateVisible = (data) => {
        return data[fields.invite] && !data[fields.confirm]
    }

    /**Action menu block */
    actionMenu = () => {
        return [
            { id: constant.ACTION_POOL_ACCESS_GRANT, label: 'Grant Access', visible: this.onCreateVisible, onClick: createConfirmation },
            { id: constant.ACTION_POOL_ACCESS_REMOVE, label: 'Remove Access', visible: this.onDeleteVisible, onClick: deleteConfirmation },
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteCloudletPool, icon: 'delete', warning: 'delete all the selected cloudlet pool', type: 'Edit' },
        ]
    }

    /*Action menu block*/

    requestInfo = () => {
        return ({
            id: constant.PAGE_POOL_ACCESS,
            headerLabel: 'Cloudlet Pools',
            nameField: fields.poolName,
            requestType: [showConfirmation, showInvitation],
            sortBy: [fields.poolName],
            selection: true,
            keys: this.keys
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu} />
        )
    }

    access = (data, isDetailView) => {
        if (isDetailView) {
            return constant.showYesNo(data, isDetailView)
        }
        else {
            return <Icon name={`${data ? 'check' : 'question'}`} />
        }
    }

    formatInvite = (data, isDetailView) => {
        return this.access(data[fields.invite], isDetailView)
    }

    formatConfirm = (data, isDetailView) => {
        return this.access(data[fields.confirm], isDetailView)
    }

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.invite) {
                key.customizedData = this.formatInvite
            }
            else if (key.field === fields.confirm) {
                key.customizedData = this.formatConfirm
            }
        }
    }

    componentDidMount() {
        this.customizedData()
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(ClouldetPoolList));