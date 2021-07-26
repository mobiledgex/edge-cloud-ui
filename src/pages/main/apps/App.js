import React from 'react';
import DataView from '../../../container/DataView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import { fields } from '../../../services/model/format';
import { keys, showApps, deleteApp } from '../../../services/modules/app';
import AppReg from './Reg';
import AppInstReg from '../appInst/Reg';
import { HELP_APP_LIST } from "../../../tutorial";
import { perpetual } from '../../../helper/constant';
import { labelFormatter } from '../../../helper/formatter';
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
        this.updateState({ currentView: <AppReg isUpdate={action ? true : false} data={data} onClose={this.onRegClose} /> });
    }

    /***Action Block */


    onLaunch = (action, data) => {
        this.updateState({ currentView: <AppInstReg isLaunch={action ? true : false} data={data} onClose={this.onRegClose} /> });
    }

    actionMenu = () => {
        return [
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
        if (key.field === fields.scaleWithCluster) {
            return labelFormatter.showYesNo(data[key.field])
        }
        else if (key.field === fields.trusted) {
            return labelFormatter.showYesNo(data[key.field])
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_APPS,
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
        const { currentView } = this.state
        return (
            <DataView id={perpetual.PAGE_APPS} resetView={this.resetView} actionMenu={this.actionMenu} currentView={currentView} requestInfo={this.requestInfo} groupActionMenu={this.groupActionMenu} />
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