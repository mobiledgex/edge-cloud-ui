import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';

//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

import SiteFourOrgaStepView from '../container/siteFourOrgaStepView';
import './siteThree.css';
import * as serviceMC from '../services/serviceMC';
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
            step:1,
            toggleSubmit:false,
            toggleSubmitTwo:false
        };
        this.headerH = 70;
        this.hgap = 0;
        this.headerLayout = [3,3,3,3,4]
        //this.hideHeader = ['Address','Phone']
    }
    gotoUrl(site, subPath) {
        let mainPath = site;
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:mainPath, subPath: subPath})

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
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if(store && store.userToken) this.getDataDeveloper(store.userToken);
    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})
        if(nextProps.userToken) {
            this.getDataDeveloper(nextProps.userToken);
        }


        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

        if(nextProps.stepOne && nextProps.stepOne.submitSucceeded && !this.state.toggleSubmit) {
            this.setState({toggleSubmit:true});
            _self.props.handleLoadingSpinner(true);
            serviceOrganiz.organize('createOrg',
                {
                    name:nextProps.stepOne.values.name,
                    type:nextProps.stepOne.values.type.toLowerCase(),
                    address:nextProps.stepOne.values.address,
                    phone:nextProps.stepOne.values.phone,
                    token:store ? store.userToken : 'null'
                }, this.resultCreateOrg, this)
            
        }
        /*
        org=bigorg username=worker1 role=DeveloperContributor
         */
        if(nextProps.stepTwo && nextProps.stepTwo.submitSucceeded && !this.state.toggleSubmitTwo) {
            this.setState({toggleSubmitTwo:true});
            this.props.handleLoadingSpinner(true);
            let _username = nextProps.stepTwo.values && nextProps.stepTwo.values.username || '';
            let _org = nextProps.stepTwo.values && nextProps.stepTwo.values.orgName || '';
            let _role = nextProps.stepTwo.values && nextProps.stepTwo.values.orgType+nextProps.stepTwo.values.selectRole || '';
            serviceOrganiz.organize('addUserRole',
                {
                        username:_username,
                        org:_org,
                        role:_role,
                        token:store ? store.userToken : 'null'
                }, this.resultGiveToRole, this)
        }

    }
    resultCreateOrg = (result,resource, self, body) => {
        this.setState({toggleSubmit:false})
        _self.props.handleLoadingSpinner(false);
        if(result.data.error) {
            this.props.handleAlertInfo('error',String(result.data.error))
        } else {
            this.props.handleAlertInfo('success','Your organization '+body.name+' created successfully')
            //goto next step
            this.props.handleChangeStep('02')
            this.setState({step:2})
        }
    }
    resultGiveToRole = (result,resource, self, body) => {
        this.setState({toggleSubmitTwo:false})
        _self.props.handleLoadingSpinner(false);
        if(result.data.error) {
            this.props.handleAlertInfo('error',String(result.data.error))
        } else {
            this.props.handleAlertInfo('success','User '+body.username+' added to organization '+body.org+' successfully')
            //goto next step
            //this.setState({step:3})
        }
    }
    receiveResult(mcRequest) {
        let result = mcRequest.data;
        // @inki if data has expired token
        if(result.error && result.error.indexOf('Expired') > -1) {
            _self.props.handleAlertInfo('error', result.error);
            setTimeout(() => _self.gotoUrl('/logout'), 4000);
            _self.props.handleLoadingSpinner(false);
            return;
        }

        if(result.error) {

        } else {
            _self.setState({devData:result})

        }
        _self.props.handleLoadingSpinner(false);
    }
    getDataDeveloper(token) {
        serviceMC.sendRequest({token:token, method:serviceMC.SHOW_ORG}, _self.receiveResult)
    }
    render() {
        const {shouldShowBox, shouldShowCircle, step} = this.state;
        const { activeItem } = this.state
        return (
            <SiteFourOrgaStepView devData={this.state.devData} headerLayout={this.headerLayout} hideHeader={this.hideHeader} stepMove={this.state.step} toggleSubmit={this.state.toggleSubmit} toggleSubmitTwo={this.state.toggleSubmitTwo}></SiteFourOrgaStepView>
        );
    }

};

const mapStateToProps = (state) => {
    let formStepOne= state.form.orgaStepOne
        ? {
            values: state.form.orgaStepOne.values,
            submitSucceeded: state.form.orgaStepOne.submitSucceeded,
            submitFailed: state.form.orgaStepOne.submitFailed
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
        handleChangeStep: (data) => { dispatch(actions.changeStep(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageCreateorga)));


