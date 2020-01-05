import React from 'react';
import sizeMe from 'react-sizeme';
import DeveloperListView from '../container/developerListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

import * as serviceMC from '../services/serviceMC';
import './siteThree.css';
import Alert from "react-s-alert";


let devOptions = [ { key: 'af', value: 'af', text: 'SK Telecom' } ]

let _self = null;
class SiteFourPageCluster extends React.Component {
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
            liveComp:false
        };
        this.headerH = 70;
        this.hgap = 0;
        this.headerLayout = [1,3,2,2,3,2,3]
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
        console.log('info..will mount page one  0000   ', this.columnLeft)
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {
        console.log('info.. ', this.childFirst, this.childSecond)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        // console.log('info.. store == ', store)
        if(store && store.userToken) {
            this.getDataDeveloper(this.props.changeRegion);
        } else {
            Alert.error('Invalid or expired token', {
                position: 'top-right',
                effect: 'slide',
                timeout: 5000
            });
            setTimeout(()=>_self.gotoPreview('/logout'), 2000)
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

        if(nextProps.computeRefresh.compute) {
            this.getDataDeveloper(nextProps.changeRegion);
            this.props.handleComputeRefresh(false);
        }
        if(this.props.changeRegion !== nextProps.changeRegion){
            console.log("regionChange@@@@")
            this.getDataDeveloper(nextProps.changeRegion);
        }
    }
    
    receiveResult = (mcRequest) => {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                let join = null;
                if (response.data[0]['Edit']) {
                    join = _self.state.devData.concat(response.data);
                } else {
                    join = _self.state.devData;
                }
                _self.props.handleLoadingSpinner(false);
                _self.setState({ devData: join })
            }
        }
        _self.props.handleLoadingSpinner(false);
    }

    getDataDeveloper(region) {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let rgn = ['US','EU'];
        this.setState({devData:[]})
        console.log("changeRegion###@@",_self.props.changeRegion)
        if(region !== 'All'){
            rgn = [region]
        }
        rgn.map((item) => {
            serviceMC.sendRequest(_self, { token: store ? store.userToken : 'null', method: serviceMC.getEP().SHOW_CLUSTER_FLAVOR, data: { region: item } }, _self.receiveResult)
        })
    }
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (

            <DeveloperListView devData={this.state.devData} headerLayout={this.headerLayout} siteId={'ClusterFlavors'} dataRefresh={this.getDataDeveloper}></DeveloperListView>

        );
    }

};

const mapStateToProps = (state) => {
    return {
        computeRefresh : (state.computeRefresh) ? state.computeRefresh: null,
        changeRegion : state.changeRegion.region?state.changeRegion.region:null
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))},
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageCluster)));
