import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import MexListView from './MexListView';
import { equal } from '../constant/compare';

class DataView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: true
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.organizationInfo && !equal(nextProps.organizationInfo, this.props.organizationInfo)) {
            this.props.resetView()
            this.setState({ visible: false }, () => {
                this.setState({ visible: true})
            })
            return true
        }
        else if (nextState.visible !== this.state.visible || this.props.currentView !== nextProps.currentView) {
            return true
        }
        return false
    }

    render() {
        const { requestInfo, actionMenu, multiDataRequest, groupActionMenu, organizationInfo, currentView } = this.props
        const { visible } = this.state
        return (
            organizationInfo && visible ?
                currentView ? currentView : <MexListView actionMenu={actionMenu()} requestInfo={requestInfo()} multiDataRequest={multiDataRequest} groupActionMenu={groupActionMenu} /> : null
        )
    }
}


const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

export default withRouter(connect(mapStateToProps, null)(DataView));