import React from 'react';
import DataView from '../../../container/DataView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';
import { fields } from '../../../services/model/format';
import { keys, showConfirmation, showInvitation, multiDataRequest, deleteConfirmation, createConfirmation } from '../../../services/modules/poolAccess';
import { perpetual } from '../../../helper/constant';
import { labelFormatter } from '../../../helper/formatter';
import { service } from '../../../services';

class PoolAccessList extends React.Component {
    constructor(props) {
        super(props);
        this._isMounted = false
        this.keys = keys();
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    onPrePoolAccess = (type, action, data) => {
        let isRemove = data[fields.confirm]
        if (type === perpetual.ACTION_LABEL) {
            return isRemove ? 'Withdraw' : 'Accept'
        }
        else if (type === perpetual.ACTION_WARNING) {
            return `${isRemove ? 'withdraw invitation for' : 'accept invitation to'} cloudlet pool`
        }
    }

    onPoolAccess = async (action, data, callback) => {
        let isRemove = data[fields.confirm]
        let request = deleteConfirmation
        if (!isRemove) {
            data[fields.decision] = action.id === perpetual.ACTION_POOL_ACCESS_DEVELOPER_REJECT ? 'reject' : 'accept'
            request = createConfirmation
        }
        let mc = await service.authSyncRequest(this, request(data))
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
            { id: perpetual.ACTION_POOL_ACCESS_DEVELOPER, label: this.onPrePoolAccess, warning: this.onPrePoolAccess, onClick: this.onPoolAccess },
            { id: perpetual.ACTION_POOL_ACCESS_DEVELOPER_REJECT, label: 'Reject', visible: this.onRejectVisible, warning: 'reject invitation to cloudlet pool', onClick: this.onPoolAccess },
        ]
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === fields.decision) {
            return labelFormatter.decision(data[key.field])
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_POOL_ACCESS,
            headerLabel: 'Cloudlet Pools',
            nameField: fields.poolName,
            requestType: [showConfirmation, showInvitation],
            sortBy: [fields.poolName],
            isRegion: true,
            keys: this.keys,
            formatData: this.dataFormatter
        })
    }

    render() {
        return (
            <DataView id={perpetual.PAGE_POOL_ACCESS} actionMenu={this.actionMenu} requestInfo={this.requestInfo} multiDataRequest={multiDataRequest} />
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