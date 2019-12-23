import React from 'react';
import { Grid, Image, Header, Menu, Dropdown, Button } from 'semantic-ui-react';
import sizeMe from 'react-sizeme';
import InstanceListView from '../container/instanceListView';
import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
import PagePoolDetailViewer from '../container/pagePoolDetailViewer';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as services from '../services/service_cloudlet_pool';
import './siteThree.css';
import InsideListView from "../container/insideListView";
import Alert from "react-s-alert";
import * as reducer from '../utils'


let _self = null;
let rgn = [];
class SiteFourPageCloudletPool extends React.Component {
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
            regions:[],
            regionToggle:false,
            dataSort:false,
            changeRegion:null
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
        // this.getDataDeveloper(this.props.changeRegion);
        this.userToken = store.userToken;
        //test...
        this.createCloudletPoolMember('EU', 'TDG', 'frankfurt-eu', 'bicCloudletPool20191220-1')
    }
    componentWillUnmount() {
        this._devData = [];
        this._cloudletDummy = [];
    }

    componentWillReceiveProps(nextProps) {
        console.log("20191119 ..cloudlet 11 region info in page cloudlet",nextProps.changeRegion,"-- : --",this.state.changeRegion,": props region ==>",nextProps.regionInfo.region,": state region==>",this.state.regions)

        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})
        if(nextProps.viewMode) {
            if(nextProps.viewMode === 'listView') {
                //alert('viewmode..'+nextProps.viewMode+':'+ this.state.devData)
                //this.getDataDeveloper(this.props.changeRegion)
                this.setState({viewMode:nextProps.viewMode})
            } else {
                this.setState({viewMode:nextProps.viewMode})
                // setTimeout(() => this.setState({detailData:nextProps.detailData}), 300)
                this.setState({detailData:nextProps.detailData})
            }

        }
        if(this.state.changeRegion !== nextProps.changeRegion){
            console.log("20191119 ..cloudlet 22 nextProps.changeRegion = ",nextProps.changeRegion,"-- : --",this.props.changeRegion)
            this.setState({changeRegion: nextProps.changeRegion})
            this.getDataDeveloper(nextProps.changeRegion, this.state.regions);
            ///care pool test
            //this.createCloudletPool('EU','bicCloudletPool20191220-3');
        } else {

        }
        if(nextProps.computeRefresh.compute) {
            console.log('20191119 computeRefresh..')
            this._cloudletDummy = [];
            this.getDataDeveloper(nextProps.changeRegion);
            this.props.handleComputeRefresh(false);
            this.setState({dataSort:true});
        }

        if(nextProps.regionInfo.region.length && !this.state.regionToggle) {
            //{ key: 1, text: 'All', value: 'All' }
            console.log("20191119 ..cloudlet 33 region info in page cloudlet")
            _self.setState({regionToggle:true,regions:nextProps.regionInfo.region})
            this.getDataDeveloper(nextProps.changeRegion,nextProps.regionInfo.region);
        }




    }
    receiveResult = (result) => {
        console.log('20191220 receive result cloudlet pool...', JSON.stringify(result));
        // @inki if data has expired token
        if(result.error && result.error.indexOf('Expired') > -1) {
            _self.props.handleAlertInfo('error', result.error);
            setTimeout(() => _self.gotoUrl('/logout'), 4000);
            _self.props.handleComputeRefresh(false);
            _self.props.handleLoadingSpinner(false);
            return;
        }

        let regionGroup = (!result.error) ? reducer.groupBy(result, 'Region'):{};
        if(Object.keys(regionGroup)[0]) {
            _self._cloudletDummy = _self._cloudletDummy.concat(result)
        }

        this.loadCount ++;
        console.log("20191220 ..cloudlet EditEditEdit",rgn.length,":::",this.loadCount)
        if(rgn.length == this.loadCount){
            _self.countJoin()            
        }
        _self.props.handleLoadingSpinner(false);

        // let join = null;
        // if(result[0]['Edit']) {
        //     join = this.state.devData.concat(result);
        // } else {
        //     join = this.state.devData;
        // }
        // this.loadCount ++;
        // this.setState({devData:join})
        // this.props.handleLoadingSpinner(false);
        // if(rgn.length == this.loadCount-1){
        //     return
        // }

    }

    // receiveResult = (result) => {
    //     console.log('20191220 receive result cloudlet pool...', JSON.stringify(result));
    // }
    receiveResultCreate = (result) => {
        console.log('20191220 receive result cloudlet pool create ...', JSON.stringify(result));
    }
    receiveResultMember = (result) => {
        console.log('20191220 receive result cloudlet pool member  ...', JSON.stringify(result));
    }
    receiveResultCreateMember = (result) => {
        console.log('20191220 receive result cloudlet pool create member  ...', JSON.stringify(result));
    }

    countJoin() {
        let cloudlet = this._cloudletDummy;
        console.log('20191119 ..cloudlet---', cloudlet)
        _self.setState({devData:cloudlet,dataSort:false})
        this.props.handleLoadingSpinner(false);
    }


    getDataDeveloper = (region,regionArr) => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({devData:[]})
        this._cloudletDummy = [];
        _self.loadCount = 0;
        if(region !== 'All'){
            rgn = [region]
        } else {
            rgn = (regionArr)?regionArr:this.props.regionInfo.region;
        }

        rgn.map((item, i) => {
            services.getListCloudletPool('ShowCloudletPool',{token:store.userToken, region:item}, _self.receiveResult)
            //services.getListCloudletPoolMember('ShowCloudletPoolMember',{token:store.userToken, region:item}, _self.receiveResultMember)
        })
        this.props.handleLoadingSpinner(true);

    }
    createCloudletPool = (_region, _poolName) => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        services.createCloudletPool('CreateCloudletPool',{token:store.userToken, region:_region, name:_poolName}, _self.receiveResultCreate)
    }
    /*
       example : region=EU operator=TDG cloudlet=deleteme pool=DeletemePool
     */
    createCloudletPoolMember = (_region, _oper, _cloudlet, _pool) => {
        //TODO: 맴버 가져오기
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let _params = {region: _region, operator: _oper, cloudlet: _cloudlet, pool:_pool};
        services.createCloudletPoolMember('CreateCloudletPoolMember',{token:store.userToken, params:_params}, _self.receiveResultCreateMember)

    }

    getDataDeveloperSub = (region) => {
        let _region = (region)?region:'All';
        this.getDataDeveloper(_region);
        _self.props.handleComputeRefresh(false);
    }
    render() {
        const {shouldShowBox, shouldShowCircle, devData} = this.state;
        const { activeItem, viewMode } = this.state;
        let randomValue = Math.round(Math.random() * 100);
        return (
            (viewMode === 'listView')?
                <InsideListView devData={devData} headerLayout={this.headerLayout} hiddenKeys={this.hiddenKeys} siteId={'Cloudlet Pool'} userToken={this.userToken} dataRefresh={this.getDataDeveloperSub}></InsideListView>
            :
            <PagePoolDetailViewer data={this.state.detailData} page='cloudletPool'/>
        );
    }

};
SiteFourPageCloudletPool.defaultProps = {
    changeRegion : ''
}


const mapStateToProps = (state) => {
    console.log("20191119 regionssInfo",state.regionInfo,":", state.changeRegion)
    let viewMode = null;
    let detailData = null;

    if(state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
        detailData = state.changeViewMode.mode.data;
    }
    let regionInfo = (state.regionInfo)?state.regionInfo:null;
    return {
        computeRefresh : (state.computeRefresh) ? state.computeRefresh: null,
        changeRegion : state.changeRegion?state.changeRegion.region:null,
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageCloudletPool)));
