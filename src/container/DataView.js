import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import DataGrid from '../hoc/datagrid/DataGrid';
import { operators, shared } from '../helper/constant';
import { redux_org } from '../helper/reduxData';

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

    filterActionMenu = () => {
        let actionMenu = this.props.actionMenu()
        if (actionMenu && actionMenu.length > 0) {
            let viewerEdit = this.props.requestInfo.viewerEdit
            let menu = actionMenu.filter(action => {
                let valid = true
                if (action.type === 'Edit') {
                    if (redux_org.isViewer(this)) {
                        valid = false
                    }
                }
                return valid || viewerEdit
            })
            return menu
        }
    }

    render() {
        const { requestInfo, multiDataRequest, groupActionMenu, currentView, onClick, customToolbar, tableHeight, refreshToggle, toolbarAction, detailAction, handleListViewClick } = this.props
        const { visible } = this.state
        return (
            visible ?
                currentView ? currentView : <DataGrid actionMenu={this.filterActionMenu()} requestInfo={requestInfo()} multiDataRequest={multiDataRequest} groupActionMenu={groupActionMenu} onClick={onClick} customToolbar={customToolbar} tableHeight={tableHeight} refreshToggle={refreshToggle} toolbarAction={toolbarAction} detailAction={detailAction} handleListViewClick={handleListViewClick} /> : null
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