import _ from 'lodash'
import React from 'react';
import sizeMe from 'react-sizeme';
import { withRouter } from 'react-router-dom';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as serviceMC from '../../../services/serviceMC';
import '../../siteThree.css';
import InsideListView from '../../../container/insideListView';
import ListDetailViewer from '../../../container/ListDetailViewer';
import PageDetailViewer from "../../../container/pageDetailViewer";

let _self = null;
let rgn = [];
class SiteFourPageApps extends React.Component {
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
            detailData: [],
            viewMode: 'listView',
            randomId: 0,
            regionToggle: false
        };
        this.requestCount = 0;
        this.multiRequestData = [];
        this.headerH = 70;
        this.hgap = 0;
        this.loadCount = 0;

        this.headerLayout = [1, 3, 3, 1, 3, 1, 3, 4];
        this.hiddenKeys = ['ImagePath', 'DeploymentMF', 'ImageType', 'Command', 'Cluster', 'AuthPublicKey', 'DefaultFQDN', 'PackageName', 'ScaleWithCluster', 'Revision']
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

    componentWillUnmount() {
        this.setState({ devData: [] })
    }


    componentWillReceiveProps(nextProps) {
        this.setState({ bodyHeight: (window.innerHeight - this.headerH) })
        this.setState({ contHeight: (nextProps.size.height - this.headerH) / 2 - this.hgap })
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        if (nextProps.receiveNewReg && nextProps.receiveNewReg.values) {
            //services.createNewApp('CreateApp', {params:nextProps.receiveNewReg.values, token:store.userToken, region:'US'}, _self.receiveResult)
        }
        if (this.props.region.value !== nextProps.region.value) {
            this.getDataDeveloper(store ? store.userToken : 'null', nextProps.region.value);
        }

        if (nextProps.regionInfo.region.length && !this.state.regionToggle) {
            _self.setState({ regionToggle: true, regions: nextProps.regionInfo.region })
            this.getDataDeveloper(store ? store.userToken : 'null', nextProps.region.value, nextProps.regionInfo.region);
        }
        if (nextProps.computeRefresh.compute) {
            this.getDataDeveloper(store ? store.userToken : 'null', nextProps.region.value);
            this.props.handleComputeRefresh(false);
        }
        if (nextProps.viewMode) {
            if (nextProps.viewMode === 'listView') {
                this.setState({ viewMode: nextProps.viewMode });
                setTimeout(() => this.setState({ devData: this.state.devData, randomId: Math.random() * 1000 }), 300)
            } else {
                this.setState({ detailData: nextProps.detailData })
                this.forceUpdate()
                setTimeout(() => this.setState({ viewMode: nextProps.viewMode }), 600)
            }

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
                let sortedData = _.orderBy(_self.multiRequestData, ['Region', 'AppName'])
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

    getDataDeveloper = (token, region, regionArr) => {
        this.setState({ devData: [] })
        this.requestCount = 0;
        this.multiRequestData = [];

        if (region !== 'All') {
            rgn = [region]
        } else {
            rgn = (regionArr) ? regionArr : this.props.regionInfo.region;
        }

        if (rgn && rgn.length > 0) {
            this.requestCount = rgn.length;
            if (localStorage.selectRole === 'AdminManager') {
                rgn.map((item) => {
                    serviceMC.sendRequest(_self, { token: token, method: serviceMC.getEP().SHOW_APP, data: { region: item } }, _self.receiveResult)
                })
            } else {
                rgn.map((item) => {
                    let data = {
                        "region": item,
                        "app": {
                            "key": {
                                "organization": localStorage.selectOrg,
                            }
                        }
                    }
                    serviceMC.sendRequest(_self, { token: token, method: serviceMC.getEP().SHOW_APP, data: data }, _self.receiveResult);
                })
            }
        }

    }

    getDataDeveloperSub = () => {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.getDataDeveloper(store ? store.userToken : 'null', this.props.region.value);
    }

    render() {
        const { viewMode, detailData, devData, randomId } = this.state;
        return (
            (viewMode === 'listView') ?
                <InsideListView devData={devData} headerLayout={this.headerLayout} hiddenKeys={this.hiddenKeys} siteId={'App'} randomId={randomId} userToken={this.userToken} dataRefresh={this.getDataDeveloperSub}></InsideListView>
                :
                <PageDetailViewer className="ttt" data={detailData} page='App' />
            //<ListDetailViewer data={detailData} dimmer={false} open={this.state.openDetail} siteId={'App'} close={this.closeDetail} siteId={this.props.siteId}></ListDetailViewer>
        );
    }

};

const mapStateToProps = (state) => {
    let registNew = state.form.registNewListInput
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
    let viewMode = null;
    let detailData = null;
    if (state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
        detailData = state.changeViewMode.mode.data;
    }
    let regionInfo = (state.regionInfo) ? state.regionInfo : null;
    return {
        receiveNewReg: registNew,
        region: region,
        computeRefresh: (state.computeRefresh) ? state.computeRefresh : null,
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
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageApps)));
