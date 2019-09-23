import _ from 'lodash'
import React from 'react';
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
import ClustersMap from '../libs/simpleMaps/with-react-motion/index_clusters';
import VerticalLinearStepper from '../components/stepper';
import PopDetailViewer from './popDetailViewer';
import * as computeService from '../services/service_compute_service';
import MaterialIcon from 'material-icons-react';
import ReactJson from 'react-json-view'
import * as aggregate from '../utils'

const ReactGridLayout = WidthProvider(RGL);
let prgInter = null;

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
            stateViewToggle:false
            
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

    }
    gotoUrl(site, subPath) {
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:site, subPath: subPath});
    }

    onHandleClick(dim, data) {
        //this.setState({ dimmer:dim, open: true, selected:data })
        this.props.handleEditInstance(data);
        this.gotoUrl('/site4', 'pg=editAppInst')
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
        if ((column !== clickedColumn) && dummyData) {
            let sorted = _.sortBy(dummyData, [clm => typeof clm[clickedColumn] === 'string' ? String(clm[clickedColumn]).toLowerCase(): clm[clickedColumn]])
            this.setState({
                column: clickedColumn,
                dummyData: sorted,
                direction: 'ascending',
            })
        } else {
            let reverse = dummyData.reverse()
            this.setState({
                dummyData: reverse,
                direction: direction === 'ascending' ? 'descending' : 'ascending',
            })

        }

        //setTimeout(() => _self.setState({sorting : false}), 1000)
    }
    generateStart () {

        (this.state.dummyData.length) ? this.setState({noData: false}) : this.setState({noData: true})
    }
    checkLengthData() {
        this.setState({noData:false})
        setTimeout(() => this.generateStart(), 2000)
    }

    generateDOM(open, dimmer, randomValue, dummyData, resize) {
        return layout.map((item, i) => (

            (i === 1)?
                <div className="round_panel" key={i} >

                    <div className="grid_table" style={{overflow:'hidden'}}>
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
                        <ContainerOne ref={ref => this.container = ref} {...this.props} gotoNext={this.gotoNext} zoomIn={this.zoomIn} zoomOut={this.zoomOut} resetMap={this.resetMap}></ContainerOne>
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
                    {key}
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
    stateView(_item,_siteId) {
        Alert.closeAll();
        //clearInterval(prgInter);
        this.setState({stateViewToggle:true})
        Alert.info(
            <div className='ProgressBox' id='prgBox' style={{minWidth:250,maxHeight:500,overflow:'auto'}}>
                <VerticalLinearStepper item={_item} site={this.props.siteId} alertRefresh={this.setAlertRefresh}  failRefresh={this.setAlertFailRefresh}  />
            </div>, {
            position: 'top-right', timeout: 'none', limit:1,
            //onShow: this.setState({stateViewToggle:true}),
            onClose: this.proClose
        })
    }

    proClose = () => {
        this.setState({stateViewToggle:false})
    }

    setAlertRefresh = () => {
        let msg = '';
        console.log("setAlertRefresh")
        clearInterval(prgInter);
        this.props.dataRefresh();
        Alert.closeAll();
        if(this.props.siteId == 'ClusterInst') msg = 'Your cluster instance created successfully'
        else if(this.props.siteId == 'appinst') msg = 'Your app instance created successfully'
        else if(this.props.siteId == 'Cloudlet') msg = 'Your cloudlet created successfully'

        this.props.handleAlertInfo('success',msg)
        
    }

    setAlertFailRefresh = (msg) => {
        console.log("setAlertFailRefresh")
        clearInterval(prgInter);
        this.props.dataRefresh();
        Alert.closeAll();
        this.props.handleAlertInfo('error',msg)
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
                                            {/* {(String(item[value]).indexOf('Editable') > -1 && localStorage.selectRole === 'AdminManager') ? <Button key={`key_${j}`} color='teal' onClick={() => this.onHandleClick(true, item)}><Icon name={'edit'}/></Button> : null} */}
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
                                            {`Latitude : ${Math.round(item[value].latitude)}`} <br />
                                            {`Longitude : ${Math.round(item[value].longitude)}`}
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
                                            {(item[value] == 0)? "Tracked State Unknown" : (item[value] == 1)? "Not Present" : (item[value] == 2)? "Create Requested" : (item[value] == 3)? "Creating" : (item[value] == 4)? "Create Error" : (item[value] == 5)? "Ready" : (item[value] == 6)? "Update Requested" : (item[value] == 7)? "Updating" : (item[value] == 8)? "Update Error" : (item[value] == 9)? "Delete Requested" : (item[value] == 10)? "Deleting" : (item[value] == 11)? "Delete Error" : (item[value] == 12)? "Delete Prepare" : item[value]}
                                            {/*{item[value]}*/}
                                        </Table.Cell>
                                    :
                                    (value === 'Progress'  && item['State'] == 3)?
                                        <Table.Cell key={j} textAlign='center' onClick={() => this.stateView(item,this.props.siteId)}  style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <Popup content='View Progress' trigger={<Icon className={'progressIndicator'} loading size={12} color='green' name='circle notch' />} />
                                        </Table.Cell>
                                    :
                                    (value === 'Progress' && item['State'] == 5)?
                                        <Table.Cell key={j} textAlign='center' onClick={() => this.stateView(item,this.props.siteId)}  style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <Icon className="progressIndicator" name='check' color='rgba(255,255,255,.5)' />
                                        </Table.Cell>
                                    :
                                    (value === 'Progress' && (item['State'] == 10 || item['State'] == 12))?
                                        <Table.Cell key={j} textAlign='center' onClick={() => this.stateView(item,this.props.siteId)}  style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
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

        let toArray = null;
        let toJson = null;
        toArray = result.data.split('\n')
        toArray.pop();
        toJson = toArray.map((str)=>(JSON.parse(str)))
        toJson.map((item,i) => {
            if(item.data) {
                //console.log("successfullyzxxx111",item.data.message,":::",item.data.message.toLowerCase().indexOf('created successfully'))
                if(item.data.message.toLowerCase().indexOf('created successfully') > -1){
                    //clearInterval(prgInter);
                    console.log("Created successfullyCreated successfully")
                    setTimeout(() => {
                        this.setAlertRefresh();
                        computeService.deleteTempFile(_item, this.props.siteId)
                    }, 2000);
                } else if(item.data.message.toLowerCase().indexOf('deleted cloudlet successfully') > -1){
                    //clearInterval(prgInter);
                    console.log("Delete successfullyCreated successfully")
                    setTimeout(() => {
                        this.setAlertFailRefresh('Deleted cloudlet successfully');
                        computeService.deleteTempFile(_item, this.props.siteId)
                    }, 2000);
                }
            } else if(item.result && item.result.code == 400){
                //clearInterval(prgInter);
                console.log("failRefreshfailRefreshfailRefresh")
                setTimeout(() => {
                    this.setAlertFailRefresh(item.result.message);
                    computeService.deleteTempFile(_item, this.props.siteId)
                }, 3000);
            }
        })
        
    }
    componentDidMount() {
        let self = this;
        window.addEventListener("resize", this.updateDimensions);
    }
    componentWillUnmount() {
        window.addEventListener("resize", this.updateDimensions);
        //alert('unmount map with list view')
        this.props.handleSetHeader([])
    }
    componentDidUpdate(prevProps, prevState, snapshot) {
    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log("sdsdsdsfaf",nextProps)

        if(this.state.dummyData.length > 0){
            this.state.dummyData.map((item) => {
                //console.log("dummyDatadummyData",item.State)
                if(item.State == 3 && !this.state.stateCreate){
                    this.setState({stateCreate:true})
                    console.log("dummyDatadummyData",item)
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
        const {randomValue} = this.props;
        
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

                            {this.generateDOM(open, dimmer, randomValue, dummyData, resize)}
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
        isDraggable:false
    };
}

const mapStateToProps = (state) => {
    console.log("statestatestate",state)
    let account = state.registryAccount.account;
    let dimm =  state.btnMnmt;
    let accountInfo = account ? account + Math.random()*10000 : null;
    let dimmInfo = dimm ? dimm : null;
    let viewMode = null;
    let deleteReset = state.deleteReset.reset
    return {
        accountInfo,
        dimmInfo,
        clickCity: state.clickCityList.list,
        deleteReset
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
        handleEditInstance: (data) => { dispatch(actions.editInstance(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MapWithListView));


