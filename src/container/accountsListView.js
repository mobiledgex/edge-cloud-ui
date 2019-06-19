import React from 'react';
import { Modal, Grid, Header, Button, Table, Menu, Icon, Input, Divider, Container } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
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
            verifyEmail:'',
            isDraggable: false,
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
    }

    getDataDeveloper(token) {
        services.getMCService('ShowRole',{token:token}, this.receiveResult)
    }
    receiveResult = (result) => {
        this.setState({orgData:result})
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

    popupSendEmail(email) {
        this.setState({openVerify:true, verifyEmail:email})
    }


     generateDOM(open, dimmer, width, height, hideHeader) {
        return layout.map((item, i) => (

            (i === 0)?
                <div className="round_panel" key={i} style={{ width:width, height:height, display:'flex', flexDirection:'column'}} >
                    <div className="grid_table" style={{width:'100%', height:height, overflowY:'auto'}}>
                        {this.TableExampleVeryBasic(width, height, this.props.headerLayout, this.props.hiddenKeys, this.state.dummyData)}
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
                <div className="round_panel" key={i} style={{ width:width, height:height, display:'flex', flexDirection:'column'}} >
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
        console.log('default width header -- ', widthDefault, filteredKeys)
        return filteredKeys.map((key, i) => (
            (i === filteredKeys.length -1) ?
                <Table.HeaderCell key={i} className='unsortable' width={2} textAlign='center'>
                    {key}
                </Table.HeaderCell>
                :
                <Table.HeaderCell key={i} className={(key === 'EmailVerified' || key === 'Locked')?'unsortable':''} textAlign='center' width={(headL)?headL[i]:widthDefault} sorted={column === key ? direction : null} onClick={(key !== 'EmailVerified' && key !== 'Locked' )?this.handleSort(key):null}>
                    {(key === 'EmailVerified')?'Email Verified':key}
                </Table.HeaderCell>
        ));
    }

    onLayoutChange(layout) {
        //this.props.onLayoutChange(layout);
        console.log('changed layout = ', JSON.stringify(layout))
    }

    detailView(item) {
        console.log("user >>>> ",item)
        if(!item['Username']){
            this.setState({detailViewData:item, openDetail:true})
        } else {
            this.setState({detailViewData:item, openUser:true})
        }
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

                                        <Button onClick={() => this.setState({openDelete: true, selected:item})}><Icon name={'trash alternate'}/></Button>

                                    </Table.Cell>
                                :
                                (value === 'Type')?
                                    <Table.Cell key={j} textAlign='center' onClick={() => this.detailView(item)} style={(this.state.selectUse == i)?{whiteSpace:'nowrap',background:'#444'} :{whiteSpace:'nowrap'}} >
                                        {/*<div className="markBox">{this.typeMark(item[value])}</div>*/}
                                        <span style={(item[value] == 'developer')?{color:'#9b9979'}:{color:'#7d969b'}}>{item[value]}</span>
                                    </Table.Cell>
                                :
                                (value === 'Username')?
                                    <Table.Cell key={j} textAlign='left'>
                                        <div className="left_menu_item" onClick={() => this.detailView(item)} style={{cursor:'pointer'}}>
                                        <Icon name='user circle' size='big' style={{marginRight:"6px"}} ></Icon> {(i==0) ? <div className="userNewMark">{'New'}</div> : null} {item[value]}
                                        </div>
                                    </Table.Cell>
                                :   
                                (value === 'EmailVerified')?
                                    <Table.Cell key={j} textAlign='center' style={{cursor:'pointer'}} >
                                        {
                                            (item[value] === true)?'Yes'
                                                // String(item[value])
                                                :
                                                <Button onClick={() => this.popupSendEmail(item['Email'])}>Send verification email</Button>
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

                        <DeleteItem open={this.state.openDelete}
                                    selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                                    success={this.successfully} refresh={this.props.dataRefresh}
                        ></DeleteItem>
                        <PopVerify open={this.state.openVerify} email={this.state.verifyEmail}
                                    selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                                    success={this.successfully} receiveResendVerify={this.receiveResendVerify}
                        ></PopVerify>
                        
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
    }

};
const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))},
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleUserRole: (data) => { dispatch(actions.showUserRole(data))},
        handleSelectOrg: (data) => { dispatch(actions.selectOrganiz(data))},
        handleRefreshData: (data) => { dispatch(actions.refreshData(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(AccountListView));


