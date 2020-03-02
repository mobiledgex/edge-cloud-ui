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
import _ from "lodash";
import * as reducer from '../utils'
import { IconButton } from '@material-ui/core';
import ListIcon from '@material-ui/icons/List';

const appssEdit = [
    {key: 'launch', text:'Launch', icon:null},
    {key: 'update', text:'Update', icon:null},
    {key: 'delete', text:'Delete', icon:'trash alternate'},
]
const cloudletPoolEdit = [
    {key: 'add', text:'Add Cloudlet', icon:null},
    {key: 'link', text:'Link Organization', icon:null},
    {key: 'delete', text:'Delete Cloudlet Pool', icon:'trash alternate'},
]
const cloudletPoolDeleteDisabled = [cloudletPoolEdit[0], cloudletPoolEdit[1]]

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
            deleteDisabled:false,
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
        _self.props.handleChangeSite({mainPath:site, subPath: subPath})
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
                    <div className={'grid_table '+this.props.siteId} style={{overflowY:'auto'}}>
                        {
                            this.TableExampleVeryBasic(this.props.headerLayout, this.props.hiddenKeys, this.state.dummyData)

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

                </div>
                :
                <div className="round_panel" key={i} style={{display:'flex', flexDirection:'column'}} >
                    <div style={{width:'100%', height:'100%', overflowY:'auto'}}>
                        Map viewer
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

   returnReWord = (key) => {
        let newName = '';
        switch (key) {
            case 'FlavorName' : newName = 'Flavor Name'; break;
            case 'RAM' : newName = 'RAM Size'; break;
            case 'vCPUs' : newName = 'Number of vCPUs'; break;
            case 'Disk' : newName = 'Disk Space'; break;
            case 'OrganizationName' : newName = 'Organization Name'; break;
            case 'AppName' : newName = 'App Name'; break;
            case 'DeploymentType' : newName = 'Deployment Type'; break;
            case 'DefaultFlavor' : newName = 'Default Flavor'; break;
            case 'PoolName' : newName = 'Pool Name'; break;
            case 'NumOfCloudlets' : newName = 'Number of Cloudlets'; break;
            case 'NumOfOrganizations' : newName = 'Number of Organizations'; break;
            default: newName = key; break;
        }
        return newName;

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
                    {this.returnReWord(key)}
                </Table.HeaderCell>
        ));
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

    addCloudlet = (data) => {
        this.gotoUrl('/site4', 'pg=updateCloudletPool','pg=7')
        this.props.handleAppLaunch(data)
        // this.props.handleChangeComputeItem('App Instances')
        localStorage.setItem('selectMenu', 'Cloudlet Pools')
    }
    linkOrganize = (data) => {
        this.gotoUrl('/site4', 'pg=linkOrganize','pg=7')
        this.props.handleAppLaunch(data)
        // this.props.handleChangeComputeItem('App Instances')
        localStorage.setItem('selectMenu', 'Cloudlet Pools')
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
        !this.state.isOpen && setTimeout(() => _self.setState({isOpenTip:true}), 100)

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
        //cloudlet pool

        this.setState({ isOpen: false })
        
        if(b.children === 'Launch') {
            this.appLaunch(this.state.item)
        } else if(b.children === 'Update') {
            this.onHandleClick(true, this.state.item)
        } else if(b.children === 'Delete') {
            this.setState({openDelete: true, selected:this.state.item})
        }

        /** cloudlet pool */
        if(b.children === 'Add Cloudlet') {
            this.addCloudlet(this.state.item)
        } else if(b.children === 'Link Organization') {
            this.linkOrganize(this.state.item)
        } else if(b.children === 'Delete Cloudlet Pool') {
            this.setState({openDelete: true, selected:this.state.item})
        }

    }

    makeActionButton = (target, disabled) => (
        <Button.Group vertical className="table_actions_popup_group">
            {
                (this.props.siteId === "Cloudlet Pools")?
                    (disabled === true)?
                        cloudletPoolDeleteDisabled.map((option, i) => (
                            <Button key={i} onClick={this.onHandlePopMenu} className="table_actions_popup_group_button">
                                {option.text}
                            </Button>
                        ))
                        :
                        cloudletPoolEdit.map((option, i)=> (
                            <Button key={i} onClick={this.onHandlePopMenu} className="table_actions_popup_group_button">
                                {option.text}
                            </Button>
                        ))
                    :
                    appssEdit.map((option, i)=> (
                        <Button key={i} onClick={this.onHandlePopMenu} className="table_actions_popup_group_button">
                            {option.text}
                        </Button>
                    ))
            }
        </Button.Group>
    )
    makeEditButtonGroup = (item, value, j, i, OrgCount) => (
        <div style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
            <div ref={acell => this['actionCell_'+i] = acell} style={{backgroundColor:'transparent', width:0, height:0, position:'relative'}}></div>
            
            <IconButton
                className='actionButton'
                aria-label="Action" 
                onClick={(self) => {
                        _self.
                        onClickDropMenu(item, value, i, self)
                        OrgCount !== 0 ? this.setState({deleteDisabled : true}) : this.setState({deleteDisabled : false})
                    }}
                    onMouseOver={()=> _self.onOverDropMenu(item, value, i)}
                    onMouseOut={() => _self.onOutDropMenu(item, value, i)}>
                <ListIcon style={{ color: '#76ff03' }} />
            </IconButton>
        </div>
    )
    makeEditMenu = (item, value, i, j) => (
        <Table.Cell key={j} textAlign='center' style={{whiteSpace:'nowrap'} }>
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
    TableExampleVeryBasic = (headL, hideHeader, datas) => (
        <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing>
            <Table.Header className="viewListTableHeader">
                <Table.Row>
                    {(this.state.dummyData.length > 0)?this.makeHeader(this.state.dummyData[0], headL, hideHeader):null}
                </Table.Row>
            </Table.Header>

            <Table.Body className="tbBodyList" onScroll={this.onHandleScroll}>
                {
                    datas.map((item, i) => (
                        <Table.Row key={i} id={'tbRow_'+i} style={{position:'relative'}}>
                            {Object.keys(item).map((value, j) => (
                                (value === 'Edit')?
                                    String(item[value]) === 'null' ? <Table.Cell /> :
                                        <Table.Cell className="table_actions" key={j} textAlign='center' style={{whiteSpace:'nowrap', overflow:'visible'} }>
                                            {this.makeEditButtonGroup(item, value, j, i, item['NumOfOrganizations'] && item['NumOfOrganizations'])}
                                        </Table.Cell>
                                :
                                (value === 'Type')?
                                    <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)} style={{whiteSpace:'nowrap'}} >
                                        {/*<div className="markBox">{this.typeMark(item[value])}</div>*/}
                                        <span style={(item[value] == 'developer')?{color:'#9b9979'}:{color:'#7d969b'}}>{item[value]}</span>
                                    </Table.Cell>
                                :
                                (value === 'Mapped_ports')?
                                    <Table.Cell key={j} textAlign='left'>
                                        <Icon name='server' size='big' onClick={() => this.onPortClick(true, item)} style={{cursor:'pointer'}}></Icon>
                                    </Table.Cell>
                                :
                                (value === 'Username')?
                                    <Table.Cell key={j} textAlign='left'>
                                        <div className="left_menu_item" onClick={() => this.detailView(item)} style={{cursor:'pointer'}}>
                                        <Icon name='user circle' size='big' style={{marginRight:"6px"}} ></Icon> {item[value]}
                                        </div>
                                    </Table.Cell>
                                :   
                                (value === 'Role Type')?
                                    <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)} style={{cursor:'pointer'}} >
                                        <div className="markBox">{this.roleMark(item[value])}</div>
                                        {item[value]}
                                    </Table.Cell>
                                :
                                (value === 'DeploymentType')?
                                    <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)} style={{cursor:'pointer'}} >
                                        {
                                            (item[value] == 'docker')? 'Docker':
                                            (item[value] == 'kubernetes')? 'Kubernetes':
                                            (item[value] == 'vm')? 'VM':
                                            (item[value] == 'helm')? 'Helm':
                                            item[value]
                                        }
                                    </Table.Cell>
                                :
                                (value === 'Ports')?
                                    <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)} style={{cursor:'pointer',wordBreak:'break-all'}} >
                                        {
                                            String(item[value]).toUpperCase()
                                        }
                                    </Table.Cell>
                                :
                                (!( String(hideHeader).indexOf(value) > -1 )) ?
                                    <Table.Cell key={j} textAlign={(value === 'Region')?'center':(j === 0 || value.indexOf('Name')!==-1)?'left':'center'} onClick={() => this.detailView(item)} >
                                        <div ref={ref => this.tooltipref = ref}  data-tip='tooltip' data-for='happyFace' style={{wordBreak:'break-all'}}>
                                            {String(item[value])}
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
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps, nextContext) {
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
                <DeleteItem open={this.state.openDelete}
                            selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                            refresh={this.props.dataRefresh}
                ></DeleteItem>
                <RegistNewListItem data={this.state.dummyData} resultData={this.state.resultData} dimmer={this.state.dimmer} open={this.state.open} selected={this.state.selected} close={this.close} refresh={this.props.dataRefresh}/>

                <div
                    {...this.props}
                    style={{width:'100%'}}
                >
                    {this.generateDOM(open, dimmer,hiddenKeys)}
                </div>
                <Popup
                    inverted
                    content={this.makeActionButton(this[this.state.actionContextRef], this.state.deleteDisabled)}
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
                    content={this.props.siteId === "Cloudlet Pools"?
                        'Click this button to perform "Add Cloudlet", "Link Organization" and "Delete Cloudlet Pool".'
                        : 'Click this button to perform "Launch", "Update" and "Delete".'}
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


