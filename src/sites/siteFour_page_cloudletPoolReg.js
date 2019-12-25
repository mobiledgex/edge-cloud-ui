import React from 'react';
import { Tab } from 'semantic-ui-react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
//redux
import { connect } from 'react-redux';
import * as actions from '../actions';
import * as services from '../services/service_compute_service';
import './siteThree.css';

import Alert from "react-s-alert";
import SiteFourPoolStepViewer from '../container/siteFourPoolStepView';
import * as reducer from "../utils";



let _self = null;
let rgn = [];
class SiteFourPageCloudletPoolReg extends React.Component {
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
            cloudlets:[],
            operators:[],
            clustinst:[],
            apps:[],
            hangeRegion:[],
            regionToggle:false,
            step: 1
        };
        this.headerH = 70;
        this.hgap = 0;
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
    countJoin() {
        let cloudlet = this._cloudletDummy;
        console.log('20191223 props dev data countJoin---', cloudlet, ": regions == ", rgn, ":", this.props.region)
        let cloudletList = [];
        cloudlet.map((list) => {
            cloudletList.push({region:list['Region'], cloudlet:list['CloudletName']})
        })
        //TODO: cloudlet --- 20191220 폼에 맞는 데이터 형태로 가공 필요
        let fieldValue = [{
            'Region':rgn,
            'poolName':'',
            'selectCloudlet':cloudletList,
            'invisibleField':''

        }]
        _self.setState({devData:fieldValue, dataSort:false})
        _self.forceUpdate();
        _self.props.handleLoadingSpinner(false);
        console.log('20191220 props dev data countJoin 2 1---', fieldValue, ": state devData == ", this.state.devData)
    }

    receiveResult = (result) => {

        // @inki if data has expired token
        if(result.error && result.error.indexOf('Expired') > -1) {
            _self.props.handleAlertInfo('error', result.error);
            setTimeout(() => _self.gotoUrl('/logout'), 4000);
            _self.props.handleComputeRefresh(false);
            _self.props.handleLoadingSpinner(false);
            return;
        }

        let regionGroup = (!result.error) ? reducer.groupBy(result, 'Region'):{};
        console.log('20191220 region group == ', regionGroup, ":", result)
        if(Object.keys(regionGroup)[0]) {
            _self._cloudletDummy = _self._cloudletDummy.concat(result)
        }

        this.loadCount ++;

        if(rgn.length == this.loadCount){
            _self.countJoin()
        }
        _self.props.handleLoadingSpinner(false);

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
            //setTimeout(() => services.getMCService('ShowCloudlet',{token:store.userToken, region:item}, _self.receiveResult), 0)
            services.getMCService('ShowCloudlet',{token:store.userToken, region:item}, _self.receiveResult)
        })
        this.props.handleLoadingSpinner(true);
    }

    componentWillMount() {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(window.innerHeight-this.headerH)/2 - this.hgap})
    }
    componentDidMount() {
        
    }
    componentWillReceiveProps(nextProps) {
        this.setState({bodyHeight : (window.innerHeight - this.headerH)})
        this.setState({contHeight:(nextProps.size.height-this.headerH)/2 - this.hgap})
        //
        let regions = nextProps.regionInfo.region;
        console.log("20191220 ..cloudlet 33 region info in page cloudlet", nextProps.changeRegion,":", nextProps.regionInfo.region)
        if(nextProps.regionInfo.region.length && !this.state.regionToggle) {
            //{ key: 1, text: 'All', value: 'All' }

            _self.setState({regionToggle:true,regions:nextProps.regionInfo.region})
            this.getDataDeveloper(nextProps.changeRegion,nextProps.regionInfo.region);
        }

    }

    gotoUrl() {
        _self.props.history.push({
            pathname: '/site4',
            search: 'pg=7'
        });
        _self.props.history.location.search = 'pg=7';
        _self.props.handleChangeSite({mainPath:'/site4', subPath: 'pg=7'})
    }


    /*
     */
    render() {
        const {shouldShowBox, shouldShowCircle, devData} = this.state;
        const { activeItem } = this.state
        return (

            <SiteFourPoolStepViewer devData={devData} stepMove={this.state.step} gotoUrl={this.gotoUrl}/>
        );
    }

};
const mapStateToProps = (state) => {
    let region = state.changeRegion
        ? {
            value: state.changeRegion.region
        }
        : {};
    let regionInfo = (state.regionInfo)?state.regionInfo:null;
    return {
        getRegion : (state.getRegion)?state.getRegion.region:null,
        regionInfo: regionInfo,
        region:region,
        changeRegion : state.changeRegion?state.changeRegion.region:null,
    }
};


const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleInjectData: (data) => { dispatch(actions.injectData(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleInjectFlavor: (data) => { dispatch(actions.showFlavor(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageCloudletPoolReg)));
