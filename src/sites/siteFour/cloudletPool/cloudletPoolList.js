import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as constant from '../../../constant';
import { fields } from '../../../services/model/format';
import { keys, showCloudletPools, deleteCloudletPool, multiDataRequest } from '../../../services/model/cloudletPool';
import { showCloudletPoolMembers } from '../../../services/model/cloudletPoolMember';
import { showCloudletLinkOrg } from '../../../services/model/cloudletLinkOrg';
import CloudletPoolReg from './cloudletPoolReg';
import * as actions from "../../../actions";

class ClouldetPoolList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this.keys = Object.assign([], keys);
    }

    onAdd = () => {
        this.setState({ currentView: <CloudletPoolReg onClose={() => this.setState({ currentView: null })} /> });
        this.props.handleViewMode(true );
    }

    /**Action menu block */
    onActionClick = (action, data) => {
        this.setState({ currentView: <CloudletPoolReg data={data} action={action.id} onClose={() => this.setState({ currentView: null })} /> });
        this.props.handleViewMode(true )
    }

    actionMenu = () => {
        return [
            { id: constant.ADD_CLOUDLET, label: 'Add Cloudlet', onClick: this.onActionClick },
            { id: constant.DELETE_CLOUDLET, label: 'Delete Cloudlet', onClick: this.onActionClick },
            { id: constant.ADD_ORGANIZATION, label: 'Link Organization', onClick: this.onActionClick },
            { id: constant.DELETE_ORGANIZATION, label: 'Unlink Organization', onClick: this.onActionClick },
            { id: constant.DELETE, label: 'Delete', onClick: deleteCloudletPool }
        ]
    }

    /*Action menu block*/

    requestInfo = () => {
        return ({
            id: 'CloudletPools',
            headerLabel: 'Cloudlet Pools',
            nameField: fields.poolName,
            requestType: [showCloudletPools, showCloudletPoolMembers, showCloudletLinkOrg],
            isRegion: true,
            sortBy: [fields.poolName],
            keys: this.keys,
            onAdd: this.onAdd
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} multiDataRequest={multiDataRequest} />
        )
    }
};

const mapStateToProps = (state) => {
    return {

    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ClouldetPoolList));
