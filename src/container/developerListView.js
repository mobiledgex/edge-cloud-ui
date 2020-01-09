import React from 'react';
import {Header, Button, Table, Popup, Icon, Input} from 'semantic-ui-react';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import * as actions from '../actions';
import RGL, {WidthProvider} from "react-grid-layout";
import SelectFromTo from '../components/selectFromTo';
import RegistNewListItem from './registNewListItem';
import PopDetailViewer from './popDetailViewer';
import PopUserViewer from './popUserViewer';
import PopAddUserViewer from './popAddUserViewer';
import DeleteItem from './deleteItem';
import './styles.css';
import _ from "lodash";
import * as reducer from '../utils'

const ReactGridLayout = WidthProvider(RGL);

/*****************
 * configuration menus of Edit field
 * @type {number}
 */
const organizationEdit = [
    {key: 'Audit', text: 'Audit', icon: null},
    {key: 'AddUser', text: 'Add User', icon: null},
    {key: 'Delete', text: 'Delete', icon: 'trash alternate'},
]

const appssEdit = [
    {key: 'Launch', text: 'Audit', icon: null},
    {key: 'Update', text: 'Add User', icon: null},
    {key: 'Delete', text: 'Delete', icon: 'trash alternate'},
]

////////////

const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 20;
var layout = [
    {
        "w": 19,
        "h": 20,
        "x": 0,
        "y": 0,
        "i": "0",
        "minW": 8,
        "minH": 5,
        "moved": false,
        "static": false,
        "title": "Developer"
    }
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
            openDetail: false,
            dimmer: false,
            activeItem: '',
            dummyData: [],
            detailViewData: null,
            selected: {},
            openUser: false,
            selectUse: null,
            resultData: null,
            openDelete: false,
            isDraggable: false,
            noData: false,
            viewMode: 'listView',
            selectedRole: null,
            isOpen: false,
            isOpenTip: false,
            actionContextRef: 'actionCell_0',
            item: null
        };
        this.sorting = false;

    }

    gotoUrl(site, subPath, pg) {


        let arrSubPath = subPath.toString().split("&org=")
        let orgName = arrSubPath[1];

        this.props.history.push({
            pathname: site,
            search: subPath,
            goBack: pg,
            state:{
                orgName: orgName
            }
        });


        this.props.history.location.search = subPath;
        this.props.handleChangeSite({mainPath: site, subPath: subPath})
    }

    onHandleClick(dim, data) {
        this.setState({dimmer: dim, open: true, selected: data})
        //this.props.handleChangeSite(data.children.props.to)
    }

    onHandleClickAdd(dim, data) {
        this.setState({dimmer: dim, openAdd: true, selected: data})
        //this.props.handleChangeSite(data.children.props.to)
    }

    onHandleClickAudit(dim, data) {
        this.setState({page: 'pg=audits'})
        let orgName = data.Organization;
        console.log('20191018 on handle click audit --- ', data)
        this.gotoUrl('/site4', 'pg=audits&org=' + orgName)
    }

    onUseOrg(useData, key, evt) {
        this.setState({selectUse: key})
        if (this.props.roleInfo) {
            this.props.roleInfo.map((item, i) => {
                if (i == key) {
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

    show = (dim) => this.setState({dimmer: dim, openDetail: true})
    close = () => {
        this.setState({open: false, openDelete: false, selected: {}})
        this.props.handleInjectDeveloper(null)
    }
    closeDetail = () => {
        this.setState({openDetail: false})
    }
    closeUser = () => {
        this.setState({openUser: false})
    }
    closeAddUser = () => {
        this.setState({openAdd: false})
    }
    makeHeader_noChild = (title) => (
        <Header className='panel_title'>{title}</Header>
    )
    makeHeader_date = (title) => (
        <Header className='panel_title' style={{display: 'flex', flexDirection: 'row'}}>
            <div style={{display: 'flex', flexGrow: 8}}>{title}</div>
            <SelectFromTo style={{display: 'flex', alignSelf: 'flex-end'}}></SelectFromTo>
        </Header>
    )
    makeHeader_select = (title) => (
        <Header className='panel_title'>{title}</Header>
    )

    InputExampleFluid = (value) => <Input fluid placeholder={(this.state.dimmer === 'blurring') ? '' : value}/>

    generateStart() {

        (this.state.dummyData.length) ? this.setState({noData: false}) : this.setState({noData: true})
    }

    checkLengthData() {
        this.setState({noData: false})
        setTimeout(() => this.generateStart(), 2000)
    }

    generateDOM(open, dimmer, hideHeader) {
        return layout.map((item, i) => (

            (i === 0) ?

                <div className="round_panel" key={i} style={{display: 'flex', flexDirection: 'column'}}>
                    <div className={'grid_table ' + this.props.siteId}>
                        {
                            this.TableExampleVeryBasic(this.props.headerLayout, this.props.hiddenKeys, this.state.dummyData)
                        }
                    </div>

                    {/* <Table.Footer className='listPageContainer'>
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
                    </Table.Footer> */}

                </div>
                :
                <div className="round_panel" key={i} style={{display: 'flex', flexDirection: 'column'}}>
                    <div style={{overflowY: 'auto'}}>
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
        const {column, dummyData, direction} = _self.state
        if ((column !== clickedColumn) && dummyData) {
            let sorted = _.sortBy(dummyData, [clm => typeof clm[clickedColumn] === 'string' ? String(clm[clickedColumn]).toLowerCase() : clm[clickedColumn]])
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
        const {column, direction} = this.state
        let keys = Object.keys(_keys);
        //hide column filtered...
        let filteredKeys = (visibles) ? reducer.filterDefine(keys, visibles) : keys;

        let widthDefault = Math.round(16 / filteredKeys.length);
        return filteredKeys.map((key, i) => (
            (i === filteredKeys.length - 1) ?
                <Table.HeaderCell key={i} className='unsortable' width={(this.props.siteId == 'Organization') ? 3 : 2}
                                  textAlign='center'>
                    {
                        (key === 'Edit') ? 'Actions'
                            : key}
                </Table.HeaderCell>
                :
                <Table.HeaderCell key={i} className={(key === 'Phone' || key === 'Address') ? 'unsortable' : ''}
                                  textAlign='left' width={(headL) ? headL[i] : widthDefault}
                                  sorted={column === key ? direction : null}
                                  onClick={(key !== 'Phone' && key !== 'Address') ? this.handleSort(key) : null}>
                    {(key === 'FlavorName') ? 'Flavor Name'
                        : (key === 'RAM') ? 'RAM Size(MB)'
                            : (key === 'vCPUs') ? 'Number of vCPUs'
                                : (key === 'Disk') ? 'Disk Space(GB)'
                                    : (key === 'OrganizationName') ? 'Organization Name'
                                        : (key === 'AppName') ? 'App Name'
                                            : (key === 'DeploymentType') ? 'Deployment Type'
                                                : (key === 'DefaultFlavor') ? 'Default Flavor'
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
        if (!item['Username']) {
            this.setState({detailViewData: item, openDetail: true})
        } else {
            this.setState({detailViewData: item, openUser: true})
        }
    }

    roleMark = (role) => (
        (role.indexOf('Admin') !== -1 && role.indexOf('Manager') !== -1) ? <div className="mark markA markS">S</div> :
            (role.indexOf('Developer') !== -1 && role.indexOf('Manager') !== -1) ?
                <div className="mark markD markM">M</div> :
                (role.indexOf('Developer') !== -1 && role.indexOf('Contributor') !== -1) ?
                    <div className="mark markD markC">C</div> :
                    (role.indexOf('Developer') !== -1 && role.indexOf('Viewer') !== -1) ?
                        <div className="mark markD markV">V</div> :
                        (role.indexOf('Operator') !== -1 && role.indexOf('Manager') !== -1) ?
                            <div className="mark markO markM">M</div> :
                            (role.indexOf('Operator') !== -1 && role.indexOf('Contributor') !== -1) ?
                                <div className="mark markO markC">C</div> :
                                (role.indexOf('Operator') !== -1 && role.indexOf('Viewer') !== -1) ?
                                    <div className="mark markO markV">V</div> : <div></div>
    )
    typeMark = (type) => (
        (type.indexOf('developer') !== -1) ? <div className="mark type markD markM"></div> :
            (type.indexOf('operator') !== -1) ? <div className="mark type markO markM"></div> : <div></div>
    )
    addUserDisable = (orgName) => {
        let dsb = false;
        if (this.props.roleInfo && localStorage.selectRole !== 'AdminManager') {
            this.props.roleInfo.map((item, i) => {
                if (item.org == orgName.Organization) {
                    if (item.role == 'DeveloperContributor') dsb = true
                    else if (item.role == 'DeveloperViewer') dsb = true
                    else if (item.role == 'OperatorContributor') dsb = true
                    else if (item.role == 'OperatorViewer') dsb = true
                }
            })
        }
        return dsb;
    }
    userRoleActive = (data) => {
        let btn = true;
        this.props.roleInfo.map((item) => {
            if (item.role.indexOf('Manager') > -1 && item.org == data.Organization) {
                btn = false;
            }
        })
        if (localStorage.selectRole == 'AdminManager') {
            btn = false;
        }
        return btn;
    }
    appLaunch = (data) => {
        this.gotoUrl('/site4', 'pg=createAppInst', 'pg=5')
        this.props.handleAppLaunch(data)
        // this.props.handleChangeComputeItem('App Instances')
        localStorage.setItem('selectMenu', 'App Instances')
    }
    handleOpen = () => {
        this.setState({isOpen: true})

        // this.timeout = setTimeout(() => {
        //     this.setState({ isOpen: false })
        // }, timeoutLength)
    }

    handleClose = () => {
        this.setState({isOpen: false, isOpenTip: false})
        //clearTimeout(this.timeout)
    }
    onHandleScroll = () => {
        this.setState({isOpen: false, isOpenTip: false})
    }
    /* onClickDropMenu = (item, value, idx) => {
         _self.setState({actionContextRef: 'actionCell_' + idx})
         setTimeout(() => _self.setState({isOpen: true, isOpenTip: false}), 100)

         //set state for use audit
         _self.setState({orgName: item.Organization, item: item})
     }*/
    onOverDropMenu = (item, value, idx) => {
        _self.setState({actionContextRef: 'actionCell_' + idx})
        setTimeout(() => _self.setState({isOpenTip: true}), 100)

        //set state for use audit
        _self.setState({orgName: item.Organization, item: item})
    }
    onOutDropMenu = (item, value, idx) => {
        _self.setState({actionContextRef: ''})
        setTimeout(() => _self.setState({isOpenTip: false}), 100)

    }


    /*******
     * If you click the buttons that are grouped
     ** *****/
    onHandlePopMenu = (a, b) => {
        this.setState({isOpen: false})
        console.log('20191104 ... on handle pop menu.. ', a, b.children, ': orgName=', this.state.orgName)

        //@desc: Audit in ContextMenu
        //@desc: Audit in ContextMenu
        //@desc: Audit in ContextMenu
        if (b.children === 'Audit') {


            this.onHandleClickAudit(true, {Organization: this.state.orgName})
            this.setState({page: 'pg=audits'})
            let orgName = this.state.orgName
            this.gotoUrl('/site4', 'pg=audits&org=' + orgName)

        } else if (b.children === 'Add User') {
            this.onHandleClickAdd(true, this.state.item)
        } else if (b.children === 'Delete') {
            this.setState({openDelete: true, selected: this.state.item})
        }

    }
    makeActionButton = (item, j, i) => (
        <Button.Group vertical className="table_actions_popup_group">
            {
                organizationEdit.map((option, i) => (
                    <Button key={i} ref={btn => this.actionButton = btn} onClick={this.onHandlePopMenu}
                            className="table_actions_popup_group_button">
                        {option.text}
                    </Button>
                ))
            }
        </Button.Group>
    )

    //@desc: #############################################################
    //@desc: Organizations ---> actions contextButton
    //@desc: #############################################################
    makeEditButtonGroup = (item, value, j, index) => (
        <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
            <div ref={acell => this['actionCell_' + index] = acell}
                 style={{backgroundColor: 'transparent', width: 0, height: 0, position: 'relative'}}></div>
            <Button
                    className="table_actions_button"
                    disabled={(localStorage.selectRole === 'AdminManager' || (this.state.selectUse == index)) ? false : true}
                    // color={localStorage.selectRole === 'AdminManager' ? 'teal' : (this.state.selectUse == index) ? 'teal' : null}
                    onClick={() => {
                        this.setState({actionContextRef: 'actionCell_' + index})
                        setTimeout(() => this.setState({isOpen: true, isOpenTip: false}), 100)
                        this.setState({orgName: item.Organization, item: item})


                    }}
                    onMouseOver={() => _self.onOverDropMenu(item, value, index)}
                    onMouseOut={() => _self.onOutDropMenu(item, value, index)}>
                <Button.Content visible>
                    <Icon name='bars'/>
                </Button.Content>
            </Button>
        </div>
    )
    makeEditMenu = (item, j, i) => (
        <div key={j} textalign='center'
             style={(this.state.selectUse == i) ? {whiteSpace: 'nowrap', background: '#444'} : {whiteSpace: 'nowrap'}}>
            {(this.props.siteId == 'Organization' && localStorage.selectRole !== 'AdminManager') ?
                <Button className='stepOrgDeveloper1' color={(this.state.selectUse == i) ? 'teal' : null}
                        onClick={(evt) => this.onUseOrg(item, i, evt)}>
                    Manage
                </Button> : null}
            <Button disabled style={{display: 'none'}} key={`key_${j}`} color='teal'
                    onClick={() => this.onHandleClick(true, item)}><Icon name={'edit'}/></Button>
            {(this.props.siteId == 'Organization') ?
                <Button className='stepOrgDeveloper3' color='teal' disabled={this.addUserDisable(item)}
                        onClick={() => this.onHandleClickAudit(true, item, i)}>
                    Audit
                </Button> : null}
            {(this.props.siteId == 'Organization') ?
                <Button className='stepOrgDeveloper3' color='teal' disabled={this.addUserDisable(item)}
                        onClick={() => this.onHandleClickAdd(true, item, i)}>
                    Add User
                </Button> : null}
            {(this.props.siteId == 'App') ?
                <Button color='teal' disabled={this.props.dimmInfo.onlyView} onClick={() => this.appLaunch(item)}>
                    Launch
                </Button> : null}
            <Button className='stepOrgDeveloper4'
                    disabled={
                        (localStorage.selectMenu !== 'Organizations') ?
                            ((item['Role Type'] == 'AdminManager') ? true : (localStorage.selectMenu == 'User Roles') ? this.userRoleActive(item) : this.props.dimmInfo.onlyView) :
                            this.addUserDisable(item)
                    }

                    onClick={() => this.setState({openDelete: true, selected: item})}><Icon
                name={'trash alternate'}/></Button>

        </div>
    )
    TableExampleVeryBasic = (headL, hideHeader, datas) => (
        <Table className="viewListTable" basic='very' sortable striped celled fixed collapsing>
            <Table.Header className="viewListTableHeader">
                <Table.Row>
                    {(this.state.dummyData.length > 0) ? this.makeHeader(this.state.dummyData[0], headL, hideHeader) : null}
                </Table.Row>
            </Table.Header>

            <Table.Body className="tbBodyList" onScroll={this.onHandleScroll}>
                {
                    (datas.length) ? datas.map((item, i) => (
                        <Table.Row key={i} id={'tbRow_' + i} style={{position: 'relative'}}>
                            {Object.keys(item).map((value, j) => (
                                (value === 'Edit') ?
                                    String(item[value]) === 'null' ? <Table.Cell/> :
                                        <Table.Cell className="table_actions" key={j} textAlign='center'
                                                    style={(this.state.selectUse == i) ? {
                                                        whiteSpace: 'nowrap',
                                                        background: '#444',
                                                        overflow: 'visible'
                                                    } : {whiteSpace: 'nowrap', overflow: 'visible'}}>

                                            {(this.props.siteId == 'Organization' && localStorage.selectRole !== 'AdminManager') ?
                                                <Button className='stepOrgDeveloper1'
                                                        color={(this.state.selectUse == i) ? 'teal' : null}
                                                        onClick={(evt) => this.onUseOrg(item, i, evt)}>
                                                    {/* <Icon name='check' /> */}
                                                    Manage
                                                </Button> : null
                                            }
                                            {
                                                (this.props.siteId == 'Organization') ? this.makeEditButtonGroup(item, value, j, i) : this.makeEditMenu(item, j, i)
                                            }


                                        </Table.Cell>
                                    :
                                    (value === 'Type') ?
                                        <Table.Cell key={j} textAlign='left' onClick={() => this.detailView(item)}
                                                    style={(this.state.selectUse == i) ? {
                                                        whiteSpace: 'nowrap',
                                                        background: '#444'
                                                    } : {whiteSpace: 'nowrap'}}>
                                            {/*<div className="markBox">{this.typeMark(item[value])}</div>*/}
                                            <span
                                                style={(item[value] == 'developer') ? {color: '#9b9979'} : {color: '#7d969b'}}>{item[value]}</span>
                                        </Table.Cell>
                                        :
                                        (value === 'Mapped_ports') ?
                                            <Table.Cell key={j} textAlign='left'>
                                                <Icon name='server' size='big'
                                                      onClick={() => this.onPortClick(true, item)}
                                                      style={{cursor: 'pointer'}}></Icon>
                                            </Table.Cell>
                                            :
                                            (value === 'Username') ?
                                                <Table.Cell key={j} textAlign='left'>
                                                    <div className="left_menu_item"
                                                         onClick={() => this.detailView(item)}
                                                         style={{cursor: 'pointer'}}>
                                                        <Icon name='user circle' size='big'
                                                              style={{marginRight: "6px"}}></Icon> {item[value]}
                                                    </div>
                                                </Table.Cell>
                                                :
                                                (value === 'Role Type') ?
                                                    <Table.Cell key={j} textAlign='left'
                                                                onClick={() => this.detailView(item)}
                                                                style={{cursor: 'pointer'}}>
                                                        <div className="markBox">{this.roleMark(item[value])}</div>
                                                        {item[value]}
                                                    </Table.Cell>
                                                    :
                                                    (value === 'DeploymentType') ?
                                                        <Table.Cell key={j} textAlign='center'
                                                                    onClick={() => this.detailView(item)}
                                                                    style={{cursor: 'pointer'}}>
                                                            {
                                                                (item[value] == 'docker') ? 'Docker' :
                                                                    (item[value] == 'kubernetes') ? 'Kubernetes' :
                                                                        (item[value] == 'vm') ? 'VM' :
                                                                            (item[value] == 'helm') ? 'Helm' :
                                                                                item[value]
                                                            }
                                                        </Table.Cell>
                                                        :
                                                        (value === 'Ports') ?
                                                            <Table.Cell key={j} textAlign='center'
                                                                        onClick={() => this.detailView(item)}
                                                                        style={{cursor: 'pointer'}}>
                                                                {
                                                                    String(item[value]).toUpperCase()
                                                                }
                                                            </Table.Cell>
                                                            :
                                                            (!(String(hideHeader).indexOf(value) > -1)) ?
                                                                <Table.Cell key={j}
                                                                            textAlign={(value === 'Region') ? 'center' : (j === 0 || value.indexOf('Name') !== -1) ? 'left' : 'left'}
                                                                            onClick={() => this.detailView(item)}
                                                                            style={(this.state.selectUse == i) ? {
                                                                                cursor: 'pointer',
                                                                                background: '#444'
                                                                            } : {cursor: 'pointer'}}>
                                                                    <div ref={ref => this.tooltipref = ref}
                                                                         data-tip='tooltip' data-for='happyFace'>
                                                                        {String(item[value])}
                                                                    </div>
                                                                </Table.Cell>
                                                                : null

                            ))}
                        </Table.Row>
                    )) : null
                }
            </Table.Body>

        </Table>
    )

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps, nextContext) {
        console.log('20191104 nextprops devData.. ', nextProps.devData)
        if (nextProps.accountInfo) {
            this.setState({dimmer: 'blurring', open: true})
        }
        if (nextProps.devData.length) {
            this.setState({
                dummyData: nextProps.devData,
                resultData: (!this.state.resultData) ? nextProps.devData : this.state.resultData
            })
        } else {
            this.setState({dummyData: nextProps.devData})
            this.checkLengthData();
        }
        if (nextProps.searchValue) {
            let searchData = reducer.filterSearch(nextProps.devData, nextProps.searchValue, nextProps.searchType);
            this.setState({dummyData: searchData})
        }
    }

    render() {
        const {open, dimmer, viewMode} = this.state;
        const {hiddenKeys} = this.props;
        return (
            <div style={{display: 'flex', overflowY: 'auto', overflowX: 'hidden', width: '100%'}}>
                <RegistNewListItem data={this.state.dummyData} resultData={this.state.resultData}
                                   dimmer={this.state.dimmer} open={this.state.open} selected={this.state.selected}
                                   close={this.close} refresh={this.props.dataRefresh}/>

                <DeleteItem open={this.state.openDelete}
                            selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                            refresh={this.props.dataRefresh}
                ></DeleteItem>

                <div style={{width: '100%'}}>
                    {
                        (viewMode === 'listView') ? this.generateDOM(open, dimmer, hiddenKeys)
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
                <PopDetailViewer data={this.state.detailViewData} dimmer={false} open={this.state.openDetail}
                                 close={this.closeDetail} siteId={this.props.siteId}></PopDetailViewer>
                <PopUserViewer data={this.state.detailViewData} dimmer={false} open={this.state.openUser}
                               close={this.closeUser}></PopUserViewer>
                <PopAddUserViewer data={this.state.selected} dimmer={false} open={this.state.openAdd}
                                  close={this.closeAddUser}></PopAddUserViewer>
            </div>

        );

    }

    static defaultProps = {
        className: "layout",
        items: 20,
        rowHeight: 30,
        cols: 12,
        width: 1600,
        isDraggable: false,
        roleInfo: []

    };
}

const mapStateToProps = (state) => {
    let account = state.registryAccount.account;
    let dimm = state.btnMnmt;
    let accountInfo = account ? account + Math.random() * 10000 : null;
    let dimmInfo = dimm ? dimm : null;

    return {
        accountInfo,
        dimmInfo,
        itemLabel: state.computeItem.item,
        userToken: (state.user.userToken) ? state.userToken : null,
        searchValue: (state.searchValue.search) ? state.searchValue.search : null,
        searchType: (state.searchValue.scType) ? state.searchValue.scType : null,
        userRole: state.showUserRole ? state.showUserRole.role : null,
        roleInfo: state.roleInfo ? state.roleInfo.role : null,
    }

    // return (dimm) ? {
    //     dimmInfo : dimm
    // } : (account)? {
    //     accountInfo: account + Math.random()*10000
    // } : null;
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => {
            dispatch(actions.changeSite(data))
        },
        handleInjectDeveloper: (data) => {
            dispatch(actions.registDeveloper(data))
        },
        handleUserRole: (data) => {
            dispatch(actions.showUserRole(data))
        },
        handleSelectOrg: (data) => {
            dispatch(actions.selectOrganiz(data))
        },
        handleRefreshData: (data) => {
            dispatch(actions.refreshData(data))
        },
        handleAppLaunch: (data) => {
            dispatch(actions.appLaunch(data))
        },
        handleChangeComputeItem: (data) => {
            dispatch(actions.computeItem(data))
        },
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(DeveloperListView));


