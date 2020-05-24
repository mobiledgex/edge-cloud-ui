import React from 'react';
import MexListView from '../../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';

import PrivacyPolicyReg from './privacyPolicyReg'
import { keys, fields, showPrivacyPolicies, deletePrivacyPolicy } from '../../../../services/model/privacyPolicy';
import {PolicyTutor} from "../../../../tutorial";


const policySteps = PolicyTutor();

class PrivacyPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.keys = keys();
    }

    onRegClose = (isEdited)=>
    {
        this.setState({ currentView: null })
    }

    onAdd = () => {
        this.setState({ currentView: <PrivacyPolicyReg onClose={this.onRegClose} /> });
    }

    onUpdate = (action, data) => {
        this.setState({ currentView: <PrivacyPolicyReg data={data} action='Update' onClose={this.onRegClose}/> })
    }

    actionMenu = () => {
        return [
            { label: 'Update', onClick: this.onUpdate },
            { label: 'Delete', onClick: deletePrivacyPolicy }
        ]
    }

    requestInfo = () => {
        return ({
            headerLabel: 'Privacy Policy',
            requestType: [showPrivacyPolicies],
            isRegion: true,
            nameField: fields.privacyPolicyName,
            sortBy: [fields.region, fields.privacyPolicyName],
            keys: this.keys,
            onAdd: this.onAdd,
            viewMode : policySteps.stepsPolicy
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
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(PrivacyPolicy));
