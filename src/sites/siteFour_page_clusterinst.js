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



let _self = null;
let rgn = ['US','EU'];
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
            clusterInstData:[],
            cloudletData:[],
            liveComp:false,
            viewMode:'listView',
            detailData:null,
        };
        this.headerH = 70;
        this.hgap = 0;
        this.loadCount = 0;

        this.headerLayout = [1,2,2,2,2,1,2,2,1,2];
        this.hiddenKeys = ['Status']

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
        this.setState({liveComp:true})
    }
    componentDidMount() {
        console.log('info.. ', this.childFirst, this.childSecond)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        // console.log('info.. store == ', store)
        if(store.userToken) {
            this.getDataDeveloper(this.props.changeRegion);
        }
    }
    componentWillUnmount() {

        this.setState({liveComp:false})
    }


    componentWillReceiveProps(nextProps) {
        console.log("nextprprprp",nextProps)
        if(!this.state.liveComp) {
            return;
        }
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})

        if(nextProps.computeRefresh.compute) {
            this.getDataDeveloper(nextProps.changeRegion);
            this.props.handleComputeRefresh(false);
        }
        if(this.props.changeRegion !== nextProps.changeRegion){
            console.log("regionChange@@@@")
            this.getDataDeveloper(nextProps.changeRegion);
        }
        if(nextProps.viewMode) {
            if(nextProps.viewMode === 'listView') {
                this.setState({liveComp:false})
                //alert('viewmode..'+nextProps.viewMode+':'+ this.state.devData)
                //this.getDataDeveloper(this.props.changeRegion)
                this.setState({viewMode:nextProps.viewMode})
            } else {
                this.setState({viewMode:nextProps.viewMode})
                setTimeout(() => this.setState({detailData:nextProps.detailData}), 300)
            }

        }
    }
    receiveResult(result) {
        let join = this.state.devData.concat(result);

        if(result.error) {
            Alert.error(result.error, {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
        } else {
            _self.setState({devData:join})
        }
    }

    receiveResultClusterInst(result) {
        _self.groupJoin(result,'clusterInst')
    }
    receiveResultCloudlet(result) {
        _self.groupJoin(result,'cloudlet')
    }

    groupJoin(result,cmpt){

        console.log('cluster inst show app list.. ', result, cmpt, 'load cnt = ', _self.loadCount)
        this.props.handleLoadingSpinner(false);

        if(cmpt == 'clusterInst') this.setState({clusterInstData:_self.state.clusterInstData.concat(result)})
        else if(cmpt == 'cloudlet') this.setState({cloudletData:_self.state.cloudletData.concat(result)})

        _self.countJoin()

        _self.loadCount ++;
    }
    countJoin() {
        if(_self.loadCount + 1 === rgn.length * 2) {
            let clusterInst = this.state.clusterInstData;
            let cloudlet = this.state.cloudletData;
            let arr =[]
            clusterInst.map((itemCinst,i) => {
                cloudlet.map((itemClet,j) => {
                    console.log('cloudletName is == ',itemCinst.Cloudlet, ":", itemClet.CloudletName)
                    if(itemCinst.Cloudlet === itemClet.CloudletName) {
                        itemCinst.CloudletLocation = itemClet.CloudletLocation;
                    }
                })
                if(itemCinst.Cloudlet !== "") arr.push(itemCinst)
            })
            _self.setState({devData:arr, liveComp:true})

            _self.loadCount = 0;
        }

        // default data ??? - in order to display header of table even if has no data.
    }
    
    getDataDeveloper = (region) => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null

        //TODO: region에 대한 데이터를  DB에서 가져와야 함.

        let serviceBody = {}
        _self.setState({devData:[], cloudletData:[], clusterInstData:[]})
        if(region !== 'All'){
            rgn = [region]
        } 

        if(localStorage.userRole == 'AdminManager') {
            rgn.map((item) => {
                // All show clusterInst
                services.getMCService('ShowCloudlet',{token:store.userToken, region:item}, _self.receiveResultCloudlet)
                services.getMCService('ShowClusterInst',{token:store.userToken, region:item}, _self.receiveResultClusterInst)
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
                services.getMCService('ShowClusterInsts',serviceBody, _self.receiveResultClusterInst)
                setTimeout(()=>services.getMCService('ShowCloudlet',{token:store.userToken, region:item}, _self.receiveResultCloudlet), 500);
            })
        }

    }
    getDataDeveloperSub = () => {
        this.getDataDeveloper('All');
    }
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem, viewMode } = this.state
        return (

            //<DeveloperListView devData={this.state.devData} headerLayout={this.headerLayout}></DeveloperListView>
            (viewMode === 'listView')?
                <MapWithListView devData={this.state.devData} headerLayout={this.headerLayout} hiddenKeys={this.hiddenKeys} siteId={'ClusterInst'} title='Cluster Instance' region='US' dataRefresh={this.getDataDeveloperSub}></MapWithListView>
                :
                <PageDetailViewer data={this.state.detailData}/>
        );
    }

};

const mapStateToProps = (state) => {
    console.log('props in state.form..', state.form, 'region === ', state)
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
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageClusterInst)));
