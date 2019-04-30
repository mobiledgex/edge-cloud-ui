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
import Alert from "react-s-alert";



let _self = null;
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
            cloudletData:[]
        };
        this.headerH = 70;
        this.hgap = 0;
        this.headerLayout = [1,3,2,2,2,2,2,2];
        //this.hiddenKeys = ['CloudletLocation']
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
            this.getDataDeveloper(store.userToken);
        } else {
            Alert.error('Invalid or expired token', {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
            setTimeout(()=>_self.gotoPreview('/Logout'), 2000)
        }
    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})

        if(nextProps.computeRefresh.compute) {
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            this.getDataDeveloper(store.userToken);
            this.props.handleComputeRefresh(false);
        }
    }
    receiveResult(result) {
        console.log("receive  == ", Object.keys(result[0]).indexOf('ClusterName'), result)


        if(result.error) {
            Alert.error(result.error, {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
        } else {
            _self.setState({devData:result})
        }
    }

    receiveResultClusterInst(result) {
        _self.groupJoin(result,'clusterInst')
    }
    receiveResultCloudlet(result) {
        _self.groupJoin(result,'cloudlet')
    }

    groupJoin(result,cmpt){

        console.log('cluster inst show app list.. ', result, cmpt)
        this.props.handleLoadingSpinner(false);

        if(cmpt == 'clusterInst') this.setState({clusterInstData:result}) 
        else if(cmpt == 'cloudlet') this.setState({cloudletData:result})
        
        if(this.state.clusterInstData.length > 0 && this.state.cloudletData.length > 0) {
            let clusterInst = this.state.clusterInstData;
            let cloudlet = this.state.cloudletData;
            let arr =[]
            clusterInst.map((itemCinst,i) => {
                cloudlet.map((itemClet,j) => {
                    if(itemCinst.Cloudlet == itemClet.CloudletName) {
                        itemCinst.CloudletLocation = itemClet.CloudletLocation;
                    } 
                })
                arr.push(itemCinst)
            })
            _self.setState({devData:arr})
        }
    }
    
    getDataDeveloper(token) {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        services.getMCService('ShowClusterInst',{token:store.userToken, region:'US'}, _self.receiveResultClusterInst)
        services.getMCService('ShowCloudlet',{token:store.userToken, region:'US'}, _self.receiveResultCloudlet)
    }
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (

            //<DeveloperListView devData={this.state.devData} headerLayout={this.headerLayout}></DeveloperListView>
            <MapWithListView devData={this.state.devData} headerLayout={this.headerLayout} hiddenKeys={this.hiddenKeys} siteId={'ClusterInst'} title='Cluster Instance' region='US' dataRefresh={this.getDataDeveloper}></MapWithListView>
        );
    }

};

const mapStateToProps = (state) => {
    return {
        computeRefresh : (state.computeRefresh) ? state.computeRefresh: null
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
