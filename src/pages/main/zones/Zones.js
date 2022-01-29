import React from "react";
import { withRouter } from 'react-router-dom';
import DataView from '../../../container/DataView';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { fields } from '../../../services/model/format';
//model
import { HELP_ZONES_LIST } from "../../../tutorial";
import { perpetual } from "../../../helper/constant";
import ZoneReg from "./Reg"
import { showSelfZone, keys, showSelfFederatorZone, multiDataRequest } from "../../../services/modules/zones"
import { deleteSelfZone } from "../../../services/modules/zones/zones";

class ZoneList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        },
            this.keys = keys()
    }

    resetView = () => {
        if (this._isMounted) {
            this.updateState({ currentView: null })
        }
    }

    onRegClose = (isEdited) => {
        this.resetView()
    }
    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_ZONES,
            headerLabel: 'Zones',
            requestType: [showSelfZone, showSelfFederatorZone],
            sortBy: [fields.region],
            isRegion: true,
            keys: this.keys,
            onAdd: this.onAdd,
            nameField: fields.zoneId,
            viewMode: HELP_ZONES_LIST,
            grouping: true
        })
    }

    onAdd = (type) => {
        this.updateState({ currentView: <ZoneReg onClose={this.onRegClose} /> });
    }

    registeredZones = (type, action, data) => {
        return data[fields.zonesRegistered] === true ? true : false
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteSelfZone, type: 'Delete', disable: this.registeredZones },
        ]
    }

    render() {
        const { tableHeight, currentView, open } = this.state
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <DataView id={perpetual.PAGE_ZONES} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} onClick={this.onListViewClick} tableHeight={tableHeight} handleListViewClick={this.handleListViewClick} multiDataRequest={multiDataRequest} />
            </div>
        )
    }

    componentDidMount() {
        this._isMounted = true
        this.props.handleViewMode(HELP_ZONES_LIST)
    }

};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleViewMode: (data) => { dispatch(actions.viewMode(data)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(ZoneList));