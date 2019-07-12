import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as services from '../services/service_compute_service';
import './siteThree.css';
import DeveloperListView from '../container/developerListView';
import Alert from "react-s-alert";

let _self = null;
let rgn = ['US','EU'];
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
            liveComp:true
        };
        this.headerH = 70;
        this.hgap = 0;
        this.loadCount = 0;

        this.headerLayout = [1,2,2,1,2,2,2,3];
        this.hiddenKeys = ['ImagePath', 'DeploymentMF', 'ImageType', 'Command', 'Cluster']
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
        console.log('info..will mount ', this.columnLeft)
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
        this.setState({liveComp:true})
    }
    componentDidMount() {
        console.log('infof.. ', this.childFirst, this.childSecond)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        // console.log('info.. store == ', store)
        if(store.userToken) {
            this.getDataDeveloper(store.userToken, this.props.region.value);
            this.userToken = store.userToken;
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
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if(nextProps.receiveNewReg && nextProps.receiveNewReg.values) {
            console.log('submit on...', nextProps.receiveNewReg.values)
            //services.createNewApp('CreateApp', {params:nextProps.receiveNewReg.values, token:store.userToken, region:'US'}, _self.receiveResult)
        }
        if(this.props.region.value !== nextProps.region.value){
            console.log("regionChange@@@@")
            this.getDataDeveloper(store.userToken, nextProps.region.value);
        }

        // if(nextProps.region.value) {
        //     let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        //     this.getDataDeveloper(store.userToken, nextProps.region.value)
        // }
        
        if(nextProps.computeRefresh.compute) {
            console.log("refresh@@@")
            this.getDataDeveloper(store.userToken,nextProps.region.value);
            this.props.handleComputeRefresh(false);
        }

    }
    receiveResult = (result, region) => {
        
        let join = this.state.devData.concat(result);
        this.props.handleLoadingSpinner(false);
        console.log("receive == ", result)
        this.setState({devData:join})

        this.countJoin()

        this.loadCount ++;
    }
    countJoin() {
        console.log("tteeeesss@@@",_self.loadCount+1,":::",rgn.length)
        if(_self.loadCount + 1 === rgn.length) {
            console.log("countjoin@@@",this.state.devData)
            let apps = this.state.devData;
            let duplicate = false;
            let arr =[]
            apps.map((itemCinst,i) => {
                arr.map((item) => {
                    if(item.AppName == itemCinst.AppName) {
                        duplicate = true;
                    }   
                })
                if(!duplicate) arr.push(itemCinst)
            })
            
            _self.setState({devData:arr})

            _self.loadCount = 0;
        }

    }
    getDataDeveloper = (token, region) => {

        let serviceBody = {}
        _self.loadCount = 0;
        this.setState({devData:[]})
        if(region !== 'All'){
            rgn = [region]
        } else {
            rgn = ['US','EU'];
        }

        if(localStorage.selectRole == 'AdminManager') {
            rgn.map((item) => {
                // All show app
                // services.getMCService('ShowApps',{token:token, region:item}, _self.receiveResult)
                setTimeout(() => {services.getMCService('ShowApps',{token:token, region:item}, _self.receiveResult)}, 0)
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
                setTimeout(() => {services.getMCService('ShowApp',serviceBody, _self.receiveResult)}, 0)
            })
        }
        
    }
    
    getDataDeveloperSub = () => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.getDataDeveloper(store.userToken, this.props.region.value);
    }

    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (
            <DeveloperListView devData={this.state.devData} headerLayout={this.headerLayout} hiddenKeys={this.hiddenKeys} siteId={'App'} userToken={this.userToken} dataRefresh={this.getDataDeveloperSub}></DeveloperListView>
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
    return {
        receiveNewReg:registNew,
        region:region,
        computeRefresh : (state.computeRefresh) ? state.computeRefresh: null,
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
        userRole : state.showUserRole?state.showUserRole.role:null,
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
