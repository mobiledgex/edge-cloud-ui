import React from 'react'

import DataView from '../../../../container/DataView';
import { fields } from '../../../../services/model/format';

import { withRouter } from 'react-router-dom';
import { redux_org } from '../../../../helper/reduxData';
import { connect } from 'react-redux';
import { perpetual } from '../../../../helper/constant';
import { showPartnerFederatorZone, keys, iconKeys } from '../../../../services/modules/partnerZones';

class PartnerZones extends React.Component {
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
        // return [
        //     { label: 'View Invoice', onClick: this.viewInvoice },
        // ]
    }

    onBackClick = () => {
        this.props.onClose()
    }

    requestInfo = () => {
        const { billingOrg } = this.state
        return ({
            id: perpetual.PAGE_PARTNER_ZONES,
            headerLabel: 'Partner Zones',
            nameField: fields.zoneId,
            requestType: [showPartnerFederatorZone],
            sortBy: [fields.federationName],
            selection: false,
            keys: this.keys,
            onAdd: undefined,
            grouping: false,
            filter: { federationname: this.props.data[fields.federationName], selfoperatorid: this.props.data[fields.operatorName], operatorid: this.props.data[fields.partnerOperatorName] },
            back: this.onBackClick,
            iconKeys: iconKeys()
        })
    }

    render() {
        const { invoice, billingOrg } = this.state
        return (
            <React.Fragment>
                <DataView id={perpetual.PAGE_PARTNER_ZONES} actionMenu={this.actionMenu} requestInfo={this.requestInfo} />
            </React.Fragment>
        )
    }

    componentDidMount() {
        console.log(this.props.data)
        // let billingOrg = this.props.data ? this.props.data : this.props.location.state ? this.props.location.state.data : undefined
        // billingOrg ? this.setState({ billingOrg }) : this.props.history.push(`/main/${perpetual.PAGE_ORGANIZATIONS.toLowerCase()}`)
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

export default withRouter(connect(mapStateToProps, null)(PartnerZones));