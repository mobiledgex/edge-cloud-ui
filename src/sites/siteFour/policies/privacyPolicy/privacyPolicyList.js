import _ from 'lodash'
import React from 'react';
import MexListView from '../../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../../actions';

import PrivacyPolicyReg from './privacyPolicyReg'
import { keys, fields, showPrivacyPolicies, deletePrivacyPolicy } from '../../../../services/model/privacyPolicy';

class PrivacyPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
    }

    onRegClose = (isEdited)=>
    {
        this.setState({ currentView: null })
    }

    onAdd = () => {
        this.setState({ currentView: <PrivacyPolicyReg onClose={this.onRegClose} /> })
    }

    onUpdate = (data) => {
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
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(PrivacyPolicy));