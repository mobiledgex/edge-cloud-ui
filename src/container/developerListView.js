import React from 'react';
import { Modal, Grid, Header, Button, Table, Menu, Icon, Input, Divider, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import SelectFromTo from '../components/selectFromTo';
import RegistNewListItem from './registNewListItem';
import PopDetailViewer from './popDetailViewer';
import PopUserViewer from './popUserViewer';
import './styles.css';
import ContainerDimensions from 'react-container-dimensions'
import _ from "lodash";
import * as reducer from '../utils'
import MaterialIcon from "material-icons-react";

const ReactGridLayout = WidthProvider(RGL);


const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 20;
var layout = [
    {"w":19,"h":20,"x":0,"y":0,"i":"0","moved":false,"static":false, "title":"Developer"},
]

class DeveloperListView extends React.Component {
    constructor(props) {
        super(props);

        const layout = this.generateLayout();
        this.state = {
            layout,
            open: false,
            openDetail:false,
            dimmer:false,
            activeItem:'',
            dummyData : [],
            detailViewData:null,
            selected:{},
            openUser:false
        };

    }

    onHandleClick(dim, data) {
        console.log('on handle click == ', data)
        this.setState({ dimmer:dim, open: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }
    onHandleClicAdd(dim, data) {
        console.log('on handle click == ', data)
        this.setState({ dimmer:dim, open: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }

    show = (dim) => this.setState({ dimmer:dim, openDetail: true })
    close = () => {
        this.setState({ open: false })
        this.props.handleInjectDeveloper(null)
    }
    closeDetail = () => {
        this.setState({ openDetail: false })
    }
    closeUser = () => {
        this.setState({ openUser: false })
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

        //let keys = Object.keys(this.state.dummyData);
        //hide column filtered...
        //let filteredKeys = (hideHeader) ? reducer.filterDefine(keys, hideHeader) : keys;
        let filteredDummyData = Object.assign([], this.state.dummyData);

        if(hideHeader && filteredDummyData.length > 0) {
            filteredDummyData  = reducer.filterDefineKey(filteredDummyData, hideHeader);
        }
        console.log('filteredDummyData -- ', filteredDummyData)

        return layout.map((item, i) => (

            (i === 0)?
                <div className="round_panel" key={i} style={{ width:width, height:height, display:'flex', flexDirection:'column'}} >
                    <div className="grid_table" style={{width:'100%', height:height, overflowY:'auto'}}>
                        {this.TableExampleVeryBasic(width, height, this.props.headerLayout, hideHeader, this.state.dummyData)}
                    </div>

                    <Table.Footer className='listPageContainer'>
                        <Table.Row>
                            <Table.HeaderCell colspan={100}>
                                <Menu floated={'center'} pagination>
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
                <Table.HeaderCell width={3} textAlign='center' sorted={column === key ? direction : null} onClick={this.handleSort(key)}>
                    {key}
                </Table.HeaderCell>
                :
                <Table.HeaderCell textAlign='center' width={(headL)?headL[i]:widthDefault} sorted={column === key ? direction : null} onClick={this.handleSort(key)}>
                    {key}
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
        if(!item['UserName']){
            this.setState({detailViewData:item, openDetail:true})
        } else {
            this.setState({detailViewData:item, openUser:true})
        }
    }
    roleMark = (role) => (
        (role.indexOf('Manager')!==-1) ? <div className="mark markM">M</div> :
        (role.indexOf('Contributor')!==-1) ? <div className="mark markC">C</div> :
        (role.indexOf('Viewer')!==-1) ? <div className="mark markV">V</div> : <div></div>
    )

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
                        <Table.Row key={i}>
                            {Object.keys(item).map((value, j) => (
                                (value === 'Edit')?
                                    <Table.Cell key={j} textAlign='center' style={{whiteSpace:'nowrap'}}>
                                        <Button key={`key_${j}`} color='teal' disabled={this.props.dimmInfo.onlyView} onClick={() => this.onHandleClick(true, item)}>Edit</Button>
                                        {(item['AdminUsername'])?<Button color='teal' disabled={this.props.dimmInfo.onlyView} onClick={() => this.onHandleClicAdd(true, item)}>Add User</Button>:null}
                                        <Button disabled={this.props.dimmInfo.onlyView} onClick={() => alert('Are you sure?')}><Icon name={'trash alternate'}/></Button>
                                    </Table.Cell>
                                :
                                (value === 'Mapped_ports')?
                                    <Table.Cell key={j} textAlign='left'>
                                        <Icon name='server' size='big' onClick={() => this.onPortClick(true, item)} style={{cursor:'pointer'}}></Icon>
                                    </Table.Cell>
                                :
                                (value === 'UserName')?
                                    <Table.Cell key={j} textAlign='left'>
                                        <div className="left_menu_item" onClick={() => this.detailView(item)} style={{cursor:'pointer'}}>
                                        <Icon name='user circle' size='big' style={{marginRight:"6px"}} ></Icon> {(i==0) ? <div className="userNewMark">{'New'}</div> : null} {item[value]}
                                        </div>
                                    </Table.Cell>
                                :   
                                (value === 'TypeRole')?
                                    <Table.Cell key={j} textAlign='left' onClick={() => this.detailView(item)} style={{cursor:'pointer'}} >
                                        <div className="markBox">{this.roleMark(item[value])}</div>
                                        {item[value]}
                                    </Table.Cell>
                                :  
                                    <Table.Cell key={j} textAlign='left' onClick={() => this.detailView(item)} style={{cursor:'pointer'}}> {item[value]} </Table.Cell>
                            ))}
                        </Table.Row>
                    ))
                }
            </Table.Body>

        </Table>
    )
    componentWillReceiveProps(nextProps, nextContext) {
                console.log('nextProps')
        if(nextProps.accountInfo){
            this.setState({ dimmer:'blurring', open: true })
        }
        if(nextProps.devData) {
            this.setState({dummyData:nextProps.devData})
        }
    }

    render() {
        const { open, dimmer } = this.state;
        const { hideHeader } = this.props;
        return (
            <ContainerDimensions>
                { ({ width, height }) =>
                    <div style={{width:width, height:height, display:'flex', overflowY:'auto', overflowX:'hidden'}}>
                        <RegistNewListItem data={this.state.dummyData} dimmer={this.state.dimmer} open={this.state.open} selected={this.state.selected} close={this.close}/>
                        <ReactGridLayout
                            layout={this.state.layout}
                            onLayoutChange={this.onLayoutChange}
                            {...this.props}
                            style={{width:width, height:height-20}}
                        >
                            {this.generateDOM(open, dimmer, width, height, hideHeader)}
                        </ReactGridLayout>
                        <PopDetailViewer data={this.state.detailViewData} dimmer={false} open={this.state.openDetail} close={this.closeDetail}></PopDetailViewer>
                        <PopUserViewer data={this.state.detailViewData} dimmer={false} open={this.state.openUser} close={this.closeUser}></PopUserViewer>
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
        width: 1600
    };
}

const mapStateToProps = (state) => {
    let account = state.registryAccount.account;
    let dimm =  state.btnMnmt;
    console.log('account -- '+account)
    
    let accountInfo = account ? account + Math.random()*10000 : null;
    let dimmInfo = dimm ? dimm : null;

    return {
        accountInfo,
        dimmInfo
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
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))}
    };
};

export default connect(mapStateToProps, mapDispatchProps)(DeveloperListView);


