import React, { lazy, Suspense } from 'react'
import LogoSpinner from '../../../../hoc/loader/LogoSpinner'
import { PAGE_INVOICES } from '../../../../constant';

import DataView from '../../../../container/DataView';
import { fields } from '../../../../services/model/format';

import { showInvoices, keys } from '../../../../services/model/invoices'

const Invoice = lazy(() => import('./Invoice'));
class Invoices extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            invoice: undefined
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
        const { data } = this.props
        return ({
            id: PAGE_INVOICES,
            headerLabel: `Invoices - ${data[fields.name]}`,
            nameField: fields.name,
            requestType: [showInvoices],
            sortBy: [fields.name],
            selection: false,
            keys: this.keys,
            onAdd: undefined,
            grouping: false,
            filter: { name: data[fields.name] },
            back: this.onBackClick
        })
    }

    render() {
        const { invoice } = this.state
        return (
            <React.Fragment>
                <DataView id={PAGE_INVOICES} actionMenu={this.actionMenu} requestInfo={this.requestInfo} />
                <Suspense fallback={<LogoSpinner/>}>
                    <Invoice data={invoice} close={this.onClose} />
                </Suspense>
            </React.Fragment>
        )
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

export default Invoices