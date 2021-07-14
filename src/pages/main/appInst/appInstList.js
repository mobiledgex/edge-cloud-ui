import React from 'react';
import DataView from '../../../container/DataView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';
import { fields } from '../../../services/model/format';
import { changePowerState, deleteAppInst, keys, multiDataRequest, refreshAppInst, showAppInsts, streamAppInst, requestAppInstLatency } from '../../../services/modules/appInst';
import { showApps } from '../../../services/modules/app';
import { showCloudletInfoData } from '../../../services/modules/cloudletInfo';
import AppInstReg from './appInstReg';
import * as shared from '../../../services/model/shared';
import TerminalViewer from '../../../container/TerminalViewer';
import { Dialog } from '@material-ui/core';
import { HELP_APP_INST_LIST } from "../../../tutorial";
import { perpetual } from '../../../helper/constant';
import * as serverData from '../../../services/model/serverData'
import { idFormatter, labelFormatter, uiFormatter } from '../../../helper/formatter';
import { redux_org } from '../../../helper/reduxData';
import { responseValid } from '../../../services/service';

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
        this.multiStepperHeader = [{ label: 'App', field: fields.appName }, { label: 'Cloudlet', field: fields.cloudletName }, { label: 'Operator', field: fields.operatorName }, { label: 'Cluster', field: fields.clusterName }]
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

    onTerminalVisible = (data) => {
        let visible = false;
        if (data) {
            if (data[fields.deployment] === perpetual.DEPLOYMENT_TYPE_VM) {
                visible = redux_org.role(this) !== perpetual.DEVELOPER_VIEWER
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
        this.updateState({ terminalData: data, openTerminal: true })
    }

    onPrePowerState = (type, action, data) => {
        let powerState = labelFormatter.powerState(data[fields.powerState])
        let visible = data[fields.deployment] === perpetual.DEPLOYMENT_TYPE_VM
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

    onUpgradeVisible = (data) => {
        return data[fields.updateAvailable]
    }

    onUpdateVisible = (data) => {
        return data[fields.deployment] === perpetual.DEPLOYMENT_TYPE_KUBERNETES || data[fields.deployment] === perpetual.DEPLOYMENT_TYPE_HELM
    }

    getDeleteActionMessage = (action, data) => {
        if (data[fields.cloudletStatus] !== perpetual.CLOUDLET_STATUS_READY && redux_org.isAdmin(this)) {
            return `Cloudlet status is not online, do you still want to proceed with ${data[fields.appName]} App Instance deletion?`
        }
    }

    getDialogNote = (data) => {
        if (data[fields.clusterName]) {
            return data[fields.clusterName].includes('autocluster') || data[fields.deployment] === perpetual.DEPLOYMENT_TYPE_VM ? '' :
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
        data[fields.powerState] = powerState
        this.props.handleLoadingSpinner(true)
        serverData.sendWSRequest(this, changePowerState(data), callback, data)
    }

    refreshNote = (data)=>{
        return 'Note: This will restart all the containers'
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_UPDATE, label: 'Update', visible: this.onUpdateVisible, onClick: this.onAdd, type: 'Edit' },
            { id: perpetual.ACTION_UPGRADE, label: 'Upgrade', visible: this.onUpgradeVisible, onClick: refreshAppInst, multiStepperHeader: this.multiStepperHeader, type: 'Edit', warning: 'upgrade' },
            { id: perpetual.ACTION_REFRESH, label: 'Refresh', onClick: refreshAppInst, multiStepperHeader: this.multiStepperHeader, warning: 'refresh', dialogNote: this.refreshNote },
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteAppInst, ws: true, dialogMessage: this.getDeleteActionMessage, multiStepperHeader: this.multiStepperHeader, type: 'Edit', dialogNote: this.getDialogNote },
            { id: perpetual.ACTION_TERMINAL, label: 'Terminal', visible: this.onTerminalVisible, onClick: this.onTerminal },
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
            id: perpetual.PAGE_APP_INSTANCES,
            headerLabel: 'App Instances',
            nameField: fields.appName,
            requestType: redux_org.isOperator(this) ? [showAppInsts, showCloudletInfoData] : [showAppInsts, showApps, showCloudletInfoData],
            streamType: streamAppInst,
            isRegion: true,
            isMap: true,
            selection: !redux_org.isOperator(this),
            sortBy: [fields.region, fields.appName],
            keys: this.keys,
            onAdd:  redux_org.isOperator(this) ?  null : this.onAdd,
            viewMode: HELP_APP_INST_LIST,
            grouping: true,
            groupingAction:true,
            formatData: this.dataFormatter
        })
    }

    render() {
        const { currentView } = this.state
        return (
            <React.Fragment>
                <DataView id={perpetual.PAGE_APP_INSTANCES} resetView={this.resetView} actionMenu={this.actionMenu} currentView={currentView} requestInfo={this.requestInfo} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu}/>
                <Dialog disableBackdropClick={true} disableEscapeKeyDown={true} fullScreen open={this.state.openTerminal} onClose={() => { this.updateState({ openTerminal: false }) }}>
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
