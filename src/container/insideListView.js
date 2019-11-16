import React from 'react';
import { Modal, Grid, Header, Button, Table, Popup, Icon, Input, Dropdown, Container } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import SelectFromTo from '../components/selectFromTo';
import RegistNewListItem from './registNewListItem';
import PopDetailViewer from './popDetailViewer';
import PopUserViewer from './popUserViewer';
import PopAddUserViewer from './popAddUserViewer';
import DeleteItem from './deleteItem';
import './styles.css';
import Tabulator from "tabulator-tables"; //import Tabulator library
import "tabulator-tables/dist/css/tabulator.min.css"; //import Tabulator stylesheet
import './tabulator.css'; // import Tabulator custom stylesheet
import ContainerDimensions from 'react-container-dimensions'
import _ from "lodash";
import * as reducer from '../utils'
import MaterialIcon from "material-icons-react";
import * as services from '../services/service_compute_service';
const ReactGridLayout = WidthProvider(RGL);

const appssEdit = [
    {key: 'launch', text:'Launch', icon:null},
    {key: 'update', text:'Update', icon:null},
    {key: 'delete', text:'Delete', icon:'trash alternate'},
]
const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 20;
var layout = [
    {"w":19,"h":20,"x":0,"y":0,"i":"0","minW":8,"minH":5,"moved":false,"static":false, "title":"Developer"}
]
let _self = null;

class InsideListView extends React.Component {
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
            selectUse:null,
            resultData:null,
            openDelete:false,
            isDraggable: false,
            noData:false,
            viewMode:'listView',
            selectedRole:null,
            isOpen: false,
            isOpenTip:false,
            actionContextRef:'actionCell_0',
            item:null,
            tableData : [],
            tabulatorLayout:'fitDataFill'
        };
        this.sorting = false;

    }
    gotoUrl(site, subPath, pg) {
        _self.props.history.push({
            pathname: site,
            search: subPath,
            goBack: pg
        });
        _self.props.history.location.search = subPath;
        //_self.props.handleChangeSite({mainPath:site, subPath: subPath})
    }

    onHandleClick(dim, data) {
        //this.setState({ dimmer:dim, open: true, selected:data })
        this.props.handleEditInstance(data);
        this.gotoUrl('/site4', 'pg=editApp')
    }
    onHandleClickAdd(dim, data) {
        this.setState({ dimmer:dim, openAdd: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }
    onHandleClickAddApp(dim, data) {
        this.setState({page:'pg=createAppInst'})
    }

    onUseOrg(useData,key, evt) {

        this.setState({selectUse:key})
        if(this.props.roleInfo) {
            this.props.roleInfo.map((item,i) => {
                if(i == key) {
                    this.props.handleUserRole(item.role)
                    localStorage.setItem('selectOrg', useData.Organization)
                    localStorage.setItem('selectRole', item.role)
                }
            })

            this.props.handleSelectOrg(useData)
        } else {
            console.log('Error: There is no orgData')
        }

        
    }
    
    show = (dim) => this.setState({ dimmer:dim, openDetail: true })
    close = () => {
        this.setState({ open: false, openDelete: false, selected:{} })
        this.props.handleInjectDeveloper(null)
    }
    closeDetail = () => {
        this.setState({ openDetail: false })
    }
    closeUser = () => {
        this.setState({ openUser: false })
    }
    closeAddUser = () => {
        this.setState({ openAdd: false })
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
    generateStart () {

        (this.state.dummyData.length) ? this.setState({noData: false}) : this.setState({noData: true})
    }
    checkLengthData() {
        this.setState({noData:false})
        setTimeout(() => this.generateStart(), 2000)
    }
     generateDOM(open, dimmer, hideHeader) {
        return layout.map((item, i) => (

            (i === 0)?
                <div className="round_panel" key={i} style={{display:'flex', flexDirection:'column'}} >
                    {/* Tabulator */}
                    <div ref={el => (this.el = el)} />
                </div>
                :
                <div className="round_panel" key={i} style={{display:'flex', flexDirection:'column'}} >
                    <div style={{width:'100%', height:'100%', overflowY:'auto'}}>
                        Map viewer
                    </div>
                </div>


        ))
    }

    generateLayout() {
        const p = this.props;

        return layout
    }

    handleSort = clickedColumn => (a) => {

        this.sorting = true;
        const { column, dummyData, direction } = _self.state
        if ((column !== clickedColumn) && dummyData) {
            //let sorted = _.sortBy(dummyData, [clm => String(clm[clickedColumn]).toLowerCase()])
            let sorted = _.sortBy(dummyData, [clm => typeof clm[clickedColumn] === 'string' ? String(clm[clickedColumn]).toLowerCase(): clm[clickedColumn]])
            this.setState({
                column: clickedColumn,
                dummyData: sorted,
                direction: 'ascending',
            })
            this.forceUpdate()
            return
        } else {
            let reverse = dummyData.reverse()
            this.setState({
                dummyData: reverse,
                direction: direction === 'ascending' ? 'descending' : 'ascending',
            })

        }

        setTimeout(() => this.sorting = false, 1000)
    }
    makeHeader(_keys, headL, visibles) {
        const { column, direction } = this.state
        let keys = Object.keys(_keys);
        //hide column filtered...
        let filteredKeys = (visibles) ? reducer.filterDefine(keys, visibles) : keys;

        let widthDefault = Math.round(16/filteredKeys.length);
        return filteredKeys.map((key, i) => (
            (i === filteredKeys.length -1) ?
                <Table.HeaderCell key={i} className='unsortable' width={4} textAlign='center'>
                    {
                        (key === 'Edit')? 'Actions'
                            : key}
                </Table.HeaderCell>
                :
                <Table.HeaderCell key={i} className={(key === 'Phone' || key === 'Address' || key === 'Ports')?'unsortable':''} textAlign='center'  sorted={column === key ? direction : null} onClick={(key !== 'Phone' && key !== 'Address' && key !== 'Ports')?this.handleSort(key):null}>
                    {(key === 'FlavorName')? 'Flavor Name'
                        : (key === 'RAM')? 'RAM Size'
                            : (key === 'vCPUs')? 'Number of vCPUs'
                                : (key === 'Disk')? 'Disk Space'
                                    : (key === 'OrganizationName')? 'Organization Name'
                                        : (key === 'AppName')? 'App Name'
                                            : (key === 'DeploymentType')? 'Deployment Type'
                                                : (key === 'DefaultFlavor')? 'Default Flavor'
                                                    : key}
                </Table.HeaderCell>
        ));
    }

    onLayoutChange(layout) {
        //this.props.onLayoutChange(layout);
    }
    onPortClick() {

    }
    detailView(item) {
        // if(!item['Username']){
        //     this.setState({detailViewData:item, openDetail:true})
        // } else {
        //     this.setState({detailViewData:item, openUser:true})
        // }
        _self.props.handleDetail({data:item, viewMode:'detailView'})
    }
    roleMark = (role) => (
        (role.indexOf('Admin')!==-1 && role.indexOf('Manager')!==-1) ? <div className="mark markA markS">S</div> :
        (role.indexOf('Developer')!==-1 && role.indexOf('Manager')!==-1) ? <div className="mark markD markM">M</div> :
        (role.indexOf('Developer')!==-1 && role.indexOf('Contributor')!==-1) ? <div className="mark markD markC">C</div> :
        (role.indexOf('Developer')!==-1 && role.indexOf('Viewer')!==-1) ? <div className="mark markD markV">V</div> :
        (role.indexOf('Operator')!==-1 && role.indexOf('Manager')!==-1) ? <div className="mark markO markM">M</div> :
        (role.indexOf('Operator')!==-1 && role.indexOf('Contributor')!==-1) ? <div className="mark markO markC">C</div> :
        (role.indexOf('Operator')!==-1 && role.indexOf('Viewer')!==-1) ? <div className="mark markO markV">V</div> : <div></div>
    )
    typeMark = (type) => (
        (type.indexOf('developer')!==-1) ? <div className="mark type markD markM"></div> :
            (type.indexOf('operator')!==-1) ? <div className="mark type markO markM"></div> : <div></div>
    )
    addUserDisable = (orgName) => {
        let dsb = false;
        if(this.props.roleInfo && localStorage.selectRole !== 'AdminManager'){
            this.props.roleInfo.map((item,i) => {
                if(item.org == orgName.Organization) {
                    if(item.role == 'DeveloperContributor') dsb = true
                    else if(item.role == 'DeveloperViewer') dsb = true
                    else if(item.role == 'OperatorContributor') dsb = true
                    else if(item.role == 'OperatorViewer') dsb = true
                }
            })
        }
        return dsb;
    }
    appLaunch = (data) => {
        this.gotoUrl('/site4', 'pg=createAppInst','pg=5')
        this.props.handleAppLaunch(data)
        // this.props.handleChangeComputeItem('App Instances')
        localStorage.setItem('selectMenu', 'App Instances')
    }
    handleOpen = () => {
        this.setState({ isOpen: true })

        // this.timeout = setTimeout(() => {
        //     this.setState({ isOpen: false })
        // }, timeoutLength)
    }

    handleClose = () => {
        this.setState({ isOpen: false, isOpenTip:false })
        //clearTimeout(this.timeout)
    }
    onHandleScroll = () => {
        this.setState({ isOpen: false, isOpenTip:false })
    }
    onClickDropMenu = (item, value, idx, self) => {
        _self.setState({actionContextRef:'actionCell_'+idx})
        setTimeout(() => _self.setState({isOpen:true, isOpenTip:false}), 100)

        //set state for use audit
        _self.setState({orgName:item.Organization, item:item})
    }
    onOverDropMenu = (item, value, idx) => {
        _self.setState({actionContextRef:'actionCell_'+idx})
        setTimeout(() => _self.setState({isOpenTip:true}), 100)

        //set state for use audit
        _self.setState({orgName:item.Organization, item:item})
    }
    onOutDropMenu = (item, value, idx) => {
        _self.setState({actionContextRef:''})
        setTimeout(() => _self.setState({isOpenTip:false}), 100)

    }


    /*******
     * If you click the buttons that are grouped
     ** *****/
    onHandlePopMenu = (a, b) => {
        this.setState({ isOpen: false })
        console.log('20191104 ... on handle pop menu.. ', a, b.children, ': orgName=', this.state.orgName)
        if(b.children === 'Launch') {
            this.appLaunch(this.state.item)
        } else if(b.children === 'Update') {
            this.onHandleClick(true, this.state.item)
        } else if(b.children === 'Delete') {
            this.setState({openDelete: true, selected:this.state.item})
        }

    }
    makeActionButton = (target) => (
        <Button.Group vertical className="table_actions_popup_group">
            {
                appssEdit.map((option)=> (
                    <Button onClick={this.onHandlePopMenu} className="table_actions_popup_group_button">
                        {option.text}
                    </Button>
                ))
            }
        </Button.Group>
    )
    makeEditButtonGroup = (item, value, j, i) => (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <div ref={acell => this['actionCell_'+i] = acell} style={{backgroundColor:'transparent', width:0, height:0, position:'relative'}}></div>
            <Button className="table_actions_button" onClick={(self) => _self.onClickDropMenu(item, value, i, self)} onMouseOver={()=>_self.onOverDropMenu(item, value, i)} onMouseOut={() => _self.onOutDropMenu(item, value, i)}>
                <Button.Content visible>
                    <Icon name='bars' />
                </Button.Content>
            </Button>
        </div>
    )
    makeEditMenu = (item, value, i, j) => (
        <Table.Cell key={j} textAlign='center' style={(this.state.selectUse == i)?{whiteSpace:'nowrap',background:'#444'} :{whiteSpace:'nowrap'} }>
            <Button disabled style={{display:'none'}} key={`key_${j}`} color='teal' onClick={() => this.onHandleClick(true, item)}><Icon name={'edit'}/></Button>
            {(this.props.siteId == 'App')?
                <Button className='launchButton' color='teal' disabled={this.props.dimmInfo.onlyView} onClick={() => this.appLaunch(item)}>
                    Launch
                </Button>:null}
            {(this.props.siteId == 'App')?
                (String(item[value]).indexOf('Editable') > -1) ? <Button key={`key_${j}`} color='teal' onClick={() => this.onHandleClick(true, item)}><Icon name={'edit'}/></Button> : null:null}
            <Button disabled={(localStorage.selectMenu !== 'Organizations')?this.props.dimmInfo.onlyView:this.addUserDisable(item)} onClick={() => this.setState({openDelete: true, selected:item})}><Icon name={'trash alternate'}/></Button>
        </Table.Cell>
    )

    makeTabulatorHeader(_keys, visibles) {
        let keys = Object.keys(_keys);
        //hide column filtered...
        let filteredKeys = (visibles) ? reducer.filterDefine(keys, visibles) : keys;
        return filteredKeys;
    }

    el = React.createRef();
    tabulator = null; //variable to hold your table

    componentDidMount() {

    }
    componentWillUnmount() {
        this.tabulator = null;
    }

    componentWillReceiveProps(nextProps, nextContext) {
        // Tabluator
        if(nextProps.devData.length){
            let tbLayout = 'fitDataFill'
            if(nextProps.changeStep) {
                console.log('20191115 inside list view ', 'fitColumns')
                this.setState({tabulatorLayout:'fitColumns'})
                tbLayout = 'fitColumns'
            } else {
                console.log('20191115 inside list view ', 'fitDataFill')
                this.setState({tabulatorLayout:null})
                tbLayout = 'fitDataFill'
            }

            let makeHeader = this.makeTabulatorHeader(nextProps.devData[0],this.props.hiddenKeys)
            let hData = [];
            let count = 0;
            let btnGroup = (cell, formatterParams, onRendered) => {
                let tealClass = '';
                count++;
                if(this.state.manageKey == count) tealClass = 'teal'
                return `<button class="ui teal button launch launchButton" id="btnLaunch${count}">Launch</i></button>
                        <button class="ui teal button edit" id="btnEdit${count}"><i aria-hidden="true" class="edit alternate icon"></i></button>
                        <button class="ui button trash" id="btnTrash${count}"><i aria-hidden="true" class="trash alternate icon"></i></button>`
            };
            let ports = (cell, formatterParams, onRendered) => {
                return `${cell.getData().Ports.toUpperCase()}`
            };
            //this.onUseOrg(item,i, evt)
            this.setState({tableData:nextProps.devData})
            makeHeader.map((item) => {
                hData.push(
                    (item == 'Edit')?
                    {title:'Actions', field:item, align:"center", width: 250, formatter:btnGroup, cellClick:function(e, cell){
                        e.stopPropagation();
                        if(e.target.className.indexOf('trash') > -1){ //trash
                            _self.setState({openDelete: true, selected:cell.getData()});
                        } else if(e.target.className.indexOf('launch') > -1){ //launch
                            _self.appLaunch(cell.getData());
                        } else if(e.target.className.indexOf('edit') > -1){ //edit
                            _self.onHandleClick(true,cell.getData())
                        } 
                    }}
                    :
                    (item == 'Ports')?
                    {title:item, field:item, align:"left", formatter:ports}
                    :
                    {title:item, field:item, align:"left"}
                )
            })
            hData.map((item,i) => {
                item['minWidth'] = nextProps.mWidth[i];
            })
            this.tabulator = new Tabulator(this.el, {
                height:"100%",
                data: nextProps.devData, //link data to table
                columns: hData,
                // columnMinWidth:200,
                //layout:"fitDataFill",
                layout:tbLayout,
                rowClick:function(e, row){
                    let data = row.getData();
                    _self.detailView(data)
                },
            });
        }

        if(nextProps.accountInfo){
            this.setState({ dimmer:'blurring', open: true })
        }
        if(nextProps.devData.length) {
            this.setState({dummyData:nextProps.devData, resultData:(!this.state.resultData)?nextProps.devData:this.state.resultData})
        } else {
            this.setState({dummyData:nextProps.devData})
            this.checkLengthData();
        }
        if(nextProps.searchValue) {
            let searchData  = reducer.filterSearch(nextProps.devData,nextProps.searchValue,nextProps.searchType);
            this.setState({dummyData:searchData})
        }


    }

    render() {
        const { open, dimmer } = this.state;
        const { hiddenKeys } = this.props;
        return (
            <div style={{display:'flex', overflowY:'auto', overflowX:'hidden', width:'100%'}}>
                <RegistNewListItem data={this.state.dummyData} resultData={this.state.resultData} dimmer={this.state.dimmer} open={this.state.open} selected={this.state.selected} close={this.close} refresh={this.props.dataRefresh}/>
                
                <DeleteItem open={this.state.openDelete}
                            selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                            refresh={this.props.dataRefresh}
                ></DeleteItem>
                
                <div
                    onLayoutChange={this.onLayoutChange}
                    {...this.props}
                    style={{width:'100%'}}
                >
                    {this.generateDOM(open, dimmer,hiddenKeys)}
                </div>
                <Popup
                    inverted
                    content={this.makeActionButton(this[this.state.actionContextRef])}
                    on='click'
                    open={this.state.isOpen}
                    onClose={this.handleClose}
                    onOpen={this.handleOpen}
                    position='left center'
                    context={this[this.state.actionContextRef]}
                    className="table_actions_popup"
                    basic
                />
                <Popup
                    className="table_actions_tooltip"
                    open={this.state.isOpenTip}
                    content='Click this button to perform "Launch", "Update" and "Delete".'
                    size='mini'
                    position='left center'
                    context={this[this.state.actionContextRef]}
                />
                <PopDetailViewer data={this.state.detailViewData} dimmer={false} open={this.state.openDetail} close={this.closeDetail} siteId={this.props.siteId}></PopDetailViewer>
                <PopUserViewer data={this.state.detailViewData} dimmer={false} open={this.state.openUser} close={this.closeUser}></PopUserViewer>
                <PopAddUserViewer data={this.state.selected} dimmer={false} open={this.state.openAdd} close={this.closeAddUser}></PopAddUserViewer>
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
    let account = state.registryAccount.account;
    let dimm =  state.btnMnmt;
    let accountInfo = account ? account + Math.random()*10000 : null;
    let dimmInfo = dimm ? dimm : null;

    return {
        accountInfo,
        dimmInfo,
        itemLabel: state.computeItem.item,
        userToken : (state.user.userToken) ? state.userToken: null,
        searchValue : (state.searchValue.search) ? state.searchValue.search: null,
        searchType : (state.searchValue.scType) ? state.searchValue.scType: null,
        userRole : state.showUserRole?state.showUserRole.role:null,
        roleInfo : state.roleInfo?state.roleInfo.role:null,
        changeStep: (state.changeStep.step)?state.changeStep.step:null,
    }
    
    // return (dimm) ? {
    //     dimmInfo : dimm
    // } : (account)? {
    //     accountInfo: account + Math.random()*10000
    // } : null;
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleUserRole: (data) => { dispatch(actions.showUserRole(data))},
        handleSelectOrg: (data) => { dispatch(actions.selectOrganiz(data))},
        handleRefreshData: (data) => { dispatch(actions.refreshData(data))},
        handleAppLaunch: (data) => { dispatch(actions.appLaunch(data))},
        handleChangeComputeItem: (data) => { dispatch(actions.computeItem(data))},
        handleDetail: (data) => { dispatch(actions.changeDetail(data))},
        handleEditInstance: (data) => { dispatch(actions.editInstance(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(InsideListView));


