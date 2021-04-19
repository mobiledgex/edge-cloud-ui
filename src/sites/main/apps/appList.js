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
import { HELP_APP_LIST } from "../../../tutorial";
import { ACTION_DELETE, ACTION_UPDATE } from '../../../container/Actions';
import { labelFormatter, uiFormatter } from '../../../helper/formatter';
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

    onRegClose = (isEdited) => {
        this.setState({ currentView: null })
    }

    onAdd = (action, data) => {
        this.setState({ currentView: <AppReg isUpdate={action ? true : false} data={data} onClose={this.onRegClose} /> });
    }

    /***Action Block */


    onLaunch = (action, data) => {
        this.setState({ currentView: <AppInstReg isLaunch={action ? true : false} data={data} onClose={this.onRegClose} /> });
    }

    actionMenu = () => {
        return [
            { id: ACTION_UPDATE, label: 'Update', onClick: this.onAdd, type: 'Edit' },
            { id: ACTION_DELETE, label: 'Delete', onClick: deleteApp, type: 'Edit' },
            { label: 'Create Instance', onClick: this.onLaunch, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteApp, icon: 'delete', warning: 'delete all the selected apps', type: 'Edit' },
        ]
    }
    /***Action Block */

    dataFormatter = (key, data, isDetail) => {
        if (key.field === fields.scaleWithCluster) {
            return constant.showYesNo(data[key.field], isDetail)
        }
        else if (key.field === fields.trusted) {
            return uiFormatter.trusted(key, data, isDetail)
        }
        else if (key.field === fields.kind) {
            return labelFormatter.kind(data[key.field])
        }
        else if (key.field === fields.imageType) {
            return labelFormatter.imageType(data[key.field])
        }
        else if (key.field === fields.accessType) {
            return labelFormatter.accessType(data[key.field])
        }
        else if (key.field === fields.appName) {
            return `${data[key.field]} [${data[fields.version]}]`
        }
    }

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
            viewMode: HELP_APP_LIST,
            selection: true,
            grouping: true,
            formatData: this.dataFormatter
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} groupActionMenu={this.groupActionMenu} />
        )
    }
};

const mapDispatchProps = (dispatch) => {
    return {
    };
};

export default withRouter(connect(null, mapDispatchProps)(AppList));