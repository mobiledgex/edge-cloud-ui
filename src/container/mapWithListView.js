import _ from 'lodash'
import React from 'react';
import { Modal, Grid, Header, Button, Table, Menu, Icon, Input, Popup, Container, Sticky } from 'semantic-ui-react';

import ReactTooltip from 'react-tooltip'
import { connect } from 'react-redux';
import RGL, { WidthProvider } from "react-grid-layout";
import ContainerDimensions from 'react-container-dimensions';
import Alert from "react-s-alert";
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

const ReactGridLayout = WidthProvider(RGL);


const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 20;

var layout = [
    {"w":24,"h":9,"x":0,"y":0,"i":"0","minW":5,"minH":8,"moved":false,"static":false, "title":"LocationView"},
    {"w":24,"h":11,"x":0,"y":9,"i":"1","minW":8,"minH":6,"moved":false,"static":false, "title":"Developer"}
]
const override = {
    display: 'fixed',
    position:'absolute',
    margin: '0 auto',
    borderColor: 'red'
}

const MyCustomContentTemplate = (item) => {
    console.log("mycuster@@",item)
    
    return (
        <div className='ProgressBox'>
            <VerticalLinearStepper style={{width:'100%'}} item={item} />
            {/* <button className="customButton" onClick={handleConfirm.bind(this)}>Confirm</button> */}
            <span className='s-alert-close'></span>
        </div>
    );
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
            cInstStatus:{},
            noData:false
        };

        _self = this;

    }

    onHandleClick(dim, data) {
        console.log('on handle click == ', data)
        this.setState({ dimmer:dim, open: true, selected:data })
    }


    onItemOver(itemData,key, evt) {
        console.log('11',itemData,'22',this.state,'33',key)

        this.setState({selectedItem:key})
        // this.state.orgData.data.map((item,i) => {
        //     if(item.org == useData.Organization) {
        //         console.log('item role =',item.role)
        //         this.props.handleUserRole(item.role)
        //     }
        // })

        // this.props.handleBlinkMark(true)

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
    handleSort = clickedColumn => () => {
        const { column, dummyData, direction } = this.state

        if (column !== clickedColumn) {
            this.setState({
                column: clickedColumn,
                dummyData: _.sortBy(dummyData, [clickedColumn]),
                direction: 'ascending',
            })

            return
        }

        this.setState({
            dummyData: dummyData.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }
    generateStart () {

        (this.state.dummyData.length) ? this.setState({noData: false}) : this.setState({noData: true})
    }
    checkLengthData() {
        this.setState({noData:false})
        setTimeout(() => this.generateStart(), 2000)
    }

    generateDOM(open, dimmer, width, height) {
        return layout.map((item, i) => (

            (i === 1)?
                <div className="round_panel" key={i} style={{display:'flex', flexDirection:'column', width:'100%', height:'100%'}} >

                    <div className="grid_table" style={{width:'100%', height:height, overflowY:'auto'}}>
                        {(this.state.dummyData.length)?
                            this.TableExampleVeryBasic(width, height, this.props.headerLayout, this.props.hiddenKeys) :
                            (this.state.noData)?<div style={{padding:20}}>When you click the New button, the Create New tab appears as the default view.</div>:null
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
                <div className="round_panel" key={i} style={{display:'flex', flexDirection:'column', width:'100%', height:'100%'}} >
                    <div className='panel_worldmap' style={{width:'100%', height:'100%'}}>
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
        console.log('default width header -- ', widthDefault)
        return keys.map((key, i) => (
            (!( String(hidden).indexOf(key) > -1 ))?
                (i === keys.length -1) ?
                <Table.HeaderCell key={i} className='unsortable' width={2} textAlign='center'>
                    {key}
                </Table.HeaderCell>
                :
                <Table.HeaderCell key={i} className={(key === 'CloudletLocation' || key === 'Edit' || key === 'Progress')?'unsortable':''} textAlign='center' width={(headL)?headL[i]:widthDefault} sorted={column === key ? direction : null} onClick={(key == 'CloudletLocation' || key == 'Edit' || key == 'Progress')?null:this.handleSort(key)}>
                    {(key === 'CloudletName')? 'Cloudlet Name'
                        : (key === 'CloudletLocation')? 'Cloudlet Location'
                            : (key === 'ClusterName')? 'Cluster Name'
                                : (key === 'OrganizationName')? 'Organization Name'
                                    : (key === 'IpAccess')? 'Ip Access'
                                        : (key === 'AppName')? 'App Name'
                                            : (key === 'ClusterInst')? 'Cluster Inst'
                    : key}
                </Table.HeaderCell>
            :
                null
        ));
    }

    onLayoutChange(layout) {
        //this.props.onLayoutChange(layout);
        console.log('changed layout = ', JSON.stringify(layout))
    }
    onPortClick(a,b) {
        alert(b[a])
    }
    detailView(item) {
        //change popup to page view
        console.log('=============  mapWithListView..detailView')
        _self.props.handleDetail({data:item, viewMode:'detailView'})
    }
    stateView(item) {
        this.setState({cInstStatus:item})
        //Call ClusterInst Show
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        console.log("dddddd@@",this.props)
        if(this.props.siteId == 'ClusterInst') {
            computeService.getMCService('ShowClusterInst',{token:store.userToken, region:'US'}, _self.receiveResultClusterInst)
        } else if(this.props.siteId == 'appinst') {
            computeService.getMCService('ShowAppInst',{token:store.userToken, region:'US'}, _self.receiveResultAppInst)
        }
    }

    receiveResultClusterInst = (result) => {
        console.log("result@@@@",result,this.state.cInstStatus)
        let cData = null;
        result.map((item,i) => {
            if(item.ClusterName == this.state.cInstStatus.ClusterName) {
                cData = item
            }
        })
        console.log("cData@@@",cData)
        if(cData.Status.task_number === 1){
            localStorage.setItem('clusterinstCreateStep', cData.Status.task_name)
        }
        Alert.info(<MyCustomContentTemplate item={cData} site={this.props.siteId}/>, {
            position: 'top-right', timeout: 'none', limit:1,
            customFields: {
                stateLevel: 1
            }
        })
    }

    receiveResultAppInst = (result) => {
        console.log("result@@@@",result,this.state.cInstStatus)
        let cData = null;
        result.map((item,i) => {
            if(item.AppName == this.state.cInstStatus.AppName) {
                cData = item
            }
        })
        console.log("cData@@@",cData)
        if(cData.Status.task_number === 1){
            localStorage.setItem('clusterinstCreateStep', cData.Status.task_name)
        }
        Alert.info(<MyCustomContentTemplate item={cData} site={this.props.siteId}/>, {
            position: 'top-right', timeout: 'none', limit:1,
            customFields: {
                stateLevel: 1
            }
        })
    }

    TableExampleVeryBasic = (w, h, headL, hidden) => (
        <Table className="viewListTable" basic='very' striped celled fixed sortable ref={ref => this.viewListTable = ref} style={{width:'100%'}}>
            <Table.Header className="viewListTableHeader"  style={{width:'100%'}}>
                <Table.Row onMouseOver={() => console.log('onMouseOver..')}>
                    {(this.state.dummyData.length > 0)?this.makeHeader(this.state.dummyData[0], headL, hidden):null}
                </Table.Row>
            </Table.Header>
            <Table.Body className="tbBodyList">
                {   
                
                    //(!this.state.dummyData[0].ClusterName && !this.state.dummyData[0].Developer) ?
                    //(this.state.dummyData[0][Object.keys(this.state.dummyData[0])[0]] !== "") ?
                    ((this.state.dummyData[0])?this.state.dummyData[0][Object.keys(this.state.dummyData[0])[0]]:true) ?
                        this.state.dummyData.map((item, i) => (
                            <Table.Row key={i}>
                                {Object.keys(item).map((value, j) => (
                                    (value === 'Edit')?
                                        <Table.Cell key={j} textAlign='center' style={(this.state.selectedItem == i)?{whiteSpace:'nowrap',background:'#444'} :{whiteSpace:'nowrap'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <Button disabled style={{display:'none'}} key={`key_${j}`} color='teal' onClick={() => this.onHandleClick(true, item)}>Edit</Button>
                                            <Button disabled={this.props.dimmInfo.onlyView} onClick={() => this.setState({openDelete: true, selected:item})}><Icon name={'trash alternate'}/></Button>
                                        </Table.Cell>
                                    :
                                    (value === 'Mapped_ports')?
                                        <Table.Cell key={j} textAlign='left' style={(this.state.selectedItem == i)?{background:'#444'} :null} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <Icon name='server' size='big' onClick={() => this.onPortClick(value, item)} style={{cursor:'pointer'}}></Icon>
                                        </Table.Cell>
                                    :
                                    (value === 'CloudletLocation')?
                                        <Table.Cell key={j} textAlign='left' onClick={() => this.detailView(item)} style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <div ref={ref => this.tooltipref = ref}  data-tip='tooltip' data-for='happyFace'>
                                            {
                                                `Latitude : ${item[value].latitude}
                                                Longitude : ${item[value].longitude}`
                                            }
                                            </div>
                                        </Table.Cell>
                                    :
                                    (value === 'IpAccess')?
                                        <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)}  style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            {(item[value] == 0)? "IpAccessUnknown" : (item[value] == 1)? "IpAccessDedicated" : (item[value] == 2)? "IpAccessDedicatedOrShared" : (item[value] == 3)? "IpAccessShared" : item[value]}
                                            {/*{item[value]}*/}
                                        </Table.Cell>
                                    :
                                    (value === 'State')?
                                        <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)}  style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            {(item[value] == 1)? "NotPresent" : (item[value] == 2)? "CreateRequested" : (item[value] == 3)? "Creating" : (item[value] == 4)? "CreateError" : (item[value] == 5)? "Ready" : (item[value] == 6)? "UpdateRequested" : (item[value] == 7)? "Updating" : (item[value] == 8)? "UpdateError" : (item[value] == 9)? "DeleteRequested" : (item[value] == 10)? "Deleting" : (item[value] == 11)? "DeleteError" : (item[value] == 12)? "DeletePrepare" : item[value]}
                                            {/*{item[value]}*/}
                                        </Table.Cell>
                                    :
                                    (value === 'Progress' && item['State'] == 3)?
                                        <Table.Cell key={j} textAlign='center' onClick={() => this.stateView(item)}  style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <Popup content='View Progress' trigger={<Icon loading size={12} color='green' name='circle notch' />} />
                                        </Table.Cell>
                                    :
                                    (value === 'Progress' && item['State'] == 5)?
                                        <Table.Cell key={j} textAlign='center' onClick={() => this.stateView(item)}  style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <MaterialIcon icon='done' color='white' />
                                        </Table.Cell>
                                    :
                                    (value === 'Progress' && (item['State'] == 10 || item['State'] == 12))?
                                        <Table.Cell key={j} textAlign='center' onClick={() => this.stateView(item)}  style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <Popup content='View Progress' trigger={<Icon loading size={12} color='red' name='circle notch' />} />
                                        </Table.Cell>
                                    :
                                    (!( String(hidden).indexOf(value) > -1 )) ?
                                        <Table.Cell key={j} textAlign={(value === 'Region')?'center':(j === 0 || value.indexOf('Name')!==-1)?'left':'center'} ref={cell => this.tableCell = cell} onClick={() => this.detailView(item)} style={(this.state.selectedItem == i)?{background:'#444',cursor:'pointer'} :{cursor:'pointer'}} onMouseOver={(evt) => this.onItemOver(item,i, evt)}>
                                            <div ref={ref => this.tooltipref = ref}  data-tip='tooltip' data-for='happyFace'>
                                            {String(item[value])}
                                            </div>
                                        </Table.Cell>
                                    : null
                                ))}
                            </Table.Row>
                        ))
                    : <Table.Row>
                        <Table.Cell colSpan={Object.keys(this.state.dummyData[0]).length} textAlign='center' style={{fontSize:'1em'}}>
                            -
                        </Table.Cell>
                    </Table.Row>

                }
            </Table.Body>

        </Table>
    )
    handleMouseOverCell(value) {
        console.log('mouse over cell ', value, 'tooltip = ', this.tooltipref)
        this.setState({tooltipMsg:value})
        ReactTooltip.rebuild()
        ReactTooltip.show(this.tooltipref)
    }
    successfully(msg) {
        //reload data of dummyData that defined props devData

        _self.props.handleRefreshData({params:{state:'refresh'}})
    }

    componentDidMount() {
        let self = this;
        setTimeout(() => self.setState({tooltipVisible:true}), 1000)

    }
    // componentDidUpdate(prevProps, prevState, snapshot) {
    //     console.log('-----component did update ------', prevState.dummyData, this.state.dummyData)
    // }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('nextProps--------', nextProps,this.props.clickCity)

        let cityCoordinates = []
        let filterList = []

        const reduceUp = (value) => {
            return Math.round(value)
        }
        
        if(nextProps.accountInfo){
            this.setState({ dimmer:'blurring', open: true })
        }
        if(nextProps.devData.length) {
            this.setState({dummyData:nextProps.devData})
        }else {
            this.checkLengthData();
        }

        nextProps.clickCity.map((item) => {
            cityCoordinates.push(item.coordinates)
        })
        if(nextProps.clickCityList !== this.props.clickCity && cityCoordinates[0]) {
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
        const { open, dimmer } = this.state;
        return (
            <ContainerDimensions>
                { ({ width, height }) =>
                    <div style={{width:width, height:height, display:'flex', overflowY:'auto', overflowX:'hidden'}}>
                        <RegistNewItem data={this.state.dummyData} dimmer={this.state.dimmer} open={this.state.open}
                                       selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                                       userToken={this.props.userToken}
                                       success={this.successfully} zoomIn={this.zoomIn} zoomOut={this.zoomOut} resetMap={this.resetMap} refresh={this.props.dataRefresh}
                        />

                        <DeleteItem open={this.state.openDelete}
                                    selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                                    success={this.successfully} refresh={this.props.dataRefresh}
                        ></DeleteItem>

                        <ReactGridLayout
                            layout={this.state.layout}
                            onLayoutChange={this.onLayoutChange}
                            {...this.props}
                            style={{width:width, height:height-20}}
                        >
                            {this.generateDOM(open, dimmer, width, height)}
                        </ReactGridLayout>

                        <PopDetailViewer data={this.state.detailViewData} dimmer={false} open={this.state.openDetail} close={this.closeDetail} centered={false} style={{right:400}}></PopDetailViewer>
                    </div>

                }
            </ContainerDimensions>

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
    let account = state.registryAccount.account;
    let dimm =  state.btnMnmt;
    console.log('account -- '+account)
    console.log(state)
    let accountInfo = account ? account + Math.random()*10000 : null;
    let dimmInfo = dimm ? dimm : null;
    let viewMode = null;
    return {
        accountInfo,
        dimmInfo,
        clickCity: state.clickCityList.list
    }


};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleDetail: (data) => { dispatch(actions.changeDetail(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleRefreshData: (data) => { dispatch(actions.refreshData(data))},
        handleBlinkMark: (data) => { dispatch(actions.blinkMark(data))}

    };
};

export default connect(mapStateToProps, mapDispatchProps)(MapWithListView);


