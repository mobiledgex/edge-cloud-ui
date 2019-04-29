import React from 'react';
import { Grid, Image, Header, Menu, Dropdown, Button } from 'semantic-ui-react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';

//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

import SiteFourOrgaStepView from '../container/siteFourOrgaStepView';
import './siteThree.css';
import Alert from "react-s-alert";
import * as services from '../services/service_compute_service';
import * as serviceOrganiz from "../services/service_organiz_api";


let devOptions = [ { key: 'af', value: 'af', text: 'SK Telecom' } ]

let _self = null;
class SiteFourPageCreateorga extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            contHeight:0,
            contWidth:0,
            bodyHeight:0,
            activeItem: 'Developers',
            devData:[],
            step:1
        };
        this.headerH = 70;
        this.hgap = 0;
        this.headerLayout = [3,3,3,3,4]
        //this.hideHeader = ['Address','Phone']
    }

    //go to
    gotoPreview(site) {
        //브라우져 입력창에 주소 기록
        let mainPath = site;
        let subPath = 'pg=0';
        _self.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})

    }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    onHandleRegistry() {
        this.props.handleInjectDeveloper('userInfo');
    }
    componentWillMount() {
        console.log('info..will mount ', this.columnLeft)
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        console.log('info.. store == ', store)
        if(store.userToken) this.getDataDeveloper(store.userToken);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})
        if(nextProps.userToken) {
            this.getDataDeveloper(nextProps.userToken);
        }


        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

        if(nextProps.stepOne && nextProps.stepOne.submitSucceeded) {
            console.log('stream form siteFour_page_createOrga.js   ### ', nextProps, nextProps.stepOne.values, " store is..",store)
            if(store && store.userToken) {

                //내용저장하기
                /*
                http --auth-type=jwt --auth=$ORGMANTOKEN POST 127.0.0.1:9900/api/v1/auth/org/create
                name=bigorg type=developer address="123 abc st" phone="123-456-1234"
                 */
                if(this.state.step === 1 && nextProps.stepOne.values) {
                    console.log(nextProps.stepOne.values)
                    serviceOrganiz.organize('createOrg',
                        {name:nextProps.stepOne.values.name, type:nextProps.stepOne.values.type.toLowerCase(), address:nextProps.stepOne.values.address, phone:nextProps.stepOne.values.phone,
                            token:store.userToken}, this.resultCreateOrg, this)
                }
            } else {
                Alert.error('Invalid or expired token', {
                    position: 'top-right',
                    effect: 'slide',
                    timeout: 5000
                });
            }

        }
        /*
        org=bigorg username=worker1 role=DeveloperContributor
         */
        if(nextProps.stepTwo && nextProps.stepTwo.submitSucceeded) {
            console.log('stream form siteFour_page_createOrga.js  git to a role ... ', nextProps, nextProps.stepTwo.values)
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
    resultCreateOrg = (result,resource, self) => {
        console.log("receive == ", result, resource, self)
        if(result.data.error) {
            Alert.error(String(result.data.error), {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
            //setTimeout(()=>_self.gotoPreview('/Logout'), 2000)
        } else {

            Alert.success('Success created organization', {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
            //goto next step
            this.setState({step:2})
        }
    }
    resultGiveToRole = (result,resource, self) => {
        console.log("receive == ", result, resource, self)
        if(result.data.error) {
            Alert.error(String(result.data.error), {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
            //setTimeout(()=>_self.gotoPreview('/Logout'), 2000)
        } else {

            Alert.success('Success created organization', {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
            //goto next step
            this.setState({step:3})
        }
    }
    receiveResult(result,resource, self) {
        console.log("receive == ", result, resource, self)
        if(result.error) {
            Alert.error('Invalid or expired token', {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
            //setTimeout(()=>_self.gotoPreview('/Logout'), 2000)
        } else {
            _self.setState({devData:result})

        }
    }
    getDataDeveloper(token) {
        services.getMCService('showOrg',{token:token}, _self.receiveResult)
    }
    render() {
        const {shouldShowBox, shouldShowCircle, step} = this.state;
        const { activeItem } = this.state
        return (
            <SiteFourOrgaStepView devData={this.state.devData} headerLayout={this.headerLayout} hideHeader={this.hideHeader} stepMove={this.state.step}></SiteFourOrgaStepView>
        );
    }

};

const mapStateToProps = (state) => {
    console.log('props in userToken..', state)
    let formStepOne= state.form.orgaStepOne
        ? {
            values: state.form.orgaStepOne.values,
            submitSucceeded: state.form.orgaStepOne.submitSucceeded
        }
        : {};
    let formStepTwo= state.form.orgaStepTwo
        ? {
            values: state.form.orgaStepTwo.values,
            submitSucceeded: state.form.orgaStepTwo.submitSucceeded
        }
        : {};
    return {
        userToken : (state.user.userToken) ? state.userToken: null,
        userInfo: state.user.user,
        stepOne:formStepOne, stepTwo:formStepTwo
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageCreateorga)));


