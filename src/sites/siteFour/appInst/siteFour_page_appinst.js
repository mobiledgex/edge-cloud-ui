import _ from 'lodash'
import React from 'react';
import { withRouter } from 'react-router-dom';
import sizeMe from 'react-sizeme';
//redux
import { connect } from 'react-redux';
import * as actions from '../../../actions';
import * as serviceMC from '../../../services/serviceMC';
import '../../siteThree.css';
import MapWithListView from "../../../container/mapWithListView";
import PageDetailViewer from '../../../container/pageDetailViewer';
import TerminalViewer from '../../../container/TerminalViewer';
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
            AppRevision: [],
            regionToggle: false,
            dataSort: false
        };
        this.requestCount = 0;
        this.multiRequestData = [];
        this.headerH = 70;
        this.hgap = 0;
        this.loadCount = 0;
        this._AppInstDummy = [];
        this.socket = null;
        this._diffRev = []

        this.headerInfo = [
            { field: 'Region', label: 'Region', sortable: true, visible: true },
            { field: 'OrganizationName', label: 'Organization Name', sortable: true, visible: true },
            { field: 'AppName', label: 'App Name', sortable: true, visible: true },
            { field: 'Version', label: 'Version', sortable: true, visible: true },
            { field: 'Operator', label: 'Operator', sortable: true, visible: true },
            { field: 'Cloudlet', label: 'Cloudlet', sortable: true, visible: true },
            { field: 'ClusterInst', label: 'Cluster Instance', sortable: true, visible: true },
            { field: 'CloudletLocation', label: 'Cloudlet Location', sortable: false, visible: false },
            { field: 'DeploymentType', label: 'Deployment Type', sortable: true, visible: true },
            { field: 'State', label: 'State', sortable: true, visible: false },
            { field: 'Progress', label: 'Progress', sortable: false, visible: true },
            { field: 'Actions', label: 'Actions', sortable: false, visible: true }
        ]

        this.actionMenu = [
            { label: 'Delete', icon:'delete_outline'},
            { label: 'Terminal', icon:'code'}
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

    receiveResult = (mcRequestList) => {
         _self.requestCount -= 1;
         if (mcRequestList && mcRequestList.length > 0) {
            let appInstList = [];
            let appList = [];
            mcRequestList.map(mcRequest => {
                let request = mcRequest.request;
                if (request.method === serviceMC.getEP().SHOW_APP_INST) {
                    appInstList = mcRequest.response.data
                }
                else if (request.method === serviceMC.getEP().SHOW_APP) {
                    appList = mcRequest.response.data
                }
            });

            if (appInstList && appInstList.length > 0) {
                for (let i = 0; i < appInstList.length; i++) {
                    let appInst = appInstList[i]
                    for (let j = 0; j < appList.length; j++) {
                        let app = appList[j]
                        if (appInst.AppName === app.AppName) {
                            appInst.DeploymentType = app.DeploymentType;
                            break;
                        }
                    }
                }
                _self.multiRequestData = [..._self.multiRequestData, ...appInstList]
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
    }}

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
            rgn.map((item) => {
                let requestList = []
                let data = {}
                if (localStorage.selectRole == 'AdminManager') {
                    data = { region: item }
                }
                else {
                    data = {
                        region: item,
                        appinst: {
                            key: {
                                app_key: {
                                    developer_key: { name: localStorage.selectOrg },
                                }
                            }
                        }
                    }
                }
                requestList.push({ token: token, method: serviceMC.getEP().SHOW_APP_INST, data: data })
                requestList.push({ token: token, method: serviceMC.getEP().SHOW_APP, data: data })
                serviceMC.sendMultiRequest(_self, requestList, _self.receiveResult)
            })
        }
    }
    getDataDeveloperSub = (region) => {
        this._diffRev = []
        let _region = (region) ? region : 'All';
        this.getDataDeveloper(_region);
    }

    onTermialClose = ()=>
    {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
        this.gotoUrl('/site4', 'pg=6')
    }

    setRemote = (mcRequest) => {
        this.socket = mcRequest.socket;
        this.props.handleLoadingSpinner(false)
        let mcurl = process.env.REACT_APP_API_VM_ENDPOINT;
        if (mcRequest && mcRequest.response)
        {
            let response  = mcRequest.response;
            let responseData = response.data
            if(responseData.code === 200)
            {
                let vmURL = responseData.data;
                let vmURLs = vmURL.split('/')
                vmURL = mcurl+'/'+vmURLs[vmURLs.length-1];
                _self.setState({ viewMode: 'detailView' })
                let vm = {}
                vm.url = vmURL
                let data = {}
                data.vm = vm;
                this.props.childPage(<TerminalViewer data={data} onClose={this.onTermialClose}></TerminalViewer>)  
            }
            else
            {
                if(responseData.data)
                {
                    this.props.handleAlertInfo('error', responseData.data.message)
                }
            }
        }
    }

    onTerminal = (data)=>
    {
        if (data.DeploymentType === 'vm') {
            const { Region, OrganizationName, AppName, Version, ClusterInst, Cloudlet, Operator } = data;
            let execrequest =
            {
                app_inst_key:
                {
                    app_key:
                    {
                        developer_key: { name: OrganizationName },
                        name: AppName,
                        version: Version
                    },
                    cluster_inst_key:
                    {
                        cluster_key: { name: ClusterInst },
                        cloudlet_key: { operator_key: { name: Operator }, name: Cloudlet },
                        //developer: OrganizationName
                    }
                }
            }

            let requestedData = {
                execrequest: execrequest,
                region: Region
            }

            let store = JSON.parse(localStorage.PROJECT_INIT);
            let token = store ? store.userToken : 'null';
            let requestData = {
                token: token,
                method: serviceMC.getEP().SHOW_CONSOLE,
                data: requestedData
            }
            this.props.handleLoadingSpinner(true)
            serviceMC.sendWSRequest(requestData, this.setRemote)
        }
        else if (data.Runtime.container_ids) {
            this.props.childPage(<TerminalViewer data={data} onClose={this.onTermialClose}></TerminalViewer>)
        }
    }

    render() {
        const { viewMode, devData, detailData } = this.state;
        return (
            
            (viewMode === 'listView') ?
                <MapWithListView actionMenu={this.actionMenu} devData={devData} headerInfo={this.headerInfo} siteId='appinst' dataRefresh={this.getDataDeveloperSub} onTerminal={this.onTerminal} dataSort={this.state.dataSort}></MapWithListView>
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
