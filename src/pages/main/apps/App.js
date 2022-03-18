import React from 'react';
import DataView from '../../../hoc/datagrid/DataView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import { localFields } from '../../../services/fields';
import { keys, showApps, deleteApp } from '../../../services/modules/app';
import AppReg from './Reg';
import AppInstReg from '../appInst/Reg';
import { HELP_APP_LIST } from "../../../tutorial";
import { perpetual } from '../../../helper/constant';
import { labelFormatter } from '../../../helper/formatter';
import { developerRoles } from '../../../constant';
import { appendSpaceToLetter } from '../../../utils/string_utils';
class AppList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this._isMounted = false
        this.action = '';
        this.data = {}
        this.keys = keys()
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
        let id = action ? action.id : undefined
        this.updateState({ currentView: <AppReg id={id} data={data} onClose={this.onRegClose} /> });
    }

    /***Action Block */


    onLaunch = (action, data) => {
        this.updateState({ currentView: <AppInstReg isLaunch={action ? true : false} data={data} onClose={this.onRegClose} /> });
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_CLONE, label: 'Clone', onClick: this.onAdd, type: 'Edit' },
            { id: perpetual.ACTION_UPDATE, label: 'Update', onClick: this.onAdd, type: 'Edit' },
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteApp, type: 'Edit' },
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
        if (key.field === localFields.scaleWithCluster) {
            return labelFormatter.showYesNo(data[key.field])
        }
        else if (key.field === localFields.trusted) {
            return labelFormatter.showYesNo(data[key.field])
        }
        else if (key.field === localFields.allowServerless) {
            return labelFormatter.showYesNo(data[key.field])
        }
        else if(key.field === localFields.qosSessionDuration)
        {
            return isDetail ? appendSpaceToLetter(data[key.field]) : data[key.field]
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_APPS,
            headerLabel: 'Apps',
            nameField: localFields.appName,
            requestType: [showApps],
            isRegion: true,
            sortBy: [localFields.region, localFields.appName],
            keys: this.keys,
            onAdd: this.onAdd,
            viewMode: HELP_APP_LIST,
            selection: true,
            grouping: true,
            formatData: this.dataFormatter
        })
    }

    render() {
        const { currentView } = this.state
        return (
            <DataView id={perpetual.PAGE_APPS} resetView={this.resetView} actionMenu={this.actionMenu} actionRoles={developerRoles} currentView={currentView} requestInfo={this.requestInfo} groupActionMenu={this.groupActionMenu} />
        )
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount(){
        this._isMounted = false
    }
};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

export default withRouter(connect(mapStateToProps, null)(AppList));