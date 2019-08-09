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
import * as services from '../services/service_compute_service';
import './siteThree.css';
import MapWithListView from "../container/mapWithListView";
import Alert from "react-s-alert";
import * as reducer from '../utils'

let _self = null;
let rgn = ['US','KR','EU'];
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
        rgn.map((region) => {
            this.countObject[region] = []
        })
    }
    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        // console.log('info.. store == ', store)
        if(store.userToken) {
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
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})

        if(nextProps.computeRefresh.compute) {
            this.getDataDeveloper(nextProps.changeRegion);
            this.props.handleComputeRefresh(false);
        }
        if(this.props.changeRegion !== nextProps.changeRegion){
            this.getDataDeveloper(nextProps.changeRegion);
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

    receiveResultClusterInst(result) {
        console.log("resultresultresult",result)
        //_self.countObject[result[0]['Region']].push(result[0]['Region'])
        _self.groupJoin(result,'clusterInst', result[0]['Region'])
    }
    receiveResultCloudlet(result) {
        //_self.countObject[result[0]['Region']].push(result[0]['Region'])
        _self.groupJoin(result,'cloudlet', result[0]['Region'])
    }

    groupJoin(result,cmpt, rg){
        let regionGroup = reducer.groupBy(result, 'Region');
        

        console.log("rgnrgnrgn",Object.keys(regionGroup)[0])
        this.props.handleLoadingSpinner(false);
        if(Object.keys(regionGroup)[0]) {
            if(cmpt == 'clusterInst') this.clusterInstDummy = _self.clusterInstDummy.concat(result)
            else if(cmpt == 'cloudlet') this.cloudletDummy = _self.cloudletDummy.concat(result)
        }

        _self.loadCount ++;

        console.log("loadCountloadCount",rgn.length*2,":::",this.loadCount)
        if(rgn.length*2 == this.loadCount){
            console.log("comedfdfdfdf")
            _self.countJoin()
        }
        // try{
        //     console.log("sssssdgdfdfdf",rg,_self.countObject[rg])
        //     if(_self.countObject[rg].length == 2){
        //         _self.countJoin()
        //     }
        // } catch(e) {
        //     alert('Network unstable, Try again')
        // }


    }
    countJoin() {
        let clusterInst = this.clusterInstDummy;
        let cloudlet = this.cloudletDummy;
        console.log("tttttdddd",clusterInst,":::",cloudlet)
        if(clusterInst && clusterInst.length) {
            try{
                clusterInst.map((itemCinst,i) => {
                    cloudlet.map((itemClet,j) => {
                        if(itemCinst.Cloudlet === itemClet.CloudletName) {
                            itemCinst.CloudletLocation = itemClet.CloudletLocation;
                        }
                    })
                })
                _self.setState({devData:clusterInst})
            } catch(e) {

            }

        }


    }
    
    getDataDeveloper = (region) => {
        //_self.props.handleLoadingSpinner(true);
        console.log("changeRegion@@",region)
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
            rgn = ['US','KR','EU'];
        }


        if(localStorage.selectRole == 'AdminManager') {
            rgn.map((item) => {
                // All show clusterInst
                console.log("changeRegionitem",item)
                services.getMCService('ShowCloudlet',{token:store.userToken, region:item}, _self.receiveResultCloudlet)
                services.getMCService('ShowClusterInst',{token:store.userToken, region:item}, _self.receiveResultClusterInst)
                // setTimeout(()=>services.getMCService('ShowCloudlet',{token:store.userToken, region:item}, _self.receiveResultCloudlet), 0);
            })
        } else {
            rgn.map((item) => {
                serviceBody = {
                    "token":store.userToken,
                    "params": {
                        "region":item,
                        "clusterinst":{
                            "key":{
                                "developer": localStorage.selectOrg
                            }
                        }
                    }
                }
                // org별 show clusterInst
                services.getMCService('ShowCloudlet',{token:store.userToken, region:item}, _self.receiveResultCloudlet)
                services.getMCService('ShowClusterInsts',serviceBody, _self.receiveResultClusterInst)
                //setTimeout(()=>services.getMCService('ShowCloudlet',{token:store.userToken, region:item}, _self.receiveResultCloudlet), 0);
            })
        }

    }
    getDataDeveloperSub = () => {
        this.getDataDeveloper('All');
    }
    render() {
        const {shouldShowBox, shouldShowCircle, devData} = this.state;
        const { activeItem, viewMode } = this.state;
        let randomValue = Math.round(Math.random() * 100);
        return (

            //<DeveloperListView devData={this.state.devData} headerLayout={this.headerLayout}></DeveloperListView>
            (viewMode === 'listView')?

                <MapWithListView devData={devData} randomValue={randomValue} headerLayout={this.headerLayout} hiddenKeys={this.hiddenKeys} siteId={'ClusterInst'} title='Cluster Instance' region='US' dataRefresh={this.getDataDeveloperSub}></MapWithListView>
                :
                <PageDetailViewer data={this.state.detailData} page='clusterInst'/>
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
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
        userRole : state.showUserRole?state.showUserRole.role:null,
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
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageClusterInst)));
