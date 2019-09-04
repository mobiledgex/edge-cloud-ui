import React from 'react';


import { withRouter } from 'react-router-dom';

import Alert from "react-s-alert";
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as services from '../services/service_compute_service';
import './siteThree.css';
import MapWithListView from "../container/mapWithListView";
import PageDetailViewer from '../container/pageDetailViewer';
import DeveloperListView from "../container/developerListView";
import * as aggregate from '../utils'

let _self = null;
let rgn = ['US','KR','EU'];
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
            hiddenKeys:['Error','URI', 'Mapped_ports', 'Runtime', 'Created', 'Liveness','Flavor','Status']
        };
        this.headerH = 70;
        this.hgap = 0;
        this.loadCount = 0;

        this.headerLayout = [1,2,2,1,1,2,2,2,1,1,1,1,1,1,1,1,1,1,1];
        this._devData = [];
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
            newHiddenKeys = aggregate.filterDefine(this.state.hiddenKeys, [key.name])
        }

        this.setState({hiddenKeys:newHiddenKeys})

    }

    componentWillMount() {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
    }
    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if(store.userToken) {
            this.getDataDeveloper(this.props.changeRegion);
        }
        this._devData = [];
    }
    componentWillUnmount() {

    }


    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})

        if(nextProps.computeRefresh.compute) {
            this.getDataDeveloper(nextProps.changeRegion);
            this.props.handleComputeRefresh(false);
        }
        if(this.props.changeRegion !== nextProps.changeRegion){
            this.getDataDeveloper(nextProps.changeRegion);
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
        let join = null;
        if(result[0]['Edit']) {
            join = this.state.devData.concat(result);
        } else {
            join = this.state.devData;
        }
        this.loadCount ++;
        this.setState({devData:join})
        this.props.handleLoadingSpinner(false);
        if(rgn.length == this.loadCount-1){
            return
        }
    }

    getDataDeveloper = (region) => {
        console.log("getDataDevelopergetDataDevelopergetDataDeveloper",region)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let serviceBody = {}
        _self.loadCount = 0;
        this.setState({devData:[]})
        if(region !== 'All'){
            rgn = [region]
        } else {
            rgn = ['US','KR','EU'];
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
    getDataDeveloperSub = () => {
        this.getDataDeveloper('All');
    }
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem, viewMode, devData, detailData } = this.state;
        let randomValue = Math.round(Math.random() * 100);
        return (
            (viewMode === 'listView')?
            <MapWithListView devData={devData} randomValue={randomValue} headerLayout={this.headerLayout} hiddenKeys={this.state.hiddenKeys} siteId='appinst' dataRefresh={this.getDataDeveloperSub}></MapWithListView>
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

    return {
        stateChange:stateChange,
        computeRefresh : (state.computeRefresh) ? state.computeRefresh: null,
        changeRegion : state.changeRegion.region?state.changeRegion.region:null,
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
        userRole : state.showUserRole?state.showUserRole.role:null,
        viewMode : viewMode, detailData:detailData,
        headerFilter : state.tableHeader.filter ? state.tableHeader.filter : null
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteFourPageAppInst));
