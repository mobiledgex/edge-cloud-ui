import React from "react";
import { withRouter } from 'react-router-dom';
import DataView from '../../../../container/DataView';
//redux
import { connect } from 'react-redux';
import { localFields } from '../../../../services/fields';
//model
import { HELP_ZONES_LIST } from "../../../../tutorial";
import { perpetual } from "../../../../helper/constant";
import { showFederatorZones, keys, iconKeys, showFederationZones, multiDataRequest } from "../../../../services/modules/zones"
import ZoneReg from "./Reg"
import { deleteFederatorZone } from "../../../../services/modules/zones/zones";

class ZoneList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this._isMounted = false
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
            id: perpetual.PAGE_HOST_ZONES,
            headerLabel: 'Host - Zones',
            requestType: [showFederatorZones, showFederationZones],
            sortBy: [localFields.zoneId],
            keys: this.keys,
            isMap: true,
            onAdd: this.onAdd,
            formatData: this.dataFormatter,
            nameField: localFields.zoneId,
            viewMode: HELP_ZONES_LIST,
            iconKeys:iconKeys()
        })
    }

    onAdd = (type) => {
        this.updateState({ currentView: <ZoneReg onClose={this.onRegClose} /> });
    }

    registeredZones = (type, action, data) => {
        return data[localFields.registered]
    }

    actionMenu = () => {
        return [
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteFederatorZone, disable: this.registeredZones },
        ]
    }

    render() {
        const { tableHeight, currentView } = this.state
        return (
            <div style={{ width: '100%', height: '100%' }}>
                <DataView id={perpetual.PAGE_HOST_ZONES} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} onClick={this.onListViewClick} tableHeight={tableHeight} handleListViewClick={this.handleListViewClick} multiDataRequest={multiDataRequest} groupActionMenu={this.groupActionMenu} />
            </div>
        )
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }

};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};



export default withRouter(connect(mapStateToProps, null)(ZoneList));