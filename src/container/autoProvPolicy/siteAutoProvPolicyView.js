import React from 'react';
import { Item, Step, Icon} from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import PopDetailViewer from '../popDetailViewer';
import PopUserViewer from '../popUserViewer';
import * as serviceMC from '../../services/serviceMC';
import '../styles.css';
import * as reducer from '../../utils'
import AutoProvPolicyOne from "./autoProvPolicyOne";
import AutoProvPolicyTwo from "./autoProvPolicyTwo";
import AutoProvPolicyThree from "./autoProvPolicyThree";
import Alert from 'react-s-alert';

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
        description:"Create New Policy"
    },
    {
        step:"Step 2",
        description:"Link the organization to the cloudlet pool"
    },
    {
        step:"Step 3",
        description:"Review your Cloudlet Pool"
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
        'autoPolicyName':{label:'Auto Policy Name', type:'RenderInput', necessary:true, tip:'Name of the auto policy.', active:true, items:[]},
        'AddCloudlet':{label:'Add cloudlet', type:'RenderDualListBox', necessary:true, tip:'select a cloudlet', active:true, items:[{headers:['Select Item', 'Selected Item']}]},
        'invisibleField':{label:'invisible field', type:'InvisibleField', necessary:true, tip:'', active:true},
    },
    {
        'Region':{label:'Region', type:'RenderInput', necessary:true, tip:'Select region where you want to deploy.', active:true, readOnly:true, items:[]},
        'poolName':{label:'Pool Name', type:'RenderInput', necessary:true, tip:'Name of the cloudlet pool.', active:true, readOnly:true, items:[]},
        'LinktoOrganization':{label:'Add Cloudlet to Pool', type:'RenderDualListBox', necessary:true, tip:'Select a cloudlet in left side', active:true},
        'invisibleField':{label:'invisible field', type:'InvisibleField', necessary:true, tip:'', active:true},
    },
    {
        'Region':{label:'Region', type:'RenderInput', necessary:true, tip:'Select region where you want to deploy.', active:true, readOnly:true, items:[]},
        'poolName':{label:'Pool Name', type:'RenderInput', necessary:true, tip:'Name of the cloudlet pool.', active:true, readOnly:true, items:[]},
        'LinktoOrganization':{label:'Add Member to Pool', type:'RenderDualListBox', necessary:true, tip:'select a cloudlet', active:true},
        'LinkDiagram':{label:'Linked Status', type:'RenderLinkedDiagram', necessary:false, tip:'linked the cloudlet pool with the organization', active:true},
    }
]
const fakes = [
    {
        'Region':'',
        'poolName':'',
        'AddCloudlet':''
    },
    {
        'Region':'',
        'poolName':'',
        'LinktoOrganization':''
    },
    {
        'Region':'',
        'poolName':'',
        'AddedCloudlet':'',
        'LinktoOrganization':''
    }
]
class SiteFourPoolStepView extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.step = 1; //default is 1
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
            typeOperator:'Developer',
            orgaName:'',
            validateError:[],
            step:this.step, 
            keysData: [keys[this.step-1]],
            fakeData: [fakes[this.step-1]],
            devData: [],
            region:[],
            selectedRegion:null,
            gavePoolName:null,
            submitValues:null,
            errorClose:false,
            formValue:[]
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
            search: 'pg=7'
        });
    }
    onSkipClick = () => {
        this.props.history.push({
            pathname: '/site4',
            search: 'pg=7'
        });
        //this.props.history.location.search = 'pg=7';
        //this.props.handleChangeSite({mainPath:'/site4', subPath: 'pg=7'})
    }
    
    makeSteps = (data) => (

        <Item className='content create-org' style={{margin:'30px auto 0px auto', maxWidth:1200}}>
            <div className='content_title' style={{padding:'0px 0px 10px 0'}}>Create New Cloudlet Policy</div>
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
                (this.state.step ==1) ? <AutoProvPolicyOne onSubmit={() => console.log('Form was submitted')} type={this.state.typeOperator} toggleSubmit={this.props.toggleSubmit} data={data} changeOrg={this.changeOrg} step={this.state.step}></AutoProvPolicyOne> :
                    (this.state.step ==2) ? <AutoProvPolicyTwo onSubmit={() => console.log('Form was submitted')} type={this.state.typeOperator} org={this.state.orgaName} toggleSubmitTwo={this.props.toggleSubmitTwo} selectedData={{region:this.state.selectedRegion, poolName:this.state.gavePoolName}} changeOrg={this.changeOrg} step={this.state.step} onSkipClick={this.onSkipClick}></AutoProvPolicyTwo> :
                        (this.state.step ==3) ? <AutoProvPolicyThree onSubmit={() => console.log('Form was submitted')} type={this.state.typeOperator} org={this.state.orgaName} data={data} selectedData={{region:this.state.selectedRegion, poolName:this.state.gavePoolName}} changeOrg={this.changeOrg}></AutoProvPolicyThree> : null
            }
        </Item>
    )


    generateDOM(open, dimmer, data, keysData, hideHeader, region) {

        let panelParams = {data:data, keys:keysData, region:region}

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
    createPoolMember= () => {
        /**
         * '{"cloudletpoolmember":{"cloudlet_key":{"name":"frankfurt-eu","operator_key":{"name":"TDG"}},"pool_key":{"name":"TEST1223"}},"region":"EU"}'
         * @type {{pool: *, cloudlet: *, region: *, operator: *}}
         * @private
         */
        let cloudletTest = this.state.dummyData[0].AddCloudlet[0];
        console.log('20200104 cloudlet == ', cloudletTest)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let _params = {};
        let selectedNumber = JSON.parse(this.state.formValue.invisibleField)
        if(selectedNumber.length) {
            let cloudlet = ''
            selectedNumber.map((no) => {
                cloudlet = this.state.dummyData[0].AddCloudlet[parseInt(no)];
                console.log('20200104 cloudlet--- ', cloudlet)
                _params = {
                    "cloudletpoolmember":{
                        "cloudlet_key":{
                            "name":cloudlet.cloudlet,
                            "operator_key":{
                                "name":cloudlet.orgaName
                            }
                        },
                        "pool_key":{
                            "name":this.state.formValue.poolName
                        }
                    },
                    "region":cloudlet.region
                }
                console.log('20200104 _params == ', _params)
                ////////// new
                let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
                serviceMC.sendRequest(_self, { token: store ? store.userToken : 'null', method: serviceMC.getEP().CREATE_CLOUDLET_POOL_MEMBER, data : _params }, _self.receiveResultCreateMember)
            })
        }

        
    }
    receiveSubmit = (mcRequest) => {

        

        // if(result.error) {
        //     //this.setState({clusterInstCreate:false})
        //     this.props.handleLoadingSpinner(false);
        //     if(result.error == 'Key already exists'){

        //     } else {

        //         this.props.handleAlertInfo('error','Request Failed')
        //     }
        //     // TEST : Although already exist pool add a cloudlets in to pool <-- later delete code
        //     this.createPoolMember();
        // } else {
        //     if (result.data.error) {
        //         this.props.handleAlertInfo('error', result.data.error)
        //     } else {
        //         this.props.handleAlertInfo('success',result.data.message)
        //         /** send props to next step **/
        //         //this.setState({selectedRegion:this.state.submitValues.Region, gavePoolName:this.state.submitValues.poolName})
        //         //this.setState({step:2, validateError:null, keysData:[keys[1]], fakeData:[fakes[1]]})

        //         this.createPoolMember();
        //     }
        // }



        ///// new
        if(this.pauseRender) return;
        if(mcRequest)
        {
            if(mcRequest.response)
            {
                let response = mcRequest.response;
                if (response.data.length == 0) {
                    _self.setState({ devData: [] })
                    _self.props.handleDataExist(false)
                    _self.props.handleAlertInfo('error', 'There is no data')
                } else {
                    _self.props.handleAlertInfo('success','Created successfully')
                    _self.createPoolMember();
                    _self.props.handleDataExist(true)
                }
            }
        }      
        _self.props.handleLoadingSpinner(false);
        this.pauseRender = true;

    }
    receiveResultCreateMember = (mcRequest) => {
        /// new
        if(this.pauseRender) return;
        if(mcRequest)
        {
            if(mcRequest.response)
            {
                let response = mcRequest.response;
                if (response.data.length == 0) {
                    _self.setState({ devData: [] })
                    _self.props.handleDataExist(false)
                    _self.props.handleAlertInfo('error', 'There is no data')
                } else {
                    _self.props.handleAlertInfo('success','Created successfully')
                    /** send props to next step **/
                    _self.setState({selectedRegion:_self.state.submitValues.Region, gavePoolName:_self.state.submitValues.poolName})
                    _self.setState({step:2, validateError:null, keysData:[keys[1]], fakeData:[fakes[1]]})
                    _self.props.handleDataExist(true)
                }
            }
        }      
        _self.props.handleLoadingSpinner(false);
        this.pauseRender = true;


    }
    receiveResultLinkOrg = (result) => {
        console.log('20191231 result -- ',JSON.stringify(result))
        if(this.pauseRender) return;

        if(result.response && result.response.error) {
            //this.setState({clusterInstCreate:false})
            this.props.handleLoadingSpinner(false);
            if(result.error == 'Key already exists'){

            } else {
                /** test --- test ---- send props to next step **/
                this.setState({selectedRegion:this.state.submitValues.Region, gavePoolName:this.state.submitValues.poolName})
                this.setState({step:3, validateError:null, keysData:[keys[2]], fakeData:[fakes[2]]})
                /** **/

                this.props.handleAlertInfo('error','Request Failed')
            }
        } else {
            if (result.response && result.response.data.error) {
                this.props.handleAlertInfo('error', result.data.error)
            } else {
                this.props.handleAlertInfo('success',result.response.data.message ? result.response.data.message : 'Created sucessfully')

                /** send props to next step **/
                this.setState({selectedRegion:this.state.submitValues.Region, gavePoolName:this.state.submitValues.poolName})
                this.setState({step:3, validateError:null, keysData:[keys[2]], fakeData:[fakes[2]]})
            }
        }
        this.pauseRender = true;
    }


    setFildData(devData) {
        //
        let _devData = devData;
        let _filtered = (_devData && devData[0]) ?devData[0]['AddCloudlet']:[];
        if(_filtered.length > 0) {
            _self.setState({dummyData:_devData, resultData:(!_self.state.resultData)?_devData:_self.state.resultData})
        } else {
            _self.setState({dummyData:_self.state.fakeData, resultData:(!_self.state.resultData)?_devData:_self.state.resultData})
        }
    }
    componentDidMount() {
        this.setFildData(this.props.devData);
    }


    componentWillReceiveProps(nextProps, nextContext) {

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
        if(nextProps.formClusterInst) {
            console.log('20191231 if click skip... ', nextProps.formClusterInst)
        }
        if(nextProps.formClusterInst.values === this.state.submitValues) return;


        if(nextProps.devData){
            /* like registryCloudletPoolViewer..*/
            _self.setFildData(nextProps.devData);
        }

        if(nextProps.formClusterInst && nextProps.formClusterInst.submitSucceeded){
            //
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            if(nextProps.formClusterInst.values === this.state.submitValues) {
                return;
            }
            this.setState({submitValues: nextProps.formClusterInst.values})

            if(this.state.step === 1) {

                // TODO: 20200109 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
                // old
                //servicePool.createCloudletPool('CreateCloudletPool', {params:nextProps.formClusterInst.values, token:store.userToken}, this.receiveSubmit)
                
                
                // new
                /*
                
                serviceBody = {"region":region, "cloudletpool": {"key": {"name": poolName}}};
                */
                //{"region":region, "cloudletpool": {"key": {"name": poolName}}}
                let self = this;
                self.setState({formValue: nextProps.formClusterInst.values, selectedRegion:nextProps.formClusterInst.values.Region, gavePoolName:nextProps.formClusterInst.values.poolName})
                let poolName = nextProps.formClusterInst.values.poolName;
                let region = nextProps.formClusterInst.values.Region;
                let keyObj = {"region":region, "cloudletpool": {"key": {"name": poolName}}}
                let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
                serviceMC.sendRequest(_self, { token: store ? store.userToken : 'null', method: serviceMC.getEP().CREATE_CLOUDLET_POOL, data : keyObj }, _self.receiveSubmit)

                /** TEST 20191231 go to next step 2 **/
                // let self = this;
                // setTimeout(() => {
                //     self.setState({selectedRegion:self.state.submitValues.Region, gavePoolName:self.state.submitValues.poolName})
                //     self.setState({step:2, validateError:null, keysData:[keys[1]], fakeData:[fakes[1]]})
                //     self.props.handleChangeNext(2)
                // }, 2000)


            } else if(this.state.step === 2) {

                /**
                 * $ http --auth-type=jwt --auth=$SUPERPASS POST https://mc-stage.mobiledgex.net:9900/api/v1/auth/orgcloudletpool/create <<<
                 * '{"cloudletpool":"cloudletPool_bictest_1223-01","org":"bicinkiOper","region":"EU"}'
                 * @type {{}}
                 * @private
                 */
                console.log('21091231 create link pool org.. ')
                let _params = {};
                let _selectedItems = nextProps.formClusterInst.values.invisibleField;
                let selectedNumber = (_selectedItems !== "") ? JSON.parse(_selectedItems) : [];
                let cloudletPool = nextProps.formClusterInst.values.poolName;
                let region = nextProps.formClusterInst.values.Region;
                if(selectedNumber.length) {
                    let organiz = ''
                    selectedNumber.map((no) => {
                        organiz = nextProps.formClusterInst.values.LinktoOrganization[no];
                        _params = {"cloudletpool":cloudletPool,"org":organiz['cloudlet'],"region":region}
                        // old
                        //servicePool.createLinkPoolOrg('CreateLinkPoolOrg',{token:store.userToken, params:_params}, _self.receiveResultLinkOrg)

                        // new
                        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
                        serviceMC.sendRequest(_self, { token: store ? store.userToken : 'null', method: serviceMC.getEP().CREATE_LINK_POOL_ORG, data : _params }, _self.receiveResultLinkOrg)
                    })
                } else {
                    //_self.props.handleAlertInfo('error', 'Select the organization')
                    Alert.warning('Select the organization', {
                        position: 'top-right',
                        effect: 'scale',
                        onShow: function () {
                            console.log('aye!')
                        },
                        beep: false,
                        timeout: 5,
                        offset: 100
                    });
                    setTimeout(() => Alert.closeAll(), 3000)
                    _self.setState({submitValues: {noData:''} })
                }

                //TEST goto step 3 -test-test-test-test-
                // let self = this;
                // setTimeout(() => {
                //     self.setState({selectedRegion:self.state.submitValues.Region, gavePoolName:self.state.submitValues.poolName})
                //     self.setState({step:3, validateError:null, keysData:[keys[2]], fakeData:[fakes[2]]})
                // }, 2000)

            } else if(this.state.step === 3) {

                console.log('20191231 submit link org to pool == ', JSON.parse(nextProps.formClusterInst.values))
            }

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
        handleChangeNext: (next) => { dispatch(actions.changeNext(next))}

    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteFourPoolStepView));
