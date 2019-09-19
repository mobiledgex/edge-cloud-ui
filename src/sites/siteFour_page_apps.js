import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as services from '../services/service_compute_service';
import './siteThree.css';
import InsideListView from '../container/insideListView';
import ListDetailViewer from '../container/listDetailViewer';

let _self = null;
let rgn = ['US','KR','EU'];
class SiteFourPageApps extends React.Component {
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
            detailData:[],
            viewMode:'listView',
            randomId:0
        };
        this.headerH = 70;
        this.hgap = 0;
        this.loadCount = 0;

        this.headerLayout = [1,2,2,1,2,2,2,3];
        this.hiddenKeys = ['ImagePath', 'DeploymentMF', 'ImageType', 'Command', 'Cluster','AuthPublicKey','DefaultFQDN','PackageName','ScaleWithCluster']
        this.userToken = null;

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
        if(store && store.userToken) {
            this.getDataDeveloper(store.userToken, this.props.region.value);
            this.userToken = store.userToken;
        }
    }
    componentWillUnmount() {
        this.setState({devData:[]})
    }


    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if(nextProps.receiveNewReg && nextProps.receiveNewReg.values) {
            //services.createNewApp('CreateApp', {params:nextProps.receiveNewReg.values, token:store.userToken, region:'US'}, _self.receiveResult)
        }
        if(this.props.region.value !== nextProps.region.value){
            this.getDataDeveloper(store ? store.userToken : 'null', nextProps.region.value);
        }

        // if(nextProps.region.value) {
        //     let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        //     this.getDataDeveloper(store.userToken, nextProps.region.value)
        // }
        
        if(nextProps.computeRefresh.compute) {
            this.getDataDeveloper(store ? store.userToken : 'null',nextProps.region.value);
            this.props.handleComputeRefresh(false);
        }
        if(nextProps.viewMode) {
            if(nextProps.viewMode === 'listView') {
                this.setState({viewMode:nextProps.viewMode});
                setTimeout(() => this.setState({devData:this.state.devData, randomId:Math.random()*1000}), 300)
            } else {
                this.setState({detailData:nextProps.detailData})
                this.forceUpdate()
                setTimeout(() => this.setState({viewMode:nextProps.viewMode}), 600)
            }

        }
    }
    receiveResult = (result, region) => {
        let join = null;
        if(result[0]['Edit']) {
            join = this.state.devData.concat(result);
        } else {
            join = this.state.devData;
        }
        this.props.handleLoadingSpinner(false);
        this.setState({devData:join})
        this.loadCount ++;
        if(rgn.length == this.loadCount){
            return
        }
    }

    getDataDeveloper = (token, region) => {

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
                // All show app
                services.getMCService('ShowApps',{token:token, region:item}, _self.receiveResult)
                // setTimeout(() => {services.getMCService('ShowApps',{token:token, region:item}, _self.receiveResult)}, 0)
            })
        } else {
            rgn.map((item) => {
                serviceBody = {
                    "token":token,
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
                services.getMCService('ShowApp',serviceBody, _self.receiveResult)
            })
        }
        
    }
    
    getDataDeveloperSub = () => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.getDataDeveloper(store ? store.userToken : 'null', this.props.region.value);
    }

    render() {
        const { viewMode, detailData, devData, randomId } = this.state;
        return (
            (viewMode === 'listView')?
            <InsideListView devData={devData} headerLayout={this.headerLayout} hiddenKeys={this.hiddenKeys} siteId={'App'} randomId={randomId} userToken={this.userToken} dataRefresh={this.getDataDeveloperSub}></InsideListView>
                :
                <ListDetailViewer data={detailData} dimmer={false} open={this.state.openDetail} close={this.closeDetail} siteId={this.props.siteId}></ListDetailViewer>
        );
    }

};

const mapStateToProps = (state) => {

    let registNew= state.form.registNewListInput
        ? {
            values: state.form.registNewListInput.values,
            submitSucceeded: state.form.registNewListInput.submitSucceeded
        }
        : {};
    let region = state.changeRegion
        ? {
            value: state.changeRegion.region
        }
        : {};
    let viewMode = null;
    let detailData = null;
    if(state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
        detailData = state.changeViewMode.mode.data;
    }
    return {
        receiveNewReg:registNew,
        region:region,
        computeRefresh : (state.computeRefresh) ? state.computeRefresh: null,
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
        userRole : state.showUserRole?state.showUserRole.role:null,
        viewMode : viewMode, detailData:detailData,
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageApps)));
