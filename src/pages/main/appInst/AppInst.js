import React from 'react';
import DataView from '../../../container/DataView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';
import { localFields } from '../../../services/fields';
import { changePowerState, deleteAppInst, keys, multiDataRequest, refreshAppInst, showAppInsts, streamAppInst } from '../../../services/modules/appInst';
import { showApps } from '../../../services/modules/app';
import { showCloudletInfoData } from '../../../services/modules/cloudletInfo';
import AppInstReg from './Reg';
import { Dialog } from '@material-ui/core';
import { HELP_APP_INST_LIST } from "../../../tutorial";
import { perpetual, role } from '../../../helper/constant';
import { idFormatter, labelFormatter, serverFields, uiFormatter } from '../../../helper/formatter';
import { redux_org } from '../../../helper/reduxData';
import { developerRoles } from '../../../constant';
import TerminalViewer from '../../../hoc/terminal/TerminalViewer';
import { websocket } from '../../../services';

class AppInstList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: undefined,
            terminalData: [],
            openTerminal: false,
            stepsArray: []
        }
        this._isMounted = false;
        this.action = '';
        this.data = {};
        this.keys = keys();
        this.multiStepperHeader = [{ label: 'App', field: localFields.appName }, { label: 'Cloudlet', field: localFields.cloudletName }, { label: 'Operator', field: localFields.operatorName }, { label: 'Cluster', field: localFields.clusterName }]
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
        if (this._isMounted) {
            this.updateState({ currentView: <AppInstReg isUpdate={action ? true : false} data={data} onClose={this.onRegClose} /> })
        }

    }

    onTerminalVisible = (type, action ,data) => {
        let visible = false;
        if (data) {
            if (data[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_VM) {
                visible = redux_org.role(this) !== perpetual.DEVELOPER_VIEWER
            }
            else {
                let runtimeInfo = data[localFields.runtimeInfo]
                if (runtimeInfo) {
                    let containers = runtimeInfo[localFields.container_ids]
                    if (containers && containers.length > 0) {
                        visible = true
                    }
                }
            }
        }
        return visible
    }

    onTerminal = (action, data) => {
        this.updateState({ terminalData: data, openTerminal: true })
    }

    onPrePowerState = (type, action, data) => {
        let powerState = labelFormatter.powerState(data[localFields.powerState])
        let visible = data[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_VM
        if (visible) {
            if (action.id === perpetual.ACTION_POWER_ON) {
                visible = powerState === perpetual.POWER_STATE_POWER_OFF
            }
            else if (action.id === perpetual.ACTION_POWER_OFF) {
                visible = powerState === perpetual.POWER_STATE_POWER_ON
            }
            else if (action.id === perpetual.ACTION_REBOOT) {
                visible = powerState === perpetual.POWER_STATE_POWER_ON
            }
        }
        return visible
    }

    onUpgradeVisible = (type, action ,data) => {
        return data[localFields.updateAvailable]
    }

    onRefreshAction = (type, action, data)=>{
        return data[localFields.deployment] !== perpetual.DEPLOYMENT_TYPE_VM && !data[localFields.updateAvailable]
    }

    onUpdateVisible = (type, action ,data) => {
        return data[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES || data[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_HELM
    }

    getDeleteActionMessage = (action, data) => {
        if (data[localFields.cloudletStatus] !== serverFields.READY && redux_org.isAdmin(this)) {
            return `Cloudlet status is not online, do you still want to proceed with ${data[localFields.appName]} App Instance deletion?`
        }
    }

    getDialogNote = (data) => {
        if (data[localFields.clusterName]) {
            return data[localFields.clusterName].includes('autocluster') || data[localFields.deployment] === perpetual.DEPLOYMENT_TYPE_VM ? '' :
                'Note: Deleting this Application Instance will not automatically delete the Cluster Instance associated with this Application Instance. You must go in and manually delete the Cluster Instance'
        }
    }

    onPowerState = (action, data, callback) => {
        let powerState = idFormatter.powerState(perpetual.UNKNOWN)
        switch (action.id) {
            case perpetual.ACTION_POWER_ON:
                powerState = idFormatter.powerState(perpetual.POWER_STATE_POWER_ON)
                break;
            case perpetual.ACTION_POWER_OFF:
                powerState = idFormatter.powerState(perpetual.POWER_STATE_POWER_OFF)
                break;
            case perpetual.ACTION_REBOOT:
                powerState = idFormatter.powerState(perpetual.POWER_STATE_REBOOT)
                break;
        }
        data[localFields.powerState] = powerState
        this.props.handleLoadingSpinner(true)
        websocket.request(this, changePowerState(data), callback, data)
    }

    refreshNote = (data)=>{
        return 'Note: This will restart all the containers'
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Update', visibility: this.onUpdateVisible, onClick: this.onAdd, type: 'Edit' },
            { id: perpetual.ACTION_UPGRADE, label: 'Upgrade', visibility: this.onUpgradeVisible, onClick: refreshAppInst, multiStepperHeader: this.multiStepperHeader, type: 'Edit', warning: 'upgrade' },
            { id: perpetual.ACTION_REFRESH, label: 'Refresh', onClick: refreshAppInst, visibility: this.onRefreshAction, multiStepperHeader: this.multiStepperHeader, warning: 'refresh', dialogNote: this.refreshNote },
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteAppInst, ws: true, dialogMessage: this.getDeleteActionMessage, multiStepperHeader: this.multiStepperHeader, type: 'Edit', dialogNote: this.getDialogNote },
            { id: perpetual.ACTION_TERMINAL, label: 'Terminal', visibility: this.onTerminalVisible, onClick: this.onTerminal },
            { id: perpetual.ACTION_POWER_ON, label: 'Power On', visibility: this.onPrePowerState, onClick: this.onPowerState, warning: 'power on' },
            { id: perpetual.ACTION_POWER_OFF, label: 'Power Off', visibility: this.onPrePowerState, onClick: this.onPowerState, warning: 'power off' },
            { id: perpetual.ACTION_REBOOT, label: 'Reboot', visibility: this.onPrePowerState, onClick: this.onPowerState, warning: 'reboot' },
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Upgrade', onClick: refreshAppInst, icon: 'upgrade', warning: 'upgrade all the selected app instances', multiStepperHeader: this.multiStepperHeader, type: 'Edit' },
            { label: 'Delete', onClick: deleteAppInst, icon: 'delete', ws: true, warning: 'delete all the selected app instances', multiStepperHeader: this.multiStepperHeader, type: 'Edit' },
            { label: 'Refresh', onClick: refreshAppInst, icon: 'refresh', warning: 'refresh all the selected app instances', multiStepperHeader: this.multiStepperHeader, dialogNote: this.refreshNote },
        ]
    }

    showPowerState = (data, isDetail) => {
        if (isDetail) {
            return labelFormatter.powerState(data[localFields.powerState])
        }
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === localFields.state) {
            return uiFormatter.showProgress(data, isDetail)
        }
        else if (key.field === localFields.region) {
            return uiFormatter.appInstRegion(key, data, isDetail)
        }
        else if (key.field === localFields.powerState) {
            return this.showPowerState(data, isDetail)
        }
        else if (key.field === localFields.healthCheck) {
            return uiFormatter.healthCheck(key, data, isDetail)
        }
        else if (key.field === localFields.trusted) {
            return labelFormatter.showYesNo(data[key.field])
        }
        else if (key.field === localFields.dedicatedIp) {
            return labelFormatter.showYesNo(data[key.field])
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_APP_INSTANCES,
            headerLabel: 'App Instances',
            nameField: localFields.appName,
            requestType: redux_org.isOperator(this) ? [showAppInsts, showCloudletInfoData] : [showAppInsts, showApps, showCloudletInfoData],
            streamType: streamAppInst,
            isRegion: true,
            isMap: true,
            selection: !redux_org.isOperator(this),
            sortBy: [localFields.region, localFields.appName],
            keys: this.keys,
            onAdd:  role.validateRole(developerRoles, this.props.organizationInfo) ? this.onAdd : undefined,
            viewMode: HELP_APP_INST_LIST,
            grouping: true,
            groupingAction:true,
            formatData: this.dataFormatter
        })
    }

    onDialogClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            this.updateState({ openTerminal: false })
        }
    }

    render() {
        const { currentView } = this.state
        return (
            <React.Fragment>
                <DataView id={perpetual.PAGE_APP_INSTANCES} resetView={this.resetView} actionMenu={this.actionMenu} actionRoles={developerRoles} currentView={currentView} requestInfo={this.requestInfo} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu}/>
                <Dialog disableEscapeKeyDown={true} fullScreen open={this.state.openTerminal} onClose={this.onDialogClose}>
                    <TerminalViewer data={this.state.terminalData} onClose={() => {
                        this.updateState({ openTerminal: false })
                    }} />
                </Dialog>
            </React.Fragment>
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
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AppInstList));
