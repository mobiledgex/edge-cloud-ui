import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';

import { fields, isAdmin } from '../../../services/model/format';
import { keys, showAppInsts, deleteAppInst, streamAppInst, refreshAppInst, multiDataRequest } from '../../../services/model/appInstance';
import { showApps } from '../../../services/model/app';
import { showCloudletInfos } from '../../../services/model/cloudletInfo';
import AppInstReg from './appInstReg';
import * as constant from '../../../constant';
import * as shared from '../../../services/model/shared';
import TerminalViewer from '../../../container/TerminalViewer';
import { Dialog } from '@material-ui/core';
import { Icon } from 'semantic-ui-react';

class AppInstList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null,
            terminalData: [],
            openTerminal: false,
            stepsArray: []
        }
        this.action = '';
        this.data = {};
        this.keys = keys();
    }

    onRegClose = (isEdited) => {
        this.setState({ currentView: null })
    }

    onAdd = () => {
        this.setState({ currentView: <AppInstReg onClose={this.onRegClose} /> })
    }

    onTerminalVisible = (data) => {
        let visible = false;
        if (data) {
            if (data[fields.deployment] === constant.DEPLOYMENT_TYPE_VM) {
                visible = true
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
        this.setState({ terminalData: data, openTerminal: true })
    }

    onUpdateVisible = (data) => {
        return data[fields.updateAvailable]
    }

    getDeleteActionMessage = (action, data) => {
        if (data[fields.cloudletStatus] !== constant.CLOUDLET_STATUS_READY && isAdmin()) {
            return `Cloudlet status is not online, due you still want to proceed with ${data[fields.appName]} App Instance deletion?`
        }
    }

    actionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteAppInst, ws: true, dialogMessage: this.getDeleteActionMessage, },
            { label: 'Upgrade', visible: this.onUpdateVisible, onClick: refreshAppInst },
            { label: 'Terminal', visible: this.onTerminalVisible, onClick: this.onTerminal }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Upgrade', onClick: refreshAppInst, icon: 'fa fa-arrow-circle-up', warning: 'upgrade all the selected App Instances' },
            { label: 'Delete', onClick: deleteAppInst, icon: 'fa fa-trash', warning: 'delete all the selected App Instances' }
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
            onAdd: this.onAdd
        })
    }

    /**
   * Customized data block
   **/

    getUpdate = (data, isDetailView) => {
        return (
            isDetailView ? data :
                data[fields.updateAvailable] ?
                    <label><Icon color={'orange'} name={'arrow alternate circle up outline'} />&nbsp;{data[fields.region]}  </label> :
                    <label>{data[fields.region]}</label>
        )
    }

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.state) {
                key.customizedData = shared.showProgress
            }
            if (key.field === fields.region) {
                key.customizedData = this.getUpdate
            }
        }
    }

    /**
    * Customized data block
    * ** */

    UNSAFE_componentWillMount() {
        this.customizedData()
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

const mapStateToProps = (state) => {
    return {}
};
const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AppInstList));
