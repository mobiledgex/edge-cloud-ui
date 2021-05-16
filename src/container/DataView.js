import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MexListView from './MexListView';
import { equal } from '../constant/compare';
import { isPathOrg } from '../constant/common';

class DataView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: true
        }
    }

    resetOrRedirect = () => {
        if (this.props.currentView) {
            this.props.resetView()
        }
        if (!isPathOrg(this)) {
            this.setState({ visible: false }, () => {
                this.setState({ visible: true })
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.organizationInfo && !equal(nextProps.organizationInfo, this.props.organizationInfo)) {
            this.resetOrRedirect()
            return true
        }
        else if (nextState.visible !== this.state.visible || this.props.currentView !== nextProps.currentView) {
            return true
        }
        return false
    }

    render() {
        const { requestInfo, actionMenu, multiDataRequest, groupActionMenu, organizationInfo, currentView, onClick, customToolbar, tableHeight, refreshToggle } = this.props
        const { visible } = this.state
        return (
            organizationInfo && visible ?
                currentView ? currentView : <MexListView actionMenu={actionMenu()} requestInfo={requestInfo()} multiDataRequest={multiDataRequest} groupActionMenu={groupActionMenu} onClick={onClick} customToolbar={customToolbar} tableHeight={tableHeight} refreshToggle={refreshToggle} /> : null
        )
    }

    componentDidMount() {
    }
}


const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

export default withRouter(connect(mapStateToProps, null)(DataView));