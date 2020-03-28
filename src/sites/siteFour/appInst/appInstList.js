import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';

import { fields } from '../../../services/model/format';
import { keys, showAppInsts, deleteAppInst, streamAppInst, multiDataRequest } from '../../../services/model/appInstance';
import { showApps } from '../../../services/model/app';
import AppInstReg from './appInstReg';
import * as constant from '../../../services/model/shared';
import TerminalViewer from '../../../container/TerminalViewer';
import * as serviceMC from '../../../services/serviceMC';
import { Modal } from 'semantic-ui-react';
import { Dialog } from '@material-ui/core';

class AppInstList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null,
            terminalData: [],
            openTerminal: false
        }
        this.action = '';
        this.data = {};
        this.keys = Object.assign([], keys);
    }

    onRegClose = (isEdited) => {
        this.setState({ currentView: null })
    }

    onAdd = () => {
        this.setState({ currentView: <AppInstReg onClose={this.onRegClose} /> })
    }

    onTerminalVisible = (data) => {
        let visible = false;
        let runtimeInfo = data[fields.runtimeInfo]
        if (runtimeInfo) {
            let containers = runtimeInfo[fields.container_ids]
            if (containers && containers.length > 0) {
                visible = true
            }
        }
        return visible
    }

    onTerminal = (action, data) => {
        if (data.DeploymentType === 'vm') {
            let execrequest =
            {
                app_inst_key:
                {
                    app_key:
                    {
                        developer_key: { name: data[fields.organizationName] },
                        name: data[fields.appName],
                        version: data[fields.version]
                    },
                    cluster_inst_key:
                    {
                        cluster_key: { name: data[fields.clusterName] },
                        cloudlet_key: { organization: data[fields.operatorName], name: data[fields.cloudletName] }
                    }
                }
            }

            let requestedData = {
                execrequest: execrequest,
                region: data[fields.region]
            }

            let store = JSON.parse(localStorage.PROJECT_INIT);
            let token = store ? store.userToken : 'null';
            let requestData = {
                token: token,
                method: serviceMC.getEP().SHOW_CONSOLE,
                data: requestedData
            }
            this.props.handleLoadingSpinner(true)
            serviceMC.sendWSRequest(requestData, this.setRemote)
        }
        else if (data[fields.runtimeInfo][fields.container_ids]) {
            this.setState({ terminalData: data, openTerminal: true })
        }
    }

    actionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteAppInst, ws: true },
            { label: 'Terminal', visible: this.onTerminalVisible, onClick: this.onTerminal }
        ]
    }

    requestInfo = () => {
        return ({
            id: 'AppInsts',
            headerLabel: 'App Instances',
            nameField: fields.appName,
            requestType: [showAppInsts, showApps],
            streamType: streamAppInst,
            isRegion: true,
            isMap: true,
            sortBy: [fields.region, fields.appName],
            keys: this.keys,
            onAdd: this.onAdd
        })
    }

    /**
   * Customized data block
   **/

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.state) {
                key.customizedData = constant.showProgress
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
                <div style={{ width: '100%' }}>
                    <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={multiDataRequest} />
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
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AppInstList));