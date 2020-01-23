import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
import PageDetailViewer from '../../../container/pageDetailViewer';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as serviceMC from '../../../services/serviceMC';
import '../../siteThree.css';
import MapWithListView from "../../../container/mapWithListView";

let _self = null;
let rgn = [];
class SiteFourPageClusterInst extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            contHeight: 0,
            contWidth: 0,
            bodyHeight: 0,
            devData: [],
            viewMode: 'listView',
            detailData: null,
            regionToggle: false,
            dataSort: false
        };
        this.requestCount = 0;
        this.multiRequestData = [];
        this.headerH = 70;
        this.hgap = 0;
        this.loadCount = 0;
        this.countObject = {};
        this.headerLayout = [1, 2, 2, 2, 2, 1, 2, 2, 1, 2];
        this.hiddenKeys = ['Status', 'Deployment']

    }
    gotoUrl(site, subPath) {
        let mainPath = site;
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })
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
        _self.props.handleChangeSite({ mainPath: mainPath, subPath: subPath })

    }
    handleItemClick = (e, { name }) => this.setState({ activeItem: name })

    onHandleRegistry() {
        this.props.handleInjectDeveloper('userInfo');
    }
    componentWillMount() {
        this.setState({ bodyHeight: (window.innerHeight - this.headerH) })
        this.setState({ contHeight: (window.innerHeight - this.headerH) / 2 - this.hgap })
        rgn.map((region) => {
            this.countObject[region] = []
        })
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ bodyHeight: (window.innerHeight - this.headerH) })

        if (nextProps.computeRefresh.compute) {
            this.getDataDeveloper(nextProps.changeRegion);
            this.props.handleComputeRefresh(false);
            this.setState({ dataSort: true });
        }
        if (this.props.changeRegion !== nextProps.changeRegion) {
            this.getDataDeveloper(nextProps.changeRegion);
        }
        if (nextProps.regionInfo.region.length && !this.state.regionToggle) {
            _self.setState({ regionToggle: true, regions: nextProps.regionInfo.region })
            this.getDataDeveloper(nextProps.changeRegion, nextProps.regionInfo.region);
        }
        if (nextProps.viewMode) {
            if (nextProps.viewMode === 'listView') {
                this.setState({ viewMode: nextProps.viewMode })
            } else {
                this.setState({ detailData: nextProps.detailData })
                this.forceUpdate()
                setTimeout(() => this.setState({ viewMode: nextProps.viewMode }), 600)
            }

        }
        //make hidden key
        let tbHeader = nextProps.headerFilter;
        if (tbHeader) {
            this.setHiddenKey(tbHeader)
        }
        setTimeout(() => this.forceUpdate(), 1000)
    }

   
    receiveClusterInstResult = (mcRequestList) => {
        _self.requestCount -= 1;
        if (mcRequestList) {
            let cloudletDataList = [];
            let clusterDataList = [];
            mcRequestList.map(mcRequest => {
                if (mcRequest.response) {
                    if (mcRequest.request.method === serviceMC.getEP().SHOW_CLOUDLET) {
                        cloudletDataList = mcRequest.response.data;
                    }
                    if (mcRequest.request.method === serviceMC.getEP().SHOW_CLUSTER_INST) {
                        clusterDataList = mcRequest.response.data;
                    }
                }
                return null;
            })

            if(clusterDataList.length > 0)
            {
                clusterDataList.map(clusterData =>{
                    cloudletDataList.map(cloudletData=>{
                        if (clusterData.Cloudlet === cloudletData.CloudletName) {
                            clusterData.CloudletLocation = cloudletData.CloudletLocation;
                        }
                    })
                })
                _self.multiRequestData = [..._self.multiRequestData, ...clusterDataList]
            }

            if (_self.requestCount === 0) {
                if (_self.multiRequestData.length > 0) {
                    _self.setState({
                        devData: _self.multiRequestData
                    })
                } else {
                    _self.props.handleComputeRefresh(false);
                    _self.props.handleAlertInfo('error', 'Requested data is empty')
                }
            } 
        }
    }

    getDataDeveloper = (region, regionArr) => {

        _self.props.handleLoadingSpinner(true);
        _self.loadCount = 0;
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.multiRequestData = [];
        _self.setState({ devData: [] })

        let serviceBody = {}
        _self.setState({ devData: [], cloudletData: [], clusterInstData: [] })
        if (region !== 'All') {
            rgn = [region];
        } else {
            rgn = (regionArr) ? regionArr : this.props.regionInfo.region;
        }

        
        if (rgn && rgn.length > 0) {
            this.requestCount = rgn.length;
            let token = store ? store.userToken : 'null';
            if (localStorage.selectRole == 'AdminManager') {
                rgn.map((item) => {
                    let requestList = [];
                    requestList.push({ token: token, method: serviceMC.getEP().SHOW_CLOUDLET, data: { region: item } })
                    requestList.push({ token: token, method: serviceMC.getEP().SHOW_CLUSTER_INST, data: { region: item } })
                    serviceMC.sendMultiRequest(_self, requestList, _self.receiveClusterInstResult)
                })
            } else {
                rgn.map((item) => {
                    let data = {
                        region: item,
                        clusterinst: {
                            key: {
                                developer: localStorage.selectOrg
                            }
                        }
                    }
                    let requestList = [];
                    requestList.push({ token: token, method: serviceMC.getEP().SHOW_CLOUDLET, data: { region: item } })
                    requestList.push({ token: token, method: serviceMC.getEP().SHOW_CLUSTER_INST, data: data })
                    serviceMC.sendMultiRequest(_self, requestList, _self.receiveClusterInstResult)
                })
            }
        }
    }
    
getDataDeveloperSub = (region) => {
    let _region = (region) ? region : 'All';
    this.getDataDeveloper(_region);
}
render() {
    const { devData, viewMode } = this.state;
    let randomValue = Math.round(Math.random() * 100);
    return (
        (viewMode === 'listView') ?
            <MapWithListView devData={devData} randomValue={randomValue} headerLayout={this.headerLayout} hiddenKeys={this.hiddenKeys} siteId={'ClusterInst'} region='US' dataRefresh={this.getDataDeveloperSub} dataSort={this.state.dataSort}></MapWithListView>
            :
            <PageDetailViewer className="ttt" data={this.state.detailData} page='clusterInst' />
    );
}

componentWillUnmount() {
    this.multiRequestData = [];
    this.setState({ devData: [] })
}


};

const mapStateToProps = (state) => {
    let viewMode = null;
    let detailData = null;
    if (state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
        detailData = state.changeViewMode.mode.data;
    }
    let regionInfo = (state.regionInfo) ? state.regionInfo : null;
    return {
        computeRefresh: (state.computeRefresh) ? state.computeRefresh : null,
        changeRegion: state.changeRegion.region ? state.changeRegion.region : null,
        selectOrg: state.selectOrg.org ? state.selectOrg.org : null,
        userRole: state.showUserRole ? state.showUserRole.role : null,
        viewMode: viewMode, detailData: detailData,
        regionInfo: regionInfo
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) },
        handleInjectData: (data) => { dispatch(actions.injectData(data)) },
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data)) },
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};
export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageClusterInst)));
