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

import React, { lazy, Suspense } from 'react'
import LogoSpinner from '../../../../hoc/loader/LogoSpinner'

import DataView from '../../../../hoc/datagrid/DataView';
import { localFields } from '../../../../services/fields';

import { showInvoices, keys } from '../../../../services/modules/invoices'
import { withRouter } from 'react-router-dom';
import { redux_org } from '../../../../helper/reduxData';
import { connect } from 'react-redux';
import { perpetual } from '../../../../helper/constant';
import { componentLoader } from '../../../../hoc/loader/componentLoader';

const Invoice = lazy(() => componentLoader(import('./Invoice')));
class Invoices extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            invoice: undefined,
            billingOrg: undefined
        }
        this._isMounted = false
        this.keys = keys()
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    onClose = () => {
        this.updateState({ invoice: undefined })
    }

    viewInvoice = (action, data) => {
        this.updateState({ invoice: data })
    }

    actionMenu = () => {
        return [
            { label: 'View Invoice', onClick: this.viewInvoice },
        ]
    }

    onBackClick = () => {
        this.props.onClose()
    }

    requestInfo = () => {
        const { billingOrg } = this.state
        return ({
            id: perpetual.PAGE_INVOICES,
            headerLabel: redux_org.isAdmin(this) ? `Invoices - ${billingOrg[localFields.name]}` : 'Invoices',
            nameField: localFields.name,
            requestType: [showInvoices],
            sortBy: [localFields.name],
            selection: false,
            keys: this.keys,
            onAdd: undefined,
            grouping: false,
            picker: true,
            filter: { name: billingOrg[localFields.name] },
            back: redux_org.isAdmin(this) ? this.onBackClick : null
        })
    }

    render() {
        const { invoice, billingOrg } = this.state
        return (
            billingOrg ? <React.Fragment>
                <DataView id={perpetual.PAGE_INVOICES} actionMenu={this.actionMenu} requestInfo={this.requestInfo} />
                <Suspense fallback={<LogoSpinner />}>
                    <Invoice data={invoice} close={this.onClose} />
                </Suspense>
            </React.Fragment> : null
        )
    }

    componentDidMount() {
        let billingOrg = this.props.data ? this.props.data : this.props.location.state ? this.props.location.state.data : undefined
        billingOrg ? this.setState({ billingOrg }) : this.props.history.push(`/main/${perpetual.PAGE_ORGANIZATIONS.toLowerCase()}`)
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

export default withRouter(connect(mapStateToProps, null)(Invoices));