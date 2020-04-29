import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as constant from '../../../constant'
import { fields } from '../../../services/model/format';
import { keys, showApps, deleteApp } from '../../../services/model/app';
import AppReg from './appReg';
import AppInstReg from '../appInst/appInstReg';
import {organizationTutor} from "../../../tutorial";

const orgaSteps = organizationTutor();

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
        this.props.handleViewMode( orgaSteps.stepsCreateApp )
    }

    /***Action Block */


    onLaunch = (action, data) => {
        this.setState({ currentView: <AppInstReg isLaunch={action ? true : false} data={data} onClose={this.onRegClose}/> });
        this.props.handleViewMode( orgaSteps.stepsCreateApp )
    }

    actionMenu = () => {
        return [
            { label: 'Update', onClick: this.onAdd },
            { label: 'Delete', onClick: deleteApp },
            { label: 'Create Instance', onClick: this.onLaunch }
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
            viewMode : orgaSteps.stepsApp
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} />
        )
    }
};

const mapStateToProps = (state) => {
    return {}
};
const mapDispatchProps = (dispatch) => {
    return {
        handleAppLaunch: (data) => { dispatch(actions.appLaunch(data))},
        handleEditInstance: (data) => { dispatch(actions.editInstance(data))},
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) },
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AppList));
