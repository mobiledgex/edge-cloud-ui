import React from 'react';
import {Button, Divider, Modal, Grid, Input, TextArea, Dropdown, Image} from "semantic-ui-react";
import SiteFourOrgaAddUser from "./siteFourOrgaAdduser";
import * as serviceOrganiz from "../services/service_organiz_api";
import Alert from 'react-s-alert';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import {GridLoader} from "react-spinners";
import './styles.css';

let _self = null;
class PopAddUserViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            open:false,
            dimmer:'',
            cloudletResult:null,
            listOfDetail:null,
            userImage:null,
            userName:null,
            typeOperator:'',
            organization:'',
            successReset:false
        }
        _self = this;
    }

    componentDidMount() {

    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('regist new item -- ', nextProps)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if(nextProps.open) {
            this.setState({open:nextProps.open, dimmer:nextProps.dimmer, typeOperator:nextProps.data['Type'], organization:nextProps.data['Organization']});
        }
        if(nextProps.stepTwo && nextProps.stepTwo.submitSucceeded) {
                console.log('stream form siteFour_page_createOrga.js  git to a role view ... ', nextProps, nextProps.stepTwo.values)
                //{username: "inkikim", orgName: "bicinkiOrg", orgType: "Developer", selectRole: "Manager"}
                let _username = nextProps.stepTwo.values && nextProps.stepTwo.values.username || '';
                let _org = nextProps.stepTwo.values && nextProps.stepTwo.values.orgName || '';
                let _role = nextProps.stepTwo.values && nextProps.stepTwo.values.orgType+nextProps.stepTwo.values.selectRole || '';
                serviceOrganiz.organize('addUserRole',
                    {
                            username:_username,
                            org:_org,
                            role:_role,
                            token:store.userToken
                    }, this.resultGiveToRole, this)
            
        }
    }

    resultGiveToRole = (result,resource, self, body) => {
        console.log("receive 3== ", result, resource, self, body)
        _self.props.handleLoadingSpinner(false);
        if(result.data.error) {
            Alert.error(String(result.data.error), {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
            this.setState({successReset:true});
            //setTimeout(()=>_self.gotoPreview('/Logout'), 2000)
        } else {

            Alert.success('User '+body.username+' added to organization '+body.org+' successfully', {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
            //popup close
        }
    }

    setCloudletList = (operNm) => {
        let cl = [];
        _self.state.cloudletResult[operNm].map((oper, i) => {
            if(i === 0) _self.setState({dropdownValueThree: oper.CloudletName})
            cl.push({ key: i, value: oper.CloudletName, text: oper.CloudletName })
        })

        _self.setState({devOptionsThree: cl})
    }

    setForms = () => (
        <SiteFourOrgaAddUser onSubmit={() => console.log('Form was submitted')} org={this.state.organization} type={this.state.typeOperator} successReset={this.state.successReset}></SiteFourOrgaAddUser>
    )


    close() {
        this.setState({ open: false })
        this.props.close()
    }


    render() {

        return (
            <Modal open={this.state.open} dimmer={false}>
                <Modal.Header>Add User</Modal.Header>
                <Modal.Content>
                    <Grid className='popup_user'>
                        {/*<Grid.Row>*/}
                        {/*    <Grid.Column>*/}
                        {/*        <Image src='/assets/matthew.png' size="tiny" centered bordered/>*/}
                        {/*    </Grid.Column>*/}
                        {/*</Grid.Row>*/}
                        {this.setForms()}
                    </Grid>
                    {(this.props.loadingSpinner==true)?
                    <div className="loadingBox" style={{zIndex:99999}}>
                        <GridLoader
                            sizeUnit={"px"}
                            size={30}
                            color={'#70b2bc'}
                            loading={this.props.loadingSpinner}
                            //loading={true}
                        />
                        <span className={this.props.loadingSpinner ? '' : 'loading'} style={{fontSize:'22px', color:'#70b2bc'}}>Loading...</span>
                    </div>:null}
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
    let formStepAdduser= state.form.orgaStepAddUser
    ? {
        values: state.form.orgaStepAddUser.values,
        submitSucceeded: state.form.orgaStepAddUser.submitSucceeded
    }
    : {};
    return {
        stepTwo:formStepAdduser,
        loadingSpinner : state.loadingSpinner.loading?state.loadingSpinner.loading:null,
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))}
    };
};


export default withRouter(connect(mapStateToProps, mapDispatchProps)(PopAddUserViewer));


