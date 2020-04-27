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
import * as actions from "../../../actions";

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
        this.props.handleViewMode( true )
    }

    actionMenu = () => {
        return [
            { label: 'Update', onClick: this.onAdd },
            { label: 'Delete', onClick: deleteCloudlet, ws: true }
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


    requestInfo = () => {
        return ({
            id: 'Cloudlets',
            headerLabel: 'Cloudlets',
            nameField: fields.cloudletName,
            requestType: [showCloudlets, showCloudletInfos],
            streamType: streamCloudlet,
            isRegion: true,
            isMap: true,
            sortBy: [fields.region, fields.cloudletName],
            keys: this.keys,
            onAdd: this.canAdd() ? this.onAdd : undefined
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

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.cloudletStatus) {
                key.customizedData = this.getCloudletInfoState
            }
            else if (key.field === fields.state) {
                key.customizedData = shared.showProgress
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
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={multiDataRequest} />
        )
    }
};

const mapStateToProps = (state) => {
    return {}
};
const mapDispatchProps = (dispatch) => {
    return {
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(CloudletList));
