import React from 'react';
import { Tab } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import './styles.css';
import _ from "lodash";
import * as reducer from '../utils'

import * as serviceMC from '../services/serviceMC';
import SiteFourCreateInstForm from "./siteFourCreateInstForm";
import MexMultiStepper, {updateStepper} from '../hoc/stepper/mexMessageMultiStream'

var layout = [
    { "w": 19, "x": 0, "y": 0, "i": "0", "minW": 8, "moved": false, "static": false, "title": "Developer" }
]
let _self = null;


const panes = [
    { menuItem: 'Cluster Instance Deployment', render: (props) => <Tab.Pane attached={false}><SiteFourCreateInstForm data={props} pId={0} getUserRole={props.userrole} toggleSubmit={props.toggleSubmit} validError={props.error} onSubmit={() => console.log('submit form')} /></Tab.Pane> },
]
const ipaccessArr = ['Dedicated', 'Shared'];
class RegistryClusterInstViewer extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        const layout = this.generateLayout();
        this.wsRequestCount = 0;
        this.wsRequestResponse = [];
        this.state = {
            layout,
            stepsArray:[],
            open: false,
            dimmer: false,
            dummyData: [],
            selected: {},
            resultData: null,
            toggleSubmit: false,
            validateError: [],
            regSuccess: true,
            errorClose: false,
            keysData: [
                {
                    'Region': { label: 'Region', type: 'RenderSelect', necessary: true, tip: 'Select region where you want to deploy the cluster.', active: true, items: [] },
                    'ClusterName': { label: 'Cluster Name', type: 'RenderInputCluster', necessary: true, tip: 'Enter name of your cluster.', active: true },
                    'OrganizationName': { label: 'Organization Name', type: 'RenderInputDisabled', necessary: true, tip: 'This is the name of the organization you are currently managing.', active: true, items: ['', ''] },
                    'Operator': { label: 'Operator', type: 'RenderSelect', necessary: true, tip: 'Which operator do you want to deploy this cluster? Please select one.', active: true, items: ['', ''] },
                    'Cloudlet': { label: 'Cloudlet', type: 'RenderDropDown', necessary: true, tip: 'Which cloudlet(s) do you want to deploy this cluster?', active: true, items: ['', ''] },
                    'DeploymentType': { label: 'Deployment Type', type: 'RenderSelect', necessary: true, tip: 'Do you plan to deploy your application in kubernetes cluster? Or do you plan to deploy it as a plain docker container?', active: true, items: ['Docker', 'Kubernetes'] },
                    'IpAccess': { label: 'IP Access', type: 'RenderSelect', necessary: false, tip: 'Shared IP Access represents that you would be sharing a Root Load Balancer with other developers. Dedicated IP Access represents that you would have a dedicated Root Load Balancer.', items: ipaccessArr },
                    'Flavor': { label: 'Flavor', type: 'RenderSelect', necessary: true, tip: 'What flavor is needed to run your application?', active: true, items: ['', ''] },
                    'NumberOfMaster': { label: 'Number of Masters', type: 'RenderInputDisabled', necessary: false, tip: 'This represents Kubernetes Master where it is responsible for maintaining the desired state for your cluster.', value: null },
                    'NumberOfNode': { label: 'Number of Nodes', type: 'RenderInputNum', necessary: false, tip: 'What is the number of nodes you want in this cluster? The nodes in a cluster are the machines that run your applications.', value: null }
                }
            ],
            fakeData: [
                {
                    'Region': '',
                    'ClusterName': '',
                    'OrganizationName': '',
                    'Operator': '',
                    'Cloudlet': '',
                    'DeploymentType': '',
                    'IpAccess': '',
                    'PrivacyPolicy': '',
                    'Flavor': '',
                    'NumberOfMaster': '1',
                    'NumberOfNode': '1'
                }
            ]


        };

    }

    addReservableForAdmin = () => {
        if (localStorage.selectRole && localStorage.selectRole === 'AdminManager') {
            
            let fakeData = this.state.fakeData;
            let keysData = this.state.keysData;
            
            fakeData[0].Reservable = false;
            fakeData[0].ReservedBy = '';

            keysData[0].Reservable = { label: 'Reservable', type: 'renderCheckbox', necessary: false, tip: 'Reserve cluster', value: false }
            keysData[0].ReservedBy = { label: 'Reserved By', type: 'RenderInputCluster', necessary: false, tip: 'MobiledgeX ClusterInsts, the current developer tenant', value: false }
            
            this.setState({
                keysData: keysData,
                fakeData: fakeData
            })
        }
    }


    close = () => {
        this.setState({ open: false })
        this.props.handleInjectDeveloper(null)
    }

    generateDOM(open, dimmer, data, keysData, hideHeader, region) {

        let panelParams = { data: data, keys: keysData, region: region, handleLoadingSpinner: this.props.handleLoadingSpinner, userrole: localStorage.selectRole }

        return layout.map((item, i) => (

            (i === 0) ?
                <div className="round_panel" key={i}>
                    <div className="grid_table">
                        <Tab className="grid_tabs" menu={{ secondary: true, pointing: true, inverted: true, attached: false, tabular: false }} panes={panes}{...panelParams} gotoUrl={this.gotoUrl} toggleSubmit={this.state.toggleSubmit} error={this.state.validateError} />
                    </div>
                </div>
                :
                <div className="round_panel" key={i}>
                </div>


        ))
    }

    generateLayout() {
        const p = this.props;

        return layout
    }

    

    setFildData() {
        //
        if (_self.props.devData.length > 0) {
            _self.setState({ dummyData: _self.props.devData, resultData: (!_self.state.resultData) ? _self.props.devData : _self.state.resultData })
        } else {
            _self.setState({ dummyData: _self.state.fakeData, resultData: (!_self.state.resultData) ? _self.props.devData : _self.state.resultData })
        }
    }

    receiveSubmit = (mcRequest) => {
        if (mcRequest) {
            let data = undefined;
            let request = mcRequest.request;
            let cloudletName = request.data.clusterinst.key.cloudlet_key.name;
            if(mcRequest.response && mcRequest.response.data)
            {
                data  = mcRequest.response.data;
            }
            this.setState({stepsArray:updateStepper(this.state.stepsArray, cloudletName, data)})
        }
    }

    componentDidMount() {

        this.addReservableForAdmin()
        this.setFildData();
        let assObj = Object.assign([], this.state.fakeData);
        assObj[0].OrganizationName = localStorage.selectOrg;
        this.setState({ fakeData: assObj });
    }
    componentWillReceiveProps(nextProps, nextContext) {

        if (nextProps.accountInfo) {
            this.setState({ dimmer: 'blurring', open: true })
        }
        if (nextProps.devData.length > 1) {
            this.setState({ dummyData: nextProps.devData, resultData: (!this.state.resultData) ? nextProps.devData : this.state.resultData })
        } else {
            this.setState({ dummyData: this.state.fakeData, resultData: (!this.state.resultData) ? nextProps.devData : this.state.resultData })
        }
        if (nextProps.regionInfo.region.length) {
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].Region.items = nextProps.regionInfo.region;
        }
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({ toggleSubmit: false });
        if (nextProps.submitValues && !this.state.toggleSubmit) {

            const cluster = ['Region', 'ClusterName', 'OrganizationName', 'Operator', 'Cloudlet', 'DeploymentType', 'Flavor'];
            let error = [];
            cluster.map((item) => {
                if (!nextProps.validateValue[item]) {
                    error.push(item)
                }
            })

            //close tutorial
            this.props.handleStateTutor('done');

            if (nextProps.formClusterInst.submitSucceeded && error.length === 0) {
                this.setState({ toggleSubmit: true, validateError: error, regSuccess: true });
                this.wsRequestResponse = [];
                this.wsRequestCount = nextProps.validateValue.Cloudlet.length;
                this.props.handleLoadingSpinner(true);
                nextProps.validateValue.Cloudlet.map((item) => {
                    let data = nextProps.submitValues;
                    data.clusterinst.key.cloudlet_key.name = item;

                    serviceMC.sendWSRequest({ uuid: serviceMC.generateUniqueId(), token: store ? store.userToken : 'null', data: JSON.parse(JSON.stringify(data)), method: serviceMC.getEP().CREATE_CLUSTER_INST }, this.receiveSubmit)
                })

            } else {
                this.setState({ validateError: error, toggleSubmit: true })
            }
        }
    }

    stepperClose = () => {
        this.setState({
            stepsArray:[]
        })
        this.props.gotoUrl();
    }

    render() {
        const { open, dimmer, dummyData } = this.state;
        const { hiddenKeys } = this.props;
        return (
            <div className="regis_container">
                <div
                    draggableHandle
                    layout={this.state.layout}
                    {...this.props}
                    style={{ overflowY: 'visible' }}
                    useCSSTransforms={false}
                >
                    {this.generateDOM(open, dimmer, dummyData, this.state.keysData, hiddenKeys, this.props.region)}
                </div>
                <MexMultiStepper multiStepsArray={this.state.stepsArray} onClose={this.stepperClose}/>
            </div>
        );
    }

    static defaultProps = {
        className: "layout",
        items: 20,
        rowHeight: 30,
        cols: 12,
        width: 1600
    };
}

const getInteger = (str) => (
    (str === 'Dedicated') ? 1 :
        (str === 'Shared') ? 3 : false
)
const createFormat = (data) => (
    {
        "region": data['Region'],
        "clusterinst":
        {
            "key":
            {
                "cluster_key": { "name": data['ClusterName'] },
                "cloudlet_key": {
                    "operator_key": { "name": data['Operator'] },
                    "name": data['Cloudlet']
                },
                "developer": data['Reservable'] ? data['OrganizationName'] === 'mobiledgex' ? 'MobiledgeX' : data['OrganizationName'] : data['OrganizationName']
            },
            "deployment": data['DeploymentType'],
            "flavor": { "name": data['Flavor'] },
            "ip_access": parseInt(getInteger(data['IpAccess'])),
            "privacy_policy": parseInt(getInteger(data['IpAccess'])) === 1 ? data['PrivacyPolicy'] : undefined,
            "reservable":data['Reservable'],
            "reserved_by":data['ReservedBy'],
            "num_masters": parseInt(data['NumberOfMaster']),
            "num_nodes": parseInt(data['NumberOfNode'])
        }
    }
)
const mapStateToProps = (state) => {
    let account = state.registryAccount.account;
    let dimm = state.btnMnmt;
    let accountInfo = account ? account + Math.random() * 10000 : null;
    let dimmInfo = dimm ? dimm : null;
    let submitVal = null;
    let validateValue = null;
    let region = state.changeRegion ? { value: state.changeRegion.region } : {};
    let regionInfo = (state.regionInfo) ? state.regionInfo : null;
    let formClusterInst = {};

    if (state.form && state.form.createAppFormDefault) {
        let values = state.form.createAppFormDefault.values;
        let submitSucceeded = state.form.createAppFormDefault.submitSucceeded;
        if (values) {
            if (values && submitSucceeded) {
                let enableValue = reducer.filterDeleteKey(values, 'Edit')
                if (enableValue.DeploymentType === "Docker") {
                    enableValue.NumberOfMaster = 0;
                    enableValue.NumberOfNode = 0;
                    enableValue.DeploymentType = "docker"
                }
                if (enableValue.DeploymentType === "Kubernetes") {
                    enableValue.DeploymentType = "kubernetes"
                }
                submitVal = createFormat(enableValue);
                validateValue = values;
            }
        }

        formClusterInst = {
            values: state.form.createAppFormDefault.values,
            submitSucceeded: submitSucceeded
        }
    }


    return {
        accountInfo,
        dimmInfo,
        itemLabel: state.computeItem.item,
        userToken: (state.user.userToken) ? state.userToken : null,
        submitValues: submitVal,
        region: region.value,
        flavors: (state.showFlavor) ? state.showFlavor.flavor : null,
        selectOrg: state.selectOrg.org ? state.selectOrg.org : null,
        userRole: state.showUserRole ? state.showUserRole.role : null,
        validateValue: validateValue,
        formClusterInst: formClusterInst,
        regionInfo: regionInfo
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data)) },
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data)) },
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) },
        handleStateTutor: (data) => { dispatch(actions.tutorStatus(data)) }
    };
};

export default connect(mapStateToProps, mapDispatchProps)(RegistryClusterInstViewer);


