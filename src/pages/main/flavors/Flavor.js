import React from 'react';
import DataView from '../../../container/DataView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import { fields } from '../../../services/model/format';
import { redux_org } from '../../../helper/reduxData';
import { keys, showFlavors, deleteFlavor } from '../../../services/modules/flavor';
import FlavorReg from './Reg';
import { HELP_FLAVOR_LIST } from "../../../tutorial";
import { perpetual } from '../../../helper/constant';
import { uiFormatter } from '../../../helper/formatter';

class FlavorList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null
        }
        this._isMounted = false
        this.action = '';
        this.data = {}
        this.keys = keys();
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    resetView = () => {
        this.updateState({ currentView: null })
    }

    onRegClose = (isEdited) => {
        this.resetView()
    }

    onAdd = () => {
        this.updateState({ currentView: <FlavorReg onClose={this.onRegClose} /> });
    }

    onPreDelete = (type, action, data) => {
        if (type === perpetual.ACTION_DISABLE) {
            let disable = redux_org.isAdmin(this)
            return !disable
        }
    }

    /**Action menu block */
    actionMenu = () => {
        return [
            { id: perpetual.ACTION_DELETE, label: 'Delete', onClick: deleteFlavor, disable: this.onPreDelete, type: 'Edit' }
        ]
    }

    groupActionMenu = () => {
        return [
            { label: 'Delete', onClick: deleteFlavor, icon: 'delete', warning: 'delete all the selected flavors', type: 'Edit' },
        ]
    }

    dataFormatter = (key, data, isDetail) => {
        if (key.field === fields.gpu) {
            return uiFormatter.flavorGPU(key, data, isDetail)
        }
    }

    /*Action menu block*/

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_FLAVORS,
            headerLabel: 'Flavors',
            nameField: fields.flavorName,
            isRegion: true,
            requestType: [showFlavors],
            sortBy: [fields.region, fields.flavorName],
            selection: true,
            keys: this.keys,
            onAdd: redux_org.isAdmin(this) ? this.onAdd : undefined,
            formatData: this.dataFormatter,
            viewMode: HELP_FLAVOR_LIST
        })
    }

    render() {
        const {currentView} = this.state
        return (
            <DataView id={perpetual.PAGE_FLAVORS} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} requestInfo={this.requestInfo} groupActionMenu={this.groupActionMenu} />
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

export default withRouter(connect(mapStateToProps, null)(FlavorList));