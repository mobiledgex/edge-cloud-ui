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
import { Icon } from 'semantic-ui-react';
import { customizedTrusted } from '../../../constantUI';
import { ACTION_DELETE, ACTION_UPDATE } from '../../../container/Actions';
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
            grouping: true
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} groupActionMenu={this.groupActionMenu} />
        )
    }

    /**
     * Customized data block
    **/

    showYesNo = (data, isDetailView) => {
        if (isDetailView) {
            return data[fields.scaleWithCluster] ? constant.YES : constant.NO
        }
    }

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.scaleWithCluster) {
                key.customizedData = this.showYesNo
            }
            else if (key.field === fields.trusted) {
                key.customizedData = customizedTrusted
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