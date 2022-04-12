/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import DataView from '../../../hoc/datagrid/DataView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import { localFields } from '../../../services/fields';
import { redux_org } from '../../../helper/reduxData';
import { keys, iconKeys, showFlavors, deleteFlavor } from '../../../services/modules/flavor';
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

  

    /*Action menu block*/

    requestInfo = () => {
        return ({
            id: perpetual.PAGE_FLAVORS,
            headerLabel: 'Flavors',
            nameField: localFields.flavorName,
            isRegion: true,
            requestType: [showFlavors],
            sortBy: [localFields.region, localFields.flavorName],
            selection: !redux_org.isDeveloper(this),
            keys: this.keys,
            iconKeys : iconKeys(),
            onAdd: redux_org.isAdmin(this) ? this.onAdd : undefined,
            viewMode: HELP_FLAVOR_LIST
        })
    }

    render() {
        const {currentView} = this.state
        return (
            <DataView id={perpetual.PAGE_FLAVORS} resetView={this.resetView} currentView={currentView} actionMenu={this.actionMenu} actionRoles={[perpetual.ADMIN_MANAGER]} requestInfo={this.requestInfo} groupActionMenu={this.groupActionMenu} />
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