import React from 'react';
import { Modal, Grid, Header, Button, Table, Menu, Icon, Input, Divider, Container } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as moment from 'moment';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import PopDetailViewer from './popDetailViewer';
import PopUserViewer from './popUserViewer';
import PopAddUserViewer from './popAddUserViewer';
import DeleteItem from './deleteItem';
import PopVerify from './popVerify';
import './styles.css';
import ContainerDimensions from 'react-container-dimensions'
import _ from "lodash";
import * as reducer from '../utils'
import * as services from '../services/service_compute_service';
import Alert from 'react-s-alert';


const ReactGridLayout = WidthProvider(RGL);

var layout = [
    {"w":19,"h":20,"x":0,"y":0,"i":"0", "moved":false,"static":false, "title":"Developer"},
]
let _self = null;

class AccountListView extends React.Component {
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
            orgData:{data:[]},
            selectUse:null,
            resultData:null,
            openDelete:false,
            openVerify:false,
            userName:'',
            verifyEmail:'',
            isDraggable: false,
        };

    }
    gotoUrl(site, subPath) {
        _self.props.history.push({
            pathname: site,
            search: subPath
        });
        _self.props.history.location.search = subPath;
        _self.props.handleChangeSite({mainPath:site, subPath: subPath})
    }
    onHandleClick(dim, data) {
        this.setState({ dimmer:dim, open: true, selected:data })
    }

    getDataDeveloper(token) {
        services.getMCService('ShowRole',{token:token}, this.receiveResult)
    }
    receiveResult = (result) => {
        //alert(JSON.stringify(result));
        this.setState({orgData:result})
    }
    receiveLockResult = (result) => {
        _self.props.handleComputeRefresh(true);
    }
    
    show = (dim) => this.setState({ dimmer:dim, openDetail: true })
    close = () => {
        this.setState({ open: false, openDelete: false, selected:{}, openVerify:false })
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
    receiveResendVerify(result) {
        Alert.success('Success send  ', {
            position: 'top-right',
            effect: 'slide',
            timeout: 5000
        });
       _self.props.handleLoadingSpinner(false);

    }

    popupSendEmail(user, email) {
        this.setState({openVerify:true, userName:user, verifyEmail:email})
    }


     generateDOM(open, dimmer, hideHeader) {
        return layout.map((item, i) => (

            (i === 0)?
                <div className="round_panel" key={i} style={{ display:'flex', flexDirection:'column'}} >
                    <div className="grid_table" style={{overflow:'hidden'}}>
                        {this.TableExampleVeryBasic(this.props.headerLayout, this.props.hiddenKeys, this.state.dummyData)}
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
        return filteredKeys.map((key, i) => (
            (i === filteredKeys.length -1) ?
                <Table.HeaderCell key={i} className='unsortable' width={2} textAlign='center'>
                    {
                        (key === 'Edit')? 'Action'
                            : key}
                </Table.HeaderCell>
                :
                <Table.HeaderCell key={i} className={(key === 'EmailVerified' || key === 'Locked')?'unsortable':''} textAlign='center' width={(headL)?headL[i]:widthDefault} sorted={column === key ? direction : null} onClick={(key !== 'EmailVerified' && key !== 'Locked' )?this.handleSort(key):null}>
                    {(key === 'EmailVerified')?'Email Verified':key}
                </Table.HeaderCell>
        ));
    }

    onLayoutChange(layout) {
        //this.props.onLayoutChange(layout);
    }

    detailView(item) {
        if(!item['Username']){
            this.setState({detailViewData:item, openDetail:true})
        } else {
            this.setState({detailViewData:item, openUser:true})
        }
    }
    onLocking(value) {
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        services.getMCService('SettingLock',{token:store ? store.userToken : 'null', params:{email:value.email, locked:value.lockState}}, this.receiveLockResult)
    }
    compareDate = (date) => {
        let isNew = false;
        let dName = 'd'
        let fromNow = moment(date).utc().startOf('day').fromNow();
        let darray = fromNow.split(' ')
        console.log('20191001 compare date ... ', date,":", fromNow, ":", darray)
        if(parseInt(darray[0]) <= 1 && darray[1] === 'days') isNew = true;

        if(parseInt(darray[0]) <= 24 && darray[1] === 'hours') isNew = true; dName='h'
        if(darray[0] === 'an' && darray[1] === 'hour') isNew = true; dName='h'

        if(parseInt(darray[0]) <= 60 && darray[1] === 'minutes') isNew = true; dName='m'

        if(parseInt(darray[0]) <= 60 && darray[1] === 'seconds') isNew = true; dName='s'

        return {new:isNew, days:darray[0]+dName};
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

                                        <Button disabled={item.Username === 'mexadmin'} onClick={() => this.setState({openDelete: true, selected:item})}><Icon name={'trash alternate'}/></Button>

                                    </Table.Cell>
                                :
                                (value === 'Type' && item[value])?
                                    <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)} style={(this.state.selectUse == i)?{whiteSpace:'nowrap',background:'#444'} :{whiteSpace:'nowrap'}} >
                                        {/*<div className="markBox">{this.typeMark(item[value])}</div>*/}
                                        <span style={(item[value] == 'developer')?{color:'#9b9979'}:{color:'#7d969b'}}>{item[value]}</span>
                                    </Table.Cell>
                                :
                                (value === 'Username' && item[value])?
                                    <Table.Cell key={j} textAlign='left'>
                                        <div className="left_menu_item" onClick={() => this.detailView(item)} style={{cursor:'pointer'}}>
                                        <Icon name='user circle' size='big' style={{marginRight:"6px"}} ></Icon> {this.compareDate(item['CreatedAt']).new ? <div className="userNewMark">{`New`}</div> : null} {item[value]}
                                        </div>
                                    </Table.Cell>
                                :
                                (value === 'EmailVerified' && item[value])?
                                    <Table.Cell key={j} textAlign='center' style={{cursor:'pointer'}} >
                                        {
                                            (item[value] === true)?'Yes'
                                                // String(item[value])
                                                :
                                                <Button onClick={() => this.popupSendEmail(item['Username'], item['Email'])}>Send verification email</Button>
                                        }

                                    </Table.Cell>
                                :
                                (value === 'Locked' && item[value])?
                                    <Table.Cell key={j} textAlign='center'
                                                onMouseEnter={() => {
                                                    document.body.style.cursor = "pointer";
                                                }}
                                                onMouseLeave={() => {
                                                    document.body.style.cursor = "default";
                                                }}
                                    >
                                        {
                                            (item[value] === true)?

                                                <Icon name='lock'       size={20} style={ {color:'#6a6a6a'}} onClick={() => this.onLocking({email:item['Email'], lockState:false})}/>
                                                :
                                                <Icon name='lock open'  size={20} style={{ color:'rgba(136,221,0,.9)'}} onClick={() => this.onLocking({email:item['Email'], lockState:true})}/>
                                        }

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
        //refresh the list

        _self.props.dataRefresh();
    }

    componentDidMount() {

    }
    componentWillReceiveProps(nextProps, nextContext) {
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
                    <div style={{display:'flex', overflowY:'auto', overflowX:'hidden', width:'100%'}}>

                        <DeleteItem open={this.state.openDelete}
                                    selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                                    success={this.successfully} refresh={this.props.dataRefresh}
                        ></DeleteItem>
                        <PopVerify open={this.state.openVerify} email={this.state.verifyEmail} user={this.state.userName}
                                    selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                                    success={this.successfully} receiveResendVerify={this.receiveResendVerify}
                        ></PopVerify>
                        
                        <div
                            layout={this.state.layout}
                            onLayoutChange={this.onLayoutChange}
                            {...this.props}
                            useCSSTransforms={false}
                            style={{width:'100%'}}
                        >
                            {this.generateDOM(open, dimmer, hiddenKeys)}
                        </div>
                        <PopDetailViewer data={this.state.detailViewData} dimmer={false} open={this.state.openDetail} close={this.closeDetail}></PopDetailViewer>
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
        userRole : state.showUserRole?state.showUserRole.role:null,
    }

};
const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleUserRole: (data) => { dispatch(actions.showUserRole(data))},
        handleSelectOrg: (data) => { dispatch(actions.selectOrganiz(data))},
        handleRefreshData: (data) => { dispatch(actions.refreshData(data))},
        handleComputeRefresh: (data) => { dispatch(actions.computeRefresh(data))},
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AccountListView));


