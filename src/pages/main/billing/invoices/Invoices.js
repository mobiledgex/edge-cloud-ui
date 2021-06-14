import React, { lazy, Suspense } from 'react'
import LogoSpinner from '../../../../hoc/loader/LogoSpinner'

import DataView from '../../../../container/DataView';
import { fields } from '../../../../services/model/format';

import { showInvoices, keys } from '../../../../services/modules/invoices'
import { withRouter } from 'react-router-dom';
import { redux_org } from '../../../../helper/reduxData';
import { connect } from 'react-redux';
import { perpetual } from '../../../../helper/constant';

const Invoice = lazy(() => import('./Invoice'));
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
            headerLabel: redux_org.isAdmin(this) ? `Invoices - ${billingOrg[fields.name]}` : 'Invoices',
            nameField: fields.name,
            requestType: [showInvoices],
            sortBy: [fields.name],
            selection: false,
            keys: this.keys,
            onAdd: undefined,
            grouping: false,
            filter: { name: billingOrg[fields.name] },
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