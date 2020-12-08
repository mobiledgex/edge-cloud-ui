import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';

import { fields, getUserRole } from '../../../services/model/format';
import { keys, showCloudlets, deleteCloudlet, streamCloudlet, multiDataRequest } from '../../../services/model/cloudlet';
import { showCloudletInfos } from '../../../services/model/cloudletInfo';
import ClouldletReg from './cloudletReg';
import * as constant from '../../../constant'
import * as shared from '../../../services/model/shared';
import { Button } from 'semantic-ui-react';
import {Icon, Popup} from 'semantic-ui-react';
import {HELP_CLOUDLET_LIST} from "../../../tutorial";

class CloudletList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.action = '';
        this.data = {};
        this.keys = keys();
    }

    onRegClose = (isEdited)=>
    {
        this.setState({ currentView: null })
    }

    onAdd = (action, data) => {
        this.setState({ currentView: <ClouldletReg data={data} isUpdate={action ? true : false} onClose={this.onRegClose}/> });
    }

    onCloudletManifest = (action, data) => {
        this.setState({ currentView: <ClouldletReg data={data} isManifest={true} onClose={this.onRegClose}/> });
    }
    
    onCloudletManifestVisible = (data) =>
    {
        return data[fields.infraApiAccess] === constant.INFRA_API_ACCESS_RESTRICTED
    }

    actionMenu = () => {
        return [
            { label: 'Update', onClick: this.onAdd, type:'Edit' },
            { label: 'Delete', onClick: deleteCloudlet, ws: true, type:'Edit' },
            { label: 'Show Manifest', visible: this.onCloudletManifestVisible, onClick: this.onCloudletManifest}
        ]
    }

    canAdd = ()=>
    {
        let  valid  = false
        let role = getUserRole();
        if(role === constant.ADMIN_MANAGER || role === constant.OPERATOR_MANAGER || role === constant.OPERATOR_CONTRIBUTOR)
        {
            valid = true
        }
        return valid
    }

    customStream = (data)=>{
        return data[fields.infraApiAccess] === 'Restricted' && data[fields.cloudletStatus] !== 2
    }


    requestInfo = () => {
        return ({
            id: 'Cloudlets',
            headerLabel: 'Cloudlets',
            nameField: fields.cloudletName,
            requestType: [showCloudlets, showCloudletInfos],
            streamType: streamCloudlet,
            customStream : this.customStream,
            isRegion: true,
            isMap: true,
            sortBy: [fields.region, fields.cloudletName],
            keys: this.keys,
            onAdd: this.canAdd() ? this.onAdd : undefined,
            viewMode : HELP_CLOUDLET_LIST,
            grouping : true
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

    showProgress = (data, isDetailView)=>{
        let progressRender = null
        if (!isDetailView && this.customStream(data)) {
            progressRender = <Popup content='View Progress' trigger={<Icon className={'progressIndicator'} loading color='green' name='circle notch' />} />
        }
        else
        {
            progressRender = shared.showProgress(data, isDetailView)
        }
        return progressRender
    }

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.cloudletStatus) {
                key.customizedData = this.getCloudletInfoState
            }
            else if (key.field === fields.state) {
                key.customizedData = this.showProgress
            }
        }
    }

    /**
    * Customized data block
    * ** */

   componentDidMount() {
        this.customizedData()
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={multiDataRequest} />
        )
    }
};

export default withRouter(connect(null, null)(CloudletList));
