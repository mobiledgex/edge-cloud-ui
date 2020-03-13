import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import { fields } from '../../../services/model/format';
import { keys, showApps, deleteApp } from '../../../services/model/app';
import AppReg from './appReg';

class AppList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.action = '';
        this.data = {}
    }

    onAdd = () => {
        this.setState({ currentView: <AppReg /> })
    }

    /***Action Block */

    gotoUrl(site, subPath) {
        let mainPath = site;
        this.props.history.push({
            pathname: site,
            search: subPath
        });
        this.props.history.location.search = subPath;
        this.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })
    }


    onLaunch = (data) => {
        this.gotoUrl('/site4', 'pg=createAppInst', 'pg=5')
        this.props.handleAppLaunch(data)
    }

    onUpdate = (data) => {
        this.props.handleEditInstance(data);
        this.gotoUrl('/site4', 'pg=editApp')
    }

    actionMenu = () => {
        return [
            { label: 'Launch', onClick: this.onLaunch },
            { label: 'Update', onClick: this.onUpdate },
            { label: 'Delete', onClick: deleteApp }
        ]
    }
    /***Action Block */
    requestInfo = () => {
        return ({
            id: 'Apps',
            headerLabel: 'Apps',
            nameField: fields.appName,
            requestType: [showApps],
            isRegion: true,
            sortBy: [fields.region, fields.appName],
            keys: keys,
            onAdd: this.onAdd
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
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AppList));