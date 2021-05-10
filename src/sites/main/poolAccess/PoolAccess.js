import React from 'react';
import DataView from '../../../container/DataView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';
import * as constant from '../../../constant';
import { fields } from '../../../services/model/format';
import * as serverData from '../../../services/model/serverData'
import { keys, showConfirmation, showInvitation, multiDataRequest, deleteConfirmation, createConfirmation } from '../../../services/model/privateCloudletAccess';
import { ACTION_LABEL, ACTION_POOL_ACCESS_DEVELOPER, ACTION_POOL_ACCESS_DEVELOPER_REJECT, ACTION_WARNING } from '../../../constant/actions'
import { labelFormatter } from '../../../helper/formatter';

class PoolAccessList extends React.Component {
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

    onPrePoolAccess = (type, action, data) => {
        let isRemove = data[fields.confirm]
        if (type === ACTION_LABEL) {
            return isRemove ? 'Withdraw' : 'Accept'
        }
        else if (type === ACTION_WARNING) {
            return `${isRemove ? 'withdraw invitation for' : 'accept invitation to'} cloudlet pool`
        }
    }

    onPoolAccess = async (action, data, callback) => {
        let isRemove = data[fields.confirm]
        let request = deleteConfirmation
        if (!isRemove) {
            data[fields.decision] = action.id === ACTION_POOL_ACCESS_DEVELOPER_REJECT ? 'reject' : 'accept'
            request = createConfirmation
        }
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
            { id: ACTION_POOL_ACCESS_DEVELOPER_REJECT, label: 'Reject', visible: this.onRejectVisible, warning: 'reject invitation to cloudlet pool', onClick: this.onPoolAccess },
        ]
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === fields.decision) {
            return labelFormatter.decision(data[key.field])
        }
    }

    requestInfo = () => {
        return ({
            id: constant.PAGE_POOL_ACCESS,
            headerLabel: 'Cloudlet Pools',
            nameField: fields.poolName,
            requestType: [showConfirmation, showInvitation],
            sortBy: [fields.poolName],
            isRegion: true,
            selection: true,
            keys: this.keys,
            formatData: this.dataFormatter
        })
    }

    render() {
        const {currentView} = this.state
        return (
            <DataView id={constant.PAGE_POOL_ACCESS} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} multiDataRequest={multiDataRequest} />
        )
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(PoolAccessList));