import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
//redux
import { connect } from 'react-redux';

import { fields, getOrganization, isAdmin } from '../../../services/model/format';
import { keys, showCloudlets, deleteCloudlet, streamCloudlet, multiDataRequest } from '../../../services/model/cloudlet';
import { showCloudletInfos } from '../../../services/model/cloudletInfo';
import ClouldletReg from './cloudletReg';
import {validateRole, operatorRoles, INFRA_API_ACCESS_RESTRICTED, showYesNo, COLOR_RED, COLOR_GREEN} from '../../../constant'
import * as shared from '../../../services/model/shared';
import { Button } from 'semantic-ui-react';
import { Icon, Popup } from 'semantic-ui-react';
import { HELP_CLOUDLET_LIST } from "../../../tutorial";
import { getCloudletManifest, revokeAccessKey } from '../../../services/model/cloudlet';
import MexMessageDialog from '../../../hoc/dialog/mexWarningDialog';
import SecurityOutlinedIcon from '@material-ui/icons/SecurityOutlined';
class CloudletList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null,
            dialogMessageInfo:{}
        }
        this._isMounted = false;
        this.action = '';
        this.data = {};
        this.keys = keys();
        this.multiStepperHeader = [{ label: 'Cloudlet', field: fields.cloudletName }, { label: 'Operator', field: fields.operatorName }]
    }

    onRegClose = (isEdited) => {
        if (this._isMounted) {
            this.setState({ currentView: null })
        }
    }

    onAdd = (action, data) => {
        if (this._isMounted) {
            this.setState({ currentView: <ClouldletReg data={data} isUpdate={action ? true : false} onClose={this.onRegClose} /> });
        }
    }

    onCloudletManifest = async (action, data) => {
        let cloudletManifest = await getCloudletManifest(this, data)
        if (cloudletManifest) {
            if (cloudletManifest.response && cloudletManifest.response.data) {
                if (this._isMounted) {
                    this.setState({ currentView: <ClouldletReg data={data} manifestData={cloudletManifest.response.data} onClose={this.onRegClose} /> });
                }
            }
            else if (cloudletManifest.error && cloudletManifest.error.response) {
                let response = cloudletManifest.error.response
                if (response.data && response.data.message) {
                    let message = response.data.message
                    if (message === 'Cloudlet has access key registered, please revoke the current access key first so a new one can be generated for the manifest') {
                        let message= 'Cloudlet has access key registered, click on yes if you would like to revoke the current access key, so a new one can be generated for the manifest'
                        this.setState({ dialogMessageInfo: { message, data:data } })
                    }
                }

            }
        }

    }

    onCloudletManifestVisible = (data) => {
        return data[fields.infraApiAccess] === INFRA_API_ACCESS_RESTRICTED
    }

    onEditDisable = (data) => {
        let disable = isAdmin() || data[fields.operatorName] === getOrganization()
        return !disable
    }

    actionMenu = () => {
        return [
            { label: 'Update', disable:this.onEditDisable, onClick: this.onAdd, type: 'Edit' },
            { label: 'Delete', disable:this.onEditDisable, onClick: deleteCloudlet, ws: true, type: 'Edit' },
            { label: 'Show Manifest', visible: this.onCloudletManifestVisible, onClick: this.onCloudletManifest }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteCloudlet, icon: 'delete', ws: true, warning: 'delete all the selected cloudlets', multiStepperHeader: this.multiStepperHeader, type: 'Edit' },
        ]
    }

    customStream = (data) => {
        return data[fields.infraApiAccess] === 'Restricted' && data[fields.cloudletStatus] !== 2
    }


    requestInfo = () => {
        return ({
            id: 'Cloudlets',
            headerLabel: 'Cloudlets',
            nameField: fields.cloudletName,
            requestType: [showCloudlets, showCloudletInfos],
            streamType: streamCloudlet,
            customStream: this.customStream,
            isRegion: true,
            isMap: true,
            selection: true,
            sortBy: [fields.region, fields.cloudletName],
            keys: this.keys,
            onAdd: validateRole(operatorRoles) ? this.onAdd : undefined,
            viewMode: HELP_CLOUDLET_LIST,
            grouping: true
        })
    }

    /**
    * Customized data block
    **/
    getCloudletInfoState = (data, isDetailView) => {
        let id = isDetailView ? data : data[fields.cloudletStatus]
        let state = 'Not Present';
        let color = 'red'
        switch (id) {
            case 0:
                state = 'Unknown'
                break;
            case 1:
                state = 'Error'
                break;
            case 2:
                state = 'Online'
                color = 'green'
                break;
            case 3:
                state = 'Offline'
                break;
            case 4:
                state = 'Not Present'
                break;
            case 5:
                state = 'Init'
                break;
            case 6:
                state = 'Upgrade'
                break;
            case 999:
                state = 'Under Maintenance'
                color = 'yellow'
                break;
            default:
                state = 'Not Present'
                break;
        }

        return (
            isDetailView ? state :
                <Button basic size='mini' color={color} compact style={{ width: 100 }}>
                    <label>{state}</label>
                </Button>
        )
    }

    showProgress = (data, isDetailView) => {
        let progressRender = null
        if (!isDetailView && this.customStream(data)) {
            progressRender = <Popup content='View Progress' trigger={<Icon className={'progressIndicator'} loading color='green' name='circle notch' />} />
        }
        else {
            progressRender = shared.showProgress(data, isDetailView)
        }
        return progressRender
    }

    customizedTrusted = (data, isDetailView)=>{
        if(isDetailView)
        {
            return showYesNo(data, isDetailView)
        }
        else 
        {
            let color = data[fields.trusted] ? COLOR_GREEN : COLOR_RED
            return <SecurityOutlinedIcon style={{color:color}}/>
        }
    }

    customizedData = () => {
        for (let key of this.keys) {
            if (key.field === fields.cloudletStatus) {
                key.customizedData = this.getCloudletInfoState
            }
            else if (key.field === fields.state) {
                key.customizedData = this.showProgress
            }
            else if (key.field === fields.trusted) {
                key.customizedData = this.customizedTrusted
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

    onDialogClose = async (valid, data)=>{
        this.setState({ dialogMessageInfo: {} })
        if(valid)
        {
            let mc = await revokeAccessKey(this, data)
            if(mc && mc.response && mc.response.status === 200)
            {
                this.onCloudletManifest(undefined, data)
            }
        }
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <React.Fragment>
                    <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu} />
                    <MexMessageDialog messageInfo={this.state.dialogMessageInfo} onClick={this.onDialogClose}/>
                </React.Fragment>
        )
    }

    componentWillUnmount() {
        this._isMounted = false
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) }
    };
};

export default withRouter(connect(null, mapDispatchProps)(CloudletList));
