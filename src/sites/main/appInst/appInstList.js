import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';
import { fields, getUserRole, isAdmin } from '../../../services/model/format';
import { changePowerState, deleteAppInst, keys, multiDataRequest, refreshAppInst, showAppInsts, streamAppInst } from '../../../services/model/appInstance';
import { showApps } from '../../../services/model/app';
import { showCloudletInfoData } from '../../../services/model/cloudletInfo';
import AppInstReg from './appInstReg';
import * as constant from '../../../constant';
import * as shared from '../../../services/model/shared';
import TerminalViewer from '../../../container/TerminalViewer';
import { Dialog } from '@material-ui/core';
import { HELP_APP_INST_LIST } from "../../../tutorial";
import { ACTION_DELETE, ACTION_UPDATE, ACTION_POWER_OFF, ACTION_POWER_ON, ACTION_TERMINAL, ACTION_UPGRADE, ACTION_REFRESH, ACTION_REBOOT } from '../../../constant/actions';
import * as serverData from '../../../services/model/serverData'
import { idFormatter, labelFormatter, uiFormatter } from '../../../helper/formatter';
import { isOperator } from '../../../reducers/organizationInfo';
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

    onPrePowerState = (type, action, data) => {
        let powerState = labelFormatter.powerState(data[fields.powerState])
        let visible = data[fields.deployment] === constant.DEPLOYMENT_TYPE_VM
        if (visible) {
            if (action.id === ACTION_POWER_ON) {
                visible = powerState === constant.POWER_STATE_POWER_OFF
            }
            else if (action.id === ACTION_POWER_OFF) {
                visible = powerState === constant.POWER_STATE_POWER_ON
            }
            else if (action.id === ACTION_REBOOT) {
                visible = powerState === constant.POWER_STATE_POWER_ON
            }
        }
        return visible
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
        let powerState = idFormatter.powerState(constant.UNKNOWN)
        switch (action.id) {
            case ACTION_POWER_ON:
                powerState = idFormatter.powerState(constant.POWER_STATE_POWER_ON)
                break;
            case ACTION_POWER_OFF:
                powerState = idFormatter.powerState(constant.POWER_STATE_POWER_OFF)
                break;
            case ACTION_REBOOT:
                powerState = idFormatter.powerState(constant.POWER_STATE_REBOOT)
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
            { id: ACTION_POWER_ON, label: 'Power On', visibility: this.onPrePowerState, onClick: this.onPowerState, warning: 'power on' },
            { id: ACTION_POWER_OFF, label: 'Power Off', visibility: this.onPrePowerState, onClick: this.onPowerState, warning: 'power off' },
            { id: ACTION_REBOOT, label: 'Reboot', visibility: this.onPrePowerState, onClick: this.onPowerState, warning: 'reboot' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Upgrade', onClick: refreshAppInst, icon: 'upgrade', warning: 'upgrade all the selected app instances', multiStepperHeader: this.multiStepperHeader, type: 'Edit' },
            { label: 'Delete', onClick: deleteAppInst, icon: 'delete', ws: true, warning: 'delete all the selected app instances', multiStepperHeader: this.multiStepperHeader, type: 'Edit' },
            { label: 'Refresh', onClick: refreshAppInst, icon: 'refresh', warning: 'refresh all the selected app instances', multiStepperHeader: this.multiStepperHeader },
        ]
    }

    showPowerState = (data, isDetail) => {
        if (isDetail) {
            return labelFormatter.powerState(data[fields.powerState])
        }
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === fields.state) {
            return shared.showProgress(data, isDetail)
        }
        else if (key.field === fields.region) {
            return uiFormatter.appInstRegion(key, data, isDetail)
        }
        else if (key.field === fields.powerState) {
            return this.showPowerState(data, isDetail)
        }
        else if (key.field === fields.healthCheck) {
            return uiFormatter.healthCheck(key, data, isDetail)
        }
        else if (key.field === fields.trusted) {
            return labelFormatter.showYesNo(data[key.field])
        }
    }

    requestInfo = () => {
        return ({
            id: constant.PAGE_APP_INSTANCES,
            headerLabel: 'App Instances',
            nameField: fields.appName,
            requestType: isOperator(this) ? [showAppInsts, showCloudletInfoData] : [showAppInsts, showApps, showCloudletInfoData],
            streamType: streamAppInst,
            isRegion: true,
            isMap: true,
            selection: true,
            sortBy: [fields.region, fields.appName],
            keys: this.keys,
            onAdd:  isOperator(this) ?  null : this.onAdd,
            viewMode: HELP_APP_INST_LIST,
            grouping: true,
            formatData: this.dataFormatter
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <div style={{ width: '100%', height: '100%' }}>
                    <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu}/>
                    <Dialog disableBackdropClick={true} disableEscapeKeyDown={true} fullScreen open={this.state.openTerminal} onClose={() => { this.setState({ openTerminal: false }) }}>
                        <TerminalViewer data={this.state.terminalData} onClose={() => {
                            this.setState({ openTerminal: false })
                        }} />
                    </Dialog>
                </div>
        )
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }
};

const mapStateToProps = (state) => {
    return {
        organizationInfo : state.organizationInfo.data
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AppInstList));
