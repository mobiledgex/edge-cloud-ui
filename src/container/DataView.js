import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import MexListView from './MexListView';
import { operators, shared } from '../helper/constant';

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
        if (!shared.isPathOrg(this)) {
            this.setState({ visible: false }, () => {
                this.setState({ visible: true })
            })
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.organizationInfo && !operators.equal(nextProps.organizationInfo, this.props.organizationInfo)) {
            this.resetOrRedirect()
            return true
        }
        else if (nextState.visible !== this.state.visible || this.props.currentView !== nextProps.currentView) {
            return true
        }
        return false
    }

    render() {
        const { requestInfo, actionMenu, multiDataRequest, groupActionMenu, currentView, onClick, customToolbar, tableHeight, refreshToggle, toolbarAction, detailAction, handleListViewClick } = this.props
        const { visible } = this.state
        return (
            visible ?
                currentView ? currentView : <MexListView actionMenu={actionMenu()} requestInfo={requestInfo()} multiDataRequest={multiDataRequest} groupActionMenu={groupActionMenu} onClick={onClick} customToolbar={customToolbar} tableHeight={tableHeight} refreshToggle={refreshToggle} toolbarAction={toolbarAction} detailAction={detailAction} handleListViewClick={handleListViewClick} /> : null
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