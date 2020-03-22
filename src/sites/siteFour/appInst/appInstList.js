import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';

import { fields } from '../../../services/model/format';
import { keys, showAppInsts, deleteAppInst, streamAppInst, multiDataRequest } from '../../../services/model/appInstance';
import { showApps } from '../../../services/model/app';
import AppInstReg from './appInstRegNew';
import * as constant from '../../../services/model/shared';

class AppInstList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.action = '';
        this.data = {};
        this.keys = Object.assign([], keys);
    }

    onAdd = () => {
        this.setState({ currentView: <AppInstReg /> })
    }

    actionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteAppInst, ws: true }
        ]
    }

    requestInfo = () => {
        return ({
            id: 'AppInsts',
            headerLabel: 'App Instances',
            nameField: fields.appName,
            requestType: [showAppInsts, showApps],
            streamType: streamAppInst,
            isRegion: true,
            isMap: true,
            sortBy: [fields.region, fields.appName],
            keys: this.keys,
            onAdd: this.onAdd
        })
    }

    /**
   * Customized data block
   **/

    customizedData = () => {
        for (let i = 0; i < this.keys.length; i++) {
            let key = this.keys[i]
            if (key.field === fields.state) {
                key.customizedData = constant.showProgress
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
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AppInstList));