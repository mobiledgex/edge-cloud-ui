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
            changeRegion: null
        };
        this.requestCount = 0;
        this.multiRequestData = [];
        this.headerH = 70;
        this.hgap = 0;
        this.hiddenKeys = ['Ip_support', 'Num_dynamic_ips', 'Status', 'Physical_name', 'Platform_type'];
        this.headerLayout = [1, 3, 3, 3, 2, 2, 2];
        this.userToken = null;
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
        console.log("20191119 ..cloudlet 11 region info in page cloudlet", nextProps.changeRegion, "-- : --", this.state.changeRegion, ": props region ==>", nextProps.regionInfo.region, ": state region==>", this.state.regions)

        this.setState({ bodyHeight: (window.innerHeight - this.headerH) })
        this.setState({ contHeight: (nextProps.size.height - this.headerH) / 2 - this.hgap })
        if (nextProps.viewMode) {
            if (nextProps.viewMode === 'listView') {
                //alert('viewmode..'+nextProps.viewMode+':'+ this.state.devData)
                //this.getDataDeveloper(this.props.changeRegion)
                this.setState({ viewMode: nextProps.viewMode })
            } else {
                this.setState({ viewMode: nextProps.viewMode })
                // setTimeout(() => this.setState({detailData:nextProps.detailData}), 300)
                this.setState({ detailData: nextProps.detailData })
            }

        }
        if (this.state.changeRegion !== nextProps.changeRegion) {
            console.log("20191119 ..cloudlet 22 nextProps.changeRegion = ", nextProps.changeRegion, "-- : --", this.props.changeRegion)
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
            //{ key: 1, text: 'All', value: 'All' }
            console.log("20191119 ..cloudlet 33 region info in page cloudlet")
            _self.setState({ regionToggle: true, regions: nextProps.regionInfo.region })
            this.getDataDeveloper(nextProps.changeRegion, nextProps.regionInfo.region);
        }


    }

    receiveResult = (mcRequest) => {
        _self.requestCount -= 1;
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                if (response.data.length > 0) {
                    _self.multiRequestData = [..._self.multiRequestData, ...response.data]
                }
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
        this.setState({ devData: [] })
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
                //let requestData = { token: store.userToken, method: serviceMC.getEP().SHOW_CLOUDLET, data: { region: item } };
                let requestData = null;
                if(localStorage.selectRole && localStorage.selectRole === 'AdminManager') {
                    requestData = {token:store.userToken, method:serviceMC.getEP().SHOW_CLOUDLET, data : {region:item}}
                } else {
                    requestData = {token:store.userToken, method:serviceMC.getEP().SHOW_ORG_CLOUDLET, data : {region:item, org:_self.props.selectOrg || localStorage.selectOrg}}
                }
                serviceMC.sendRequest(_self, requestData, _self.receiveResult)
            })
        }

    }

    getDataDeveloper = (region, regionArr) => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({ devData: [] })
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
                let requestData = { token: store.userToken, method: serviceMC.getEP().SHOW_CLOUDLET};
                if(localStorage.selectRole && localStorage.selectRole === 'AdminManager') {
                    requestData.data = {region:item}
                } else {
                    requestData.data = {region:item, org:_self.props.selectOrg || localStorage.selectOrg}
                }
                serviceMC.sendRequest(_self, requestData, _self.receiveResult)
            })
        }

    }
    getDataDeveloperSub = (region) => {
        let _region = (region) ? region : 'All';
        this.getDataDeveloper(_region);
        _self.props.handleComputeRefresh(false);
    }

    render() {

        const { devData, viewMode, detailData } = this.state;
        let randomValue = Math.round(Math.random() * 100);
        return (
            (viewMode === 'listView') ?
                <MapWithListView devData={devData} randomValue={randomValue} headerLayout={this.headerLayout} hiddenKeys={this.hiddenKeys} siteId={'Cloudlet'} userToken={this.userToken} dataRefresh={this.getDataDeveloperSub} dataSort={this.state.dataSort}></MapWithListView>
                :
                <PageDetailViewer data={detailData} page='cloudlet' />
        );
    }

};
SiteFourPageCloudlet.defaultProps = {
    changeRegion: ''
}


const mapStateToProps = (state) => {
    console.log("20191119 regionssInfo", state.regionInfo, ":", state.changeRegion)
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

