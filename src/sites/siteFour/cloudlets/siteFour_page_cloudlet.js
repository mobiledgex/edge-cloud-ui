import _ from 'lodash'
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
class SiteFourPageCloudlet extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            contHeight: 0,
            contWidth: 0,
            bodyHeight: 0,
            activeItem: 'Developers',
            devData: [],
            viewMode: 'listView',
            regions: [],
            regionToggle: false,
            dataSort: false,
            changeRegion: null,
            selectRole: ''
        };
        this.requestCount = 0;
        this.multiRequestData = [];
        this.headerH = 70;
        this.hgap = 0;
        this.hiddenKeys = ['Ip_support', 'Num_dynamic_ips', 'Status', 'Physical_name', 'Platform_type'];
        this.headerLayout = [1, 3, 3, 3, 2, 2, 2];
        this.userToken = null;

        this.headerInfo = [
            { field: 'Region', label: 'Region', sortable: true, visible: true },
            { field: 'CloudletName', label: 'Cloudlet Name', sortable: true, visible: true },
            { field: 'Operator', label: 'Operator', sortable: true, visible: true },
            { field: 'CloudletLocation', label: 'Cloudlet Location', sortable: false, visible: false },
            { field: 'State', label: 'State', sortable: true, visible: false },
            { field: 'Progress', label: 'Progress', sortable: false, visible: true },
            { field: 'CloudletInfoState', label: 'Status', sortable: false, visible: true },
            { field: 'Actions', label: 'Actions', sortable: false, visible: true },
        ]

        this.actionMenu = [
            { label: 'Delete', icon:'delete_outline'}
        ]
        this.actionMenu_disable = [
            null
        ]
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
    }
    componentDidMount() {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        // this.getDataDeveloper(this.props.changeRegion);
        this.userToken = store.userToken;
    }

    componentWillReceiveProps(nextProps) {
        let userRole = localStorage.selectRole;
        this.setState({ bodyHeight: (window.innerHeight - this.headerH) })
        this.setState({ contHeight: (nextProps.size.height - this.headerH) / 2 - this.hgap })
        if (nextProps.viewMode) {
            if (nextProps.viewMode === 'listView') {
                this.setState({ viewMode: nextProps.viewMode })
            } else {
                if(userRole.indexOf('Developer') > -1) {
                    return;
                } else {
                    this.setState({ viewMode: nextProps.viewMode })
                    this.setState({ detailData: nextProps.detailData })
                }
            }

        }
        if (this.state.changeRegion !== nextProps.changeRegion) {
            this.setState({ changeRegion: nextProps.changeRegion })
            this.getDataDeveloper(nextProps.changeRegion, this.state.regions);
        } else {

        }
        if (nextProps.computeRefresh.compute) {
            this.getDataDeveloper(nextProps.changeRegion);
            this.props.handleComputeRefresh(false);
            this.setState({ dataSort: true });
        }

        if (nextProps.regionInfo.region.length && !this.state.regionToggle) {
            _self.setState({ regionToggle: true, regions: nextProps.regionInfo.region })
            this.getDataDeveloper(nextProps.changeRegion, nextProps.regionInfo.region);
        }


    }

   

    receiveResult = (mcRequestList) => {
        _self.requestCount -= 1;
        if (mcRequestList && mcRequestList.length > 0) {
            let cloudletList = [];
            let cloudletInfoList = [];
            mcRequestList.map(mcRequest => {
                let request = mcRequest.request;
                if (request.method === serviceMC.getEP().SHOW_CLOUDLET || request.method === serviceMC.getEP().SHOW_ORG_CLOUDLET) {
                    for (let i = 0; i < this.headerInfo.length > 0; i++) {
                        let headerInfo = this.headerInfo[i];
                        if (headerInfo.field === 'CloudletInfoState') {
                            headerInfo.visible = request.method === serviceMC.getEP().SHOW_ORG_CLOUDLET ? false : true;
                            break;
                        }
                    }
                    
                    cloudletList = mcRequest.response.data
                }
                else if (request.method === serviceMC.getEP().SHOW_CLOUDLET_INFO) {
                    cloudletInfoList = mcRequest.response.data
                }
            })

            if (cloudletList && cloudletList.length > 0) {
                for (let i = 0; i < cloudletList.length; i++) {
                    let cloudlet = cloudletList[i]
                    for (let j = 0; j < cloudletInfoList.length; j++) {
                        let cloudletInfo = cloudletInfoList[j]
                        if (cloudlet.CloudletName === cloudletInfo.CloudletName) {
                            cloudlet.CloudletInfoState = cloudletInfo.State
                            break;
                        }
                    }
                }
                _self.multiRequestData = [..._self.multiRequestData, ...cloudletList]
            }

        }
        
        if (_self.requestCount === 0) {
            if (_self.multiRequestData.length > 0) {
                let sortedData = _.orderBy(_self.multiRequestData, ['Region', 'CloudletName'])
                _self.setState({
                    devData: sortedData
                })
                _self.multiRequestData = [];
            } else {
                _self.props.handleComputeRefresh(false);
                _self.props.handleAlertInfo('error', 'Requested data is empty')
            }
        }
    }


    getDataDeveloper = (region, regionArr) => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({ devData: [], selectRole: localStorage.selectRole })
        this.multiRequestData = [];
        this.requestCount = 0;
        if (region !== 'All') {
            rgn = [region]
        } else {
            rgn = (regionArr) ? regionArr : this.props.regionInfo.region;
        }
        if (rgn && rgn.length > 0) {
            this.requestCount = rgn.length;
            rgn.map(item => {
                let requestList = []
                if (localStorage.selectRole && localStorage.selectRole === 'AdminManager') {
                    requestList.push({ token: store.userToken, method: serviceMC.getEP().SHOW_CLOUDLET, data: { region: item } })
                    requestList.push({ token: store.userToken, method: serviceMC.getEP().SHOW_CLOUDLET_INFO, data: { region: item } })
                } else {
                    let data = { region: item, org: localStorage.selectOrg };
                    requestList.push({ token: store.userToken, method: serviceMC.getEP().SHOW_ORG_CLOUDLET, data: data })
                }
                serviceMC.sendMultiRequest(_self, requestList, _self.receiveResult)
            })
        }
    }


    getDataDeveloperSub = (region) => {
        let _region = (region) ? region : 'All';
        this.getDataDeveloper(_region);
        _self.props.handleComputeRefresh(false);
    }

    render() {

        const { devData, viewMode, detailData, selectRole } = this.state;
        let randomValue = Math.round(Math.random() * 100);
        return (
            (viewMode === 'listView') ?
                <MapWithListView actionMenu={selectRole.indexOf('Developer') > -1 ? this.actionMenu_disable : this.actionMenu} devData={devData} randomValue={randomValue} headerLayout={this.headerLayout} headerInfo = {this.headerInfo} hiddenKeys={this.hiddenKeys} siteId={'Cloudlet'} userToken={this.userToken} dataRefresh={this.getDataDeveloperSub} dataSort={this.state.dataSort}></MapWithListView>
                :
                <PageDetailViewer data={detailData} page='cloudlet' />
        );
    }

};
SiteFourPageCloudlet.defaultProps = {
    changeRegion: ''
}


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
        changeRegion: state.changeRegion ? state.changeRegion.region : null,
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageCloudlet)));

