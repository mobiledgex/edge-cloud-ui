import React from 'react'
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import MexListView from './MexListView';
import { equal } from '../constant/compare';
import { pages, PAGE_ORGANIZATIONS } from '../constant';
import { redux_org } from '../helper/reduxData';

class DataView extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            visible: true
        }
    }

    resetOrRedirect = (orgInfo) => {
        const { id } = this.props
        let page = pages.filter(page => {
            return page.id === id
        })[0]
        if (page && page.roles) {
            let roles = page.roles
            if (roles.includes(redux_org.roleType(orgInfo))) {
                this.props.resetView()
            }
            else {
                this.props.history.push(`/main/${PAGE_ORGANIZATIONS.toLowerCase()}`)
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.organizationInfo && !equal(nextProps.organizationInfo, this.props.organizationInfo)) {
            this.resetOrRedirect(nextProps.organizationInfo)
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
        const { requestInfo, actionMenu, multiDataRequest, groupActionMenu, organizationInfo, currentView, onClick, customToolbar, tableHeight, refreshToggle } = this.props
        const { visible } = this.state
        return (
            organizationInfo && visible ?
                currentView ? currentView : <MexListView actionMenu={actionMenu()} requestInfo={requestInfo()} multiDataRequest={multiDataRequest} groupActionMenu={groupActionMenu} onClick={onClick} customToolbar={customToolbar} tableHeight={tableHeight} refreshToggle={refreshToggle}/> : null
        )
    }

    componentDidMount(){
    }
}


const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

export default withRouter(connect(mapStateToProps, null)(DataView));