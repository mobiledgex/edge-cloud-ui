import React from 'react';
import { Grid, Image, Header, Menu, Dropdown, Button } from 'semantic-ui-react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
import MaterialIcon from 'material-icons-react';
import { connect } from 'react-redux';
import Alert from "react-s-alert";
import InstanceListView from '../../../container/instanceListView';
import PagePoolDetailViewer from '../../../container/pagePoolDetailViewer';
//redux
import * as actions from '../../../actions';
import * as services from '../../../services/service_cloudlet_pool';
import * as serviceMC from '../../../services/serviceMC';
import '../../siteThree.css';
import InsideListView from "../../../container/insideListView";
import * as reducer from '../../../utils'


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
        this.hiddenKeys = ['Ip_support', 'Num_dynamic_ips','Status','Physical_name','Platform_type', 'cloudletGroup', 'OrganizGroup', 'uuid'];
        this.headerLayout = [1,3,3,3,2,2,2];
        this.userToken = null;
        this._devData = [];
        this.loadCount = 0;
        this.loadCountM = 0;
        this.loadCountLink = 0;
        this._cloudletDummy = [];
        this._memberDummy = [];
        this._linkDummy = [];
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
        this.getDataDeveloper(this.props.changeRegion);
        this.userToken = store.userToken;

    }
    componentWillUnmount() {
        this._devData = [];
        this._cloudletDummy = [];
    }

    componentWillReceiveProps(nextProps) {
        console.log("20200106 ..page cloudlet pool -",nextProps.viewMode)
        if(nextProps.viewMode) {
            if(nextProps.viewMode === 'listView') {
                this.getDataDeveloper(this.props.changeRegion, this.state.regions)
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
    /* example code : should delete it
    if(mcRequest.response)
            {
                let response = mcRequest.response;
                regionGroup = reducer.groupBy(response.data, 'Region');
                if(Object.keys(regionGroup)[0]) {
                    _self._cloudletDummy = _self._cloudletDummy.concat(response.data)
     */
    receiveResultShow = (_result) => {
        let result = null;
        if(_result.response) {
            result = _result.response.data
        } else {
            _self.props.handleComputeRefresh(false);
            return;
        }
        // @inki if data has expired token
        if(result.error && result.error.indexOf('Expired') > -1) {
            _self.props.handleAlertInfo('error', result.error);
            setTimeout(() => _self.gotoUrl('/logout'), 4000);
            _self.props.handleComputeRefresh(false);
            _self.props.handleLoadingSpinner(false);
            return;
        }
        console.log('20200108 result show pool - ', result, ": rgn= ", rgn)
        let regionGroup = (!result.error) ? reducer.groupBy(result, 'Region'):{};
        if(Object.keys(regionGroup)[0]) {
            _self._cloudletDummy = _self._cloudletDummy.concat(result)
        }

        this.loadCount ++;
        if(rgn.length === this.loadCount){
            _self.countJoin()
        }

    }

    receiveResultMember = (_result) => {
        let result = null;
        if(_result.response) {
            result = _result.response.data
        } else {
            _self.props.handleComputeRefresh(false);
            return;
        }
        console.log('20200108 result show - ', result)
        if(result.error && result.error.indexOf('Expired') > -1) {
            _self.props.handleAlertInfo('error', result.error);
            setTimeout(() => _self.gotoUrl('/logout'), 4000);
            _self.props.handleComputeRefresh(false);
            _self.props.handleLoadingSpinner(false);
            return;
        }
        let poolGroup = (!result.error) ? reducer.groupBy(result, 'PoolName'):{};
        if(Object.keys(poolGroup)[0]) {
            _self._memberDummy = _self._memberDummy.concat(poolGroup)
        }
        console.log('20200108 result show member - ', _self._memberDummy)
        this.loadCountM ++;
        if(rgn.length === this.loadCountM){
            _self.countJoin();
        }
    }
    receiveResultLinkOrg = (_result) => {
        let result = null;
        if(_result.response) {
            result = _result.response.data
        } else {
            _self.props.handleComputeRefresh(false);
            return;
        }
        if(this.loadCountLink > 0) return;
        console.log('20200108 result show link org - ', result, ": this.loadCountLink =", this.loadCountLink)

        let poolGroup = (!result) ? reducer.groupBy(result, 'CloudletPool'):{};
        console.log('20200108 result show link org - - - ', poolGroup)
        if(Object.keys(poolGroup)[0]) {
            _self._linkDummy = poolGroup;
        }
        console.log('20200108 result show link org - ', _self._linkDummy)
        this.loadCountLink ++;

        _self.countJoin();


    }


    countJoin() {
        console.log('20200108 ==== countJoin... ', this.loadCount,":", this.loadCountM, ":", this.loadCountLink)
        if(this.loadCount == rgn.length && this.loadCountM == rgn.length && this.loadCountLink == 1) {
            this.countAllJoin();
        }
    }

    countAllJoin() {
        this.loadCount = 0;
        this.loadCountM = 0;
        this.loadCountLink = 0;
        let cloudlet = Object.assign([], this._memberDummy);
        /** cloudlet pool join member data */
        let cloneData = Object.assign([], this._cloudletDummy);
        let orgData = Object.assign([], this._linkDummy)
        console.log('20200103 ..cloudlet member count---', cloneData, ":", cloudlet)

        cloneData.map((data, i) => {
            console.log('20200103 data - ', data['PoolName'])
            data['cloudletGroup'] = [];
            data['OrganizGroup'] = [];
            cloudlet.map(member => {
                if(member[data['PoolName']]){
                    member[data['PoolName']].map((pn)=> {
                        if(pn['Region'] === data['Region']) {
                            console.log("20200103 member", pn, ":", pn['Region'],":", data['Region'])
                            data['Cloudlets'] += 1
                            data['cloudletGroup'].push(pn)
                        }
                    })
                }
            })
            if(orgData[data['PoolName']]) {
                orgData[data['PoolName']].map((org) => {
                    if(org['Region'] === data['Region']) {
                        data['Organizations'] += 1
                        data['OrganizGroup'].push(org)
                    }
                })
            }
        })

        console.log('20200103 ..cloudlet member count join---', cloneData)
        this.setState({devData:cloneData})
        this._memberDummy = [];
        this._cloudletDummy = [];
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
            // old
            //services.getListCloudletPool('ShowCloudletPool',{token:store.userToken, region:item}, _self.receiveResultShow)
            //services.getListCloudletPoolMember('ShowCloudletPoolMember',{token:store.userToken, region:item}, _self.receiveResultMember)
            //TODO : apply arch of Rahul to ..
            let requestData = {token:store.userToken, method:serviceMC.getEP().SHOW_CLOUDLET_POOL, data : {region:item}};
            serviceMC.sendRequest(_self, requestData, _self.receiveResultShow)
            //
            let requestDataMember = {token:store.userToken, method:serviceMC.getEP().SHOW_CLOUDLET_MEMBER, data : {region:item}};
            serviceMC.sendRequest(_self, requestDataMember, _self.receiveResultMember)
        })
        //old
        //services.showOrgCloudletPool('ShowOrgCloudletPool', {token:store.userToken}, _self.receiveResultLinkOrg)
        //new
        let requestDataOrg = {token:store.userToken, method:serviceMC.getEP().SHOW_CLOUDLET_LINKORG, data : {}};
        serviceMC.sendRequest(_self, requestDataOrg, _self.receiveResultLinkOrg)
        this.props.handleLoadingSpinner(true);

    }

    /*
       example : region=EU operator=TDG cloudlet=deleteme pool=DeletemePool
     */

    getDataDeveloperSub = (region) => {
        let _region = (region)?region:'All';
        this.getDataDeveloper(_region);
        _self.props.handleComputeRefresh(false);
    }
    render() {
        const {devData, viewMode} = this.state;

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
    console.log("20200106 state.changeViewMode.mode.viewMode--",state.changeViewMode)
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteFourPageCloudletPool));
