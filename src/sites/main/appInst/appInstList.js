import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';
import { fields, getUserRole, isAdmin } from '../../../services/model/format';
import { changePowerState, deleteAppInst, keys, multiDataRequest, refreshAppInst, showAppInsts, streamAppInst } from '../../../services/model/appInstance';
import { showApps } from '../../../services/model/app';
import { showCloudletInfos } from '../../../services/model/cloudletInfo';
import AppInstReg from './appInstReg';
import * as constant from '../../../constant';
import * as shared from '../../../services/model/shared';
import TerminalViewer from '../../../container/TerminalViewer';
import { Dialog, Tooltip } from '@material-ui/core';
import { Icon, Popup } from 'semantic-ui-react';
import { HELP_APP_INST_LIST } from "../../../tutorial";
import { customizedTrusted } from '../../../constantUI';
import { ACTION_DELETE, ACTION_UPDATE, ACTION_POWER_OFF, ACTION_POWER_ON, ACTION_TERMINAL, ACTION_UPGRADE, ACTION_REFRESH, ACTION_REBOOT } from '../../../container/Actions';
import * as serverData from '../../../services/model/serverData'
class AppInstList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null,
            terminalData: [],
            openTerminal: false,
            stepsArray: []
        }
        this._isMounted = false;
        this.action = '';
        this.data = {};
        this.keys = keys();
        this.multiStepperHeader = [{ label: 'App', field: fields.appName }, { label: 'Cloudlet', field: fields.cloudletName }, { label: 'Operator', field: fields.operatorName }, { label: 'Cluster', field: fields.clusterName }]
    }

    onRegClose = (isEdited) => {
        if (this._isMounted) {
            this.setState({ currentView: null })
        }
    }

    onAdd = (action, data) => {
        if (this._isMounted) {
            this.setState({ currentView: <AppInstReg isUpdate={action ? true : false} data={data} onClose={this.onRegClose} /> })
        }

    }

    onTerminalVisible = (data) => {
        let visible = false;
        if (data) {
            if (data[fields.deployment] === constant.DEPLOYMENT_TYPE_VM) {
                visible = getUserRole() !== constant.DEVELOPER_VIEWER
            }
            else {
                let runtimeInfo = data[fields.runtimeInfo]
                if (runtimeInfo) {
                    let containers = runtimeInfo[fields.container_ids]
                    if (containers && containers.length > 0) {
                        visible = true
                    }
                }
            }
        }
        return visible
    }

    onTerminal = (action, data) => {
        if (this._isMounted) {
            this.setState({ terminalData: data, openTerminal: true })
        }
    }

    onPowerStateVisible = (data) => {
        return data[fields.deployment] === constant.DEPLOYMENT_TYPE_VM
    }

    onUpgradeVisible = (data) => {
        return data[fields.updateAvailable]
    }

    onUpdateVisible = (data) => {
        return data[fields.deployment] === constant.DEPLOYMENT_TYPE_KUBERNETES || data[fields.deployment] === constant.DEPLOYMENT_TYPE_HELM
    }

    getDeleteActionMessage = (action, data) => {
        if (data[fields.cloudletStatus] !== constant.CLOUDLET_STATUS_READY && isAdmin()) {
            return `Cloudlet status is not online, do you still want to proceed with ${data[fields.appName]} App Instance deletion?`
        }
    }

    getDialogNote = (data) => {
        if (data[fields.clusterName]) {
            return data[fields.clusterName].includes('autocluster') || data[fields.deployment] === constant.DEPLOYMENT_TYPE_VM ? '' :
                'Note: Deleting this Application Instance will not automatically delete the Cluster Instance associated with this Application Instance. You must go in and manually delete the Cluster Instance'
        }
    }

    onPowerState = (action, data, callback) => {
        let powerState = constant.PowerState(constant.POWER_STATE_POWER_STATE_UNKNOWN)

        switch (action.id) {
            case ACTION_POWER_ON:
                powerState = constant.PowerState(constant.POWER_STATE_POWER_ON)
                break;
            case ACTION_POWER_OFF:
                powerState = constant.PowerState(constant.POWER_STATE_POWER_OFF)
                break;
            case ACTION_REBOOT:
                powerState = constant.PowerState(constant.POWER_STATE_REBOOT)
                break;
        }
        data[fields.powerState] = powerState
        this.props.handleLoadingSpinner(true)
        serverData.sendWSRequest(this, changePowerState(data), callback, data)

    }

    actionMenu = () => {
        return [
            { id: ACTION_UPDATE, label: 'Update', visible: this.onUpdateVisible, onClick: this.onAdd, type: 'Edit' },
            { id: ACTION_UPGRADE, label: 'Upgrade', visible: this.onUpgradeVisible, onClick: refreshAppInst, multiStepperHeader: this.multiStepperHeader, type: 'Edit', warning: 'upgrade' },
            { id: ACTION_REFRESH, label: 'Refresh', onClick: refreshAppInst, multiStepperHeader: this.multiStepperHeader, warning: 'refresh' },
            { id: ACTION_DELETE, label: 'Delete', onClick: deleteAppInst, ws: true, dialogMessage: this.getDeleteActionMessage, multiStepperHeader: this.multiStepperHeader, type: 'Edit', dialogNote: this.getDialogNote },
            { id: ACTION_TERMINAL, label: 'Terminal', visible: this.onTerminalVisible, onClick: this.onTerminal },
            { id: ACTION_POWER_ON, label: 'Power On', visible: this.onPowerStateVisible, onClick: this.onPowerState, warning: 'power on' },
            { id: ACTION_POWER_OFF, label: 'Power Off', visible: this.onPowerStateVisible, onClick: this.onPowerState, warning: 'power off' },
            { id: ACTION_REBOOT, label: 'Reboot', visible: this.onPowerStateVisible, onClick: this.onPowerState, warning: 'reboot' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Upgrade', onClick: refreshAppInst, icon: 'upgrade', warning: 'upgrade all the selected app instances', multiStepperHeader: this.multiStepperHeader, type: 'Edit' },
            { label: 'Delete', onClick: deleteAppInst, icon: 'delete', ws: true, warning: 'delete all the selected app instances', multiStepperHeader: this.multiStepperHeader, type: 'Edit' },
            { label: 'Refresh', onClick: refreshAppInst, icon: 'refresh', warning: 'refresh all the selected app instances', multiStepperHeader: this.multiStepperHeader },
        ]
    }

    requestInfo = () => {
        return ({
            id: 'AppInsts',
            headerLabel: 'App Instances',
            nameField: fields.appName,
            requestType: [showAppInsts, showApps, showCloudletInfos],
            streamType: streamAppInst,
            isRegion: true,
            isMap: true,
            selection: true,
            sortBy: [fields.region, fields.appName],
            keys: this.keys,
            onAdd: this.onAdd,
            viewMode: HELP_APP_INST_LIST,
            grouping: true
        })
    }

    /**
     * Customized data block
     **/

    getUpdate = (data, isDetailView) => {
        let value = data[fields.region]
        return (
            isDetailView ? value :
                data[fields.updateAvailable] ?
                    <Tooltip title={<div><strong style={{ fontSize: 13 }}>{`Current Version: ${data[fields.revision]}`}</strong><br /><br /><strong style={{ fontSize: 13 }}>{`Available Version: ${data[fields.appRevision]}`}</strong></div>}>
                        <label><Icon color={'orange'} name={'arrow alternate circle up outline'} />&nbsp;{value}</label>
                    </Tooltip> :
                    <label>{value}</label>
        )
    }

    showPowerState = (data, isDetailView) => {
        if (isDetailView) {
            return constant.PowerState(data[fields.powerState])
        }
    }

    showHealthCheck = (data, isDetailView) => {
        let healthCheck = data[fields.healthCheck]
        if (isDetailView) {
            return constant.healthCheck(healthCheck)
        }
        else {
            let icon = null;
            switch (healthCheck) {
                case 3:
                    icon = <Popup content={constant.healthCheck(healthCheck)} trigger={<Icon className="progressIndicator" name='check' color='green' />} />
                    break;
                default:
                    icon = <Popup content={constant.healthCheck(healthCheck)} trigger={<Icon className="progressIndicator" name='close' color='red' />} />
            }
            return (
                icon
            )
        }
    }

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.state) {
                key.customizedData = shared.showProgress
            }
            else if (key.field === fields.region) {
                key.customizedData = this.getUpdate
            }
            else if (key.field === fields.powerState) {
                key.customizedData = this.showPowerState
            }
            else if (key.field === fields.healthCheck) {
                key.customizedData = this.showHealthCheck
            }
            else if (key.field === fields.trusted) {
                key.customizedData = customizedTrusted
            }
        }
    }

    /**
     * Customized data block
     * ** */

    componentDidMount() {
        this._isMounted = true
        this.customizedData()
    }

    componentWillUnmount() {
        this._isMounted = false
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <div style={{ width: '100%', height: '100%' }}>
                    <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu} />
                    <Dialog disableBackdropClick={true} disableEscapeKeyDown={true} fullScreen open={this.state.openTerminal} onClose={() => { this.setState({ openTerminal: false }) }}>
                        <TerminalViewer data={this.state.terminalData} onClose={() => {
                            this.setState({ openTerminal: false })
                        }} />
                    </Dialog>
                </div>
        )
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(null, mapDispatchProps)(AppInstList));
