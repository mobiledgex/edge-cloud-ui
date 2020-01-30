import React, {Fragment} from 'react';
import {Button, Divider, Table, Grid, Header, Tab, Icon, Segment, Container} from "semantic-ui-react";
import ContainerDimensions from 'react-container-dimensions';
import * as moment from 'moment';
import RGL, { WidthProvider } from "react-grid-layout";
import ReactJson from 'react-json-view'
import * as serviceMC from '../services/serviceMC';
import * as aggregate from '../utils';
import { connect } from 'react-redux';
import * as actions from '../actions';
import MonitoringViewer from './monitoringViewer';
import CommandViewer from './commandViewer';
import './styles.css';
import '../css/pages/cloudletPool.css';

const ReactGridLayout = WidthProvider(RGL);
const pane = [
    { menuItem: 'Details', render: (props) => <Tab.Pane>{detailViewer(props, 'detailViewer')}</Tab.Pane> }
]
const panes = [
    { menuItem: 'Details', render: (props) => <Tab.Pane>{detailViewer(props, 'detailViewer')}</Tab.Pane> },
    { menuItem: 'Monitoring', render: (props) => <Tab.Pane><MonitoringViewer data={props}/></Tab.Pane> }
]
const panesCommand = [
    { menuItem: 'Details', render: (props) => <Tab.Pane>{detailViewer(props, 'detailViewer')}</Tab.Pane> },
    { menuItem: 'Monitoring', render: (props) => <Tab.Pane><MonitoringViewer data={props}/></Tab.Pane> },
    { menuItem: 'Command', render: (props) => <Tab.Pane><CommandViewer data={props}/></Tab.Pane> }
]

const detailViewer = (props, type) => (
    <Fragment>
        {(type === 'detailViewer')?
            <Table className='page_cloudletPool_table' celled collapsing style={{ width: '100%', height: '100%', border: 'none', display: 'flex', flexDirection: 'column' }}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={6}><div style={{ display: 'flex', justifyContent: 'center' }}>Key</div></Table.HeaderCell>
                        <Table.HeaderCell width={10}><div style={{ display: 'flex', justifyContent: 'center' }}>Value</div></Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {
                        props.data ? Object.keys(props.data).map((item, i) => makeCloudletTable(props.data, item, i)) : null
                    }
                </Table.Body>
            </Table>

            :
            <div></div>
        }

    </Fragment>
)

const makeCloudletTable = (values, label, i) => (
    (label !== 'Edit' && label !== 'uuid')?
        <Table.Row key={i}>
            <Table.Cell>
                
                        {(label == 'CloudletName')?'Cloudlet Name'
                            :(label == 'CloudletLocation')?'Cloudlet Location'
                                :(label == 'Ip_support')?'IP Support'
                                    :(label == 'Num_dynamic_ips')?'Number of Dynamic IPs' /* Cloudlets */
                                        :(label == 'ClusterName')?'Cluster Name'
                                            :(label == 'OrganizationName')?'Organization Name'
                                                :(label == 'IpAccess')?'IP Access' /* Cluster Inst */
                                                    :(label == 'Mapped_port')?'Mapped Port' /* Cluster Inst */
                                                        :(label == 'AppName')?'App Name'
                                                            :(label == 'ClusterInst')?'Cluster Instance'
                                                                :(label == 'Physical_name')?'Physical Name'
                                                                    :(label == 'Platform_type')?'Platform Type'
                                                                        :label}
                    
            </Table.Cell>
            <Table.Cell>
                {(label === 'Ip_support' && String(values[label]) == '1')?'Static'
                    :(label === 'Ip_support' && String(values[label]) == '2')?'Dynamic' /* Cloudlets */
                        :(label === 'IpAccess' && String(values[label]) == '1')?'Dedicated'
                            :(label === 'IpAccess' && String(values[label]) == '3')?'Shared' /* Cluster Inst */
                                :(label === 'Created')? String( makeUTC(values[label]) )
                                    :(label === 'State')? _status[values[label]]
                                        :(label === 'Liveness')? _liveness[values[label]]
                                            :(label === 'cloudletGroup')? tableCloudletPool(values[label])
                                            :(label === 'OrganizGroup')? tableCloudletPoolOrg(values[label])
                                            :(typeof values[label] === 'object')? jsonView(values[label],label)
                                                :(label === 'Platform_type')? String( makePFT(values[label]) )
                                                    :String(values[label])}
            </Table.Cell>
        </Table.Row> : null
)
const makeLinkTable = (values, label, i) => (
    (label !== 'Edit')?
        <Table.Row key={i}>
            <Table.Cell>
                <Header as='h4' image>Link</Header>
            </Table.Cell>
        </Table.Row>
        : null
)
const jsonView = (jsonObj,_label) => {
    if(_label === 'Mapped_port'){
        jsonObj.map((item) => {
            if(item.proto == 1) item.proto = 'TCP'
            else if(item.proto == 2) item.proto = 'UDP'
        })
    }
    return <ReactJson src={jsonObj} {..._self.jsonViewProps} />
}



const tableCloudletPool = (jsonObj) => {

    return (
        <Table className="viewListTable cloudletPoolGroup" basic='very' striped celled>
            <Table.Header className="viewListTableHeader">
                <Table.Row>
                    <Table.HeaderCell textAlign='left'>Region</Table.HeaderCell>
                    <Table.HeaderCell textAlign='left'>Operator</Table.HeaderCell>
                    {/*<Table.HeaderCell width={5}>PoolName</Table.HeaderCell>*/}
                    <Table.HeaderCell textAlign='left'>Cloudlet</Table.HeaderCell>
                    <Table.HeaderCell textAlign='right'></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body className="tbBodyList">
                {jsonObj.map((item, i) => makeCloudletGroup(item, i))}
            </Table.Body>
        </Table>

    )

}
const makeDeleteIcon = (_item, _type) => (
    <Button onClick={_self.onHandleDelete} item={_item} type={_type} size='mini'><Icon name='trash' style={{cursor:'pointer'}}></Icon></Button>
)
const makeCloudletGroup = (item, i) => (
    <Table.Row key={i}>
        <Table.Cell textAlign='left'>{item.Region}</Table.Cell>
        <Table.Cell textAlign='left'>{item.Operator}</Table.Cell>
        {/*<Table.Cell width={5}>{item.PoolName}</Table.Cell>*/}
        <Table.Cell textAlign='left'>{item.Cloudlet}</Table.Cell>
        <Table.Cell textAlign='right'>{makeDeleteIcon(item, 'delete member')}</Table.Cell>
    </Table.Row>
)

const tableCloudletPoolOrg = (jsonObj) => {

    return (
        <Table className="viewListTable cloudletPoolGroup" basic='very' striped celled>
            <Table.Header className="viewListTableHeader">
                <Table.Row>
                    <Table.HeaderCell  textAlign='left' >Region</Table.HeaderCell>
                    <Table.HeaderCell  textAlign='left' >Organization</Table.HeaderCell>
                    <Table.HeaderCell  textAlign='right'></Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body className="tbBodyList">
                {jsonObj.map((item, i) => makeOrganizGroup(item, i))}
            </Table.Body>
        </Table>

    )

}

const makeOrganizGroup = (item, i) => (
    <Table.Row key={i}>
        <Table.Cell textAlign='left' >{item.Region}</Table.Cell>
        <Table.Cell textAlign='left'>{item.Org}</Table.Cell>
        <Table.Cell textAlign='right'>{makeDeleteIcon(item, 'delete link')}</Table.Cell>
    </Table.Row>
)



const makeUTC = (time) => (
    moment.unix( time.replace('seconds : ', '') ).utc().format('YYYY-MM-DD HH:mm:ss') + ' UTC'
)

const makePFT = (value) => (
    (value == 0)? 'Fake':
    (value == 1)? 'Docker in Docker':
    (value == 2)? 'Openstack':
    (value == 3)? 'Azure':
    (value == 4)? 'GCP':
    (value == 5)? 'Mobiledgex Docker in Docker': '-'
)

const _status = {
    "0" : "Tracked State Unknown",
    "1" : "Not Present",
    "2" : "Create Requested",
    "3" : "Creating",
    "4" : "Create Error",
    "5" : "Ready",
    "6" : "Update Requested",
    "7" : "Updating",
    "8" : "Update Error",
    "9" : "Delete Requested",
    "10" : "Deleting",
    "11" : "Delete Error",
    "12" : "Delete Prepare",
    "13" : "CRM Init"
}
const _liveness = {
    "1" : "Static",
    "2" : "Dynamic"
}
var layout = [
    {"w":19,"x":0,"y":0,"i":"0", "minW":8, "moved":false,"static":false, "title":"Developer"}
]
let _self = null;
class PagePoolDetailViewer extends React.Component {
    constructor() {
        super();
        const layout = this.generateLayout();
        this.state = {
            layout,
            listData:[],
            monitorData:[],
            selected:{},
            open:false,
            dimmer:'',
            devOptionsOne:[],
            devOptionsTwo:[],
            devOptionsThree:[],
            devOptionsFour:[],
            devOptionsFive:[],
            dropdownValueOne:'',
            dropdownValueTwo:'',
            dropdownValueThree:'',
            dropdownValueFour:'',
            dropdownValueFive:'',
            cloudletResult:null,
            appResult:null,
            listOfDetail:null,
            clusterName:null,
            activeIndex:0,
            page:'',
            user:'AdminManager',
            refreshId:0
        }
        _self = this;
        this.initData = null;
        this.activeInterval = null;

        this.jsonViewProps = {
            name:null,
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
            clusterInst:['cpu', 'mem', 'disk', 'network', 'tcp', 'udp'],
            appInst:['cpu', 'mem', 'network','connections'],
            //cloudlet:['utilization']
            cloudlet:['ipusage', 'utilization']

        }

        this.selectedItems = [];

    }
    generateLayout() {

        return layout
    }
    onLayoutChange(layout) {
        //this.props.onLayoutChange(layout);
    }
    onChangeTab = (e, data) => {
        console.log('20190923 on change tab ..data --- ',data)
        if(data.activeIndex === 1 && _self.state.page) {

        } else {
            _self.clearInterval();
            _self.props.handleLoadingSpinner(false)
        }
    }
    removeSelectedItems = () => {
        _self.selectedItems.map((item) => {
            // 데이터에서 아이템 제거
            let groupData = null;
            let filterDefine = null;
            let cloneListData = Object.assign([], _self.state.listData)
            if(item.type === 'delete member') {
                groupData = _self.state.listData['cloudletGroup'];
                filterDefine = groupData.filter( data => data['Cloudlet'] !== item.item['Cloudlet']);
                cloneListData['cloudletGroup'] = filterDefine;
                cloneListData['Cloudlets'] -= 1;
            } else if(item.type === 'delete link') {
                groupData = _self.state.listData['OrganizGroup'];
                filterDefine = groupData.filter( data => data['Org'] !== item.item['Org']);
                cloneListData['OrganizGroup'] = filterDefine;
                cloneListData['Organizations'] -= 1;
            }
            
            
            if(filterDefine){
                _self.setState({listData: cloneListData})
            }
        })
    }
    httpResponse = (result) => {
        if(result) {
            console.log(JSON.stringify(result))
            if(result.response && result.response.data) {
                _self.props.handleAlertInfo('success', result.response.data.message ? result.response.data.message : 'Created successfully')
            }
            /** remove item from list */
            this.removeSelectedItems();

        } else {
            _self.props.handleAlertInfo('error', 'View the audit log')
        }
        _self.props.handleLoadingSpinner(false)
    }
    onHandleDelete = (e, _data) => {
        console.log('on handle delete ...', e, _data)
        // TODO: delete cloudlet in pool
        if(_data.type === 'delete member') {

        } else if(_data.type === 'delete link') {
            
        }
        //////
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let method = serviceMC.getEP().getDeleteMethod(_data.type);
        let data = serviceMC.getEP().getKey(_data.type, _data.item);
        if (method && data) {
            let serviceBody = {
                token: store ? store.userToken : null,
                method: method,
                data: data
            }
            _self.selectedItems.push(_data)
            _self.props.handleLoadingSpinner(true);
            serviceMC.sendRequest(_self, serviceBody, _self.httpResponse)
        }
    }

    generateDOM(open, dimmer, data, keysData, hideHeader, region, page, rfId) {

        let panelParams = {data:data, keys:keysData, page:page, region:region, handleLoadingSpinner:this.props.handleLoadingSpinner, userrole:localStorage.selectRole, rfId:rfId}
        return layout.map((item, i) => (

            (i === 0)?
                <div className="round_panel" key={i} >

                    <div className="grid_table tabs">
                        <Tab className="grid_tabs" menu={{ secondary: true, pointing: true, inverted: true, attached: false, tabular: false }}
                             panes={(this.state.userRole === 'AdminManager' && page === 'appInst')?panesCommand:((this.state.userRole === 'DeveloperManager' || this.state.userRole === 'DeveloperContributor' || this.state.userRole === 'DeveloperViewer') && page === 'cloudlet')?pane:(page === 'appInst')?panesCommand:pane}{...panelParams}
                             gotoUrl={this.gotoUrl} toggleSubmit={this.state.toggleSubmit} error={this.state.validateError} onTabChange={this.onChangeTab}/>
                    </div>
                </div>
                :
                <div className="round_panel" key={i} >

                </div>


        ))
    }

    clearInterval() {
        if(_self.activeInterval) clearInterval(_self.activeInterval);
    }

    makeFormCluster = (inst, valid, store) => (
        {
            "token":store,
            "params":{
                "region":inst.Region,
                "clusterinst":{
                    "cluster_key":{"name":inst.ClusterName},
                    "cloudlet_key":{
                        "operator_key":{"name":inst.Operator},
                        "name":inst.Cloudlet
                    },
                    "developer":inst.OrganizationName
                },
                "selector":valid,
                "last":1200

            }

        }
    )

    getAppName = (name) => {
        let lowerCaseName = name.toLowerCase()
        return lowerCaseName.replace(/\s+/g, '');
    }
    makeFormApp = (inst, valid, store) => (
        {
            "token":store,
            "params":{
                "region":inst.Region,
                "appinst":{
                    "app_key":{
                        "developer_key":{"name":inst.OrganizationName},
                        "name":this.getAppName(inst.AppName),
                        "version":inst.Version
                    },
                    "cluster_inst_key":{
                        "cluster_key":{"name":inst.ClusterInst},
                        "cloudlet_key":{
                            "name":inst.Cloudlet,
                            "operator_key":{"name":inst.Operator}
                        }
                    }
                },
                "selector":valid,
                "last":1200
            }
        }
    )

    makeFormCloudlet =(inst, valid, store) => (
        {
            'token':store,
            'params':{
                "region":inst.Region,
                "cloudlet":{
                    "operator_key":{"name":inst.Operator},
                    "name":inst.CloudletName
                },
                "selector":valid,
                //"last":200
                "last":200
            }
        }

    )

    componentDidMount() {
        let userRole = localStorage.getItem('selectRole');
        this.setState({userRole:localStorage.selectRole})
        this.props.handleLoadingSpinner(true)

    }
    componentWillReceiveProps(nextProps, nextContext) {
        let regKeys = [];
        let component = null;
        let data = [];
        if(nextProps.data && !this.initData){
            setTimeout(() => this.setState({listData:nextProps.data, page:nextProps.page}), 2000)
            this.initData = true;
            this.props.handleLoadingSpinner(false)
        }

        if(nextProps.loading) {
            console.log('20200113 refresh view')
            this.setState({refreshId: Math.random() * 300})
            this.forceUpdate();
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
                <div style={{wordWrap: 'break-word'}}>{(typeof values[label] === 'object')? JSON.stringify(values[label]):String(values[label])}</div>
            </Grid.Column>
            <Divider vertical></Divider>
        </Grid.Row>
    )

    close() {
        this.setState({ open: false })
        this.clearInterval();
        this.props.close()
    }

    render() {
        let { listData, clusterName, open, dimmer, hiddenKeys, userRole, refreshId } = this.state;
        let { loading } = this.props;
        return (
            <div className="regis_container">
                {this.generateDOM(open, dimmer, listData, this.state.keysData, hiddenKeys, this.props.region, this.props.page, refreshId={refreshId})}
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
        viewMode:viewMode,
        loading:(state.loadingSpinner)?state.loadingSpinner.loading:null
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))},
    };
};

export default connect(mapStateToProps, mapDispatchProps)(PagePoolDetailViewer);
