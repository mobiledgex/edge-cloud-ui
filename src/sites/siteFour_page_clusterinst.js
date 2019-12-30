import React from 'react';
import { withRouter } from 'react-router-dom';
import PageDetailViewer from '../container/pageDetailViewer';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as serviceMC from '../services/serviceMC';
import './siteThree.css';
import MapWithListView from "../container/mapWithListView_new";
import Alert from "react-s-alert";
import * as reducer from '../utils'

let _self = null;
let rgn = [];
class SiteFourPageClusterInst extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            contHeight:0,
            contWidth:0,
            bodyHeight:0,
            devData:[],
            viewMode:'listView',
            detailData:null,
            regionToggle:false,
            dataSort:false
        };
        this.clusterInstDummy = [];
        this.cloudletDummy = [];
        this.headerH = 70;
        this.hgap = 0;
        this.loadCount = 0;
        this.countObject = {};
        this.headerLayout = [1,2,2,2,2,1,2,2,1,2];
        this.hiddenKeys = ['Status','Deployment']

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
        rgn.map((region) => {
            this.countObject[region] = []
        })
    }
    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if(store && store.userToken) {
            this.getDataDeveloper(this.props.changeRegion);
        }
    }
    componentWillUnmount() {
        this.clusterInstDummy = [];
        this.cloudletDummy = [];
        this.setState({devData:[]})
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
            _self.setState({regionToggle:true,regions:nextProps.regionInfo.region})
            this.getDataDeveloper(nextProps.changeRegion,nextProps.regionInfo.region);
        }
        if(nextProps.viewMode) {
            if(nextProps.viewMode === 'listView') {
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
    receiveResult(result) {
        let join = null;
        if(result[0]['Edit']) {
            join = this.state.devData.concat(result);
        } else {
            join = this.state.devData;
        }

        if(result.error) {
            this.props.handleAlertInfo('error',result.error)
        } else {
            _self.setState({devData:join})
        }
    }

    receiveResultClusterInst(mcRequest) {
        let result = mcRequest.data;
        _self.props.handleLoadingSpinner();
        // @inki if data has expired token
        if(result.error && result.error.indexOf('Expired') > -1) {
            _self.props.handleAlertInfo('error', result.error);
            setTimeout(() => _self.gotoUrl('/logout'), 4000);
            _self.props.handleLoadingSpinner(false);
            return;
        }

        //_self.countObject[result[0]['Region']].push(result[0]['Region'])
        // console.log('20191004 ', result)
        // if(result.length) {
        //     if(result[0]['Region'] === "") {
        //         _self.props.handleLoadingSpinner(false);
        //         //_self.props.handleAlertInfo('error', 'There is no data to display')
        //     } else {

        //     }
        //     _self.groupJoin(result,'clusterInst', result[0]['Region'])
        // }
        _self.props.handleLoadingSpinner(false);
        _self.groupJoin(result,'clusterInst')
    }
    receiveResultCloudlet(mcRequest) {
        let result = mcRequest.data;
        // @inki if data has expired token
        if(result.error && result.error.indexOf('Expired') > -1) {
            _self.props.handleAlertInfo('error', result.error);
            setTimeout(() => _self.gotoUrl('/logout'), 4000);
            _self.props.handleLoadingSpinner();
            return;
        }
        //_self.countObject[result[0]['Region']].push(result[0]['Region'])
        _self.props.handleLoadingSpinner();
        _self.groupJoin(result,'cloudlet')
    }

    groupJoin(result,cmpt){
        let regionGroup = (!result.error) ? reducer.groupBy(result, 'Region'):{};
        if(Object.keys(regionGroup)[0]) {
            if(cmpt == 'clusterInst') this.clusterInstDummy = _self.clusterInstDummy.concat(result)
            else if(cmpt == 'cloudlet') this.cloudletDummy = _self.cloudletDummy.concat(result)
        }
        _self.loadCount ++;
        if(rgn.length*2 == this.loadCount){
            _self.countJoin()
        }
        

    }
    countJoin() {
        let clusterInst = this.clusterInstDummy;
        let cloudlet = this.cloudletDummy;
        this.props.handleLoadingSpinner(false);
        if(clusterInst && clusterInst.length) {
            try{
                clusterInst.map((itemCinst,i) => {
                    cloudlet.map((itemClet,j) => {
                        if(itemCinst.Cloudlet === itemClet.CloudletName) {
                            itemCinst.CloudletLocation = itemClet.CloudletLocation;
                        }
                    })
                })
                _self.setState({devData:clusterInst,dataSort:false})
            } catch(e) {

            }

        }


    }
    
    getDataDeveloper = (region,regionArr) => {
        _self.props.handleLoadingSpinner(true);
        _self.loadCount = 0;
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        _self.clusterInstDummy = [];
        _self.cloudletDummy = [];
        _self.setState({devData:[]})
        //TODO: region에 대한 데이터를  DB에서 가져와야 함.

        let serviceBody = {}
        _self.setState({devData:[], cloudletData:[], clusterInstData:[]})
        if(region !== 'All'){
            rgn = [region];
        } else {
            rgn = (regionArr)?regionArr:this.props.regionInfo.region;
        }
        
        let token = store ? store.userToken : 'null';
        if(localStorage.selectRole == 'AdminManager') {
            rgn.map((item) => {
                
                serviceMC.sendRequest({token:token,method : serviceMC.SHOW_CLOUDLET, data : {region:item}}, _self.receiveResultCloudlet)
                serviceMC.sendRequest({token:token,method : serviceMC.SHOW_CLUSTER_INST, data : {region:item}}, _self.receiveResultClusterInst)
            })
        } else {
            rgn.map((item) => {
                let data = {
                        "region":item,
                        "clusterinst":{
                            "key":{
                                "developer": localStorage.selectOrg
                            }
                        }
                }
                serviceMC.sendRequest({token:token,method : serviceMC.SHOW_CLOUDLET, data : {region:item}}, _self.receiveResultCloudlet)
                serviceMC.sendRequest({token:token,method : serviceMC.SHOW_CLUSTER_INST, data : data}, _self.receiveResultClusterInst)
            })
        }

    }
    getDataDeveloperSub = (region) => {
        let _region = (region)?region:'All';
        this.getDataDeveloper(_region);
    }
    render() {
        const {shouldShowBox, shouldShowCircle, devData} = this.state;
        const { activeItem, viewMode } = this.state;
        let randomValue = Math.round(Math.random() * 100);
        return (

            //<DeveloperListView devData={this.state.devData} headerLayout={this.headerLayout}></DeveloperListView>
            (viewMode === 'listView')?

                <MapWithListView devData={devData} randomValue={randomValue} headerLayout={this.headerLayout} hiddenKeys={this.hiddenKeys} siteId={'ClusterInst'} region='US' dataRefresh={this.getDataDeveloperSub} dataSort={this.state.dataSort}></MapWithListView>
                :
                <PageDetailViewer className="ttt" data={this.state.detailData} page='clusterInst'/>
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
    let regionInfo = (state.regionInfo)?state.regionInfo:null;
    return {
        computeRefresh : (state.computeRefresh) ? state.computeRefresh: null,
        changeRegion : state.changeRegion.region?state.changeRegion.region:null,
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
        userRole : state.showUserRole?state.showUserRole.role:null,
        viewMode : viewMode, detailData:detailData,
        regionInfo: regionInfo
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteFourPageClusterInst));
