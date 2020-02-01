import React, { Fragment } from 'react';
import { Table, Header, Tab, Icon } from "semantic-ui-react";
import * as moment from 'moment';
import ReactJson from 'react-json-view'
import { connect } from 'react-redux';
import * as actions from '../actions';
import TerminalViewer from './TerminalViewer';
import './styles.css';
import TextareaAutosize from "react-textarea-autosize";

const pane = [
    { menuItem: 'Details', render: (props) => <Tab.Pane>{detailViewer(props, 'detailViewer')}</Tab.Pane> }
]

const panesCommand = [
    { menuItem: 'Details', render: (props) => <Tab.Pane>{detailViewer(props, 'detailViewer')}</Tab.Pane> },
    { menuItem: 'Terminal', render: (props) => <Tab.Pane><TerminalViewer data={props} /></Tab.Pane> }
]
const detailViewer = (props, type) => (
    <Fragment>
        {(type === 'detailViewer') ?
            <Table celled collapsing style={{ width: '100%', height: '100%', border: 'none', display: 'flex', flexDirection: 'column' }}>
                <Table.Header>
                    <Table.Row>
                        <Table.HeaderCell width={6}><div style={{ display: 'flex', justifyContent: 'center' }}>Key</div></Table.HeaderCell>
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
const returnReWord = (label) => {
    let newName = '';
    switch (label) {
        case 'CloudletName' : newName = 'Cloudlet Name'; break;
        case 'CloudletLocation' : newName = 'Cloudlet Location'; break;
        case 'Ip_support' : newName = 'IP Support'; break;
        case 'Num_dynamic_ips' : newName = 'Number of Dynamic IPs'; break;
        case 'ClusterName' : newName =  'Cluster Name'; break;
        case 'OrganizationName' : newName = 'Organization Name'; break;
        case 'IpAccess' : newName = 'IP Access'; break;
        case 'Mapped_port' : newName = 'Mapped Port'; break;
        case 'AppName' : newName = 'App Name'; break;
        case 'ClusterInst' : newName = 'Cluster Instance'; break;
        case 'Physical_name' : newName = 'Physical Name'; break;
        case 'Platform_type' : newName = 'Platform Type'; break;
        case 'FlavorName' : newName = 'Flavor Name'; break;
        case 'RAM' : newName = 'RAM Size'; break;
        case 'vCPUs' : newName = 'Number of vCPUs'; break;
        case 'Disk' : newName = 'Disk Space'; break;
        case 'DeploymentType' : newName = 'Deployment Type'; break;
        case 'ImageType' : newName = 'Image Type'; break;
        case 'ImagePath' : newName = 'Image Path'; break;
        case 'DefaultFlavor' : newName = 'Default Flavor'; break;
        case 'DeploymentMF' : newName = 'Deployment Manifest'; break;
        case 'AuthPublicKey' : newName = 'Auth Public Key'; break;
        case 'DefaultFQDN' : newName = 'Official FQDN'; break;
        case 'PackageName' : newName = 'Package Name'; break;
        case 'ScaleWithCluster' : newName = 'Scale With Cluster'; break;
        default: newName = label; break;
    }
    return newName;

}
const makeTable = (values, label, i) => (
    (label !== 'Edit' && label !== 'uuid' && label !== 'CloudletInfoState') ?
        <Table.Row key={i}>
            <Table.Cell>
                <Header as='h4' image>
                    <Icon name={'dot'} />
                    <Header.Content>
                        {returnReWord(label)}
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
                                            : (label === 'Platform_type') ? String(makePFT(values[label]))
                                                :(label == 'DeploymentType' && String(values[label]) === 'docker')?"Docker"
                                                    :(label == 'DeploymentType' && String(values[label]) === 'vm')?"VM"
                                                        :(label == 'DeploymentType' && String(values[label]) === 'kubernetes')?"Kubernetes"
                                                            :(label == 'DeploymentType' && String(values[label]) === 'helm')?"Helm"
                                                                :(label == 'Ports')?String(values[label]).toUpperCase()
                                                                    :(label == 'DeploymentMF')? makeTextBox(values[label])
                                                                        :(label == 'ImageType' && String(values[label]) === '1')?"Docker"
                                                                            :(label == 'ImageType' && String(values[label]) === '2')?"Qcow" /* 여기까지 Apps*/
                                                                                :(label == 'Created')? String("time is ==  "+values[label])
                                                                                    :(label == 'ScaleWithCluster' && String(values[label]) === 'false')?"False"
                                                                                        :(label == 'ScaleWithCluster' && String(values[label]) === 'true')?"True"
                                                                                            : (typeof values[label] === 'object') ? jsonView(values[label], label)
                                                    : String(values[label])}
            </Table.Cell>
        </Table.Row> : null
)

const makeTextBox = (value) => (
    <TextareaAutosize
        minRows={3}
        maxRows={10}
        style={{width:'100%', resize:'none', padding:'5px 10px', backgroundColor:'rgba(0,0,0,.2)', borderColor:'rgba(255,255,255,.1)', color:'rgba(255,255,255,.5)' }}
        defaultValue={value}></TextareaAutosize>
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
    "13": "CRM Init",
    "14": "Creating"
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
    }

    generateLayout() {
        return layout
    }

    onChangeTab = (e, data) => {
        console.log('20190923 on change tab ..data --- ', data)
        _self.clearInterval();
        _self.props.handleLoadingSpinner(false)

    }

    generateDOM(open, dimmer, data, mData, keysData, hideHeader, region, page) {
        let panelParams = { data: data, mData: mData, keys: keysData, page: page, region: region, handleLoadingSpinner: this.props.handleLoadingSpinner, userrole: localStorage.selectRole }
        return layout.map((item, i) => (
            (i === 0) ?
                <div className="round_panel" key={i} >
                    <div className="grid_table tabs">
                        <Tab className="grid_tabs" menu={{ secondary: true, pointing: true, inverted: true, attached: false, tabular: false }}
                            panes={(page === 'appInst') ? panesCommand : pane}{...panelParams}
                            gotoUrl={this.gotoUrl} toggleSubmit={this.state.toggleSubmit} error={this.state.validateError} onTabChange={this.onChangeTab} />
                    </div>
                </div>
                :
                <div className="round_panel" key={i} ></div>
        ))
    }

    clearInterval() {
        if (_self.activeInterval) clearInterval(_self.activeInterval);
    }

    componentDidMount() {
        this.setState({ userRole: localStorage.selectRole })
        this.props.handleLoadingSpinner(true)
    }

    componentWillReceiveProps(nextProps, nextContext) {
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

    render() {
        let { listData, monitorData, open, dimmer, hiddenKeys } = this.state;
        return (
            <div className="regis_container">
                {this.generateDOM(open, dimmer, listData, monitorData, this.state.keysData, hiddenKeys, this.props.region, this.props.page)}
            </div>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        loading: (state.loadingSpinner) ? state.loadingSpinner.loading : null
    }
}
const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(PageDetailViewer);
