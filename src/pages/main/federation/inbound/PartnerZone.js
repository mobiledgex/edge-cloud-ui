import React from 'react'
import DataView from '../../../../container/DataView';
import { fields } from '../../../../services/model/format';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { perpetual } from '../../../../helper/constant';
import { showPartnerFederatorZone, keys, iconKeys } from '../../../../services/modules/partnerZones';

class PartnerZones extends React.Component {
    constructor(props) {
        super(props)
        this._isMounted = false
        this.keys = keys()
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    actionMenu = () => {

    }

    onBackClick = () => {
        this.props.onClose()
    }

    requestInfo = () => {
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
        return (
            <React.Fragment>
                <DataView id={perpetual.PAGE_PARTNER_ZONES} actionMenu={this.actionMenu} requestInfo={this.requestInfo} />
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

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

export default withRouter(connect(mapStateToProps, null)(PartnerZones));