import React from 'react'
import DataView from '../../../../container/DataView';
import { fields } from '../../../../services/model/format';
import * as actions from '../../../../actions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { perpetual } from '../../../../helper/constant';
import { showPartnerFederatorZone, keys, iconKeys } from '../../../../services/modules/partnerZones';
import { deregisterPartnerZone, registerPartnerZone } from '../../../../services/modules/partnerZones/partnerZones';
import { authSyncRequest, multiAuthSyncRequest, responseValid } from '../../../../services/service';
import { uiFormatter } from '../../../../helper/formatter';

class PartnerZones extends React.Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.keys = keys()
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    onPreRegisterZone = (type, action, data) => {
        return action.id === perpetual.ACTION_REGISTER_ZONES ? !data[fields.register] : data[fields.register]
    }

    onRegisterZone = async (action, data, callback) => {
        let request = data[fields.register] ? deregisterPartnerZone : registerPartnerZone
        let mc = await authSyncRequest(this, request(data))
        if (responseValid(mc)) {
            this.props.handleAlertInfo('success', `Partner zone ${data[fields.zoneId]} ${data[fields.register] ? 'de' : ''}registered successfully`)
            callback()
        }
    }

    onAllRegisterZone = async (action, dataList, callback) => {
        let requestList = []
        let request = action.id === perpetual.ACTION_DEREGISTER_ZONES ? deregisterPartnerZone : registerPartnerZone
        dataList.forEach(item => {
            if ((!item[fields.register] && action.id === perpetual.ACTION_REGISTER_ZONES) || (item[fields.register] && action.id === perpetual.ACTION_DEREGISTER_ZONES)) {
                requestList.push(request(item))
            }
        })
        if (requestList.length > 0) {
            let mcList = await multiAuthSyncRequest(this, requestList)
            if(mcList && mcList.length > 0)
            {
                let valid = mcList.every(mc=>{
                    return responseValid(mc)
                })
                if(valid)
                {
                    this.props.handleAlertInfo('success', `Partner zones ${action.id === perpetual.ACTION_DEREGISTER_ZONES ? 'de' : ''}registered successfully`)
                    callback()
                }
            }
        }
        else {
            this.props.handleAlertInfo('error', `Nothing to ${action.id === perpetual.ACTION_DEREGISTER_ZONES ? 'de' : ''}register`)
        }
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_REGISTER_ZONES, label: 'Register', onClick: this.onRegisterZone, visibility: this.onPreRegisterZone, warning: 'register' },
            { id: perpetual.ACTION_DEREGISTER_ZONES, label: 'Deregister', onClick: this.onRegisterZone, visibility: this.onPreRegisterZone, warning: 'deregister' }
        ]
    }

    groupActionMenu = () => {
        return [
            { id: perpetual.ACTION_REGISTER_ZONES, label: 'Register', onClick: this.onAllRegisterZone, icon: 'bookmark_added', warning: 'register all the selected zones' },
            { id: perpetual.ACTION_DEREGISTER_ZONES, label: 'Deregister', onClick: this.onAllRegisterZone, icon: 'bookmark_border', warning: 'register all the selected zones' },
        ]
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === fields.register) {
            return uiFormatter.renderYesNo(key, data, isDetail)
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_GUEST_ZONES,
            headerLabel: 'Guest Zones',
            nameField: fields.zoneId,
            requestType: [showPartnerFederatorZone],
            sortBy: [fields.federationName],
            selection: false,
            keys: this.keys,
            onAdd: undefined,
            isMap: true,
            grouping: false,
            selection: true,
            formatData: this.dataFormatter,
            iconKeys: iconKeys()
        })
    }

    render() {
        return (
            <React.Fragment>
                <DataView id={perpetual.PAGE_GUEST_ZONES} actionMenu={this.actionMenu} groupActionMenu={this.groupActionMenu} requestInfo={this.requestInfo} />
            </React.Fragment>
        )
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(PartnerZones));