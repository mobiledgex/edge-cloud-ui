import React from 'react';
import { Grid, Image, Header, Menu, Dropdown, Button } from 'semantic-ui-react';
import sizeMe from 'react-sizeme';
import DeveloperListView from '../container/developerListView';
import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

import * as services from '../services/service_compute_service';
import './siteThree.css';
import MapWithListView from "./siteFour_page_six";
import Alert from "react-s-alert";


let devOptions = [ { key: 'af', value: 'af', text: 'SK Telecom' } ]

let _self = null;
class SiteFourPageOrganization extends React.Component {
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
            liveComp:false
        };
        this.headerH = 70;
        this.hgap = 0;
        this.headerLayout = [2,2,3,3,6]
        //this.hideHeader = ['Address','Phone']
    }
    gotoUrl(site, subPath) {
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.setState({ page:subPath})
    }
    //go to
    gotoPreview(site, page) {
        //브라우져 입력창에 주소 기록
        let mainPath = site;
        let subPath = page;
        _self.props.history.push({
            pathname: mainPath,
            search: subPath,
            state: { some: 'state' }
        });
        _self.props.history.location.search = subPath;


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
        if(store.userToken) this.getDataDeveloper(store.userToken);
    }
    componentWillUnmount() {

        this.setState({liveComp:false})
    }


    componentWillReceiveProps(nextProps) {
        // if(!this.state.liveComp) {
        //     return;
        // }
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})

        if(nextProps.computeRefresh.compute) {
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            if(store.userToken) this.getDataDeveloper(store.userToken);
            this.props.handleComputeRefresh(false);
        }

    }
    receiveResult = (result,resource, self) => {
        console.log("resultresultresultresult",result)
        this.props.handleLoadingSpinner(false);

        if(result.length == 0) {
            _self.setState({devData:[]})
            this.props.handleDataExist(false)
            this.props.handleAlertInfo('error','There is no data')
            //setTimeout(()=>_self.gotoPreview('/site4', 'pg=newOrg'), 2000)
            // _self.gotoUrl('/site4', 'pg=newOrg')  /* CreatOrg 자동 연결... */
        } else {
            _self.setState({devData:result})
            this.props.handleDataExist(true)
            // if(result.length === 0) {
            //     _self.gotoUrl('/site4', 'pg=newOrg')
            // } else {
            //     _self.setState({devData:result})
            // }

        }
    }
    getDataDeveloper(token) {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        services.getMCService('showOrg',{token:store.userToken}, _self.receiveResult)
        services.getMCService('ShowRole',{token:store.userToken}, _self.receiveAdminInfo)
    }
    receiveAdminInfo = (result) => {
        this.props.handleRoleInfo(result.data)
        if(result.error) {

        } else {
            result.data.map((item,i) => {
                if(item.role.indexOf('Admin') > -1){
                    this.props.handleUserRole(item.role);
                    localStorage.setItem('selectRole', item.role)
                }
            })
        }

    }
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (
            <DeveloperListView devData={this.state.devData} headerLayout={this.headerLayout} hideHeader={this.hideHeader} siteId={"Organization"} dataRefresh={this.getDataDeveloper}></DeveloperListView>
            // <DeveloperListView headerLayout={this.headerLayout}></DeveloperListView>
        );
    }

};

const mapStateToProps = (state) => {
    return {
        userToken : (state.user.userToken) ? state.userToken: null,
        userInfo: state.user.user,
        computeRefresh : (state.computeRefresh) ? state.computeRefresh: null
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleRoleInfo: (data) => { dispatch(actions.roleInfo(data))},
        handleUserInfo: (data) => { dispatch(actions.userInfo(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))},
        handleDataExist: (data) => { dispatch(actions.dataExist(data))},
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageOrganization)));
