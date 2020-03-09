import React from 'react';
import MexListView from '../../../container/MexListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import { fields } from '../../../services/model/format';
import { keys, showOrganizations, deleteOrganization, additionalDetail} from '../../../services/model/organization';
import OrganizationReg from './siteFour_page_createOrga';
import PopAddUserViewer from '../../../container/popAddUserViewer';

class PrivacyPolicy extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentView: null,
            openAddUserView: false
        }
        this.action = '';
        this.data = {}
    }

    onAdd = () => {
        this.setState({ currentView: <OrganizationReg /> })
    }

    /**Action menu block */

    gotoUrl(site, subPath) {
        let mainPath = site;
        this.props.history.push({
            pathname: site,
            search: subPath
        });
        this.props.history.location.search = subPath;
        this.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })
    }

    onAudit = (data) => {
        let orgName = data[fields.organizationName];
        this.gotoUrl('/site4', 'pg=audits&org=' + orgName)
    }

    onAddUser = (data) => {
        this.data = data;
        this.setState({ openAddUserView: true })
    }

    onCloseAddUser = () => {
        this.data = null;
        this.setState({ openAddUserView: false })
    }

    actionMenu = () => {
        return [
            { label: 'Audit', onClick: this.onAudit },
            { label: 'Add User', onClick: this.onAddUser },
            { label: 'Delete', onClick: deleteOrganization }
        ]
    }

    /*Action menu block*/

    requestInfo = () => {
        return ({
            id: 'Organizations',
            headerLabel: 'Organizations',
            nameField: fields.organizationName,
            requestType: [showOrganizations],
            sortBy: [fields.organizationName],
            keys: keys,
            onAdd: this.onAdd,
            additionalDetail: additionalDetail
        })
    }

    render() {
        return (
            this.state.currentView ? this.state.currentView :
                <div style={{ width: '100%' }}>
                    <PopAddUserViewer data={this.data} open={this.state.openAddUserView}
                        close={this.onCloseAddUser}></PopAddUserViewer>
                    <MexListView actionMenu={this.actionMenu()} requestInfo={this.requestInfo()} />
                </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {}
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(PrivacyPolicy));