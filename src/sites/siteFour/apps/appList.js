import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as constant from '../../../constant'
import { fields } from '../../../services/model/format';
import { keys, showApps, deleteApp } from '../../../services/model/app';
import AppReg from './appReg';
import AppInstReg from '../appInst/appInstReg';
import {appTutor} from "../../../tutorial";

const appSteps = appTutor();

class AppList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.action = '';
        this.data = {}
        this.keys = keys()
    }

    onRegClose = (isEdited)=>
    {
        this.setState({ currentView: null })
    }

    onAdd = (action , data) => {
        this.setState({ currentView: <AppReg isUpdate={action ? true : false} data={data} onClose={this.onRegClose}/> });
    }

    /***Action Block */


    onLaunch = (action, data) => {
        this.setState({ currentView: <AppInstReg isLaunch={action ? true : false} data={data} onClose={this.onRegClose}/> });
    }

    actionMenu = () => {
        return [
            { label: 'Update', onClick: this.onAdd, type:'Edit' },
            { label: 'Delete', onClick: deleteApp, type:'Edit' },
            { label: 'Create Instance', onClick: this.onLaunch, type:'Edit' }
        ]
    }
    /***Action Block */
    requestInfo = () => {
        return ({
            id: constant.APP,
            headerLabel: 'Apps',
            nameField: fields.appName,
            requestType: [showApps],
            isRegion: true,
            sortBy: [fields.region, fields.appName],
            keys: this.keys,
            onAdd: this.onAdd,
            viewMode : appSteps.stepsApp
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} />
        )
    }

    /**
  * Customized data block
  **/
    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.scaleWithCluster) {
                key.customizedData = constant.showYesNo
            }
        }
    }

    /**
    * Customized data block
    * ** */

    componentDidMount() {
        this.customizedData()
    }
};

const mapDispatchProps = (dispatch) => {
    return {
    };
};

export default withRouter(connect(null, mapDispatchProps)(AppList));