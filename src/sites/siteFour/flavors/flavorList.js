import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import { fields, isAdmin } from '../../../services/model/format';
import { keys, showFlavors, deleteFlavor } from '../../../services/model/flavor';
import FlavorReg from './flavorReg';
import {HELP_FLAVOR_LIST} from "../../../tutorial";

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
    }

    /**Action menu block */
    actionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteFlavor, type:'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteFlavor, icon: 'delete', warning: 'delete all the selected Flavor', type: 'Edit' },
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
            selection:true,
            keys: this.keys,
            onAdd: isAdmin() ? this.onAdd : undefined,
            viewMode : HELP_FLAVOR_LIST
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} groupActionMenu={this.groupActionMenu}/>
        )
    }
};

const mapDispatchProps = (dispatch) => {
    return {
    };
};

export default withRouter(connect(null, mapDispatchProps)(FlavorList));