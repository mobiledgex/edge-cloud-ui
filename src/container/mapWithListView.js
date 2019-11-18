import _ from 'lodash'
import React, {ReactDOM} from 'react';
import { Modal, Grid, Header, Button, Table, Menu, Icon, Input, Popup, Container, Sticky } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import ReactTooltip from 'react-tooltip'
import { connect } from 'react-redux';
import RGL, { WidthProvider } from "react-grid-layout";
import ContainerDimensions from 'react-container-dimensions';
import Alert from "react-s-alert";
import * as moment from 'moment';
import * as actions from '../actions';
import SelectFromTo from '../components/selectFromTo';
import RegistNewItem from './registNewItem';
import DeleteItem from './deleteItem';
import './styles.css';
import Tabulator from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator.min.css"; //import Tabulator stylesheet
import './tabulator.css'; // import Tabulator custom stylesheet
import ClustersMap from '../libs/simpleMaps/with-react-motion/index_clusters';
import VerticalLinearStepper from '../components/stepper';
import PopDetailViewer from './popDetailViewer';
import * as computeService from '../services/service_compute_service';
import MaterialIcon from 'material-icons-react';
import ReactJson from 'react-json-view'
import * as reducer from '../utils'

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
            tableData : [],
            tableDataOnce : false
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

        this.interval = null;

    }
    gotoUrl(site, subPath) {
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        //_self.props.handleChangeSite({mainPath:site, subPath: subPath});
    }

    onHandleEdit(data) {
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

        setTimeout(() => this.props.dataRefresh(), 1000)

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
    resetMap(detailMode) {
        _self.setState({sideVisible:detailMode})
    }
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

    generateDOM(open, dimmer, dummyData, resize) {
        return layout.map((item, i) => (

            (i === 1)?
                <div className="round_panel taContainer" key={i} >
                    {/* Tabulator */}
                    <div className={'tbParent'} ref={el => (this.el = el)} />
                </div>
                :
                <div className="round_panel" key={i} style={(!this.state.closeMap)?this.mapzoneStyle[0]:this.mapzoneStyle[1]}>
                    <div style={{margin:'0 0 5px 0', cursor:'pointer', display:'flex', alignItems:'column', justifyContent:'center'}} onClick={this.onCloseMap}>
                        <span style={{color:'#c8c9cb'}}>{(this.state.closeMap)?'Show map':'Hide map'}</span>
                        <Icon name={(this.state.closeMap)?'angle down':'angle up'}/>
                    </div>
                    <div className='panel_worldmap'>
                        <ContainerOne ref={ref => this.container = ref} {...this.props} gotoNext={this.gotoNext} zoomIn={this.zoomIn} zoomOut={this.zoomOut} resetMap={this.resetMap}></ContainerOne>
                    </div>
                </div>
        ))

    }

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
        _self.props.handleDetail({data:item, viewMode:'detailView'})
    }
    jsonView = (jsonObj) => (
        <ReactJson src={jsonObj} {...this.jsonViewProps} />
    )
    stateView(_item,_siteId,_auto) {
        console.log("stateViewstateView",_item,":::",_auto)
        Alert.closeAll();
        this.setState({stateViewToggle:true})
        Alert.info(
            <div className='ProgressBox' id='prgBox' style={{minWidth:250,maxHeight:500,overflow:'auto'}}>
                <VerticalLinearStepper item={_item} site={this.props.siteId} alertRefresh={this.setAlertRefresh}  failRefresh={this.setAlertFailRefresh} autoRefresh={this.setAlertAutoRefresh} auto={_auto}  />
            </div>, {
                position: 'top-right', timeout: 'none', limit:1,
                //onShow: this.setState({stateViewToggle:true}),
                onClose: this.proClose
            })
    }

    proClose = () => {
        this.setState({stateViewToggle:false})
    }

    setAlertRefresh = (alertMsg) => {
        let msg = '';
        let stateMsg = 'created'
        if(alertMsg == 'updated') stateMsg = alertMsg;
        clearInterval(prgInter);

        Alert.closeAll();
        if(this.props.siteId == 'ClusterInst') msg = 'Your cluster instance created successfully'
        else if(this.props.siteId == 'appinst') msg = 'Your app instance '+stateMsg+' successfully'
        else if(this.props.siteId == 'Cloudlet') msg = 'Cloudlet '+alertMsg.CloudletName+' created successfully.'
        this.props.handleAlertInfo('success',msg)

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

    autoClusterAlert = (_data) => {
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
                    this.setAlertRefresh();
                    computeService.deleteTempFile(_item, this.props.siteId)
                    this.setAlertRefresh(_item);
                    computeService.deleteTempFile(_item, this.props.siteId)                    
                } else if(item.data.message.toLowerCase().indexOf('deleted cloudlet successfully') > -1){
                    console.log("Delete successfullyCreated successfully")
                    setTimeout(() => {
                        this.setAlertFailRefresh('Deleted cloudlet successfully');
                        computeService.deleteTempFile(_item, this.props.siteId)
                    }, 2000);
                } else if(item.data.message.toLowerCase().indexOf('completed') > -1 && item.data.message.toLowerCase().indexOf('updated') > -1){
                    console.log("Updated AppInst")
                    setTimeout(() => {
                        this.setAlertRefresh('updated');
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

    makeTabulatorHeader(_keys, visibles) {
        let keys = Object.keys(_keys);
        //hide column filtered...
        let filteredKeys = (visibles) ? reducer.filterDefine(keys, visibles) : keys;
        return filteredKeys;
    }

    el = React.createRef();
    tabulator = null; //variable to hold your table
    printIcon (cell, formatterParams){
        return "<div class=\"userNewMark\">New</div>";
    };

    makeTable (devData, diffRev, siteId, mWidth, tbLayout) {
        // Tabluator
        _self.interval = setTimeout(() => {
            console.log("20191114 tableDataOncetableDataOncesf",_self.state.dummyData)
            if(devData.length && _self.state.dummyData.length && !_self.state.tableDataOnce){

                // _self.setState({tableDataOnce:true})
                let makeHeader = _self.makeTabulatorHeader(devData[0],_self.props.hiddenKeys)
                let hData = [];
                let count = 0;
                let btnGroup = (cell, formatterParams, onRendered) => {
                    count++;
                    let disBN = 'none';
                    diffRev.map((_diff) => {
                        if(localStorage.selectMenu == 'App Instances' && _diff.AppName == cell.getData()['AppName'] && _diff.Region == cell.getData()['Region'] && _diff.OrganizationName == cell.getData()['OrganizationName'] && _diff.Operator == cell.getData()['Operator'] && _diff.Cloudlet == cell.getData()['Cloudlet'] && _diff.ClusterInst == cell.getData()['ClusterInst'] && cell.getData()['State'] != 7) {
                            disBN = 'inline-block';
                        }
                    })
                    console.log("TabluatorTabluatorTabluator",disBN)
                    let MapDisabled = _self.props.dimmInfo.onlyView
                    return `<button style="display:${disBN}" class="ui teal button update">Update</button>
                            <button ${(MapDisabled)?"disabled":""} class="ui button trash" id="btnTrash${count}"><i aria-hidden="true" class="trash alternate icon"></i></button>`
                };
                let btnProgress = (cell, formatterParams, onRendered) => {
                    count++;
                    if(cell.getData().State == 5) return `<i aria-hidden="true" class="check icon progressIndicator"></i>`
                    else if(cell.getData().State == 3 || cell.getData().State == 7) return `<i aria-hidden="true" class="circle notch loading icon progressIndicator progressGreen"></i>`
                    else if(cell.getData().State == 10 || cell.getData().State == 12) return `<i aria-hidden="true" class="circle notch loading icon progressIndicator progressRed"></i>`
                };
                let location = (cell, formatterParams, onRendered) => {
                    return `<span>Latitude : ${cell.getData().CloudletLocation.latitude}<br/>Longitude : ${cell.getData().CloudletLocation.longitude}</span>`
                };

                let state = (cell, formatterParams, onRendered) => {
                    let _status = [
                        "Tracked State Unknown",// 0
                        "Not Present",// 1
                        "Create Requested",// 2
                        "Creating",// 3
                        "Create Error",// 4
                        "Ready",// 5
                        "Update Requested",// 6
                        "Updating",// 7
                        "Update Error",// 8
                        "Delete Requested",// 9
                        "Deleting",// 10
                        "Delete Error",// 11
                        "Delete Prepare"// 12
                    ]
                    let stateData = (cell.getData().State == '-')?'-':_status[cell.getData().State];

                    return `${stateData}`
                };
                let ipAccess = (cell, formatterParams, onRendered) => {
                    let _ipAccess = [
                        "IpAccessUnknown",
                        "Dedicated",
                        "IpAccessDedicatedOrShared",
                        "Shared"
                    ]
                    return `${_ipAccess[cell.getData().IpAccess]}`
                };
                //this.onUseOrg(item,i, evt)
                _self.setState({tableData:devData})
                makeHeader.map((item) => {
                    hData.push(
                        (item == 'Edit')?
                            {title:'Actions', field:item, align:"center", width: 150, formatter:btnGroup, cellClick:function(e, cell){
                                    e.stopPropagation();
                                    if(e.target.className.indexOf('trash') > -1){ //trash
                                        _self.setState({openDelete: true, selected:cell.getData()});
                                    }
                                    if(e.target.className.indexOf('update') > -1){ //update
                                        _self.onHandleEdit(cell.getData())
                                    }
                                }}
                            :
                            (item == 'Progress')?
                                {title:item, field:item, align:"center", width: 120, formatter:btnProgress, cellClick:function(e, cell){
                                        if(e.target.className.indexOf('progressIndicator') > -1){ //progress
                                            e.stopPropagation();
                                            _self.stateView(cell.getData(),siteId)
                                        }
                                    }}
                                :
                                (item == 'CloudletLocation')?
                                    {title:item, field:item, align:"left", formatter:location}
                                    :
                                    (item == 'State')?
                                        {title:item, field:item, align:"left", formatter:state}
                                        :
                                        (item == 'IpAccess')?
                                            {title:item, field:item, align:"left", formatter:ipAccess}
                                            :
                                            {title:item, field:item, align:"left"}
                    )
                })
                hData.map((item,i) => {
                    item['minWidth'] = mWidth[i];
                })

                /////////////////
                // check new update
                console.log('20191116 dummyData == ', _self.state.dummyData)

                /////////////////
                _self.tabulator = new Tabulator(_self.el, {
                    height:"100%",
                    data: _self.state.dummyData,//devData, //link data to table
                    layout:tbLayout,
                    columns: hData,
                    movableColumns: true,
                    // columnMinWidth:200,
                    rowClick:function(e, row){
                        let data = row.getData();
                        _self.detailView(data)
                    },
                });

                let tbDom = document.getElementsByClassName('taContainer');
                let clWidth = tbDom.clientWidth;
                let windowW = window.innerWidth +250;
                let offsetW = windowW-clWidth;
                console.log('20191116 tb container  ', windowW,":",clWidth,":",offsetW)

                if(tbLayout === 'fitColumns') {

                    //tbDom.scrollLeft = (offsetW)*-1
                    //tbDom.style.width = (clWidth + offsetW) +'px';
                    _self.tabulator.moveColumn("CloudletLocation", "Actions", true)

                } else {
                    //document.getElementsByClassName('tbParent')[0].style.transform = "translateX("+(offsetW)+"px)"
                    //document.getElementsByClassName('tbParent')[0].style.width = (clWidth) +'px';
                }


            }
        }, 100);
    }
    componentDidMount() {
        if(this.props.devData && this.props.devData.length){
            console.log('20191114 did mount in  -------', this.props.devData,":",this.props.diffRev,":", this.props.siteId,":", this.props.mWidth)
            this.setState({dummyData:_self.props.devData})
            setTimeout(() => _self.makeTable(_self.props.devData, _self.props.diffRev, _self.props.siteId, _self.props.mWidth),300);
        }
        let self = this;
        //window.addEventListener("resize", this.updateDimensions);
        if(this.props.location && this.props.location.pgname=='appinst'){
            this.autoClusterAlert(this.props.location.pgnameData)
        }
    }
    componentWillUnmount() {
        //window.addEventListener("resize", this.updateDimensions);
        clearTimeout(this.interval)
        //this.props.handleSetHeader([])
        clearInterval(prgInter);

    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('20191115 receive props in mapwidthlistview....', nextProps)
        let tbLayout = 'fitDataFill'
        if(nextProps.changeStep) {
            console.log('20191115 inside list view ', 'fitColumns')
            tbLayout = 'fitColumns'
        } else {
            console.log('20191115 inside list view ', 'fitDataFill')
            tbLayout = 'fitColumns'
        }

        this.makeTable(nextProps.devData, nextProps.diffRev, nextProps.siteId, nextProps.mWidth, tbLayout)
        if(nextProps.devData.length > 0){
            nextProps.devData.map((item) => {
                //console.log("dummyDatadummyData",item.State)
                if( (item.State == 3 || item.State == 7) && !this.state.stateCreate){
                    this.setState({stateCreate:true})
                    //this.setState({stateCreate:item})
                    //this.props.dataRefresh();
                    prgInter = setInterval(() => {
                        if(!this.state.stateViewToggle){
                            computeService.creteTempFile(item, nextProps.siteId, this.receiveStatusData);
                        }
                    }, 3000);
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
        }
        if(nextProps.clickCity.length == 0) {
            this.setState({dummyData:nextProps.devData})
        } else {
            this.setState({dummyData:filterList})
        }

    }

    render() {
        const { open, dimmer, dummyData, resize } = this.state;
        return (
            <div style={{display:'flex', overflowY:'hidden', overflowX:'hidden', width:'100%'}}>
                <RegistNewItem data={this.state.dummyData} dimmer={this.state.dimmer} open={this.state.open}
                               selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                               userToken={this.props.userToken}
                               success={this.successfully} zoomIn={this.zoomIn} zoomOut={this.zoomOut} resetMap={this.resetMap} refresh={this.props.dataRefresh}
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

                    {this.generateDOM(open, dimmer, dummyData, resize)}
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

    let account = state.registryAccount.account;
    let dimm =  state.btnMnmt;
    let accountInfo = account ? account + Math.random()*10000 : null;
    let dimmInfo = dimm ? dimm : null;
    let deleteReset = state.deleteReset.reset;
    let viewMode = null;

    if(state.changeViewMode.mode && state.changeViewMode.mode.viewMode) {
        viewMode = state.changeViewMode.mode.viewMode;
    }

    console.log("20191114 mapProps statestatestate<<<<<<<<<<,",account,":",dimm,":",deleteReset,":",viewMode)
    return {
        accountInfo,
        dimmInfo,
        clickCity: state.clickCityList.list,
        deleteReset,
        viewMode:viewMode,
        loadingSpinner : state.loadingSpinner.loading?state.loadingSpinner.loading:null,
        changeStep: (state.changeStep.step)?state.changeStep.step:null,
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
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MapWithListView));


