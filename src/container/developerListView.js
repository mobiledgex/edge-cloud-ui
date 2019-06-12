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
            isDraggable: false

        };

    }
    gotoUrl(site, subPath) {
        console.log('999',_self.props.history)
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:site, subPath: subPath})
    }
    onHandleClick(dim, data) {
        console.log('on handle click == ', data)
        this.setState({ dimmer:dim, open: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }
    onHandleClickAdd(dim, data) {
        console.log('on handle click == ', data)
        this.setState({ dimmer:dim, openAdd: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }
    onHandleClickAddApp(dim, data) {
        console.log('on handle click == ', data)
        this.setState({page:'pg=createAppInst'})
    }

    onUseOrg(useData,key, evt) {
        console.log("onuseorg",useData,this.props.roleInfo.data,key)

        this.setState({selectUse:key})
        if(this.props.roleInfo.data) {
            this.props.roleInfo.data.map((item,i) => {
                if(item.org == useData.Organization) {
                    console.log('item role =',item.role)
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

     generateDOM(open, dimmer, width, height, hideHeader) {
        return layout.map((item, i) => (

            (i === 0)?
                <div className="round_panel" key={i} style={{ width:width, height:height, display:'flex', flexDirection:'column'}} >
                    <div className="grid_table" style={{width:'100%', height:height, overflowY:'auto'}}>
                        {this.TableExampleVeryBasic(width, height, this.props.headerLayout, this.props.hiddenKeys, this.state.dummyData)}
                    </div>

                    <Table.Footer className='listPageContainer'>
                        <Table.Row>
                            <Table.HeaderCell>
                                <Menu pagination>
                                    <Menu.Item as='a' icon>
                                        <Icon name='chevron left' />
                                    </Menu.Item>
                                    <Menu.Item as='a' active={true}>1</Menu.Item>
                                    <Menu.Item as='a'>2</Menu.Item>
                                    <Menu.Item as='a'>3</Menu.Item>
                                    <Menu.Item as='a'>4</Menu.Item>
                                    <Menu.Item as='a' icon>
                                        <Icon name='chevron right' />
                                    </Menu.Item>
                                </Menu>
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>

                </div>
                :
                <div className="round_panel" key={i} style={{ width:width, height:height, display:'flex', flexDirection:'column'}} >
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
    makeHeader(_keys, headL, visibles) {
        const { column, direction } = this.state
        let keys = Object.keys(_keys);
        //hide column filtered...
        let filteredKeys = (visibles) ? reducer.filterDefine(keys, visibles) : keys;

        let widthDefault = Math.round(16/filteredKeys.length);
        console.log('default width header -- ', widthDefault, filteredKeys)
        return filteredKeys.map((key, i) => (
            (i === filteredKeys.length -1) ?
                <Table.HeaderCell key={i} width={(this.props.siteId == 'Organization')?3:2} textAlign='center' sorted={column === key ? direction : null}>
                    {key}
                </Table.HeaderCell>
                :
                <Table.HeaderCell key={i} textAlign='center' width={(headL)?headL[i]:widthDefault} sorted={column === key ? direction : null} onClick={(key !== 'Phone' && key !== 'Address')?this.handleSort(key):null}>
                    {(key === 'FlavorName')? 'Flavor Name'
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
        console.log('changed layout = ', JSON.stringify(layout))
    }
    onPortClick() {

    }
    detailView(item) {
        console.log("user >>>> ",item)
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
    typeMark = (type) => (
        (type.indexOf('developer')!==-1) ? <div className="mark type markD markM"></div> :
            (type.indexOf('operator')!==-1) ? <div className="mark type markO markM"></div> : <div></div>
    )
    addUserDisable = (orgName) => {
        let dsb = false;
        if(this.props.roleInfo && localStorage.selectRole !== 'AdminManager'){
            this.props.roleInfo.data.map((item,i) => {
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
    TableExampleVeryBasic = (w, h, headL, hideHeader, datas) => (
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
                                            <Button color='teal' disabled={this.props.dimmInfo.onlyView} onClick={() => this.gotoUrl('/site4', 'pg=createAppInst')}>
                                            Launch
                                            </Button>:null}
                                        <Button disabled={(localStorage.selectMenu !== 'Organization')?this.props.dimmInfo.onlyView:this.addUserDisable(item)} onClick={() => this.setState({openDelete: true, selected:item})}><Icon name={'trash alternate'}/></Button>

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
                                        <Icon name='user circle' size='big' style={{marginRight:"6px"}} ></Icon> {(i==0) ? <div className="userNewMark">{'New'}</div> : null} {item[value]}
                                        </div>
                                    </Table.Cell>
                                :   
                                (value === 'Role Type')?
                                    <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)} style={{cursor:'pointer'}} >
                                        <div className="markBox">{this.roleMark(item[value])}</div>
                                        {item[value]}
                                    </Table.Cell>
                                :
                                (!( String(hideHeader).indexOf(value) > -1 )) ?
                                    <Table.Cell key={j} textAlign={(value === 'Region')?'center':(j === 0 || value.indexOf('Name')!==-1)?'left':'center'} onClick={() => this.detailView(item)} style={(this.state.selectUse == i)?{cursor:'pointer',background:'#444'} :{cursor:'pointer'} }>
                                        <div ref={ref => this.tooltipref = ref}  data-tip='tooltip' data-for='happyFace'>
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
    successfully(msg) {
        //reload data of dummyData that defined props devData

        //_self.props.handleRefreshData({params:{state:'refresh'}})
    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('nextProps',nextProps,this.props.siteId)
        if(nextProps.accountInfo){
            this.setState({ dimmer:'blurring', open: true })
        }
        if(nextProps.devData) {
            this.setState({dummyData:nextProps.devData, resultData:(!this.state.resultData)?nextProps.devData:this.state.resultData})
        }
        if(nextProps.searchValue) {
            let searchData  = reducer.filterSearch(nextProps.devData,nextProps.searchValue);
            this.setState({dummyData:searchData})
        }
    }

    render() {
        const { open, dimmer } = this.state;
        const { hiddenKeys } = this.props;
        return (
            <ContainerDimensions>
                { ({ width, height }) =>
                    <div style={{width:width, height:height, display:'flex', overflowY:'auto', overflowX:'hidden'}}>
                        <RegistNewListItem data={this.state.dummyData} resultData={this.state.resultData} dimmer={this.state.dimmer} open={this.state.open} selected={this.state.selected} close={this.close} refresh={this.props.dataRefresh}/>
                        
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
                            {this.generateDOM(open, dimmer, width, height, hiddenKeys)}
                        </ReactGridLayout>
                        <PopDetailViewer data={this.state.detailViewData} dimmer={false} open={this.state.openDetail} close={this.closeDetail}></PopDetailViewer>
                        <PopUserViewer data={this.state.detailViewData} dimmer={false} open={this.state.openUser} close={this.closeUser}></PopUserViewer>
                        <PopAddUserViewer data={this.state.selected} dimmer={false} open={this.state.openAdd} close={this.closeAddUser}></PopAddUserViewer>
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
    console.log("store state:::",state);
    let account = state.registryAccount.account;
    let dimm =  state.btnMnmt;
    console.log('account -- '+account)
    
    let accountInfo = account ? account + Math.random()*10000 : null;
    let dimmInfo = dimm ? dimm : null;

    return {
        accountInfo,
        dimmInfo,
        itemLabel: state.computeItem.item,
        userToken : (state.user.userToken) ? state.userToken: null,
        searchValue : (state.searchValue.search) ? state.searchValue.search: null,
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
        handleRefreshData: (data) => { dispatch(actions.refreshData(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(DeveloperListView));


