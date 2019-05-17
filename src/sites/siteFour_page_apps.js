import React from 'react';
import { Grid, Image, Header, Menu, Dropdown, Button } from 'semantic-ui-react';
import sizeMe from 'react-sizeme';
import InstanceListView from '../container/instanceListView';
import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as services from '../services/service_compute_service';
import './siteThree.css';
import MapWithListView from "../container/mapWithListView";
import DeveloperListView from '../container/developerListView';
import Alert from "react-s-alert";



let _self = null;

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
            devData:[]
        };
        this.headerH = 70;
        this.hgap = 0;

        this.headerLayout = [1,2,2,1,2,2,3,3];
        this.hiddenKeys = ['ImagePath', 'DeploymentMF', 'ImageType', 'Command', 'Cluster']
        this.userToken = null;

        //

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
    }
    componentDidMount() {
        console.log('info.. ', this.childFirst, this.childSecond)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        console.log('info.. store == ', store)
        if(store.userToken) {
            this.getDataDeveloper(store.userToken, this.props.region.value);
            this.userToken = store.userToken;
        }
    }
    componentWillReceiveProps(nextProps) {
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
            this.getDataDeveloper(store.userToken,nextProps.region.value);
            this.props.handleComputeRefresh(false);
        }

    }
    receiveResult = (result, region) => {
        let join = this.state.devData.concat(result);
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
    getDataDeveloper(token, region) {
        let rgn = ['US','EU'];
        let serviceBody = {}
        this.setState({devData:[]})
        if(region !== 'All'){
            rgn = [region]
        } 

        if(this.props.userRole == 'AdminManager') {
            rgn.map((item) => {
                // All show app
                services.getMCService('ShowApps',{token:token, region:item}, _self.receiveResult)
            })
        } else {
            rgn.map((item) => {
                serviceBody = {
                    "token":token,
                    "params": {
                        "region":item,
                        "app":{
                            "key":{
                                "developer_key":{"name":this.props.selectOrg.Organization},
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
    console.log('props in state.form..', state.form, 'region === ', state.changeRegion)
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
