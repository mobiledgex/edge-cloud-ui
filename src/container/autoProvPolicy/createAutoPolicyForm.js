import React, {Fragment} from 'react';
import {Form, Input, Grid, Tab, Button} from 'semantic-ui-react';
import SiteFourCreateFormDefault from '../siteFourCreateFormDefault';
import BubbleGroup from '../../charts/bubbleGroup';
import EditMap from '../../libs/simpleMaps/with-react-motion/editMap';
import ClustersMap from '../../libs/simpleMaps/with-react-motion/index_clusters';
import * as aggregate from "../../utils";
import * as actions from "../../actions";
import {connect} from "react-redux";
import _ from 'lodash';
import '../styles.css';
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
class CreateAutoPolicyForm extends React.Component {
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
            regionToggle:false,
        }
        _self = this;
        this.loopReqCount = 3; //cloudlet(operators), cluster, flavor
        this.regionCount = 2; // US, EU
        this.cloudlets = [];
        this.devDataDummy = {};
        this.selectedRegion = null;
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

    onChangeFormState = (state,value) => {
        
    }


    makeFilteringCloudlet = (propsData, selectedRegion, selectKey) => {
        //alert("state cloudelts ==    "+JSON.stringify(propsData))
        if(propsData.data[0][selectKey] && propsData.data[0][selectKey].length) {
            let tempData = _.cloneDeep(propsData.data[0]);
            let newData = _.cloneDeep(propsData);
            let filtered = [];
            
            
            tempData[selectKey].map(data => {
                if(data['region'] === selectedRegion) filtered.push(data);
            })
            
            //
            if(filtered.length > 0) {
                newData.data[0][selectKey] = filtered;
            } else {
                newData.data[0][selectKey] = tempData[selectKey];
                //alert('newData === '+ JSON.stringify(newData))
            }

            this.setState({devData: newData})
            this.forceUpdate();
        }
    }
    componentDidMount() {
        // if(localStorage.selectMenu == 'Cluster Instances') this.getDataDeveloper(this.props.data.region)
        console.log(this.props.data)
    }
    componentWillUnmount(){
        //this.props.handleGetRegion(null);
    }
    componentWillReceiveProps(nextProps, nextContext) {

        if(nextProps.selectedRegion && (nextProps.selectedRegion !== this.selectedRegion)) {
            this.selectedRegion = nextProps.selectedRegion
            
        }
        let cloneData = null;
        let findKeys = ['AddCloudlet', 'LinktoOrganization'];
        let selectKey = findKeys[0];
        // when selected region from the region select box
        if(Object.keys(this.devDataDummy).length && this.selectedRegion && typeof this.selectedRegion === 'string') {
            if(nextProps.selectedRegion !== 'All') {
                cloneData =  _.cloneDeep(nextProps.data);
                this.makeFilteringCloudlet(cloneData, nextProps.selectedRegion,selectKey);

            }

        } else {

        }

        if(nextProps.data && nextProps.data.data) {
            //if(nextProps.data.data === this.devDataDummy.data) alert('same')
            if(Object.keys(this.devDataDummy).length && (nextProps.data.data === this.devDataDummy.data)) {
                return;
            }
            let region = 'All'
            if(nextProps.data.data[0]){
                let actionKey = Object.keys(nextProps.data.data[0]);
                let findIdx = actionKey.findIndex( (key) => (key === findKeys[1] ))
                if(findIdx > -1 && nextProps.data.data[0][findKeys[1]].length) selectKey = findKeys[1];
                /** copy data as immutable */
                this.devDataDummy = nextProps.data;
                cloneData =  _.cloneDeep(nextProps.data);
                if(nextProps.data.region) region = nextProps.data.region;
            } 
            if(cloneData) this.makeFilteringCloudlet(cloneData, region, selectKey);
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
        const { devData } = this.state;
        let {dimmer, changeNext} = this.props;
        return (
            <Grid.Column>
                {/*<Grid.Row className="grid_map_container">*/}
                {/*    <Grid.Column className="left">*/}
                        <SiteFourCreateFormDefault data={devData} pId={0} getUserRole={this.props.getUserRole}
                                                   gotoUrl={this.gotoUrl} clusterHide={this.clusterHide}
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
                                                   longError={this.state.longerror}
                                                   step={this.props.step?this.props.step:null}

                        >

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
    let selectedRegion = state.form.createAppFormDefault ? state.form.createAppFormDefault.values.Region : null;
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
        try{
            if(formValues && formValues.Region !== "") {
                selectedRegion = _self.state.selectedRegion !== selectedRegion ? selectedRegion : null ;
                //하위 오퍼레이터 리스트 아이템 변경
            }
            if(formValues && formValues.Cloudlet !== "") {
                selectedCloudlet = formValues.Cloudlet;
            }
            if(formValues && formValues.Operator !== "") {
                selectedOperator = formValues.Operator;
            }
            if(formValues && formValues.Flavor !== "") {
                selectedFlavor = formValues.Flavor;
            }
            if(formValues && formValues.NumberOfNode !== "") {
                nodeNumber = formValues.NumberOfNode;
                masterNumber = 1;
            }
        } catch(e) {

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

export default withRouter(connect(mapStateToProps, mapDispatchProps)(CreateAutoPolicyForm));
