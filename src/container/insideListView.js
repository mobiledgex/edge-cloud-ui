import React from 'react';
import { Modal, Grid, Header, Button, Table, Menu, Icon, Input, Divider, Container } from 'semantic-ui-react';
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
import ContainerDimensions from 'react-container-dimensions'
import _ from "lodash";
import * as reducer from '../utils'
import MaterialIcon from "material-icons-react";
import * as services from '../services/service_compute_service';
const ReactGridLayout = WidthProvider(RGL);


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
            noData:false
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
        this.setState({ dimmer:dim, open: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
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
                    <div className="grid_table" style={{overflowY:'auto'}}>
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
    makeHeader(_keys, headL, visibles) {
        const { column, direction } = this.state
        let keys = Object.keys(_keys);
        //hide column filtered...
        let filteredKeys = (visibles) ? reducer.filterDefine(keys, visibles) : keys;

        let widthDefault = Math.round(16/filteredKeys.length);
        return filteredKeys.map((key, i) => (
            (i === filteredKeys.length -1) ?
                <Table.HeaderCell key={i} className='unsortable' width={(this.props.siteId == 'Organization')?3:2} textAlign='center'>
                    {key}
                </Table.HeaderCell>
                :
                <Table.HeaderCell key={i} className={(key === 'Phone' || key === 'Address')?'unsortable':''} textAlign='center' width={(headL)?headL[i]:widthDefault} sorted={column === key ? direction : null} onClick={(key !== 'Phone' && key !== 'Address' && key !== 'Ports')?this.handleSort(key):null}>
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
    TableExampleVeryBasic = (headL, hideHeader, datas) => (
        <Table className="viewListTable" basic='very' sortable striped celled fixed>
            <Table.Header className="viewListTableHeader">
                <Table.Row>
                    {(this.state.dummyData.length > 0)?this.makeHeader(this.state.dummyData[0], headL, hideHeader):null}
                </Table.Row>
            </Table.Header>

            <Table.Body className="tbBodyList">
                {
                    datas.map((item, i) => (
                        <Table.Row key={i} id={'tbRow_'+i} style={{position:'relative'}}>
                            {Object.keys(item).map((value, j) => (
                                (value === 'Edit')?
                                    String(item[value]) === 'null' ? <Table.Cell /> :
                                    <Table.Cell key={j} textAlign='center' style={(this.state.selectUse == i)?{whiteSpace:'nowrap',background:'#444'} :{whiteSpace:'nowrap'} }>
                                        {(this.props.siteId == 'Organization' && localStorage.selectRole !== 'AdminManager')?
                                            <Button color={(this.state.selectUse == i)?'teal' :null} onClick={(evt) => this.onUseOrg(item,i, evt)}>
                                                <Icon name='check' />
                                            </Button>:null}
                                        <Button disabled style={{display:'none'}} key={`key_${j}`} color='teal' onClick={() => this.onHandleClick(true, item)}>Edit</Button>
                                        {(this.props.siteId == 'Organization')?
                                            <Button color='teal' disabled={this.addUserDisable(item)} onClick={() => this.onHandleClickAdd(true, item, i)}>
                                                Add User
                                            </Button>:null}
                                        {(this.props.siteId == 'App')?
                                            <Button className='launchButton' color='teal' disabled={this.props.dimmInfo.onlyView} onClick={() => this.appLaunch(item)}>
                                            Launch
                                            </Button>:null}
                                        <Button disabled={(localStorage.selectMenu !== 'Organizations')?this.props.dimmInfo.onlyView:this.addUserDisable(item)} onClick={() => this.setState({openDelete: true, selected:item})}><Icon name={'trash alternate'}/></Button>

                                    </Table.Cell>
                                :
                                (value === 'Type')?
                                    <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)} style={(this.state.selectUse == i)?{whiteSpace:'nowrap',background:'#444'} :{whiteSpace:'nowrap'}} >
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
                                    <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)} style={{cursor:'pointer'}} >
                                        {
                                            String(item[value]).toUpperCase()
                                        }
                                    </Table.Cell>
                                :
                                (!( String(hideHeader).indexOf(value) > -1 )) ?
                                    <Table.Cell key={j} textAlign={(value === 'Region')?'center':(j === 0 || value.indexOf('Name')!==-1)?'left':'center'} onClick={() => this.detailView(item)} style={(this.state.selectUse == i)?{cursor:'pointer',background:'#444'} :{cursor:'pointer'} }>
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
                <RegistNewListItem data={this.state.dummyData} resultData={this.state.resultData} dimmer={this.state.dimmer} open={this.state.open} selected={this.state.selected} close={this.close} refresh={this.props.dataRefresh}/>
                
                <DeleteItem open={this.state.openDelete}
                            selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                            refresh={this.props.dataRefresh}
                ></DeleteItem>
                
                <div
                    layout={this.state.layout}
                    onLayoutChange={this.onLayoutChange}
                    {...this.props}
                    style={{width:'100%'}}
                >
                    {this.generateDOM(open, dimmer,hiddenKeys)}
                </div>
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
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(InsideListView));


