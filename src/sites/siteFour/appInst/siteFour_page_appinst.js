import _ from 'lodash'
import React from 'react';
import { withRouter } from 'react-router-dom';
import sizeMe from 'react-sizeme';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as serviceMC from '../../../services/serviceMC';
import '../../siteThree.css';
import PageDetailViewer from '../../../container/pageDetailViewer';
import MapWithListView from "../../../container/mapWithListView";
import * as reducer from '../../../utils'

let _self = null;
let rgn = [];
class SiteFourPageAppInst extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            shouldShowBox: true,
            shouldShowCircle: false,
            bodyHeight: 0,
            devData: [],
            viewMode: 'listView',
            detailData: null,
            hiddenKeys: ['Error', 'URI', 'Mapped_port', 'Runtime', 'Created', 'Liveness', 'Flavor', 'Status', 'Revision'],
            AppRevision: [],
            regionToggle: false,
            dataSort: false
        };
        this.requestCount = 0;
        this.multiRequestData = [];
        this.headerH = 70;
        this.hgap = 0;
        this.loadCount = 0;

        this.headerLayout = [2, 2, 2, 1, 1, 2, 2, 2, 1, 4];
        this._AppInstDummy = [];
        this._diffRev = []
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

    setHiddenKey(key) {
        let copyHiddenKeys = Object.assign([], this.state.hiddenKeys)
        let newHiddenKeys = [];
        if (key.hidden === true) {
            newHiddenKeys = copyHiddenKeys.concat(key.name)

        } else {
            //remove key from hiddenKeys
            newHiddenKeys = reducer.filterDefine(this.state.hiddenKeys, [key.name])
        }

        this.setState({ hiddenKeys: newHiddenKeys })

    }

    componentWillMount() {
        this.setState({ bodyHeight: (window.innerHeight - this.headerH) })
    }

    componentDidMount() {
    }

    componentWillUnmount() {
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
            _self.setState({ regionToggle: true })
            this.getDataDeveloper(nextProps.changeRegion, nextProps.regionInfo.region);
        }
        if (nextProps.viewMode) {
            if (nextProps.viewMode === 'listView') {

                //alert('viewmode..'+nextProps.viewMode+':'+ this.state.devData)
                //this.getDataDeveloper(this.props.changeRegion)
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
            let token = store ? store.userToken : 'null';
            if (localStorage.selectRole == 'AdminManager') {
                rgn.map((item) => {
                    serviceMC.sendRequest(_self, { token: token, method: serviceMC.getEP().SHOW_APP_INST, data: { region: item } }, _self.receiveResult)
                })
            } else {
                rgn.map((item) => {
                    let data = {
                        region: item,
                        appinst: {
                            key: {
                                app_key: {
                                    developer_key: { name: localStorage.selectOrg },
                                }
                            }
                        }
                    }
                    serviceMC.sendRequest(_self, { token: token, method: serviceMC.getEP().SHOW_APP_INST, data: data }, _self.receiveResult)
                })
            }
        }
    }
    getDataDeveloperSub = (region) => {
        console.log("getDataDeveloperSubsss", region)
        this._diffRev = []
        let _region = (region) ? region : 'All';
        this.getDataDeveloper(_region);
    }

    render() {
        const { viewMode, devData, detailData } = this.state;
        return (
            (viewMode === 'listView') ?
                <MapWithListView devData={devData} headerLayout={this.headerLayout} hiddenKeys={this.state.hiddenKeys} siteId='appinst' dataRefresh={this.getDataDeveloperSub} diffRev={this._diffRev} dataSort={this.state.dataSort}></MapWithListView>
                :
                <PageDetailViewer data={detailData} page='appInst' />
        );
    }

};

const mapStateToProps = (state) => {

    let stateChange = false;
    if (state.receiveDataReduce.params && state.receiveDataReduce.params.state === 'refresh') {
        stateChange = true;
    }
    let viewMode = null;
    let detailData = null;
    if (state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
        detailData = state.changeViewMode.mode.data;
    }
    let regionInfo = (state.regionInfo) ? state.regionInfo : null;
    return {
        stateChange: stateChange,
        computeRefresh: (state.computeRefresh) ? state.computeRefresh : null,
        changeRegion: state.changeRegion.region ? state.changeRegion.region : null,
        selectOrg: state.selectOrg.org ? state.selectOrg.org : null,
        userRole: state.showUserRole ? state.showUserRole.role : null,
        viewMode: viewMode, detailData: detailData,
        headerFilter: state.tableHeader.filter ? state.tableHeader.filter : null,
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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(sizeMe({ monitorHeight: true })(SiteFourPageAppInst)));
