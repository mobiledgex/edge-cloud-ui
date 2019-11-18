import React from 'react';
import { Modal, Grid, Header, Button, Table, Popup, Icon, Input, Divider, Container } from 'semantic-ui-react';
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

/*****************
 * configuration menus of Edit field
 * @type {number}
 */
const organizationEdit = [
    {key: 'Audit', text:'Audit', icon:null},
    {key: 'AddUser', text:'Add User', icon:null},
    {key: 'Delete', text:'Delete', icon:'trash alternate'},
]

const appssEdit = [
    {key: 'Launch', text:'Audit', icon:null},
    {key: 'Update', text:'Add User', icon:null},
    {key: 'Delete', text:'Delete', icon:'trash alternate'},
]

////////////

const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 20;
var layout = [
    {"w":19,"h":20,"x":0,"y":0,"i":"0","minW":8,"minH":5,"moved":false,"static":false, "title":"Developer"}
]
let _self = null;

class DeveloperListView extends React.Component {
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
            manageKey : null
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

        // 깜박거리는(problem refresh site all) 문제 발생
        // 만약 주소 이동하단면 조건문으로 컨트롤 하여 아래코드 실행 가능
        //_self.props.handleChangeSite({mainPath:site, subPath: subPath})
    }
    onHandleClick(dim, data) {
        this.setState({ dimmer:dim, open: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }
    onHandleClickAdd(dim, data) {
        this.setState({ dimmer:dim, openAdd: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }
    onHandleClickAudit(dim, data) {
        //_self.setState({page:'pg=audits'})
        let orgName = data.Organization;
        console.log('20191113 on handle click audit --- ', data)
        _self.gotoUrl('/site4', 'pg=audits&org='+orgName)
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
                    <div style={{overflowY:'auto'}}>
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
            let sorted = _.sortBy(dummyData, [clm => typeof clm[clickedColumn] === 'string' ? String(clm[clickedColumn]).toLowerCase(): clm[clickedColumn]])
            this.setState({
                column: clickedColumn,
                dummyData: sorted,
                direction: 'ascending',
            })
            return
        } else {
            let reverse = dummyData.reverse()
            this.setState({
                dummyData: reverse,
                direction: direction === 'ascending' ? 'descending' : 'ascending',
            })
        }
        //setTimeout(() => this.sorting = false, 1000)
    }
    makeHeader(_keys, headL, visibles) {
        const { column, direction } = this.state
        let keys = Object.keys(_keys);
        //hide column filtered...
        let filteredKeys = (visibles) ? reducer.filterDefine(keys, visibles) : keys;

        let widthDefault = Math.round(16/filteredKeys.length);
        return filteredKeys.map((key, i) => (
            (i === filteredKeys.length -1) ?
                <Table.HeaderCell key={i} className='unsortable' width={(this.props.siteId == 'Organization')?3:2} textAlign='center'>
                    {
                        (key === 'Edit')? 'Actions'
                            : key}
                </Table.HeaderCell>
                :
                <Table.HeaderCell key={i} className={(key === 'Phone' || key === 'Address')?'unsortable':''} textAlign='left' width={(headL)?headL[i]:widthDefault} sorted={column === key ? direction : null} onClick={(key !== 'Phone' && key !== 'Address')?this.handleSort(key):null}>
                    {(key === 'FlavorName')? 'Flavor Name'
                        : (key === 'RAM')? 'RAM Size(MB)'
                            : (key === 'vCPUs')? 'Number of vCPUs'
                                : (key === 'Disk')? 'Disk Space(GB)'
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
        if(!item['Username']){
            this.setState({detailViewData:item, openDetail:true})
        } else {
            this.setState({detailViewData:item, openUser:true})
        }
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
    roleMarkTabulator = (role) => (
        (role.indexOf('Admin')!==-1 && role.indexOf('Manager')!==-1) ? '<div class="mark markA markS">S</div>' :
        (role.indexOf('Developer')!==-1 && role.indexOf('Manager')!==-1) ? '<div class="mark markD markM">M</div>' :
        (role.indexOf('Developer')!==-1 && role.indexOf('Contributor')!==-1) ? '<div class="mark markD markC">C</div>' :
        (role.indexOf('Developer')!==-1 && role.indexOf('Viewer')!==-1) ? '<div class="mark markD markV">V</div>' :
        (role.indexOf('Operator')!==-1 && role.indexOf('Manager')!==-1) ? '<div class="mark markO markM">M</div>' :
        (role.indexOf('Operator')!==-1 && role.indexOf('Contributor')!==-1) ? '<div class="mark markO markC">C</div>' :
        (role.indexOf('Operator')!==-1 && role.indexOf('Viewer')!==-1) ? '<div class="mark markO markV">V</div>' : '<div></div>'
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
    userRoleActive = (data) => {
        let btn = true;
        this.props.roleInfo.map((item) => {
            if(item.role.indexOf('Manager') > -1 && item.org == data.Organization){
                btn = false;
            } 
        })
        if(localStorage.selectRole == 'AdminManager'){
            btn = false;
        }
        return btn;
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
    onClickDropMenu = (item, value, idx) => {
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
        if(b.children === 'Audit') {
            this.onHandleClickAudit(true, {Organization: this.state.orgName})
        } else if(b.children === 'Add User') {
            this.onHandleClickAdd(true, this.state.item)
        } else if(b.children === 'Delete') {
            this.setState({openDelete: true, selected:this.state.item})
        }

    }
    makeActionButton = (item, j, i) => (
        <Button.Group vertical className="table_actions_popup_group">
            {
                organizationEdit.map((option)=> (
                    <Button ref={btn => this.actionButton = btn} onClick={this.onHandlePopMenu} className="table_actions_popup_group_button">
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
    makeEditMenu = (item, j, i) => (
        <div key={j} textAlign='center' style={(this.state.selectUse == i)?{whiteSpace:'nowrap',background:'#444'} :{whiteSpace:'nowrap'} }>
            {(this.props.siteId == 'Organization' && localStorage.selectRole !== 'AdminManager')?
                <Button className='stepOrgDeveloper1' color={(this.state.selectUse == i)?'teal' :null} onClick={(evt) => this.onUseOrg(item,i, evt)}>
                    {/* <Icon name='check' /> */}
                    Manage
                </Button>:null}
            <Button disabled style={{display:'none'}} key={`key_${j}`} color='teal' onClick={() => this.onHandleClick(true, item)}><Icon name={'edit'}/></Button>
            {(this.props.siteId == 'Organization')?
                <Button className='stepOrgDeveloper3' color='teal' disabled={this.addUserDisable(item)} onClick={() => this.onHandleClickAudit(true, item, i)}>
                    Audit
                </Button>:null}
            {(this.props.siteId == 'Organization')?
                <Button className='stepOrgDeveloper3' color='teal' disabled={this.addUserDisable(item)} onClick={() => this.onHandleClickAdd(true, item, i)}>
                    Add User
                </Button>:null}
            {(this.props.siteId == 'App')?
                <Button color='teal' disabled={this.props.dimmInfo.onlyView} onClick={() => this.appLaunch(item)}>
                    Launch
                </Button>:null}
            <Button className='stepOrgDeveloper4'
                    disabled={
                        (localStorage.selectMenu !== 'Organizations')?
                            ((item['Role Type']=='AdminManager')?true:(localStorage.selectMenu == 'User Roles')?this.userRoleActive(item):this.props.dimmInfo.onlyView):
                            this.addUserDisable(item)
                    }

                    onClick={() => this.setState({openDelete: true, selected:item})}><Icon name={'trash alternate'}/></Button>

        </div>
    )

    //el = React.createRef();
    //tabulator = null; //variable to hold your table

    componentDidMount() {

    }
    componentWillReceiveProps(nextProps, nextContext) {
        // Tabluator
        setTimeout(() => {
            if(nextProps.devData.length){
                let hData = [];
                let count = 0;
                let cWidth = '';
                let btnGroup = (cell, formatterParams, onRendered) => {
                    let disBN = (this.props.siteId == 'Organization' && localStorage.selectRole !== 'AdminManager')?'inline-block':'none';
                    let disOrg = (this.props.siteId == 'Organization')?'inline-block':'none';
                    let tealClass = '';
                    let orgDisabled = (localStorage.selectMenu !== 'Organizations') ? 
                        ((cell.getData()['Role Type']=='AdminManager')?
                            true:(localStorage.selectMenu == 'User Roles')?
                                _self.userRoleActive(cell.getData()):_self.props.dimmInfo.onlyView):_self.addUserDisable(cell.getData())
                    count++;
                    if(this.state.manageKey == count) tealClass = 'teal'
                    return `<button style="display:${disBN}" class="ui button manage ${tealClass} stepOrgDeveloper1" id="btnManage${count}">Manage</i></button>
                            <button ${(orgDisabled)?"disabled":""} style="display:${disOrg}" class="ui teal button audit" id="btnAudit${count}">Audit</i></button>
                            <button ${(orgDisabled)?"disabled":""} style="display:${disOrg}" class="ui teal button adduser stepOrgDeveloper3" id="btnAddUser${count}">Add User</i></button>
                            <button ${(orgDisabled)?"disabled":""} class="ui button trash stepOrgDeveloper4" id="btnTrash${count}"><i aria-hidden="true" class="trash alternate icon"></i></button>`
                };
                let roleType = (cell, formatterParams, onRendered) => {
                    return `<div class="markBox">${_self.roleMarkTabulator(cell.getData()['Role Type'])}</div>${cell.getData()['Role Type']}`
                };
                this.setState({tableData:nextProps.devData})
                if(localStorage.selectMenu == 'Organizations') cWidth = 400
                else cWidth = 150
                Object.keys(nextProps.devData[0]).map((item) => {
                    hData.push(
                        (item == 'Edit')?
                        {title:'Actions', field:item, align:"center", width: cWidth, formatter:btnGroup, cellClick:function(e, cell){
                            e.stopPropagation();
                            if(e.target.className.indexOf('trash') > -1){ //trash
                                _self.setState({openDelete: true, selected:cell.getData()});
                            } else if(e.target.className.indexOf('adduser') > -1){ //adduser
                                _self.onHandleClickAdd(true, cell.getData());
                            } else if(e.target.className.indexOf('audit') > -1){ //audit
                                _self.onHandleClickAudit(true, cell.getData());
                            } else if(e.target.className.indexOf('manage') > -1){ //manage
                                let key = 0;
                                nextProps.devData.map((item,i) => {
                                    if(item.Organization === cell.getData().Organization){
                                        key = i;
                                        _self.setState({manageKey:i+1})
                                    }
                                })
                                _self.onUseOrg(cell.getData(),key)
                            } 
                            
                        }}
                        :
                        (item == 'Role Type')?
                        {title:item, field:item, align:"left", formatter:roleType}
                        :
                        {title:item, field:item, align:"left"}
                    )
                })
                hData.map((item,i) => {
                    item['minWidth'] = nextProps.mWidth[i];
                })
                this.tabulator = new Tabulator(this.el, {
                    height:"100%",
                    data: _self.state.dummyData,//nextProps.devData, //link data to table
                    layout:"fitColumns",
                    columns: hData,
                    // columnMinWidth:200,
                    // layout:"fitDataFill",
                    rowClick:function(e, row){
                        let data = row.getData();
                        _self.detailView(data)
                    },
                });
            }
        }, 100);
        

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
        const { open, dimmer, viewMode } = this.state;
        const { hiddenKeys } = this.props;
        return (
            <div style={{display:'flex', overflowY:'auto', overflowX:'hidden', width:'100%'}}>
                <RegistNewListItem data={this.state.dummyData} resultData={this.state.resultData} dimmer={this.state.dimmer} open={this.state.open} selected={this.state.selected} close={this.close} refresh={this.props.dataRefresh}/>
                
                <DeleteItem open={this.state.openDelete}
                            selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                            refresh={this.props.dataRefresh}
                ></DeleteItem>
                
                <div style={{width:'100%'}}>
                    {
                        (viewMode === 'listView')? this.generateDOM(open, dimmer, hiddenKeys)
                            :
                            null
                    }
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
                    content='Click this button to perform "Audit", "Add user" and "Delete".'
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
        isDraggable:false,
        roleInfo:[]

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
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(DeveloperListView));


