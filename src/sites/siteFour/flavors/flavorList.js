import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import { fields, isAdmin } from '../../../services/model/format';
import { keys, showFlavors, deleteFlavor } from '../../../services/model/flavor';
import FlavorReg from './flavorReg';
import * as actions from "../../../actions";
import {organizationTutor} from "../../../tutorial";


const orgaSteps = organizationTutor();

class FlavorList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.action = '';
        this.data = {}
        this.keys = keys();
    }

    onRegClose = (isEdited)=>
    {
        this.setState({ currentView: null })
    }

    onAdd = () => {
        this.setState({ currentView: <FlavorReg onClose={this.onRegClose}/> });
        this.props.handleViewMode( orgaSteps.stepsCreateFlavor )
    }

    /**Action menu block */
    actionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteFlavor }
        ]
    }

    /*Action menu block*/

    requestInfo = () => {
        return ({
            id: 'Flavors',
            headerLabel: 'Flavors',
            nameField: fields.flavorName,
            isRegion:true,
            requestType: [showFlavors],
            sortBy: [fields.region, fields.flavorName],
            keys: this.keys,
            onAdd: isAdmin() ? this.onAdd : undefined,
            viewMode : orgaSteps.stepsFlavors
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
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(FlavorList));
