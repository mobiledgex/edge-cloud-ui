import React from 'react';


import { withRouter } from 'react-router-dom';
import sizeMe from 'react-sizeme';
import Alert from "react-s-alert";
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as services from '../services/service_compute_service';
import './siteThree.css';
import MapWithListView from "../container/mapWithListView";
import PageDetailViewer from '../container/pageDetailViewer';
import DeveloperListView from "../container/developerListView";
import * as reducer from '../utils'

let _self = null;
let rgn = [];
class SiteFourPageAppInst extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            bodyHeight:0,
            devData:[],
            viewMode:'listView',
            detailData:null,
            hiddenKeys:['Error','URI', 'Mapped_ports', 'Runtime', 'Created', 'Liveness','Flavor','Status','Revision'],
            AppRevision:[],
            regionToggle:false,
            dataSort:false
        };
        this.headerH = 70;
        this.hgap = 0;
        this.loadCount = 0;

        this.headerLayout = [2,2,2,1,1,2,2,2,1,4];
        this._devData = [];
        this._AppInstDummy = [];
        this._diffRev = []
    }
    gotoUrl(site, subPath) {
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;

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
    setHiddenKey(key) {
        let copyHiddenKeys = Object.assign([],this.state.hiddenKeys)
        let newHiddenKeys = [];
        if(key.hidden === true) {
            newHiddenKeys = copyHiddenKeys.concat(key.name)

        } else {
            //remove key from hiddenKeys
            newHiddenKeys = reducer.filterDefine(this.state.hiddenKeys, [key.name])
        }

        this.setState({hiddenKeys:newHiddenKeys})

    }

    componentWillMount() {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
    }
    componentDidMount() {
        // let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        // if(store.userToken) {
        //     this.getDataDeveloper(this.props.changeRegion);
        //     // this.getUpdateData(this.props.changeRegion);
        // }
        this._devData = [];
    }
    componentWillUnmount() {
        this._AppInstDummy = []
    }


    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})

        if(nextProps.computeRefresh.compute) {
            this.getDataDeveloper(nextProps.changeRegion);
            this.props.handleComputeRefresh(false);
            this.setState({dataSort:true});
        }
        if(this.props.changeRegion !== nextProps.changeRegion){
            this.getDataDeveloper(nextProps.changeRegion);
        }
        if(nextProps.regionInfo.region.length && !this.state.regionToggle) {
            _self.setState({regionToggle:true})
            this.getDataDeveloper(nextProps.changeRegion,nextProps.regionInfo.region);
        }
        if(nextProps.viewMode) {
            if(nextProps.viewMode === 'listView') {

                //alert('viewmode..'+nextProps.viewMode+':'+ this.state.devData)
                //this.getDataDeveloper(this.props.changeRegion)
                this.setState({viewMode:nextProps.viewMode})
            } else {
                this.setState({detailData:nextProps.detailData})
                this.forceUpdate()
                setTimeout(() => this.setState({viewMode:nextProps.viewMode}), 600)
            }

        }

        //make hidden key
        let tbHeader = nextProps.headerFilter;
        if(tbHeader) {
            this.setHiddenKey(tbHeader)
        }
        setTimeout(() => this.forceUpdate(), 1000)

    }
    receiveResult = (result) => {
        // @inki if data has expired token
        let scope = this;
        if(result.error && result.error.indexOf('Expired') > -1) {
            scope.props.handleAlertInfo('error', result.error);
            setTimeout(() => scope.gotoUrl('/logout'), 2000);
            return;
        }

        let regionGroup = (!result.error) ? reducer.groupBy(result, 'Region'):{};
        if(Object.keys(regionGroup)[0]) {
            this._AppInstDummy = this._AppInstDummy.concat(result)
        }
        this.loadCount ++;
        if(rgn.length == this.loadCount){
            this.countJoin()            
        }

        // console.log("appinstresult",result)
        // let join = null;
        // if(!result.error && result[0]['Edit']) {
        //     join = this.state.devData.concat(result);
        // } else {
        //     join = this.state.devData;
        // }
        // this.loadCount ++;
        // this.setState({devData:join})
        // this.props.handleLoadingSpinner(false);
        // console.log("rgn.lengthrgn.length",rgn.length,":::",this.loadCount)
        // if(rgn.length == this.loadCount-1){
        //     return
        // }
    }
    countJoin() {
        let AppInst = this._AppInstDummy;
        _self.setState({devData:AppInst,dataSort:false})
        this.props.handleLoadingSpinner(false);
        this.getUpdateData(this.props.changeRegion);
    }
    receiveResultApp = (result) => {
        let diff = []
        this._diffRev = [];
        if(!result.error){
            result.map((item) => {
                this.state.devData.map((_data) => {
                    if(item.Region == _data.Region && item.AppName == _data.AppName && item.OrganizationName == _data.OrganizationName && item.Revision != _data.Revision){
                        this._diffRev.push(_data)
                    }
                })
            })
            this.forceUpdate();
        }
        
    }

    getDataDeveloper = (region,regionArr) => {
        this.props.handleLoadingSpinner(true);
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let serviceBody = {}
        this.loadCount = 0;
        this.setState({devData:[]})
        this._AppInstDummy = []
        if(region !== 'All'){
            rgn = [region]
        } else {
            rgn = (regionArr)?regionArr:this.props.regionInfo.region;
        }
 
        if(localStorage.selectRole == 'AdminManager') {
            rgn.map((item) => {
                // All show appInst
                services.getMCService('ShowAppInst',{token:store ? store.userToken : 'null', region:item}, _self.receiveResult)
            })
        } else {
            rgn.map((item) => {
                serviceBody = {
                    "token":store.userToken,
                    "params": {
                        "region":item,
                        "appinst":{
                            "key":{
                                "app_key": {
                                    "developer_key":{"name":localStorage.selectOrg},
                                }
                            }
                        }
                    }
                }
                // org별 show appInst
                services.getMCService('ShowAppInsts',serviceBody, _self.receiveResult)
            })
        }
    }
    getDataDeveloperSub = (region) => {
        console.log("getDataDeveloperSubsss",region)
        this._diffRev = []
        let _region = (region)?region:'All';
        this.getDataDeveloper(_region);
    }
    getUpdateData = (region) => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let serviceBody = {}
        if(region !== 'All'){
            rgn = [region]
        } else {
            rgn = this.props.regionInfo.region;
        }

        if(localStorage.selectRole == 'AdminManager') {
            rgn.map((item) => {
                // All show app
                services.getMCService('ShowApps',{token:store ? store.userToken : 'null', region:item}, _self.receiveResultApp)
            })
        } else {
            rgn.map((item) => {
                serviceBody = {
                    "token":store ? store.userToken : 'null',
                    "params": {
                        "region":item,
                        "app":{
                            "key":{
                                "developer_key":{"name":localStorage.selectOrg},
                            }
                        }
                    }
                }
                // org별 show app
                services.getMCService('ShowApp',serviceBody, _self.receiveResultApp)
            })
        }
    }
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem, viewMode, devData, detailData } = this.state;
        let randomValue = Math.round(Math.random() * 100);
        return (
            (viewMode === 'listView')?
            <MapWithListView devData={devData} randomValue={randomValue} headerLayout={this.headerLayout} hiddenKeys={this.state.hiddenKeys} siteId='appinst' dataRefresh={this.getDataDeveloperSub} diffRev={this._diffRev} dataSort={this.state.dataSort}></MapWithListView>
            :
            <PageDetailViewer data={detailData} page='appInst'/>
        );
    }

};

const mapStateToProps = (state) => {

    let stateChange = false;
    if(state.receiveDataReduce.params && state.receiveDataReduce.params.state === 'refresh'){
        stateChange = true;
    }
    let viewMode = null;
    let detailData = null;
    if(state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
        detailData = state.changeViewMode.mode.data;
    }
    let regionInfo = (state.regionInfo)?state.regionInfo:null;
    return {
        stateChange:stateChange,
        computeRefresh : (state.computeRefresh) ? state.computeRefresh: null,
        changeRegion : state.changeRegion.region?state.changeRegion.region:null,
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
        userRole : state.showUserRole?state.showUserRole.role:null,
        viewMode : viewMode, detailData:detailData,
        headerFilter : state.tableHeader.filter ? state.tableHeader.filter : null,
        regionInfo: regionInfo
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageAppInst)));
