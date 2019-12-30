import React from 'react';
import {Tab} from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import './styles.css';
import _ from "lodash";
import * as reducer from '../utils'
import * as serviceMC from '../services/serviceMC';
import SiteFourCreateFormFlavorDefault from "./siteFourCreateFormFlavorDefault";
import {withRouter} from "react-router-dom";

var layout = [
    {"w":19,"h":20,"x":0,"y":0,"i":"0","minW":5,"minH":5,"moved":false,"static":false, "title":"Developer"}
]
let _self = null;

const panes = [
    { menuItem: 'Flavor Deployment', render: (props) => <Tab.Pane style={{overflow:'auto'}} attached={false}><SiteFourCreateFormFlavorDefault data={props} pId={0} getUserRole={props.userrole} gotoUrl={props.gotoUrl} toggleSubmit={props.toggleSubmit} validError={props.error} autoClusterDisable={props.autoClusterDisable} onSubmit={props.onSubmit}/></Tab.Pane> }
]
class RegistryFlavorViewer extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        const layout = this.generateLayout();
        this.state = {
            layout,
            open: false,
            openAdd: false,
            openDetail:false,
            dimmer:false,
            activeItem:'',
            dummyData : [],
            detailViewData:null,
            selected:{},
            openUser:false,
            orgData:{},
            selectUse:null,
            resultData:null,
            cloudlets:[],
            operators:[],
            clustinst:[],
            apps:[],
            versions:[],
            toggleSubmit:false,
            validateError:[],
            autoClusterDisable:false,
            keysData:[
                {
                    'Region':{label:'Region', type:'RenderSelect', necessary:true, tip:'Select region where you want to deploy.', active:true, items:[]},
                    'FlavorName':{label:'Flavor Name', type:'RenderInput', necessary:true, tip:'Name of the flavor', active:true},
                    'RAM':{label:'RAM Size', type:'renderInputNum', unit:'MB', necessary:true, tip:'RAM in megabytes', active:true},
                    'vCPUs':{label:'Number of vCPUs', type:'renderInputNum', necessary:true, tip:'Number of virtual CPUs', active:true},
                    'Disk':{label:'Disk Space', type:'renderInputNum', unit:'GB', necessary:true, tip:'Amount of disk space in gigabytes', active:true}
                },
                {
                    
                }
            ],
            fakeData:[
                {
                    'Region':'US',
                    'FlavorName':'',
                    'RAM':'',
                    'vCPUs':'',
                    'Disk':''
                }
            ]


        };

    }

    
    receiveResult = (mcRequest) => {
        let result = mcRequest.response;
        let request = mcRequest.request;
        _self.props.handleLoadingSpinner(false);
        if(result.data.error) {
            this.props.handleAlertInfo('error',result.data.error)
            return;
        } else {
            this.props.handleAlertInfo('success','Flavor '+request.data.flavor.key.name+' created successfully.')
            this.gotoUrl('submit');
        }
    }

    gotoUrl() {
        let pg = 'pg=3'
        _self.props.history.push({
            pathname: '/site4',
            search: pg
        });
        _self.props.history.location.search = pg;
        //_self.props.handleChangeSite({mainPath:'/site4', subPath: pg})
    }

    generateDOM(open, dimmer, data, keysData, hideHeader) {

        let panelParams = {data:data, keys:keysData, userrole:localStorage.selectRole}

        return layout.map((item, i) => (

            (i === 0)?
                <div className="round_panel" key={i}>
                    <div className="grid_table">

                        <Tab className="grid_tabs" menu={{ secondary: true, pointing: true, inverted: true, attached: false, tabular: false }} panes={panes}{...panelParams} gotoUrl={this.gotoUrl} toggleSubmit={this.state.toggleSubmit} error={this.state.validateError} autoClusterDisable={this.state.autoClusterDisable} onSubmit={this.onSubmit} />

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

    onLayoutChange(layout) {
        //this.props.onLayoutChange(layout);
    }

    onSubmit() {
        _self.props.handleSubmitInfo('submitAction')
    }


    componentDidMount() {

    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.accountInfo){
            this.setState({ dimmer:'blurring', open: true })
        }
        if(nextProps.devData.length > 1) {
            this.setState({dummyData:nextProps.devData, resultData:(!this.state.resultData)?nextProps.devData:this.state.resultData})
        } else {
            this.setState({dummyData:this.state.fakeData, resultData:(!this.state.resultData)?nextProps.devData:this.state.resultData})
        }
        if(nextProps.regionInfo.region.length){
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].Region.items = nextProps.regionInfo.region;
        }
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({toggleSubmit:false});
        if(nextProps.submitValues && !this.state.toggleSubmit) {
            
            const flavors = ['Region','FlavorName','RAM','vCPUs','Disk']

            let error = [];
            flavors.map((item) => {
                if(!nextProps.validateValue[item]) {
                    error.push(item)
                }
            })

            if (nextProps.formAppInst.submitSucceeded && error.length == 0) {
                let submitData = nextProps.submitValues
                this.setState({ toggleSubmit: true, validateError: error });
                this.props.handleLoadingSpinner(true);
                serviceMC.sendRequest({ token: store ? store.userToken : 'null', method: serviceMC.CREATE_FLAVOR, data: submitData }, this.receiveResult)
            } else {
                this.setState({ validateError: error, toggleSubmit: true })
            }

        }

    }

    componentWillUnmount() {
    }

    receiveStatusData = (result) => {
        let toArray = null;
        let toJson = null;
        toArray = result.data.split('\n')
        toArray.pop();
        toJson = toArray.map((str)=>(JSON.parse(str)))
        console.log("toJsontoJson",toJson)
        toJson.map((item) => {
            if(item.result && item.result.code == 400){
                console.log("item.result",item.result.message)
                this.props.handleAlertInfo('error',item.result.message)
            }
        })
    }

    render() {
        const { open, dimmer, dummyData } = this.state;
        const { hiddenKeys } = this.props;
        return (
            <div className="regis_container">
                <div
                    draggableHandle
                    layout={this.state.layout}
                    onLayoutChange={this.onLayoutChange}
                    {...this.props}
                    useCSSTransforms={false}
                >
                    {this.generateDOM(open, dimmer, dummyData, this.state.keysData, hiddenKeys)}
                </div>
                
            </div>

        );
    }
}

const createFormat = (data) => (
    {
        "region":data['Region'],
        "flavor":{
            "key":{"name":data['FlavorName']},
            "ram":Number(data['RAM']),
            "vcpus":Number(data['vCPUs']),
            "disk":Number(data['Disk'])
        }
    }
)
const mapStateToProps = (state) => {
    let account = state.registryAccount.account;
    let accountInfo = account ? account + Math.random()*10000 : null;
    let submitVal = null;
    let validateValue = null;

    if(state.form.createAppFormDefault && state.form.createAppFormDefault.values && state.form.createAppFormDefault.submitSucceeded) {
        let enableValue = reducer.filterDeleteKey(state.form.createAppFormDefault.values, 'Edit')
        submitVal = createFormat(enableValue);
        validateValue = state.form.createAppFormDefault.values;
    }
        
    let formAppInst= state.form.createAppFormDefault
        ? {
            values: state.form.createAppFormDefault.values,
            submitSucceeded: state.form.createAppFormDefault.submitSucceeded
        }
        : {};
    let regionInfo = (state.regionInfo)?state.regionInfo:null;
    return {
        accountInfo,
        userToken : (state.user.userToken) ? state.userToken: null,
        submitValues: submitVal,
        selectOrg : state.selectOrg.org?state.selectOrg.org:null,
        submitData : state.form?state.form : null,
        appLaunch : state.appLaunch?state.appLaunch.data:null,
        validateValue:validateValue,
        formAppInst : formAppInst,
        regionInfo: regionInfo
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))},
        handleSubmitInfo: (data) => {dispatch(actions.submitInfo(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(RegistryFlavorViewer));


