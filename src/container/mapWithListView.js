import _ from 'lodash'
import React from 'react';
import { Modal, Grid, Header, Button, Table, Menu, Icon, Input, Popup, Container, Sticky } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import ReactTooltip from 'react-tooltip'
import { connect } from 'react-redux';
import RGL, { WidthProvider } from "react-grid-layout";
import Alert from "react-s-alert";
import * as moment from 'moment';
import * as actions from '../actions';
import SelectFromTo from '../components/selectFromTo';
import RegistNewItem from './registNewItem';
import DeleteItem from './deleteItem';
import './styles.css';
import ClustersMap from '../libs/simpleMaps/with-react-motion/index_clusters';
import VerticalLinearStepper from '../components/stepper';
import PopDetailViewer from './popDetailViewer';
import * as computeService from '../services/service_compute_service';
import ReactJson from 'react-json-view'
import * as ServiceSocket from '../services/service_webSocket';
import * as utile from '../utils'

const ReactGridLayout = WidthProvider(RGL);
let prgInter = null;
let autoInter = null;
const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 20;

var layout = [
    {"w":24,"h":9,"x":0,"y":0,"i":"0","minW":5,"minH":8,"moved":false,"static":false, "title":"LocationView"},
    {"w":24,"h":11,"x":0,"y":9,"i":"1","minW":8,"moved":false,"static":false, "title":"Developer"}
]
const override = {
    display: 'fixed',
    position:'absolute',
    margin: '0 auto',
    borderColor: 'red'
}

const ContainerOne = (props) => (

    <ClustersMap parentProps={props} />

);
let _self = null;
class MapWithListView extends React.Component {
    constructor(props) {
        super(props);

        const layout = this.generateLayout();
        this.state = {
            layout,
            open: false,
            openDetail:false,
            dimmer:true,
            activeItem:'',
            dummyData : [],
            selected:{},
            sideVisible:null,
            direction:null,
            column:null,
            isDraggable: false,
            selectedItem:null,
            openDelete:false,
            tooltipMsg:'No Message',
            tooltipVisible: false,
            detailViewData:null,
            noData:false,
            updateData:{},
            resize:null,
            sorting:false,
            closeMap:false,
            toggle:false,
            stateCreate:false,
            stateViewToggle:false,
            stateStream:null,
            stackStates:[],
            changeRegion:null,
            viewMode: null,
            resetMap:null
            
        };

        _self = this;
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
        this.mapzoneStyle = [
            {margin:'0 0 10px 0', padding: '5px 15px 15px', alignItems:'center', display:'flex', flexDirection:'column'},
            {margin:'0 0 10px 0', padding: '5px 15px 15px', alignItems:'center', display:'flex', flexDirection:'column', height:'28px'}
        ]
        this.streamInterval = null;
        this.oldTemp = {};
        this.live = true;
        this.stateStreamData = null;
    }
    gotoUrl(site, subPath) {
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:site, subPath: subPath});
    }

    onHandleEdit(data) {
        this.props.handleLoadingSpinner(true);
        //this.setState({ dimmer:dim, open: true, selected:data })
        //this.props.handleEditInstance(data);
        //this.gotoUrl('/site4', 'pg=editAppInst')
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        let createFormat = {
            "region":data['Region'],
            "appinst":{
                "key":{
                    "app_key":{"developer_key":{"name":data['OrganizationName']},"name":data['AppName'],"version":data['Version']},
                    "cluster_inst_key":{
                        "cluster_key":{"name":data['ClusterInst']},
                        "cloudlet_key":{"operator_key":{"name":data['Operator']},"name":data['Cloudlet']}
                    }
                }
            }
        }
        computeService.updateAppInst('UpdateAppInst', {params:createFormat, token:store ? store.userToken : 'null'}, _self.receiveResult)
        
        setTimeout(() => this.props.dataRefresh(), 2000)
        
        //this.props.handleLoadingSpinner(true);
    }

    receiveResult = (result) => {
        console.log("appupdateinst",result)
        // this.props.handleLoadingSpinner(false);
        
    }

    onItemOver(itemData,key, evt) {
        this.setState({selectedItem:key})
    }

    show = (dim) => this.setState({ dimmer:dim, open: true })
    close = () => {
        this.setState({ open: false, openDelete: false, selected:{} })
        this.props.handleInjectDeveloper(null)
    }
    closeDetail = () => {
        this.setState({ openDetail: false })
        this.props.handleDetail({data:null, viewMode:'listView'})
    }
    makeHeader_noChild =(title)=> (
        <Header className='panel_title'>{title}</Header>
    )
    makeHeader_date =(title)=> (
        <Header className='panel_title' style={{display:'flex',flexDirection:'row'}}>
            <div style={{display:'flex', flexGrow:8}}>{title}</div>
            <SelectFromTo style={{display:'flex', alignSelf:'flex-end'}}></SelectFromTo>
        </Header>
    )
    makeHeader_select =(title)=> (
        <Header className='panel_title'>{title}</Header>
    )

    InputExampleFluid = (value) => <Input fluid placeholder={(this.state.dimmer === 'blurring')? '' : value} />
    zoomIn(detailMode) {
        _self.setState({sideVisible:detailMode})
    }
    zoomOut(detailMode) {

        _self.setState({sideVisible:detailMode})
    }
    //this.props.parentProps.resetMap(false, 'fromDetail')
    handleSort = clickedColumn => (a) => { 
        console.log('20190819 handle sort..', a)
        _self.setState({sorting : true});
        const { column, dummyData, direction } = _self.state
        this.stateSort(dummyData)
        if ((column !== clickedColumn) && dummyData) {
            let sorted = _.sortBy(dummyData, [clm => typeof clm[(clickedColumn == 'State')?'StateData':clickedColumn] === 'string' ? String(clm[(clickedColumn == 'State')?'StateData':clickedColumn]).toLowerCase(): clm[(clickedColumn == 'State')?'StateData':clickedColumn]])
            sorted.map((item) => {
                delete item['StateData']
            })
            this.setState({
                column: clickedColumn,
                dummyData: sorted,
                direction: 'ascending',
            })
        } else {
            let reverse = dummyData.reverse()
            reverse.map((item) => {
                delete item['StateData']
            })
            this.setState({
                dummyData: reverse,
                direction: direction === 'ascending' ? 'descending' : 'ascending',
            })

        }

        //setTimeout(() => _self.setState({sorting : false}), 1000)
    }
    stateSort = (_sortData) => {
        _sortData.map((item) => {
            (item.State == 0)?item['StateData'] = 'TrackedStateUnknown':
            (item.State == 1)?item['StateData'] = 'NotPresent':
            (item.State == 2)?item['StateData'] = 'CreateRequested':
            (item.State == 3)?item['StateData'] = 'Creating':
            (item.State == 4)?item['StateData'] = 'CreateError':
            (item.State == 5)?item['StateData'] = 'Ready':
            (item.State == 6)?item['StateData'] = 'UpdateRequested':
            (item.State == 7)?item['StateData'] = 'Updating':
            (item.State == 8)?item['StateData'] = 'UpdateError':
            (item.State == 9)?item['StateData'] = 'DeleteRequested':
            (item.State == 10)?item['StateData'] = 'Deleting':
            (item.State == 11)?item['StateData'] = 'DeleteError':
            (item.State == 12)?item['StateData'] = 'DeletePrepare':
            (item.State == 13)?item['StateData'] = 'CRMInit':
            item['StateData'] = item.State
        })
        return _sortData
    }
    generateStart () {

        (this.state.dummyData.length) ? this.setState({noData: false}) : this.setState({noData: true})
    }
    checkLengthData() {
        this.setState({noData:false})
        setTimeout(() => this.generateStart(), 2000)
    }

    generateDOM(open, dimmer, dummyData, resize, resetMap) {
        return layout.map((item, i) => (

            (i === 1)?
                <div className="round_panel" key={i} >

                    <div className={'grid_table '+this.props.siteId}>
                        {
                            this.TableExampleVeryBasic(this.props.headerLayout, this.props.hiddenKeys, dummyData)
                        }
                    </div>

                    {/*<Table.Footer className='listPageContainer'>*/}
                    {/*    <Table.Row>*/}
                    {/*        <Table.HeaderCell>*/}
                    {/*            <Menu pagination>*/}
                    {/*                <Menu.Item as='a' icon>*/}
                    {/*                    <Icon name='chevron left' />*/}
                    {/*                </Menu.Item>*/}
                    {/*                <Menu.Item as='a' active={true}>1</Menu.Item>*/}
                    {/*                <Menu.Item as='a'>2</Menu.Item>*/}
                    {/*                <Menu.Item as='a'>3</Menu.Item>*/}
                    {/*                <Menu.Item as='a'>4</Menu.Item>*/}
                    {/*                <Menu.Item as='a' icon>*/}
                    {/*                    <Icon name='chevron right' />*/}
                    {/*                </Menu.Item>*/}
                    {/*            </Menu>*/}
                    {/*        </Table.HeaderCell>*/}
                    {/*    </Table.Row>*/}
                    {/*</Table.Footer>*/}

                    {/*페이저 기능 생길 때 까지 */}
                </div>
                :
                <div className="round_panel" key={i} style={(!this.state.closeMap)?this.mapzoneStyle[0]:this.mapzoneStyle[1]}>
                    <div style={{margin:'0 0 5px 0', cursor:'pointer', display:'flex', alignItems:'column', justifyContent:'center'}} onClick={this.onCloseMap}>
                        <span style={{color:'#c8c9cb'}}>{(this.state.closeMap)?'Show map':'Hide map'}</span>
                        <Icon name={(this.state.closeMap)?'angle down':'angle up'}/>
                    </div>
                    <div className='panel_worldmap'>
                        <ContainerOne ref={ref => this.container = ref} {...this.props} gotoNext={this.gotoNext} zoomIn={this.zoomIn} zoomOut={this.zoomOut} resetMap={resetMap}></ContainerOne>
                    </div>
                </div>
        ))

    }
    /*
    <div className="round_panel" key={i} style={{display:'flex'}}>
                {this.TableExampleVeryBasic()}
            </div>
     */

    generateLayout() {
        const p = this.props;
        return layout
    }

    makeHeader(_keys, headL, hidden) {
        const { column, direction } = this.state
        let keys = Object.keys(_keys);
        let widthDefault = Math.round(16/keys.length);

        return keys.map((key, i) => (
            (!( String(hidden).indexOf(key) > -1 ))?
                (i === keys.length -1) ?
                <Table.HeaderCell key={i} className='unsortable' textAlign='center'>
                    {(key === 'Edit')? 'Actions' : key}
                </Table.HeaderCell>
                :
                <Table.HeaderCell key={i} className={(key === 'CloudletLocation' || key === 'Edit' || key === 'Progress')?'unsortable':''} textAlign='center' sorted={column === key ? direction : null} onClick={(key == 'CloudletLocation' || key == 'Edit' || key == 'Progress' || key == 'Ports' )?null:this.handleSort(key)}>
                    {(key === 'CloudletName')? 'Cloudlet Name'
                        : (key === 'CloudletLocation')? 'Cloudlet Location'
                            : (key === 'ClusterName')? 'Cluster Name'
                                : (key === 'OrganizationName')? 'Organization Name'
                                    : (key === 'IpAccess')? 'IP Access'
                                        : (key === 'AppName')? 'App Name'
                                            : (key === 'ClusterInst')? 'Cluster Instance'
                                                : (key === 'Physical_name')? 'Physical Name'
                                                    : (key === 'Platform_type')? 'Platform Type'
                                                        : (key === 'Edit')? 'Actions'
                    : key}
                </Table.HeaderCell>
            :
                null
        ));
    }

    onLayoutChange(layout) {
        //this.props.onLayoutChange(layout);
    }
    onPortClick(a,b) {
        alert(b[a])
    }
    detailView(item) {
        //change popup to page view
        _self.setState({viewMode:'detailView'})
        _self.props.handleDetail({data:item, viewMode:'detailView'})
    }
    jsonView = (jsonObj) => (
        <ReactJson src={jsonObj} {...this.jsonViewProps} />
    )
    makeStepper = (_item, _auto) => (
        <div className='ProgressBox' id='prgBox' style={{minWidth:250,maxHeight:500,overflow:'auto'}}>
            <VerticalLinearStepper item={_item} site={this.props.siteId} alertRefresh={this.setAlertRefresh}  failRefresh={this.setAlertFailRefresh} autoRefresh={this.setAlertAutoRefresh} auto={_auto} stopInterval={this.closeInterval} getParentProps={this.getParentProps}/>
        </div>
    )
    /*****************************
     * view status of creating app
     * ***************************/
    getParentProps = () => {
        return _self.stateStreamData ? _self.stateStreamData : null;
    }
    resetParentProps = () => {

    }
    onShowAlert = (obj) => {
        console.log('20191119.. Alert..', Alert)
    }
    stateView(_item,_siteId,_auto) {
        console.log('20191119 state view.--- ', _siteId)
        Alert.closeAll('');
        clearInterval(_self.streamInterval);
        this.setState({stateViewToggle:true})
        Alert.info(
            this.makeStepper(_item, _auto),
            {
                position: 'top-right', timeout: 'none', limit:1,
                onShow: this.onShowAlert,
                onClose: this.proClose
            })
        if(_item['State'] && _item['State'] != 5) {
            _self.streamInterval = setInterval(() => {
                _self.getStackInterval(_item, _siteId);
            }, 2000)
            _self.getStackInterval(_item, _siteId);
        }

        //test
        _self.getStackInterval(_item, _siteId);
    }

    /*
    20191119 get stack interval..
    {Region: "EU",
    ClusterName: "autoclusterbicinkiapp117-1",
    OrganizationName: "bicinkiOrg1117-1",
    Operator: "TDG",
    Cloudlet: "frankfurt-eu", …}Cloudlet: "frankfurt-eu"CloudletLocation: {latitude: 50.110924, longitude: 8.682127}ClusterName: "autoclusterbicinkiapp117-1"Deployment: "kubernetes"Edit: (10) ["Region", "ClusterName", "OrganizationName", "Operator", "Cloudlet", "Flavor", "IpAccess", "Number_of_Master", "Number_of_Node", "CloudletLocation"]Flavor: "x1.medium"IpAccess: 3Operator: "TDG"OrganizationName: "bicinkiOrg1117-1"Progress: ""Region: "EU"State: 3Status: {task_number: 2, task_name: "Waiting for Cluster to Initialize", step_name: "Checking Master for Available Nodes"}__proto__: Object : ClusterInst


     Cloudlet: "frankfurt-eu"
CloudletLocation: {latitude: 50.110924, longitude: 8.682127}
ClusterName: "autoclusterbicapp"
Deployment: "docker"
Edit: (10) ["Region", "ClusterName", "OrganizationName", "Operator", "Cloudlet", "Flavor", "IpAccess", "Number_of_Master", "Number_of_Node", "CloudletLocation"]
Flavor: "m4.medium"
IpAccess: 1
Operator: "TDG"
OrganizationName: "WonhoOrg1"
Progress: ""
Region: "EU"
State: 3
Status: {task_number: 2, task_name: "Creating Heat Stack for frankfurt-eu-autoclusterbicapp-wonhoorg1", step_name: "Heat Stack Status: CREATE_IN_PROGRESS"}
//frankfurt-eu-autoclusterbicapp-wonhoorg1

     */
    //"autoclusterbicinkiapp117-1"
    getStackInterval = (_item, _siteId) => {
        console.log('20191119 get cluster state.. get stack interval..', _item, ":", _siteId)
        let clId = '';
        if(_siteId === 'Cloudlet') {
            clId = _item.Operator + _item.CloudletName;
        } else if(_siteId === 'ClusterInst') {
            //TODO :

            clId = _item.ClusterName+'-'+_item.OrganizationName+'-'+_item.Operator

        } else if(_siteId === 'appinst') {
            //TODO : if auto
            /*
            if(req.body.multiCluster.indexOf('autocluster') > -1){
                clusterId = req.body.multiCluster + req.body.multiCloudlet;
            } else {
                clusterId = params.appinst.key.app_key.name + req.body.multiCloudlet;
                clusterId = clusterId.concat((req.body.multiCluster == '')?'DefaultVMCluster': req.body.multiCluster);
            }
            */

            if(_item.ClusterInst.indexOf('auto') > -1){
                clId =  'autocluster';
            }
            clId = clId+_item.AppName+'-'+_item.OrganizationName+'-'+_item.Operator
        }
        console.log('20191119 get cluster state..', clId.toLowerCase())


        computeService.getStacksData('GetStatStream', clId.toLowerCase(), this.receiveInterval)
    }
    closeInterval = (type, message) => {
        if(type && message){
            //call from VerticalLinearStepper
            let theSame = false;

            for(let tmp in this.oldTemp) {
                console.log('20191119 proClose... ', type,":", this.oldTemp[tmp],"--== : ==--", message)
                if(this.oldTemp[tmp] === message) theSame = true;
            }

            if(!theSame){
                Alert.closeAll();
                this.props.handleAlertInfo(type, message)
                this.oldTemp[type] = message;
                this.props.handleComputeRefresh(false)
            }
            clearInterval(this.streamInterval)
        }

    }
    receiveInterval =(data) => {
        console.log('20191119 index receive data from server....', data)
        this.storeData(data.data.stacksData,'streamTemp', 'state')

    }
    storeData = (_data, stId) => {
        let stackStates = [];
        let filteredData = [];
        if(_data && _data.length) {
            _data.map((dtd, i) => {
                if(dtd[stId] !== "") {
                    let parseData = JSON.parse(dtd[stId])
                    let keys = Object.keys(parseData);

                    let clId = dtd['clId'];
                    let _dtd = null
                    if(dtd[stId] && keys[0] === 'data') {

                        _dtd = parseData.data ? parseData.data : null;
                        stackStates.push(_dtd)
                    }
                    /*
                    else if(dtd[stId] && keys[0] === 'result') {
                        _dtd = parseData.result ? parseData.result : null;
                    }
                    */
                } else {

                }

            })
            //중복제거
            stackStates.data = utile.removeDuplicate(stackStates)
            console.log('20191119 getState storeData stackStates.... ', stackStates)
            _self.setState({stateStream: stackStates})
            _self.stateStreamData = stackStates;
            _self.forceUpdate();
        } else {
            // closed streaming
            console.log('20191119 closed streaming....')
        }

        return stackStates;
    }
    storeData_old = (_data, stId, flag) => {
        let stackStates = [];
        if(_data && _data.length) {
            _data.map((dtd, i) => {
                let keys = Object.keys(JSON.parse(dtd[stId]));
                let parseData = JSON.parse(dtd[stId])
                console.log('20191119 key..', keys, ":",keys[0], ":", parseData,":clId ===>>>>>>>",dtd['clId'])

                let clId = dtd['clId'];
                let _dtd = null
                if(dtd[stId] && keys[0] === 'data') {

                    _dtd = parseData.data ? parseData.data : null;

                    if(_dtd) {
                        _dtd['clId'] = clId;
                        if(stackStates.length == 0) stackStates.push(_dtd)
                        let sameItem = false;
                        stackStates.map((sItem) => {
                            if(sItem === _dtd) sameItem = true;
                        })
                        if(!sameItem) {
                            stackStates.push(_dtd)
                        }
                    }
                    console.log('20191119 login -- ', _dtd,":", stackStates)
                } else if(dtd[stId] && keys[0] === 'result' && flag === 'result') {
                    _dtd = parseData.result ? parseData.result.message : null;
                    console.log('20191119 login result -- ', _dtd)
                    if(_dtd) {
                        //return [_dtd];
                    }
                }
            })
            alert('test1'+stackStates)
            //store.dispatch(actions.stateStream(stackStates))
        } else {
            // closed streaming
            console.log('20191119 closed streaming....')
        }
        alert('test2'+stackStates)
        console.log('20191119 stackStates -- ', stackStates)
        return stackStates;
    }


    proClose = (value) => {
        console.log('20191119 closed popup ....'+value)
        // this.setState({stateViewToggle:false})
        clearInterval(_self.streamInterval)

    }

    setAlertRefresh = (msg) => {

        console.log("setAlertRefresh")
        clearInterval(prgInter);
        
        Alert.closeAll();
        if(!msg) {
            if(this.props.siteId == 'ClusterInst') msg = 'Your cluster instance created successfully'
            else if(this.props.siteId == 'appinst') msg = 'Your app instance created successfully'
            else if(this.props.siteId == 'Cloudlet') msg = 'Your cloudlet created successfully'
        }

        this.props.handleAlertInfo('success',msg)
        _self.setState({stateStream: []})
        _self.stateStreamData = [];
        this.props.dataRefresh();
    }

    setAlertFailRefresh = (msg) => {
        console.log("setAlertFailRefresh")
        clearInterval(prgInter);
        this.props.dataRefresh();
        Alert.closeAll();
        this.props.handleAlertInfo('error',msg)
    }

    setAlertAutoRefresh = () => {
        Alert.closeAll();
        this.props.handleAlertInfo('success','Your auto cluster instance created successfully');
        this.props.dataRefresh();
    }

    /*
{"region":"EU",
"appinst":{
    "key":{"app_key":{"developer_key":{"name":"bicinkiOrg1117-1"},"name":"bicinkiApp117-1","version":"1.0"},
        "cluster_inst_key":{"cluster_key":{"name":"autoclusterbicinkiApp117-1"},"cloudlet_key":{"operator_key":{"name":"bicinkiOper"},"name":"bictest1129"}}}}}
 */
    autoClusterAlert = (_data) => {
        console.log('20191119 auto cluster alert', _data, ":", this.props.submitObj)
        if(this.props.submitObj) {
            _data['OrganizationName'] = this.props.submitObj['appinst'].key.app_key.developer_key.name;
        }
        this.stateView(_data,this.props.siteId,'auto');
    }
    
    makeUTC = (time) => (
        moment.unix( time.replace('seconds : ', '') ).utc().format('YYYY-MM-DD HH:mm:ss')
    )
    compareDate = (date) => {

        let isNew = false;
        let darray = [];
        if(date) {
            let formatDate = this.makeUTC(date);

            let fromNow = moment(formatDate).utc().startOf('day').fromNow();
            if(fromNow === 'a day ago') fromNow = '24 hours ago'
            if(fromNow === 'an hour ago') fromNow = '1 hours ago'
            darray = fromNow.split(' ')
            if(fromNow.indexOf('hours') > -1 && (parseInt(darray[0]) <= 24 || fromNow === 'a day ago') ) isNew = true;
        } else {

        }

        return {new:isNew, days:darray[0]};
    }

    makeTableRow =() => {
        let row = null;

        return row;
    }

    TableExampleVeryBasic = (headL, hidden, dummyData) => (
        <Table className="viewListTable" basic='very' striped celled sortable ref={ref => this.viewListTable = ref} style={{width:'100%'}}>
            <Table.Header className="viewListTableHeader"  style={{width:'100%'}}>
                <Table.Row>
                    {(dummyData.length > 0)?this.makeHeader(dummyData[0], headL, hidden):null}
                </Table.Row>
            </Table.Header>
            <Table.Body className="tbBodyList">
                {

                        dummyData.map((item, i) => (
                            <Table.Row key={i}>
                                {Object.keys(item).map((value, j) => (
                                    (value === 'Edit')?
                                        String(item[value]) === 'null' ? <Table.Cell/> :
                                        <Table.Cell key={j} textAlign='center' style={(this.state.selectedItem == i)?{whiteSpace:'nowrap',background:'#444'} :{whiteSpace:'nowrap'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            {/* {
                                                this.props.diffRev.map((_diff) => (
                                                    (String(item[value]).indexOf('Editable') > -1 && _diff.AppName == item['AppName'] && _diff.Region == item['Region'] && _diff.OrganizationName == item['OrganizationName'] && _diff.Operator == item['Operator'] && _diff.Cloudlet == item['Cloudlet'] && _diff.ClusterInst == item['ClusterInst'] && item['State'] != 7) ? <Button key={`key_${j}`} color='teal' onClick={() => this.onHandleEdit(item)}>Update</Button> : null
                                                ))
                                            } */}
                                            <Button disabled={this.props.dimmInfo.onlyView} onClick={() => this.setState({openDelete: true, selected:item})}><Icon name={'trash alternate'}/></Button>
                                        </Table.Cell>
                                    :
                                    (value === 'AppName' && item[value])? //
                                        <Table.Cell key={j} textAlign='left' ref={cell => this.tableCell = cell} onClick={() => this.detailView(item)} style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <div style={{display:'flex', justifyContent:'row', wordBreak:'break-all'}}>
                                                 {String(item[value])}
                                            </div>
                                        </Table.Cell>
                                    :
                                    (value === 'Mapped_ports' && item[value])?
                                        <Table.Cell key={j} textAlign='left' style={(this.state.selectedItem == i)?{background:'#444'} :null} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <Icon name='server' size='big' onClick={() => this.onPortClick(value, item)} style={{cursor:'pointer'}}></Icon>
                                        </Table.Cell>
                                    :
                                    (value === 'CloudletLocation' && item[value])?
                                        <Table.Cell key={j} textAlign='left' onClick={() => this.detailView(item)} style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <div>
                                            {`Latitude : ${item[value].latitude}`} <br />
                                            {`Longitude : ${item[value].longitude}`}
                                            </div>
                                        </Table.Cell>
                                    :
                                    (value === 'IpAccess' && item[value])?
                                        <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)}  style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            {(item[value] == 0)? "IpAccessUnknown" : (item[value] == 1)? "Dedicated" : (item[value] == 2)? "IpAccessDedicatedOrShared" : (item[value] == 3)? "Shared" : item[value]}
                                            {/*{item[value]}*/}
                                        </Table.Cell>
                                    :
                                    (value === 'State' && item[value])?
                                        <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)}  style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            {(item[value] == 0)? "Tracked State Unknown" : (item[value] == 1)? "Not Present" : (item[value] == 2)? "Create Requested" : (item[value] == 3)? "Creating" : (item[value] == 4)? "Create Error" : (item[value] == 5)? "Ready" : (item[value] == 6)? "Update Requested" : (item[value] == 7)? "Updating" : (item[value] == 8)? "Update Error" : (item[value] == 9)? "Delete Requested" : (item[value] == 10)? "Deleting" : (item[value] == 11)? "Delete Error" : (item[value] == 12)? "Delete Prepare" : (item[value] == 13)? "CRM Init" : item[value]}
                                            {/*{item[value]}*/}
                                        </Table.Cell>
                                    :
                                    (value === 'Progress'  && (item['State'] == 3 || item['State'] == 7))?
                                        <Table.Cell key={j} textAlign='center' onClick={() => this.stateView(item,this.props.siteId,'', item['State'])}  style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <Popup content='View Progress' trigger={<Icon className={'progressIndicator'} loading size={12} color='green' name='circle notch' />} />
                                        </Table.Cell>
                                    :
                                    (value === 'Progress' && item['State'] == 5)?
                                        <Table.Cell key={j} textAlign='center' onClick={() => this.stateView(item,this.props.siteId, '',item['State'])}  style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <Icon className="progressIndicator" name='check' color='rgba(255,255,255,.5)' />
                                        </Table.Cell>
                                    :
                                    (value === 'Progress' && (item['State'] == 10 || item['State'] == 12))?
                                        <Table.Cell key={j} textAlign='center' onClick={() => this.stateView(item,this.props.siteId, '',item['State'])}  style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <Popup content='View Progress' trigger={<Icon className={'progressIndicator'} loading size={12} color='red' name='circle notch' />} />
                                        </Table.Cell>
                                    :
                                    (value.indexOf('Name')!==-1 || value === 'Cloudlet' || value === 'ClusterInst') ?
                                        <Table.Cell key={j} textAlign='left' ref={cell => this.tableCell = cell} onClick={() => this.detailView(item)} style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <div style={{display:'flex', alignContent:'Column', justifyContent:'flex-start', alignItems:'center', wordBreak:'break-all' }}>
                                                <div>{String(item[value])}</div>{(this.compareDate(item['Created']).new && value === 'Region') ? <div className="userNewMark" style={{marginLeft:5, fontSize:10, padding:'0 5px'}}>{`New`}</div> : null}
                                            </div>
                                        </Table.Cell>
                                    :
                                    (!( String(hidden).indexOf(value) > -1 )) ?
                                        <Table.Cell key={j} textAlign={'center'} ref={cell => this.tableCell = cell} onClick={() => this.detailView(item)} style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <div style={{display:'flex', alignContent:'Column', justifyContent:'center', alignItems:'center', wordBreak:'break-all' }}>
                                                <div>{String(item[value])}</div>{(this.compareDate(item['Created']).new && value === 'Region') ? <div className="userNewMark" style={{marginLeft:5, fontSize:10, padding:'0 5px'}}>{`New`}</div> : null}
                                            </div>
                                        </Table.Cell>
                                    : null
                                ))}
                            </Table.Row>
                        ))


                }
            </Table.Body>

        </Table>
    )
    handleMouseOverCell(value) {
        this.setState({tooltipMsg:value})
        ReactTooltip.rebuild()
        ReactTooltip.show(this.tooltipref)
    }
    successfully(msg) {
        //reload data of dummyData that defined props devData

        _self.props.handleRefreshData({params:{state:'refresh'}})
    }
    updateDimensions(e) {
        _self.setState({resize:e.currentTarget.innerHeight})
    }
    onCloseMap =()=> {
        let close = !this.state.closeMap;
        this.setState({closeMap:close})
    }
    receiveStatusData = (result, _item) => {
        console.log("__receiveStatusData",result,":::",_item)
        let toArray = null;
        let toJson = null;
        let count = 0;
        toArray = result.data.split('\n')
        toArray.pop();
        toJson = toArray.map((str)=>(JSON.parse(str)))
        toJson.map((item,i) => {
            if(item.data) {
                //console.log("successfullyzxxx111",item.data.message,":::",item.data.message.toLowerCase().indexOf('created successfully'))
                if(item.data.message.toLowerCase().indexOf('created') > -1 && item.data.message.toLowerCase().indexOf('successfully') > -1){
                    count++;
                    console.log("Created successfullyCreated successfully")
                    //setTimeout(() => {
                    //     if(_item.ClusterInst.indexOf('autocluster') > -1 && count == 2){
                    //         this.setAlertRefresh();
                    //         computeService.deleteTempFile(_item, this.props.siteId)
                    //     } else if(_item.ClusterInst.indexOf('autocluster') == -1 && count == 1) {
                    //         this.setAlertRefresh();
                    //         computeService.deleteTempFile(_item, this.props.siteId)
                    //     }
                    this.setAlertRefresh();
                    computeService.deleteTempFile(_item, this.props.siteId)
                    //}, 2000);
                    
                } else if(item.data.message.toLowerCase().indexOf('deleted cloudlet successfully') > -1){
                    console.log("Delete successfullyCreated successfully")
                    setTimeout(() => {
                        this.setAlertFailRefresh('Deleted cloudlet successfully');
                        computeService.deleteTempFile(_item, this.props.siteId)
                    }, 2000);
                }
            } else if(item.result && item.result.code == 400){
                console.log("failRefreshfailRefreshfailRefresh")
                setTimeout(() => {
                    this.setAlertFailRefresh(item.result.message);
                    computeService.deleteTempFile(_item, this.props.siteId)
                }, 3000);
            }
        })
        
    }

    receiveStatusAuto = (result, _item) => {
        console.log("receiveStatusAuto111",result,":::",_item)
        let toArray = null;
        let toJson = null;
        let count = 0;
        toArray = result.data.split('\n')
        toArray.pop();
        toJson = toArray.map((str)=>(JSON.parse(str)))
        toJson.map((item,i) => {
            if(item.data) {
                if(item.data.message.toLowerCase().indexOf('created successfully') > -1){
                    console.log("Created successfullyCreated successfully")
                    count++;
                    setTimeout(() => {
                        // this.setAlertRefresh();
                        // computeService.deleteTempFile(_item, this.props.siteId)
                        // this.props.handleAlertInfo('success',msg)
                        if(count == 1){
                            Alert.closeAll();
                            this.props.handleAlertInfo('success','Your auto cluster instance created successfully');
                            this.props.dataRefresh();
                            clearInterval(autoInter);
                        }
                         
                        
                    }, 0);
                    
                }
            }
        })
        
    }

    componentDidMount() {

        window.addEventListener("resize", this.updateDimensions);
        console.log('20191119 this.props.location---', this.props)
        if(this.props.location && this.props.location.pgname=='appinst'){
            this.autoClusterAlert(this.props.location.pgnameData)
        }
        if(this.props.viewMode !== this.state.viewMode) {
            console.log('20191119 this.props.viewMode', this.props.viewMode,"  :  " , this.props.submitObj)
            //alert('ddd'+this.props.viewMode)
            this.setState({dummyData:this.props.devData})
            this.forceUpdate();
        }
        //ServiceSocket.serviceStreaming('streamTemp');
    }
    componentWillUnmount() {
        //window.addEventListener("resize", this.updateDimensions);
        clearTimeout(this.interval)
        //this.props.handleSetHeader([])
        clearInterval(prgInter);
        clearInterval(_self.streamInterval);
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('20191119 viewmode-', nextProps.viewMode, ":", nextProps)
        //if(this.state.dummyData === nextProps.devData && this.state.changeRegion) return;
        console.log("20191119 ---- >>>> dummyDatadummyData",nextProps.devData,":", this.state.dummyData,": props submit obj == ", nextProps.submitObj)
        //if(this.state.dummyData === nextProps.devData && this.state.changeRegion) return;
        if(nextProps.devData.length > 0){


            nextProps.devData.map((item) => {
                console.log("20191119 item item..",item.State)
                if( (item.State == 3 || item.State == 7) && !this.state.stateCreate){
                    //this.setState({stateCreate:true})
                    //console.log("20191119 >>>> dummyDatadummyData",item)
                    //this.setState({stateCreate:item})
                    //this.props.dataRefresh();

                    /*
                    // code block by inki 20191120
                    prgInter = setInterval(() => {
                        if(!this.state.stateViewToggle){
                            computeService.creteTempFile(item, nextProps.siteId, this.receiveStatusData);
                        }
                    }, 3000);
                    */
                }
            })
        }

        if(nextProps.dataSort){
            this.setState({sorting:false,direction:null})
        }

        if(this.state.sorting) {
            return;
        }

        let cityCoordinates = []
        let filterList = []

        const reduceUp = (value) => {
            return Math.round(value)
        }
        
        if(nextProps.accountInfo){
            this.setState({ dimmer:'blurring', open: true })
        }
        if(nextProps.devData.length && !this.state.toggle) {
            this.setState({toggle:true})
            //set filtering
            let filteredData = [];
            if(this.state.dummyData.length === 0) {
                let headers = Object.keys(nextProps.devData[0])
                let filters = [];
                headers.map((item) => {
                    let _state = false;
                    this.props.hiddenKeys.map((hkey)=>{
                        if(item === hkey){
                            _state = true
                        }
                    })
                    filters.push({name:item, hidden:_state })
                })
                this.props.handleSetHeader(filters)
            }


            //remove item from object by key name
            /*******
             * filtering
             */

            // let newData = [];
            // let headers = Object.keys(nextProps.devData[0]);
            // let copyData = Object.assign([], nextProps.devData);
            // headers.map((item) => {
            //     let _state = false;
            //     this.props.hiddenKeys.map((hkey)=>{
            //         if(item === hkey){
            //             copyData.map((data) => {
            //                 delete data[hkey]
            //             })
            //         }
            //     })

            // })



            // this.setState({dummyData:copyData})


        }else {
            this.checkLengthData();
        }
        console.log("clickCityclickCity",nextProps.clickCity,":::",cityCoordinates)
        nextProps.clickCity.map((item) => {
            cityCoordinates.push(item.coordinates)
        })
        //if(nextProps.clickCityList !== this.props.clickCity && cityCoordinates[0]) {
        if(nextProps.clickCity.length > 0) {
            nextProps.devData.map((list)=>{
                let arr = [];
                arr.push(reduceUp(list.CloudletLocation.longitude))
                arr.push(reduceUp(list.CloudletLocation.latitude))
                if(arr[0] == cityCoordinates[0][0] && arr[1] == cityCoordinates[0][1]) {
                    filterList.push(list)
                }
            })
            console.log('20191119 filterList..', filterList)
            if(filterList && filterList[0]) {
                this.setState({changeRegion:filterList[0]['Region']})
            }
        } else {
            this.setState({changeRegion:null})
        }
        if(nextProps.clickCity.length == 0) {
            this.setState({dummyData:nextProps.devData})
        } else {
            this.setState({dummyData:filterList})
        }


        if(nextProps.stateStream) {
            //console.log('20191119 receive props in mapwidthlistview == ', nextProps.stateStream)
            this.setState({stateStream:nextProps.stateStream})
        }

        if(nextProps.resetMap) {
            this.setState({resetMap: nextProps.resetMap})
            this.forceUpdate()
        }


    }

    render() {
        const { open, dimmer, dummyData, resize, resetMap } = this.state;

        return (
                    <div style={{display:'flex', overflowY:'hidden', overflowX:'hidden', width:'100%'}}>
                        <RegistNewItem data={this.state.dummyData} dimmer={this.state.dimmer} open={this.state.open}
                                       selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                                       userToken={this.props.userToken}
                                       success={this.successfully} zoomIn={this.zoomIn} zoomOut={this.zoomOut} refresh={this.props.dataRefresh}
                        />

                        <DeleteItem open={this.state.openDelete}
                                    selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                                    success={this.successfully} refresh={this.props.dataRefresh}
                        ></DeleteItem>

                        <Container
                            layout={this.state.layout}
                            onLayoutChange={this.onLayoutChange}
                            {...this.props}
                            style={{justifyContent: 'space-between', width:'100%'}}
                        >

                            {this.generateDOM(open, dimmer, dummyData, resize, resetMap)}
                        </Container>

                        <PopDetailViewer data={this.state.detailViewData} dimmer={false} open={this.state.openDetail} close={this.closeDetail} centered={false} style={{right:400}}></PopDetailViewer>
                    </div>


        );
    }
    static defaultProps = {
        className: "layout",
        items: 20,
        rowHeight: 30,
        cols: 12,
        width: 1600,
        isDraggable:false,
        diffRev:[],
        dataSort:false
    };
}

const mapStateToProps = (state) => {
    console.log("statestatestate",state)
    let account = state.registryAccount.account;
    let dimm =  state.btnMnmt;
    let accountInfo = account ? account + Math.random()*10000 : null;
    let dimmInfo = dimm ? dimm : null;
    let viewMode = null;
    let detailData = null;
    if(state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
        detailData = state.changeViewMode.mode.data;
    }
    let deleteReset = state.deleteReset.reset
    let stateStream = state.stateStream ? state.stateStream.state : null;
    let submitObj = state.submitObj ? state.submitObj.submit : null;
    let resetMap = state.resetMap ? state.resetMap.region : null;
    return {
        accountInfo,
        dimmInfo,
        clickCity: state.clickCityList.list,
        deleteReset,
        stateStream,
        submitObj,
        viewMode : viewMode, detailData:detailData,
        resetMap
    }


};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleDetail: (data) => { dispatch(actions.changeDetail(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleRefreshData: (data) => { dispatch(actions.refreshData(data))},
        handleSetHeader: (data) => { dispatch(actions.tableHeaders(data))},
        handleAlertInfo: (mode,msg) => { dispatch(actions.alertInfo(mode,msg))},
        handleEditInstance: (data) => { dispatch(actions.editInstance(data))},
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data))},
        handleChangeClickCity: (data) => { dispatch(actions.clickCityList(data))},
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MapWithListView));


