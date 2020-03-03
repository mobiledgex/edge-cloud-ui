import _ from 'lodash'
import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';

import * as serverData from '../../../services/model/serverData';
import PrivacyPolicyReg from './autoPrivacyPolicyReg'
import * as EP from '../../../services/model/endPointTypes';
import { fields } from '../../../services/model/format';
import { keys } from '../../../services/model/privacyPolicy';

class PrivacyPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView :null
        }
        this.action = '';
        this.data={}
    }

    onUpdate = (data) => {
        this.data = data;
        this.action = 'Update'
        this.setState({ currentView: <PrivacyPolicyReg data={this.data} action={this.action} childPage={this.props.childPage}></PrivacyPolicyReg> })
    }

    onAdd = () => {
        this.setState({ currentView: <PrivacyPolicyReg /> })
    }

   
    onDelete = async (data) => {
        let valid = false;
        let privacypolicy = {
            key: { developer: data[fields.organizationName], name: data[fields.privacyPolicyName] },
            outbound_security_rules: data[fields.outboundSecurityRules]
        }

        let requestData = {
            region: data[fields.region],
            privacypolicy: privacypolicy
        }
        let mcRequest = await serverData.deletePrivacyPolicy(this, requestData)
        if (mcRequest && mcRequest.response && mcRequest.response.status === 200) {
            this.props.handleAlertInfo('success', `Privacy Policy ${data[fields.privacyPolicyName]} deleted successfully`)
            valid = true;
        }
        return valid;
    }

    actionMenu = () => {
        return [
            { label: 'Update', onClick: this.onUpdate },
            { label: 'Delete', onClick: this.onDelete }
        ]
    }
      

    requestInfo = () => {
        return ({
            requestType: EP.SHOW_PRIVACY_POLICY,
            isRegion: true,
            sortBy: [fields.region, fields.privacyPolicyName],
            keys:keys,
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
    
};
const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(PrivacyPolicy));