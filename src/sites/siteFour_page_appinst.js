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


let _self = null;
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
            liveComp:false
        };
        this.headerH = 70;
        this.hgap = 0;

        this.headerLayout = [1,2,2,1,1,2,1,2];
        this.hiddenKeys = ['Error','URI', 'Mapped_ports', 'Runtime', 'Created', 'Liveness','Flavor','Status']
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
        this.setState({liveComp:true})
    }
    componentDidMount() {
        console.log('info.. ', this.childFirst, this.childSecond)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        // console.log('info.. store == ', store,this.props.changeRegion)
        if(store.userToken) {
            this.getDataDeveloper(this.props.changeRegion);
        }
    }
    componentWillUnmount() {

        this.setState({liveComp:false})
    }


    componentWillReceiveProps(nextProps) {
        if(!this.state.liveComp) {
            return;
        }
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
                this.getDataDeveloper(this.props.changeRegion)
                this.setState({viewMode:nextProps.viewMode})
            } else {
                this.setState({viewMode:nextProps.viewMode})
                setTimeout(() => this.setState({detailData:nextProps.detailData}), 300)
            }

        }

    }
    receiveResult = (result) => {
        let join = _self.state.devData.concat(result);
        this.props.handleLoadingSpinner(false);
        console.log("receive == ", result)
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
    getDataDeveloper = (region) => {
        console.log("appinst@@gogo")
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let rgn = ['US','EU'];
        let serviceBody = {}
        this.setState({devData:[]})
        if(region !== 'All'){
            rgn = [region]
        }  
 
        if(localStorage.selectRole == 'AdminManager') {
            rgn.map((item) => {
                // All show appInst
                services.getMCService('ShowAppInst',{token:store.userToken, region:item}, _self.receiveResult)
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
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem, viewMode } = this.state
        return (
            (viewMode === 'listView')?
            <MapWithListView devData={this.state.devData} headerLayout={this.headerLayout} hiddenKeys={this.hiddenKeys} siteId='appinst' dataRefresh={this.getDataDeveloper}></MapWithListView>
            :
            <PageDetailViewer data={this.state.detailData}/>
        );
    }

};

const mapStateToProps = (state) => {

    console.log('change --- --- --- --- -- ',state)
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteFourPageAppInst));
