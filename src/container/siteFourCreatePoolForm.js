import React, {Fragment} from 'react';
import {Form, Input, Grid, Tab, Button} from 'semantic-ui-react';
import SiteFourCreateFormDefault from './siteFourCreateFormDefault';
import BubbleGroup from '../charts/bubbleGroup';
import EditMap from '../libs/simpleMaps/with-react-motion/editMap';
import ClustersMap from '../libs/simpleMaps/with-react-motion/index_clusters';
import * as aggregate from "../utils";
import * as actions from "../actions";
import {connect} from "react-redux";
import {scaleLinear} from "d3-scale";
import {Field} from "redux-form";
import './styles.css';
import {withRouter} from "react-router-dom";


const panes = [
    { menuItem: 'Select Region', render: (props) => <Tab.Pane>{cloudletMap(props, 'cloudlets')}</Tab.Pane> }

]

const renderLocationInput = field => (
    <div>
        <Form.Field
            {...field.input}
            type={field.type}
            placeholder={field.placeholder}
            //value={field.value}
        >
            <Input fluid type="number"
                   onChange={field.change}
                   placeholder={field.placeholder}></Input>
        </Form.Field>
        {/*<Form.Input*/}
        {/*    {...field.input}*/}
        {/*    type={field.type}*/}
        {/*    placeholder={field.placeholder}*/}
        {/*    onChange={field.change}*/}
        {/*    //value={field.value}*/}
        {/*    fluid*/}
        {/*/>*/}
    </div>

);

const clusterNode = (props) => (
    <Fragment>
        <Grid style={{margin:0, justifyContent:'center', backgroundColor:'rgba(0,0,0,.3)'}}>
            <Grid.Row>
                <label style={{fontSize:'1.5em'}}>{props.clusterName ? props.clusterName : 'cluster'}</label>
            </Grid.Row>
            <Grid.Row>
                <BubbleGroup data={props.flavorConfig}></BubbleGroup>
            </Grid.Row>
            <Grid.Row>
                <div style={{display:'inline-block', verticalAlign: 'middle', marginRight:'20px'}}>
                    <div style={{display:'inline-block', width:24, height:24, verticalAlign: 'middle', backgroundColor: 'rgba(71, 82, 102, 0.65)', marginRight:'10px'}}></div>
                    <div style={{display:'inline-block'}}>Cluster</div>
                </div>
                <div style={{display:'inline-block', verticalAlign: 'middle', marginRight:'20px'}}>
                    <div style={{display:'inline-block', width:24, height:24, verticalAlign: 'middle', backgroundColor: '#ff7d77', opacity:'0.7', marginRight:'10px'}}></div>
                    <div style={{display:'inline-block'}}>MasterNode</div>
                </div>
                <div style={{display:'inline-block', verticalAlign: 'middle'}}>
                    <div style={{display:'inline-block', width:24, height:24, verticalAlign: 'middle', backgroundColor: '#a2cbff', opacity:'0.7', marginRight:'10px'}}></div>
                    <div style={{display:'inline-block'}}>Node</div>
                </div>
            </Grid.Row>
        </Grid>
        {/*<div style={{display:'flex', justifyContent:'center', width:'100%',backgroundColor:'rgba(0,0,0,.3)'}}  onClick={()=>console.log('45433',props)}>*/}
        {/*    <BubbleGroup data={props.flavorConfig}></BubbleGroup>*/}
        {/*</div>*/}
    </Fragment>
)
const cloudletMap = (props, type) => (
    <Fragment>
        {(type === 'cloudlets')?
        <div className='panel_worldmap' style={{width:'100%'}}>
            <ClustersMap parentProps={{locData:props.locData, reg:'cloudletAndClusterMap', zoomIn:()=>console.log('zoomin'), zoomOut:()=>console.log('zoomout'), resetMap:()=>console.log('resetmap') }} icon={'cloudlet'} zoomControl={{center:[0, 0], zoom:1.5} }></ClustersMap>
        </div>

        :
        <EditMap parentProps={{devData:props.cloudletData}}></EditMap>}

    </Fragment>
)
let _self = null;
class SiteFourCreatePoolForm extends React.Component {
    constructor() {
        super();
        this.state = {
            cloudletList:[],
            devOptionsOperator:[],
            devOptionsDeveloper:[],
            devOptionsCloudlet:[],
            devOptionsFour:[],
            devOptionsFive:[],
            devOptionsSix:[],
            devOptionsCF:[],
            devData:null,
            keys:null,
            region:'All',
            flavorConfig:null,
            clusterName:null,
            activeIndex:0,
            organizeData:[],
            cloudletData:[],
            flavorData:[],
            clusterShow:true,
            regionInfo:{},
            locationLong:null,
            locationLat:null,
            locationLongLat:[],
            laterror:'',
            longerror:'',
            locData:[],
            regionToggle:false
        }
        _self = this;
        this.loopReqCount = 3; //cloudlet(operators), cluster, flavor
        this.regionCount = 2; // US, EU
    }
    zoomIn(detailMode) {

    }
    zoomOut(detailMode) {

    }
    resetMap(detailMode) {

    }
    locationLongLat() {

    }
    resetLoc = () => {
        this.setState({ locationLat: null,locationLong:null,toggle:false })
    }
    receiveResultOper(result) {
        let operArr = [];
        let CloudArr = [];


    }

    receiveResultOrg(result) {
        if(result.error) {
            this.props.handleAlertInfo('error',result.error)
        } else {
            _self.groupJoin(result,'organization')
        }
    }
    receiveResultCloudlet(result) {
        if(result.error) {
            this.props.handleAlertInfo('error',result.error)
        } else {
            _self.groupJoin(result,'cloudlet')
        }
    }
    receiveResultFlavor(result) {
        if(result.error) {
            this.props.handleAlertInfo('error',result.error)
        } else {
            _self.groupJoin(result,'flavor')
        }
    }

    generateCloudletItem(result) {
        let keys = this.state.keys;
        let cloudlet = aggregate.groupBy(result, 'CloudletName')
    }
    groupJoin(result,cmpt){

        this.props.data.handleLoadingSpinner(false);

        if(cmpt == 'organization'){
            this.setState({organizeData : this.state.organizeData.concat(result)});
        }
        else if(cmpt == 'cloudlet') {

            let cloudletDataReady = this.state.cloudletData.filter((item) => {return item.State === 5});
            this.setState({cloudletData : cloudletDataReady.concat(result)});

            // this.setState({cloudletData : this.state.cloudletData.concat(result)});
        }
        else if(cmpt == 'flavor') {
            this.setState({flavorData : this.state.flavorData.concat(result)});
        }


        if(this.state.organizeData.length === this.regionCount && this.state.cloudletData.length  === this.regionCount && this.state.flavorData.length  === this.regionCount) {
            let clusterInst = this.state.organizeData;
            let cloudlet = this.state.cloudletData;
            let arr =[]
            clusterInst.map((itemCinst,i) => {
                cloudlet.map((itemClet,j) => {
                    if(itemCinst.Cloudlet == itemClet.CloudletName) {
                        itemCinst.CloudletLocation = itemClet.CloudletLocation;
                    }
                })
                arr.push(itemCinst)
            })
            //TODO: 20190516 set devData

        }
    }
    resetDevData(keys,field) {
        let tabNo = 0;
        let filteredKeys = aggregate.removeDuplicate(keys)
        let _keys = Object.assign({},_self.state.devData.keys[tabNo]);
        if(_keys[field]) {
            _keys[field].items = filteredKeys;
            _self.setState({keys: _keys})
        }

    }
    resetDevInputData(keys,field) {
        let tabNo = 0;

    }

    onChangeFormState = (state,value) => {
        let organizKeys = [];
        let flavorKeys = [];
        let regions = aggregate.groupBy(_self.state.cloudletData, 'Region')
        if(state === 'Region') {
            let organiz = _self.state.organizeData;
            organiz.map(
                (aa) => organizKeys.push(aa.Organization)
            )
            _self.resetDevData(organizKeys, 'OrganizationName');
            //
            let operatorKeys = [];
            setTimeout(() => {
                let flavor = aggregate.groupBy(_self.state.flavorData, 'Region');
                if(flavor) {
                    if(flavor[_self.props.selectedRegion]) flavor[_self.props.selectedRegion].map((ff) => flavorKeys.push(ff.FlavorName));
                    _self.resetDevData(flavorKeys, 'Flavor')
                    let operators = regions[_self.props.selectedRegion];
                    if(operators) {
                        operators.map(
                            (aa) => operatorKeys.push(aa.Operator)
                        )
                        _self.resetDevData(operatorKeys, 'Operator');
                    } else {
                        _self.resetDevData(operatorKeys, 'Operator');
                    }
                } else {
                    _self.resetDevData(flavorKeys, 'Flavor');
                }

            }, 500)


        } else if(state === 'OrganizationName') {
            let operatorKeys = [];
            setTimeout(() => {
                let operators = regions[_self.props.selectedRegion];
                if(operators) {
                    operators.map(
                        (aa) => operatorKeys.push(aa.Operator)
                    )
                    _self.resetDevData(operatorKeys, 'Operator');
                    _self.setState({activeIndex:0})
                    //TODO: 20190521 display cloudlet positioned on map

                }
            }, 500)
        } else if(state === 'Operator') {
            let cloudletKeys = [];
            setTimeout(() => {
                let regionArray = regions[_self.props.selectedRegion];
                if(regionArray) {
                    let cloudlets = aggregate.groupBy(regionArray, 'Operator')
                    if(cloudlets && cloudlets[_self.props.selectedOperator]){
                        cloudlets[_self.props.selectedOperator].map(
                            (aa) => cloudletKeys.push(aa.CloudletName)
                        )
                        _self.resetDevData(cloudletKeys, 'Cloudlet');
                    } else {
                        //this.props.handleAlertInfo('error','There is no Cloudlets in the Region')
                    }

                } else {
                    //this.props.handleAlertInfo('error','There is no operators in')
                }
            }, 500)
            _self.setState({activeIndex:0})
        } else if(state === 'Flavor') {

            setTimeout(() => {
                _self.setFlavorNode([_self.props.masterNumber,_self.props.nodeNumber]);
                //change TAB
                if(this.state.clusterShow) _self.setState({activeIndex:1})
            }, 500)
        } else if(state === 'NumberOfNode') {
            setTimeout(() => {
                //create node as inserted number
                _self.setFlavorNode([_self.props.masterNumber,_self.props.nodeNumber]);
                if(_self.state.activeIndex !== 1) _self.setState({activeIndex:1})
            }, 500)
        } else if(state === 'DeploymentType') {
            _self.setState({activeIndex:0})
        } else if(state === 'Cloudlet'){
            this.state.cloudletData.map((item) => {
                if(item.Region === this.props.selectedRegion && item.Operator === this.props.selectedOperator){
                    value.map((_item) => {
                        if(_item == item.CloudletName){
                            let location = {region:'',name:'', lat:String(item.CloudletLocation.latitude), long:String(item.CloudletLocation.longitude)};
                            this.props.handleGetRegion(location);
                        }
                    })
                    if(value.length == 0) this.setState({locData:[]})
                }
            })
        }
    }
    setFlavorNode(keys, flavor) {
        let master = [];
        for( var i=0; i<Number(keys[0]); i++) {
            master.push(i)
        }
        let nodes = [];
        for( var j=0; j<Number(keys[1])+1; j++) {
            nodes.push(j)
        }
        const getChild = (value, idx) => (
            {
                "name": value,
                "value": idx === 0 ? 200 : 200,
                "color": idx === 0 ? "#ff7d77" : "#a2cbff"
            }
        )
        let flconfig = {
            "name": 'NO Name',
            "children": [
                {
                    "name": "Master",
                    "children": nodes.map((node, i) => getChild(flavor,i))
                }

            ]
        }

        _self.setState({flavorConfig:flconfig, clusterName:_self.props.clusterName})
        _self.forceUpdate();


    }

    // getDataDeveloper = (region,regionArr) => {
    //     let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
    //     let rgn = [];
    //     //this.setState({devData:[]})
    //     if(region !== 'All'){
    //         rgn = [region]
    //     } else {
    //         rgn = (regionArr)?regionArr:this.props.regionInfo.region;
    //     }
    //
    //     rgn.map((item) => {
    //         services.getMCService('ShowCloudlet',{token:store ? store.userToken : 'null', region:item}, _self.receiveResultCloudlet)
    //         services.getMCService('ShowFlavor',{token:store ? store.userToken : 'null', region:item}, _self.receiveResultFlavor)
    //
    //     })
    //
    //     services.getMCService('showOrg',{token:store ? store.userToken : 'null'}, _self.receiveResultOrg, _self)
    // }
    handleTabChange = (e, { activeIndex }) => {
        this.setState({ activeIndex })
        if(this.state.locData.length) this.props.handleGetRegion(this.state.locData)
    }
    componentDidMount() {
        // if(localStorage.selectMenu == 'Cluster Instances') this.getDataDeveloper(this.props.data.region)
    }
    componentWillUnmount(){
        this.props.handleGetRegion(null);
    }
    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.regionInfo === this.state.regionInfo) return;

        if(nextProps.regionInfo.region.length && !this.state.regionToggle) {
            _self.setState({regionToggle:true, regionInfo:nextProps.getRegion})

            if(localStorage.selectMenu == 'Cluster Instances'){
                _self.setState({clusterShow: false});
                //this.getDataDeveloper(nextProps.data.region,nextProps.regionInfo.region)
            }
        }
        if(nextProps.data) this.setState({devData: nextProps.data, keys:nextProps.keys, regionInfo:nextProps.regionInfo})
        //reset cluster and node count
        if(nextProps.nodeNumber || nextProps.selectedFlavor) {
            this.setFlavorNode([nextProps.masterNumber,nextProps.nodeNumber],nextProps.selectedFlavor);
        }

        // case click a region on the map
        if(nextProps.getRegion) {
            let data = {CloudletLocation: {latitude: Number(nextProps.getRegion.lat), longitude: Number(nextProps.getRegion.long)}};
            this.setState({
                regionInfo:nextProps.getRegion,
                locData:(localStorage.selectMenu == 'Cluster Instances')?this.state.locData.concat(data):[data],
                locationLat:nextProps.getRegion.lat,
                locationLong:nextProps.getRegion.long
            })
            // if(nextProps.getRegion.lat == '' && nextProps.getRegion.long == ''){
            //     this.setState({locData:[]})
            // }
            this.props.handleGetRegion(null);
        }

    }

    gotoUrl(num) {
        if(num === 'skip') {
            return;
        }
        _self.props.history.push({
            pathname: '/site4',
            search: 'pg='+num
        });
        _self.props.history.location.search = 'pg='+num;
        _self.props.handleChangeSite({mainPath:'/site4', subPath: 'pg='+num})
    }

    clusterHide = (value) => {
        if(value === 'Docker' && panes.length == 2) {
            panes.pop();
            this.setState({clusterShow:false})
        }
        if(value === 'Kubernetes' && panes.length == 1){
            panes.push({ menuItem: 'Show Cluster', render: (props) => <Tab.Pane>{clusterNode(props)}</Tab.Pane> });
            this.setState({clusterShow:true})
        }
    }
    handleChangeLong = (e, {value}) => {
        // if(value == '-') {
        //     this.setState({ locationLong: value })
        //     return
        // }
        let onlyNum = value;
        let count = [];
        if(onlyNum.match(/[.]/g) != null) {
            count = onlyNum.match(/[.]/g)
        }
        if(onlyNum > 180 || onlyNum < -180 || /[^-0-9.]/g.test(onlyNum) || count.length > 1) {
            this.setState({longerror:'-180 ~ 180'})
            e.target.value=null;
            return
        }

        if(onlyNum != 0) {
            onlyNum = onlyNum.replace(/(^0+)/, "")
        }

        this.setState({ locationLong: onlyNum, longerror:'' })
        this.locationValue(onlyNum,this.state.locationLat)
    }
    handleChangeLat = (e, {value}) => {
        let onlyNum = value;
        let count = [];
        if(onlyNum.match(/[.]/g) != null) {
            count = onlyNum.match(/[.]/g)
        }
        if(onlyNum > 90 || onlyNum < -90 || /[^-0-9.]/g.test(onlyNum) || count.length > 1) {
            this.setState({laterror:'-90 ~ 90'})
            e.target.value=null;
            return
        }

        if(onlyNum != 0) {
            onlyNum = onlyNum.replace(/(^0+)/, "")
        }
        this.setState({ locationLat: onlyNum, laterror:'' })
        this.locationValue(this.state.locationLong,onlyNum)
    }
    locationValue = (long,lat) => {
        if(long && lat){
            this.setState({ locationLongLat: [Number(long),Number(lat)] })

        } else {
            this.setState({ locationLongLat: null})
        }
        // handle input value to input filed that lat/long fileds as redux
        let location = {region:'',name:'', lat:lat, long:long}
        console.log("locationlocationlocation",location)
        _self.props.handleGetRegion(location)

        // handle send value to map for indicate lat/long

    }

    render() {
        const { activeIndex, clusterName } = this.state;
        let {data, dimmer, changeNext} = this.props;
        console.log('20200106 props data in Form -- ', this.props.data)
        let randomState = Math.random()*100;
        return (
            <Grid.Column>
                {/*<Grid.Row className="grid_map_container">*/}
                {/*    <Grid.Column className="left">*/}
                        <SiteFourCreateFormDefault data={data} pId={0} getUserRole={this.props.getUserRole}
                                                   gotoUrl={this.gotoUrl} clusterHide={this.clusterHide}
                                                   randomState = {randomState}
                                                   toggleSubmit={this.props.toggleSubmit}
                                                   validError={this.props.validError}
                                                   onSubmit={() => console.log('submit form')}
                                                   selected={this.props.selectedRegion}
                                                   regionInfo={this.state.regionInfo}
                                                   dimmer={dimmer}
                                                   changeNext={changeNext}
                                                   editMode={this.props.editMode ? this.props.editMode : null}
                                                   handleChangeLat={this.handleChangeLat}
                                                   handleChangeLong={this.handleChangeLong}
                                                   onChangeState={this.onChangeFormState}
                                                   selectListData={this.props.selectListData}
                                                   latError={this.state.laterror}
                                                   longError={this.state.longerror}>

                        </SiteFourCreateFormDefault>
                {/*    </Grid.Column>*/}
                {/*</Grid.Row>*/}
            </Grid.Column>
        )
    }
}

const mapStateToProps = (state) => {
    let account = state.registryAccount.account;
    let dimm =  state.btnMnmt;
    let accountInfo = account ? account + Math.random()*10000 : null;
    let dimmInfo = dimm ? dimm : null;
    let submitVal = null;
    let selectedRegion = null;
    let selectedCloudlet = null;
    let selectedOperator = null;
    let selectedFlavor = null;
    let flavors = null;
    let formValues = null;
    let clusterName = null;
    let masterNumber = null;
    let nodeNumber = null;
    let getRegion = (state.getRegion)?state.getRegion.region:null
    let regionInfo = (state.regionInfo)?state.regionInfo:null;
    let changeNext = state.changeNext ? state.changeNext.next:null;
    if(state.form.createAppFormDefault) {
        formValues = state.form.createAppFormDefault.values;
        if(state.form.createAppFormDefault.values.Region !== "") {
            selectedRegion = state.form.createAppFormDefault.values.Region;
            //하위 오퍼레이터 리스트 아이템 변경
        }
        if(state.form.createAppFormDefault.values.Cloudlet !== "") {
            selectedCloudlet = state.form.createAppFormDefault.values.Cloudlet;
        }
        if(state.form.createAppFormDefault.values.Operator !== "") {
            selectedOperator = state.form.createAppFormDefault.values.Operator;
        }
        if(state.form.createAppFormDefault.values.Flavor !== "") {
            selectedFlavor = state.form.createAppFormDefault.values.Flavor;
        }
        if(state.form.createAppFormDefault.values.NumberOfNode !== "") {
            nodeNumber = state.form.createAppFormDefault.values.NumberOfNode;
            masterNumber = 1;
        }

    }



    return {
        selectedRegion, selectedOperator, clusterName, formValues, selectedFlavor, masterNumber, nodeNumber, getRegion,
        regionInfo: regionInfo, changeNext
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleGetRegion: (data) => { dispatch(actions.getRegion(data)) },
        handleChangeNext: (data) => { dispatch(actions.changeNext(data)) },
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteFourCreatePoolForm));
