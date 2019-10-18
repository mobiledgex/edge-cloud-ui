import React from 'react';
import { Grid, Image, Header, Menu, Dropdown, Button } from 'semantic-ui-react';
import sizeMe from 'react-sizeme';
import InstanceListView from '../container/instanceListView';
import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
import PageDetailViewer from '../container/pageDetailViewer';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as services from '../services/service_audit_api';
import './siteThree.css';
import TimelineAuditView from "../container/timelineAuditView";
import Alert from "react-s-alert";
import * as reducer from '../utils'


let _self = null;
let rgn = ['US','KR','EU'];
class SiteFourPageAudits extends React.Component {
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
            viewMode:'listView',
            auditMounted:false
        };
        this.headerH = 70;
        this.hgap = 0;
        this.hiddenKeys = ['Ip_support', 'Num_dynamic_ips','Status','Physical_name','Platform_type'];
        this.headerLayout = [1,3,3,3,2,2,2];
        this.userToken = null;
        this._devData = [];
        this.loadCount = 0;
        this._cloudletDummy = [];
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
    readyToData(subPaths) {
        console.log('20191018 subPaths.subPaths...', subPaths,":",subPaths.indexOf('&org='))
        let subPath = '';
        let subParam = null;
        if(subPaths.indexOf('&org=') > -1) {
            let paths = subPaths.split('&')
            subPath = paths[0];
            subParam = paths[1];
        }
        this.setState({devData:[]})
        this.setState({page:subPath, OrganizationName:subParam})
        this.props.handleLoadingSpinner(true);
        // get audits data
        this.getDataAudit(subParam);
    }


    componentWillMount() {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {

        if(this.props.location && this.props.location.search) {
            this.readyToData(this.props.location.search)

        }
    }
    componentWillUnmount() {
        this._devData = [];
        this._cloudletDummy = [];

    }


    componentWillReceiveProps(nextProps, nextContext) {

        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})
        if(nextProps.viewMode) {
            if(nextProps.viewMode === 'listView') {
                this.setState({viewMode:nextProps.viewMode})
            } else {
                this.setState({viewMode:nextProps.viewMode})
                setTimeout(() => this.setState({detailData:nextProps.detailData}), 300)
            }
        }
        //
        if(nextProps.location && nextProps.location.search && (nextProps.location.search !== this.props.location.search)) {
            console.log('20191018 nextProps.props...', nextProps.location.search, ":", this.props.location.search)
            this.setState({auditMounted:true})
            this.readyToData(nextProps.location.search);
        }

        /*

        */
    }
    receiveResult = (result) => {
        console.log('20191018 audit result..', result)
        this.loadCount ++;
        this.setState({devData:result})
        this.props.handleLoadingSpinner(false);
        if(rgn.length == this.loadCount-1){
            return
        }

    }
    countJoin() {
        let cloudlet = this._cloudletDummy;
        _self.setState({devData:cloudlet})
        this.props.handleLoadingSpinner(false);
    }
    makeOga = (logName) => {
        let lastSub = logName.substring(logName.lastIndexOf('=')+1);
        return lastSub
    }
    getDataAudit = (orgName) => {
        // this.props.handleLoadingSpinner(true);
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({devData:[]})
        this._cloudletDummy = [];
        _self.loadCount = 0;

        if(orgName) {
            services.showAuditOrg('ShowOrg',{token:store.userToken, params:`{"org":"${_self.makeOga(orgName)}"}`, limit:100}, _self.receiveResult, _self)
        } else {
            services.showAuditSelf('ShowSelf',{token:store.userToken, params:'{}', limit:70}, _self.receiveResult, _self)
        }
    }

    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem, viewMode } = this.state;
        let randomValue = Math.round(Math.random() * 100);
        return (
            (viewMode === 'listView')?
            <TimelineAuditView data={this.state.devData} randomValue={randomValue} headerLayout={this.headerLayout} hiddenKeys={this.hiddenKeys} siteId={'Audit'} userToken={this.userToken} mounted={this.state.auditMounted}></TimelineAuditView>
            :
            <div></div>
        );
    }

};

const mapStateToProps = (state) => {
    let viewMode = null;
    let detailData = null;

    if(state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
        detailData = state.changeViewMode.mode.data;
    }
    return {
        computeRefresh : (state.computeRefresh) ? state.computeRefresh: null,
        changeRegion : state.changeRegion.region?state.changeRegion.region:null,
        viewMode : viewMode, detailData:detailData
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))},
        handleDetail: (data) => { dispatch(actions.changeDetail(data))},
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageAudits)));
