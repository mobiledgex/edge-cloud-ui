import React from 'react';
import { Item, Step, Icon, Modal, Grid, Header, Button, Table, Menu, Input, Divider, Container } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import RegistNewItem from './registNewItem';
import PopDetailViewer from './popDetailViewer';
import PopUserViewer from './popUserViewer';
import * as servicePool from '../services/service_cloudlet_pool';
import './styles.css';
import * as reducer from '../utils'
import SiteFourPoolOne from "./siteFourPoolStepOne";
import SiteFourPoolTwo from "./siteFourPoolStepTwo";
import SiteFourPoolThree from "./siteFourPoolStepThree";

const ReactGridLayout = WidthProvider(RGL);

const headerStyle = {
    backgroundImage: 'url()'
}

var horizon = 6;
var vertical = 20;
var layout = [
    {"w":19,"h":20,"x":0,"y":0,"minW":8,"minH":7,"i":"0","moved":false,"static":false, "title":"Developer"}

]
const stepData = [
    {
        step:"Step 1",
        description:"Create new cloudlet pool"
    },
    {
        step:"Step 2",
        description:"Add cloudlet"
    },
    {
        step:"Step 3",
        description:"Link the organization to the cloudlet pool"
    },
]
const createFormat = (data) => (
    {
        "region":data['Region'],
        "cloudletpool":{"key": {"name":data['poolName']}}
    }
)
let _self = null;
const keys = [
    {
        'Region':{label:'Region', type:'RenderSelect', necessary:true, tip:'Select region where you want to deploy.', active:true, items:[]},
        'poolName':{label:'Pool Name', type:'RenderInput', necessary:true, tip:'Name of the cloudlet pool.', active:true, items:[]},
    },
    {
        'Region':{label:'Region', type:'RenderInput', necessary:true, tip:'Select region where you want to deploy.', active:true, readOnly:true, items:[]},
        'poolName':{label:'Pool Name', type:'RenderInput', necessary:true, tip:'Name of the cloudlet pool.', active:true, readOnly:true, items:[]},
        'AddCloudlet':{label:'Into the pool', type:'RenderDualListBox', necessary:true, tip:'select a cloudlet', active:true},
        'invisibleField':{label:'invisible field', type:'InvisibleField', necessary:true, tip:'', active:true},
    },
    {
        'CloudletPool':{label:'Cloudlet Pool', type:'RenderDropDown', necessary:true, tip:'Name of the cloudlet pool.', active:true, items:[]},
        'LinktoOrganization':{label:'Into the pool', type:'RenderDualListBox', necessary:true, tip:'select a cloudlet', active:true},
        'LinkDiagram':{label:'Linked Status', type:'RenderLinkedDiagram', necessary:false, tip:'linked the cloudlet pool with the organization', active:true},
    }
]
const fakes = [
    {
        'Region':'',
        'poolName':'',
    },
    {
        'Region':'',
        'poolName':'',
        'AddCloudlet':''
    },
    {
        'CloudletPool':'',
        'LinktoOrganization':'',
        'LinkDiagram':''
    }
]
class SiteFourPoolStepView extends React.Component {
    constructor(props) {
        super(props);
        _self = this;

        const layout = this.generateLayout();
        this.state = {
            layout,
            open: false,
            openDetail:false,
            dimmer:false,
            activeItem:'',
            dummyData : [],
            detailViewData:null,
            selected:{},
            openUser:false,
            step:3, //default is 1
            typeOperator:'Developer',
            orgaName:'',
            validateError:[],
            keysData: [keys[0]],
            fakeData: [fakes[0]],
            devData: [],
            region:[],
            selectedRegion:null,
            gavePoolName:null,
            submitValues:null,
            errorClose:false
        };
        this.pauseRender = false;

    }


    onHandleClick(dim, data) {
        this.setState({ dimmer:dim, open: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }
    onHandleClicAdd(dim, data) {
        this.setState({ dimmer:dim, open: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }

    show = (dim) => this.setState({ dimmer:dim, openDetail: true })
    close = () => {
        this.setState({ open: false })
        this.props.handleInjectDeveloper(null)
    }
    closeDetail = () => {
        this.setState({ openDetail: false })
    }
    closeUser = () => {
        this.setState({ openUser: false })
    }
    stepChange(num) {
        let stepNum = num+1;
        this.setState({step:stepNum})
    }

    onChangeActive(num) {
        if(this.state.step == num+1){
            return true;
        } else {
            return false;
        }
    }

    nextstep = (num) => {
        this.setState({step:num})
    }
    changeOrg = () => {
        this.props.history.push({
            pathname: '/site4',
            search: 'pg=0'
        });
        this.props.history.location.search = 'pg=0';
        this.props.handleChangeSite({mainPath:'/site4', subPath: 'pg=0'})
        // this.props.handleChangeSite({mainPath:"/site4", subPath: "pg=0"});
    }

    makeSteps = (data) => (

        <Item className='content create-org' style={{margin:'30px auto 0px auto', maxWidth:1200}}>
            <div className='content_title' style={{padding:'0px 0px 10px 0'}}>Create new Cloudlet Pool</div>

            <Step.Group stackable='tablet' style={{width:'100%'}}>
                {
                    stepData.map((item,i) => (
                        <Step active={this.onChangeActive(i)} key={i} >
                            <Icon name='info circle' />
                            <Step.Content>
                                <Step.Title>{item.step}</Step.Title>
                                <Step.Description>{item.description}</Step.Description>
                            </Step.Content>
                        </Step>
                    ))
                }
            </Step.Group>

            {
                (this.state.step ==1) ? <SiteFourPoolOne onSubmit={() => console.log('Form was submitted')} type={this.state.typeOperator} toggleSubmit={this.props.toggleSubmit} data={data}></SiteFourPoolOne> :
                    (this.state.step ==2) ? <SiteFourPoolTwo onSubmit={() => console.log('Form was submitted')} type={this.state.typeOperator} org={this.state.orgaName} toggleSubmitTwo={this.props.toggleSubmitTwo} data={data} selectedData={{region:this.state.selectedRegion, poolName:this.state.gavePoolName}}></SiteFourPoolTwo> :
                        (this.state.step ==3) ? <SiteFourPoolThree onSubmit={() => console.log('Form was submitted')} type={this.state.typeOperator} org={this.state.orgaName} data={data}></SiteFourPoolThree> : null
            }

        </Item>
    )


    generateDOM(open, dimmer, data, keysData, hideHeader, region) {

        let panelParams = {data:data, keys:keysData, region:region, handleLoadingSpinner:this.props.handleLoadingSpinner, userrole:localStorage.selectRole}

        return layout.map((item, i) => (

            (i === 0)?
                <div className="round_panel" key={i}>
                    <div className="grid_table" style={{overflow:'auto'}}>
                        {this.makeSteps(panelParams)}
                    </div>
                </div>
                :
                <div className="round_panel" key={i}>
                    <div>
                        Map viewer
                    </div>
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
    receiveSubmit = (result, body) => {
        console.log("20191119 cloudlet paseDatapaseDatapaseData",result, ": this.props.changeRegion=", this.props.changeRegion,": region = ", this.props.region, ":", this.props.regionInfo, ":", this.props.getRegion)

        if(this.pauseRender) return;

        if(result.error) {
            //this.setState({clusterInstCreate:false})
            this.props.handleLoadingSpinner(false);
            if(result.error == 'Key already exists'){

            } else {
                /** test --- test ---- send props to next step **/
                this.setState({selectedRegion:this.state.submitValues.Region, gavePoolName:this.state.submitValues.poolName})
                this.setState({step:2, validateError:null, keysData:[keys[1]], fakeData:[fakes[1]]})
                /** **/


                this.props.handleAlertInfo('error','Request Failed')
            }
        } else {
            if (result.data.error) {
                this.props.handleAlertInfo('error', result.data.error)
            } else {
                console.log('20191119 receive submit result is success..', result,":", result.data)
                this.props.handleAlertInfo('success','Created successfully')

                /** send props to next step **/
                this.setState({selectedRegion:this.state.submitValues.Region, gavePoolName:this.state.submitValues.poolName})
                this.setState({step:2, validateError:null, keysData:[keys[1]], fakeData:[fakes[1]]})
            }
        }
        this.pauseRender = true;
    }
    receiveResultCreateMember = (result) => {
        alert('result -- '+JSON.stringify(result))
    }
    setFildData() {
        //
        if(_self.props.devData.length > 0) {
            _self.setState({dummyData:_self.props.devData, resultData:(!_self.state.resultData)?_self.props.devData:_self.state.resultData})
        } else {
            _self.setState({dummyData:_self.state.fakeData, resultData:(!_self.state.resultData)?_self.props.devData:_self.state.resultData})
        }
    }
    componentDidMount(): void {
        this.setFildData();
    }


    componentWillReceiveProps(nextProps, nextContext) {
        /* like registryCloudletPoolViewer..*/

        if(nextProps.accountInfo){
            this.setState({ dimmer:'blurring', open: true })
        }
        /**
         * data input the region filed
         */
        if(nextProps.regionInfo && nextProps.regionInfo.region && nextProps.regionInfo.region.length){
            let assObj = Object.assign([], this.state.keysData);
            assObj[0].Region.items = nextProps.regionInfo.region;
        }
        if(nextProps.devData && nextProps.devData.length > 0) {
            console.log('20191227 props dev data -- ', nextProps.devData)
            this.setState({dummyData:nextProps.devData, resultData:(!this.state.resultData)?nextProps.devData:this.state.resultData})
        } else {
            this.setState({dummyData:this.state.fakeData, resultData:(!this.state.resultData)?nextProps.devData:this.state.resultData})
        }

        if(nextProps.formClusterInst && nextProps.formClusterInst.submitSucceeded){
            //
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            console.log('20191227 info submitValues = ', nextProps.formClusterInst.values)
            this.setState({submitValues: nextProps.formClusterInst.values})

            if(this.state.step === 1) {
                servicePool.createCloudletPool('CreateCloudletPool', {params:nextProps.formClusterInst.values, token:store.userToken}, this.receiveSubmit)
            } else if(this.state.step === 2) {

                console.log('20191227 step 2 info submitValues = ', nextProps.formClusterInst.values)
                //TODO: 20191227 클라우드렛을 여러개 넣을 수 있는지
                /**
                 * '{"cloudletpoolmember":{"cloudlet_key":{"name":"frankfurt-eu","operator_key":{"name":"TDG"}},"pool_key":{"name":"TEST1223"}},"region":"EU"}'
                 * @type {{pool: *, cloudlet: *, region: *, operator: *}}
                 * @private
                 */
                let _params = {};
                let selectedNumber = JSON.parse(nextProps.formClusterInst.values.invisibleField)
                if(selectedNumber.length) {
                    let cloudlet = ''
                    selectedNumber.map((no) => {
                        console.log('20191227 selected cloudlet == ', no, ":", nextProps.formClusterInst.values.AddCloudlet[no])
                        cloudlet = nextProps.formClusterInst.values.AddCloudlet[no];
                        _params = {"cloudletpoolmember":{"cloudlet_key":{"name":cloudlet.cloudlet,"operator_key":{"name":cloudlet.orgaName}},"pool_key":{"name":nextProps.formClusterInst.values.poolName}},"region":cloudlet.region}
                        servicePool.createCloudletPoolMember('CreateCloudletPoolMember',{token:store.userToken, params:_params}, _self.receiveResultCreateMember)
                    })
                }

            } else if(this.state.step === 3) {

            }

            //TODO: 20191227 step 2에 선택된 region과 pool이름 넘기기


            this.forceUpdate();
        }


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
                    {this.generateDOM(open, dimmer, dummyData, this.state.keysData, hiddenKeys, this.props.region)}
                </div>
                <PopDetailViewer data={this.state.detailViewData} dimmer={false} open={this.state.openDetail} close={this.closeDetail}></PopDetailViewer>
                <PopUserViewer data={this.state.detailViewData} dimmer={false} open={this.state.openUser} close={this.closeUser}></PopUserViewer>
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

const mapStateToProps = (state) => {
    let account = state.registryAccount.account;
    let dimm =  state.btnMnmt;
    let submitValues = null;
    let validateValue = {};
    if(state.form.createAppFormDefault && state.form.createAppFormDefault.values && state.form.createAppFormDefault.submitSucceeded) {
        console.log('20191223 state.form.createAppFormDefault == ', state.form.createAppFormDefault)
        let enableValue = reducer.filterDeleteKey(state.form.createAppFormDefault.values, 'Edit')
        submitValues = createFormat(enableValue,state.getRegion.region);
        validateValue = state.form.createAppFormDefault.values;
    }
    let formClusterInst= state.form.createAppFormDefault
        ? {
            values: state.form.createAppFormDefault.values,
            submitSucceeded: state.form.createAppFormDefault.submitSucceeded
        }
        : {};
    let accountInfo = account ? account + Math.random()*10000 : null;
    let dimmInfo = dimm ? dimm : null;
    let regionInfo = (state.regionInfo)?state.regionInfo:null;
    return {
        accountInfo,
        dimmInfo,
        regionInfo,
        submitValues,
        validateValue,
        formClusterInst
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleChangeComputeItem: (data) => { dispatch(actions.computeItem(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteFourPoolStepView));
