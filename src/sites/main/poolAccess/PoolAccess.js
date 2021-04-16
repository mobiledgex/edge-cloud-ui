import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';
import * as constant from '../../../constant';
import { fields } from '../../../services/model/format';
import * as serverData from '../../../services/model/serverData'
import { keys, showConfirmation, showInvitation, multiDataRequest, deleteConfirmation, createConfirmation } from '../../../services/model/privateCloudletAccess';
import { Icon } from 'semantic-ui-react';
import { ACTION_LABEL, ACTION_POOL_ACCESS_DEVELOPER, ACTION_WARNING, ACTION_POOL_ACCESS_DEVELOPER_REJECT } from '../../../container/Actions';

class ClouldetPoolList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.keys = keys();
    }

    onPrePoolAccess = (type, action, data) => {
        let isRemove = data[fields.confirm]
        if (type === ACTION_LABEL) {
            return isRemove ? 'Delete' : 'Confirm'
        }
        else if (type === ACTION_WARNING) {
            return `${isRemove ? 'delete confirmation for' : 'accept invitation to'} cloudlet pool`
        }
    }

    onPoolAccess = async (action, data, callback) => {
        let isRemove = data[fields.confirm]
        data[fields.decision] = !isRemove && action.id === ACTION_POOL_ACCESS_DEVELOPER_REJECT ? 'reject' : 'accept'
        let request = isRemove ? deleteConfirmation : createConfirmation
        let mc = await serverData.sendRequest(this, request(data))
        if (mc && mc.response && mc.response.status === 200) {
            this.props.handleAlertInfo('success', `${isRemove ? 'Access Removed' : 'Access Granted'}`)
            callback()
        }
    }

    onRejectVisible = (data) => {
        let isRemove = data[fields.confirm]
        return !isRemove
    }

    actionMenu = () => {
        return [
            { id: ACTION_POOL_ACCESS_DEVELOPER, label: this.onPrePoolAccess, warning: this.onPrePoolAccess, onClick: this.onPoolAccess },
            { id: ACTION_POOL_ACCESS_DEVELOPER_REJECT, label: 'Reject', visible: this.onRejectVisible, warning:'reject invitation to cloudlet pool', onClick: this.onPoolAccess },
        ]
    }

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
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={multiDataRequest} />
        )
    }

    access = (data, isDetailView, decision) => {
        if (isDetailView) {
            return constant.showYesNo(data, isDetailView)
        }
        else {
            return <Icon style={{color:`${data ? decision === 'accept' ? constant.COLOR_GREEN : constant.COLOR_RED : 'grey'}`}} name={`${data ? decision === 'accept' ? 'check' : 'close' : 'question'}`} />
        }
    }

    formatInvite = (data, isDetailView) => {
        return this.access(data[fields.invite], isDetailView, 'accept')
    }

    formatConfirm = (data, isDetailView) => {
        return this.access(data[fields.confirm], isDetailView, data[fields.decision])
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