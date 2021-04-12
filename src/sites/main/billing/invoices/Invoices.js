import React, { lazy, Suspense } from 'react'
import Spinner from '../../../../hoc/loader/Spinner';
import { PAGE_INVOICES } from '../../../../constant';

import MexListView from '../../../../container/MexListView';
import { fields } from '../../../../services/model/format';

import { showInvoices, keys } from '../../../../services/model/invoices'

const Invoice = lazy(() => import('./Invoice'));
class Invoices extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            currentView: undefined,
            invoice: undefined
        }
        this._isMounted = false
        this.keys = keys()
    }

    onClose = () => {
        this.setState({ invoice: undefined })
    }

    viewInvoice = (action, data) => {
        this.setState({ invoice: data })
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
        const { currentView, invoice } = this.state
        return (
            <React.Fragment>
                {currentView ? currentView : <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} />}
                <Suspense fallback={<Spinner loading={true}/>}>
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