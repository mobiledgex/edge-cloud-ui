import React, { Fragment } from 'react';
import { Divider, Table, Grid, Header, Tab, Icon } from "semantic-ui-react";
import * as moment from 'moment';
import ReactJson from 'react-json-view'
import * as serviceMC from '../services/serviceMC';
import { connect } from 'react-redux';
import * as actions from '../actions';
import MonitoringViewer from './monitoringViewer';
import CommandViewer from './commandViewer';
import TerminalViewer from './TerminalViewer';
import './styles.css';

const pane = [
    { menuItem: 'Details', render: (props) => <Tab.Pane>{detailViewer(props, 'detailViewer')}</Tab.Pane> }
]

/** This is for old monitoring tab **/
// const panes = [
//     { menuItem: 'Details', render: (props) => <Tab.Pane>{detailViewer(props, 'detailViewer')}</Tab.Pane> },
//     { menuItem: 'Monitoring', render: (props) => <Tab.Pane><MonitoringViewer data={props} /></Tab.Pane> }
// ]

const panesCommand = [
    { menuItem: 'Details', render: (props) => <Tab.Pane>{detailViewer(props, 'detailViewer')}</Tab.Pane> },
    // { menuItem: 'Monitoring', render: (props) => <Tab.Pane><MonitoringViewer data={props} /></Tab.Pane> }, // <- this is for old monitoring tab
    // { menuItem: 'Command', render: (props) => <Tab.Pane><CommandViewer data={props} /></Tab.Pane> },
    { menuItem: 'Terminal', render: (props) => <Tab.Pane><TerminalViewer data={props} /></Tab.Pane> }
]
const detailViewer = (props, type) => (
    <Fragment>
        {(type === 'detailViewer') ?
            <Table celled collapsing style={{ width: '100%', height: '100%', border: 'none', display: 'flex', flexDirection: 'column' }}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={6}><div style={{ display: 'flex', justifyContent: 'center' }}>Subject</div></Table.HeaderCell>
                        <Table.HeaderCell width={10}><div style={{ display: 'flex', justifyContent: 'center' }}>Value</div></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        props.data ? Object.keys(props.data).map((item, i) => makeTable(props.data, item, i)) : null
                    }
                </Table.Body>
            </Table>

            :
            <div></div>
        }

    </Fragment>
)

const makeTable = (values, label, i) => (
    (label !== 'Edit') ?
        <Table.Row key={i}>
            <Table.Cell>
                <Header as='h4' image>
                    <Icon name={'dot'} />
                    <Header.Content>
                        {(label == 'CloudletName') ? 'Cloudlet Name'
                            : (label == 'CloudletLocation') ? 'Cloudlet Location'
                                : (label == 'Ip_support') ? 'IP Support'
                                    : (label == 'Num_dynamic_ips') ? 'Number of Dynamic IPs' /* Cloudlets */
                                        : (label == 'ClusterName') ? 'Cluster Name'
                                            : (label == 'OrganizationName') ? 'Organization Name'
                                                : (label == 'IpAccess') ? 'IP Access' /* Cluster Inst */
                                                    : (label == 'Mapped_port') ? 'Mapped Port' /* Cluster Inst */
                                                        : (label == 'AppName') ? 'App Name'
                                                            : (label == 'ClusterInst') ? 'Cluster Instance'
                                                                : (label == 'Physical_name') ? 'Physical Name'
                                                                    : (label == 'Platform_type') ? 'Platform Type'
                                                                        : label}
                    </Header.Content>
                </Header>
            </Table.Cell>
            <Table.Cell>
                {(label === 'Ip_support' && String(values[label]) == '1') ? 'Static'
                    : (label === 'Ip_support' && String(values[label]) == '2') ? 'Dynamic' /* Cloudlets */
                        : (label === 'IpAccess' && String(values[label]) == '1') ? 'Dedicated'
                            : (label === 'IpAccess' && String(values[label]) == '3') ? 'Shared' /* Cluster Inst */
                                : (label === 'Created') ? String(makeUTC(values[label]))
                                    : (label === 'State') ? _status[values[label]]
                                        : (label === 'Liveness') ? _liveness[values[label]]
                                            : (typeof values[label] === 'object') ? jsonView(values[label], label)
                                                : (label === 'Platform_type') ? String(makePFT(values[label]))
                                                    : String(values[label])}
            </Table.Cell>
        </Table.Row> : null
)
const jsonView = (jsonObj, _label) => {
    if (_label === 'Mapped_port') {
        jsonObj.map((item) => {
            if (item.proto == 1) item.proto = 'TCP'
            else if (item.proto == 2) item.proto = 'UDP'
        })
    }
    return <ReactJson src={jsonObj} {..._self.jsonViewProps} />
}

const makeUTC = (time) => (
    moment.unix(time.replace('seconds : ', '')).utc().format('YYYY-MM-DD HH:mm:ss') + ' UTC'
)

const makePFT = (value) => (
    (value == 0) ? 'Fake' :
        (value == 1) ? 'Docker in Docker' :
            (value == 2) ? 'Openstack' :
                (value == 3) ? 'Azure' :
                    (value == 4) ? 'GCP' :
                        (value == 5) ? 'Mobiledgex Docker in Docker' : '-'
)

const _status = {
    "0": "Tracked State Unknown",
    "1": "Not Present",
    "2": "Create Requested",
    "3": "Creating",
    "4": "Create Error",
    "5": "Ready",
    "6": "Update Requested",
    "7": "Updating",
    "8": "Update Error",
    "9": "Delete Requested",
    "10": "Deleting",
    "11": "Delete Error",
    "12": "Delete Prepare",
    "13": "CRM Init"
}
const _liveness = {
    "1": "Static",
    "2": "Dynamic"
}
var layout = [
    { "w": 19, "x": 0, "y": 0, "i": "0", "minW": 8, "moved": false, "static": false, "title": "Developer" }
]
let _self = null;
class PageDetailViewer extends React.Component {
    constructor() {
        super();
        const layout = this.generateLayout();
        this.state = {
            layout,
            listData: [],
            monitorData: [],
            selected: {},
            open: false,
            dimmer: '',
            devOptionsOne: [],
            devOptionsTwo: [],
            devOptionsThree: [],
            devOptionsFour: [],
            devOptionsFive: [],
            dropdownValueOne: '',
            dropdownValueTwo: '',
            dropdownValueThree: '',
            dropdownValueFour: '',
            dropdownValueFive: '',
            cloudletResult: null,
            appResult: null,
            listOfDetail: null,
            clusterName: null,
            activeIndex: 0,
            page: '',
            user: 'AdminManager'
        }
        _self = this;
        this.initData = null;
        this.activeInterval = null;

        this.jsonViewProps = {
            name: null,
            theme: "monokai",
            collapsed: false,
            collapseStringsAfter: 15,
            onAdd: false,
            onEdit: false,
            onDelete: false,
            displayObjectSize: false,
            enableClipboard: true,
            indentWidth: 4,
            displayDataTypes: false,
            iconStyle: "triangle"
        }
        /*
        Valid selectors for cluster: “cpu”, “mem”, “disk”, “network”, “tcp”, “udp”
        Valid selectors for app api: “cpu”, “mem”, “network”, "connections"
         */
        this.resources = {
            clusterInst: ['cpu', 'mem', 'disk', 'network', 'tcp', 'udp'],
            appInst: ['cpu', 'mem', 'network', 'connections'],
            //cloudlet:['utilization']
            cloudlet: ['ipusage', 'utilization']

        }

    }
    generateLayout() {

        return layout
    }
    onLayoutChange(layout) {
        //this.props.onLayoutChange(layout);
    }
    onChangeTab = (e, data) => {
        console.log('20190923 on change tab ..data --- ', data)
        if (data.activeIndex === 1 && _self.state.page) {
            _self.getInstanceHealth(_self.state.page, _self.state.listData)
            _self.props.handleLoadingSpinner(true);
        } else {
            _self.clearInterval();
            _self.props.handleLoadingSpinner(false)
        }
    }
    generateDOM(open, dimmer, data, mData, keysData, hideHeader, region, page) {

        let panelParams = { data: data, mData: mData, keys: keysData, page: page, region: region, handleLoadingSpinner: this.props.handleLoadingSpinner, userrole: localStorage.selectRole }
        return layout.map((item, i) => (

            (i === 0) ?
                <div className="round_panel" key={i} >

                    <div className="grid_table tabs">
                        <Tab className="grid_tabs" menu={{ secondary: true, pointing: true, inverted: true, attached: false, tabular: false }}
                             panes={(page === 'appInst') ? panesCommand : pane}{...panelParams}
                             // panes={(this.state.userRole === 'AdminManager' && page === 'appInst') ? panesCommand : ((this.state.userRole === 'DeveloperManager' || this.state.userRole === 'DeveloperContributor' || this.state.userRole === 'DeveloperViewer') && page === 'cloudlet') ? pane : (page === 'appInst') ? panesCommand : panes}{...panelParams} <- this is for old Monitoring Tab
                            gotoUrl={this.gotoUrl} toggleSubmit={this.state.toggleSubmit} error={this.state.validateError} onTabChange={this.onChangeTab} />
                    </div>
                </div>
                :
                <div className="round_panel" key={i} >

                </div>


        ))
    }
    
    receiveInstanceInfo(mcRequestList) {
        let dataList = [];
        if (mcRequestList && mcRequestList.length > 0) {
            mcRequestList.map(mcRequest => {
                dataList = dataList.concat(mcRequest.response.data);
            })
            _self.setState({ monitorData: dataList })
        }
    }
    getParams = (page, data, store) => (
        (page === 'appInst' && _self.resources[page].length) ?
            _self.resources[page].map((valid) => this.makeFormApp(data, valid, store.userToken)) :
            (page === 'cloudlet' && _self.resources[page].length) ?
                _self.resources[page].map((valid) => this.makeFormCloudlet(data, valid, store.userToken)) :
                _self.resources[page].map((valid) => this.makeFormCluster(data, valid, store.userToken))
    )
    loopGetHealth(page, data, store) {
        let method = serviceMC.getEP().CLUSTER_INST_METRICS_APP;
        let dataList = _self.resources[page].map((valid) => {
            if (page === 'appInst') {
                method = serviceMC.getEP().APP_INST_METRICS_APP;
                return this.makeFormApp(data, valid, store.userToken)
            }
            else if (page === 'cloudlet') {
                method = serviceMC.getEP().CLOUDLET_METRICS_APP;
                return this.makeFormCloudlet(data, valid, store.userToken)
            }
            else {
                return this.makeFormCluster(data, valid, store.userToken)
            }
        })

        let requestDataList = [];
        dataList.map(data => {
            requestDataList.push({ token: store.userToken, method: method, data: data })
        })
        serviceMC.sendMultiRequest(_self, requestDataList, _self.receiveInstanceInfo)
    }

    getInstanceHealth(page, data) {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null;
        _self.activeInterval = setInterval(
            () => {
                _self.loopGetHealth(page, data, store);

            },
            15000
        )
        _self.loopGetHealth(page, data, store);
    }

    clearInterval() {
        if (_self.activeInterval) clearInterval(_self.activeInterval);
    }


    makeFormCluster = (inst, valid, store) => (
        {
            "region": inst.Region,
            "clusterinst": {
                "cluster_key": { "name": inst.ClusterName },
                "cloudlet_key": {
                    "operator_key": { "name": inst.Operator },
                    "name": inst.Cloudlet
                },
                "developer": inst.OrganizationName
            },
            "selector": valid,
            "last": 1200

        }
    )




    getAppName = (name) => {
        let lowerCaseName = name.toLowerCase()
        return lowerCaseName.replace(/\s+/g, '');
    }
    makeFormApp = (inst, valid, store) => (
        {
            "region": inst.Region,
            "appinst": {
                "app_key": {
                    "developer_key": { "name": inst.OrganizationName },
                    "name": this.getAppName(inst.AppName),
                    "version": inst.Version
                },
                "cluster_inst_key": {
                    "cluster_key": { "name": inst.ClusterInst },
                    "cloudlet_key": {
                        "name": inst.Cloudlet,
                        "operator_key": { "name": inst.Operator }
                    }
                }
            },
            "selector": valid,
            "last": 1200
        }
    )



    /*
    http --verify=false --auth-type=jwt --auth=$SUPERPASS POST
    https://mc-stage.mobiledgex.net:9900/api/v1/auth/metrics/cloudlet <<<
    '{"region":"EU",
        "cloudlet":{
            "operator_key":{"name":"TDG"},
            "name":"frankfurt-eu"
        },
        "selector":"utilization",
        "last":2
    }'
    */
    makeFormCloudlet = (inst, valid, store) => (
        {
            "region": inst.Region,
            "cloudlet": {
                "operator_key": { "name": inst.Operator },
                "name": inst.CloudletName
            },
            "selector": valid,
            //"last":200
            "last": 200
        }

    )

    componentDidMount() {
        let userRole = localStorage.getItem('selectRole');
        this.setState({ userRole: localStorage.selectRole })
        this.props.handleLoadingSpinner(true)

    }
    componentWillReceiveProps(nextProps, nextContext) {

        let regKeys = [];
        let component = null;
        let data = [];
        if (nextProps.data && !this.initData) {
            this.setState({ listData: nextProps.data, page: nextProps.page })
            this.initData = true;
            this.props.handleLoadingSpinner(false)
        }

    }
    componentWillUnmount() {
        this.initData = false;
        this.clearInterval();
    }

    handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex })
    makeList = (values, label, i) => (
        <Grid.Row columns={2} key={i}>
            <Grid.Column width={5} className='detail_item'>
                <div>{label}</div>
            </Grid.Column>
            <Grid.Column width={11}>
                <div style={{ wordWrap: 'break-word' }}>{(typeof values[label] === 'object') ? JSON.stringify(values[label]) : String(values[label])}</div>
            </Grid.Column>
            <Divider vertical></Divider>
        </Grid.Row>
    )


    setCloudletList = (operNm) => {
        let cl = [];
        _self.state.cloudletResult[operNm].map((oper, i) => {
            if (i === 0) _self.setState({ dropdownValueThree: oper.CloudletName })
            cl.push({ key: i, value: oper.CloudletName, text: oper.CloudletName })
        })

        _self.setState({ devOptionsThree: cl })
    }



    close() {
        this.setState({ open: false })
        this.clearInterval();
        this.props.close()
    }




    render() {
        let { listData, monitorData, clusterName, open, dimmer, hiddenKeys, userRole } = this.state;
        let { loading } = this.props;
        return (
            <div className="regis_container">
                {this.generateDOM(open, dimmer, listData, monitorData, this.state.keysData, hiddenKeys, this.props.region, this.props.page)}
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    let viewMode = null;
    if (state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
    }
    return {
        viewMode: viewMode,
        loading: (state.loadingSpinner) ? state.loadingSpinner.loading : null
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(PageDetailViewer);
