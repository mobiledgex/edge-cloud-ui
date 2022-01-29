import React from 'react'

import DataView from '../../../../container/DataView';
import { fields } from '../../../../services/model/format';

import { withRouter } from 'react-router-dom';
import { redux_org } from '../../../../helper/reduxData';
import { connect } from 'react-redux';
import { perpetual } from '../../../../helper/constant';
import { keys, iconKeys, showSelfFederatorZone } from '../../../../services/modules/sharedZones';

class SharingZones extends React.Component {
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
            id: perpetual.PAGE_SHARED_ZONES,
            headerLabel: 'Sharing Zones',
            nameField: fields.zoneId,
            requestType: [showSelfFederatorZone],
            sortBy: [fields.federationName],
            selection: false,
            keys: this.keys,
            onAdd: undefined,
            grouping: false,
            filter: { federationname: this.props.data[fields.federationName], selfoperatorid: this.props.data[fields.operatorName] },
            back: this.onBackClick,
            iconKeys: iconKeys()
        })
    }

    render() {
        return (
            <React.Fragment>
                <DataView id={perpetual.PAGE_SHARED_ZONES} actionMenu={this.actionMenu} requestInfo={this.requestInfo} />
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

export default withRouter(connect(mapStateToProps, null)(SharingZones));