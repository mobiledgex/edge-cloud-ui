import React from 'react';
import { Button, Modal, Grid } from "semantic-ui-react";
import SiteFourOrgaAddUser from "./siteFourOrgaAdduser";
import * as serviceMC from "../services/serviceMC";
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { GridLoader } from "react-spinners";
import './styles.css';

let _self = null;
class PopAddUserViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
            dimmer: '',
            cloudletResult: null,
            listOfDetail: null,
            userImage: null,
            userName: null,
            typeOperator: '',
            organization: '',
            successReset: false,
            toggleSubmit: false
        }
        _self = this;
    }

    componentDidMount() {
        //nextProps.data['Type'].substring(0,1).toUpperCase() + nextProps.data['Type'].substring(1)
    }
    componentWillReceiveProps(nextProps, nextContext) {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if (nextProps.open) {
            this.setState({ open: nextProps.open, dimmer: nextProps.dimmer, typeOperator: (nextProps.data['Type'].substring(0, 1).toUpperCase() + nextProps.data['Type'].substring(1)), organization: nextProps.data['Organization'] });
        }
        if (nextProps.stepTwo && nextProps.stepTwo.submitSucceeded && !this.state.toggleSubmit) {
            this.props.handleLoadingSpinner(true);
            this.setState({ toggleSubmit: true });
            //{username: "inkikim", orgName: "bicinkiOrg", orgType: "Developer", selectRole: "Manager"}
            let _username = nextProps.stepTwo.values && nextProps.stepTwo.values.username || '';
            let _org = nextProps.stepTwo.values && nextProps.stepTwo.values.orgName || '';
            let _role = nextProps.stepTwo.values && nextProps.stepTwo.values.orgType + nextProps.stepTwo.values.selectRole || '';
            let requestBody = {
                token: store ? store.userToken : 'null',
                method: serviceMC.getEP().ADD_USER_ROLE,
                data: {
                    username: _username,
                    org: _org,
                    role: _role
                }
            }
            serviceMC.sendRequest(_self, requestBody, this.resultGiveToRole)

        }
    }

    resultGiveToRole = (mcRequest) => {
        if (mcRequest) {
            if (mcRequest.response) {
                let request = mcRequest.request;
                this.setState({ toggleSubmit: false })
                this.props.handleAlertInfo('success', 'User ' + request.data.username + ' added to organization ' + request.data.org + ' successfully')
            }
        }
        else {
            this.setState({ successReset: true });
        }
        _self.props.handleLoadingSpinner(false);
    }

    setCloudletList = (operNm) => {
        let cl = [];
        _self.state.cloudletResult[operNm].map((oper, i) => {
            if (i === 0) _self.setState({ dropdownValueThree: oper.CloudletName })
            cl.push({ key: i, value: oper.CloudletName, text: oper.CloudletName })
        })

        _self.setState({ devOptionsThree: cl })
    }

    setForms = () => (
        <SiteFourOrgaAddUser onSubmit={() => console.log('Form was submitted')} org={this.state.organization} type={this.state.typeOperator} successReset={this.state.successReset} toggleSubmit={this.state.toggleSubmit}></SiteFourOrgaAddUser>
    )


    close() {
        this.setState({ open: false })
        this.props.close()
    }


    render() {

        return (
            <Modal open={this.state.open} dimmer={false}>
                <Modal.Header>Add User</Modal.Header>
                <Modal.Content scrolling>
                    <Grid className='popup_user'>
                        {/*<Grid.Row>*/}
                        {/*    <Grid.Column>*/}
                        {/*        <Image src='/assets/matthew.png' size="tiny" centered bordered/>*/}
                        {/*    </Grid.Column>*/}
                        {/*</Grid.Row>*/}
                        {this.setForms()}
                    </Grid>
                    {(this.props.loadingSpinner == true) ?
                        <div className="loadingBox" style={{ zIndex: 99999 }}>
                            <GridLoader
                                sizeUnit={"px"}
                                size={30}
                                color={'#70b2bc'}
                                loading={this.props.loadingSpinner}
                            //loading={true}
                            />
                            <span className={this.props.loadingSpinner ? '' : 'loading'} style={{ fontSize: '22px', color: '#70b2bc' }}>Loading...</span>
                        </div> : null}
                </Modal.Content>
                <Modal.Actions>
                    {/*<Modal.Actions  className='adduser-close'>*/}
                    <Button onClick={() => this.close()} style={{}}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}

const mapStateToProps = (state) => {
    let formStepAdduser = state.form.orgaStepAddUser
        ? {
            values: state.form.orgaStepAddUser.values,
            submitSucceeded: state.form.orgaStepAddUser.submitSucceeded
        }
        : {};
    return {
        stepTwo: formStepAdduser,
        loadingSpinner: state.loadingSpinner.loading ? state.loadingSpinner.loading : null,
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchProps)(PopAddUserViewer));


