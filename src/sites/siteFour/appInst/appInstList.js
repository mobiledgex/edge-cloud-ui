import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';

import { fields } from '../../../services/model/format';
import { keys, showAppInsts, deleteAppInst, streamAppInst, SHOW_APP_INST } from '../../../services/model/appInstance';
import { showApps, SHOW_APP } from '../../../services/model/app';
import AppInstReg from './siteFour_page_appInstReg';
import * as constant from '../../../services/model/shared';

class PrivacyPolicy extends React.Component {
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

    multiDataRequest = (mcRequestList) => {
        let appInstList = [];
        let appList = [];
        for (let i = 0; i < mcRequestList.length; i++) {
            let mcRequest = mcRequestList[i];
            let request = mcRequest.request;
            if (request.method === SHOW_APP_INST) {
                appInstList = mcRequest.response.data
            }
            else if (request.method === SHOW_APP) {
                appList = mcRequest.response.data
            }
        }

        if (appInstList && appInstList.length > 0) {
            for (let i = 0; i < appInstList.length; i++) {
                let appInst = appInstList[i]
                for (let j = 0; j < appList.length; j++) {
                    let app = appList[j]
                    if (appInst[fields.appName] === app[fields.appName]) {
                        appInst[fields.deployment] = app[fields.deployment];
                        break;
                    }
                }
            }
        }
        return appInstList;
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

    componentWillMount() {
        this.customizedData()
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={this.multiDataRequest} />
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(PrivacyPolicy));