import React from 'react';
import sizeMe from 'react-sizeme';
import DeveloperListView from '../container/developerListView';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';

import * as serviceMC from '../services/serviceMC';
import './siteThree.css';


let devOptions = [ { key: 'af', value: 'af', text: 'SK Telecom' } ]

let _self = null;
let rgn = [];
class SiteFourPageFlavor extends React.Component {
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
            regionToggle:false
        };
        this.headerH = 70;
        this.hgap = 0;
        this.headerLayout = [1,4,4,4,4,3]
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
        // let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        // if(store && store.userToken) {
        //     this.getDataDeveloper(this.props.changeRegion);
        // }
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
        if(nextProps.regionInfo.region.length && !this.state.regionToggle) {
            _self.setState({regionToggle:true})
            this.getDataDeveloper(nextProps.changeRegion,nextProps.regionInfo.region);
        }
        
    }
    receiveResult = (mcRequest) => {
        let result = mcRequest.response;
        // @inki if data has expired token
        if(result.data.error && result.data.error.indexOf('Expired') > -1) {
            _self.props.handleAlertInfo('error', result.data.error);
            setTimeout(() => _self.gotoUrl('/logout'), 4000);
            _self.props.handleLoadingSpinner(false);
            return;
        } else if(result.data.error && result.data.error.indexOf('failed') > -1) {
            _self.props.handleAlertInfo('error', result.data.error);
            _self.props.handleLoadingSpinner(false);
            return;
        }

        let join = null;
        if(result.data[0]['Edit']) {
            join = _self.state.devData.concat(result.data);
        } else {
            join = _self.state.devData;
        }

        if(result.data.error) {
            _self.props.handleAlertInfo('error',result.data.error)
        } else {
            _self.setState({devData:join})

        }
        _self.props.handleLoadingSpinner(false);
    }
    getDataDeveloper = (region,regionArr) => {
        this.props.handleLoadingSpinner(true);
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({devData:[]})
        if(region !== 'All'){
            rgn = [region]
        } else {
            rgn = (regionArr)?regionArr:this.props.regionInfo.region;
        }
        rgn.map((item) => {
            let requestData = { token: store ? store.userToken : 'null', method: serviceMC.getEP().SHOW_FLAVOR, data: { region: item } };
            serviceMC.sendRequest(requestData, _self.receiveResult)
        })
    }
    render() {
        const {shouldShowBox, shouldShowCircle} = this.state;
        const { activeItem } = this.state
        return (

            <DeveloperListView devData={this.state.devData} headerLayout={this.headerLayout} siteId={'Flavors'} dataRefresh={this.getDataDeveloper}></DeveloperListView>

        );
    }

};

const mapStateToProps = (state) => {
    let regionInfo = (state.regionInfo)?state.regionInfo:null;
    return {
        computeRefresh : (state.computeRefresh) ? state.computeRefresh: null,
        changeRegion : state.changeRegion.region?state.changeRegion.region:null,
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageFlavor)));
