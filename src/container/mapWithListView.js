import _ from 'lodash'
import React from 'react';
import { Modal, Grid, Header, Button, Table, Menu, Icon, Input, Divider, Container, Sticky } from 'semantic-ui-react';
import {findDOMNode} from 'react-dom'
import ReactTooltip from 'react-tooltip'
import { connect } from 'react-redux';
import RGL, { WidthProvider } from "react-grid-layout";
import ContainerDimensions from 'react-container-dimensions';
import { GridLoader } from 'react-spinners';
import * as actions from '../actions';
import SelectFromTo from '../components/selectFromTo';
import RegistNewItem from './registNewItem';
import DeleteItem from './deleteItem';
import './styles.css';
import ClustersMap from '../libs/simpleMaps/with-react-motion/index_clusters';
import * as service from "../services/service_compute_service";
import PopDetailViewer from './popDetailViewer';
const ReactGridLayout = WidthProvider(RGL);


const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 20;

var layout = [
    {"w":24,"h":9,"x":0,"y":0,"i":"0","moved":false,"static":false, "title":"LocationView"},
    {"w":24,"h":11,"x":0,"y":9,"i":"1","moved":false,"static":false, "title":"Developer"},
]
const override = {
    display: 'fixed',
    position:'absolute',
    margin: '0 auto',
    borderColor: 'red'
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
            receivedData:null,
            direction:null,
            column:null,
            isDraggable: false,
            selectedItem:null,
            loading:false,
            openDelete:false,
            tooltipMsg:'No Message',
            tooltipVisible: false,
            detailViewData:null,
        };

        _self = this;

    }

    onHandleClick(dim, data) {
        console.log('on handle click == ', data)
        this.setState({ dimmer:dim, open: true, selected:data })
    }

    show = (dim) => this.setState({ dimmer:dim, open: true })
    close = () => {
        this.setState({ open: false, openDelete: false, selected:{} })
        this.props.handleInjectDeveloper(null)
    }
    closeDetail = () => {
        this.setState({ openDetail: false })
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
    generateDOM(open, dimmer, width, height) {
        return layout.map((item, i) => (

            (i === 1)?
                <div className="round_panel" key={i} style={{display:'flex', flexDirection:'column', width:'100%', height:'100%'}} >

                    <div className="grid_table" style={{width:'100%', height:height, overflowY:'auto'}}>
                        {this.TableExampleVeryBasic(width, height, this.props.headerLayout, this.props.hiddenKeys)}
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
                <div className="round_panel" key={i} style={{display:'flex', flexDirection:'column', width:'100%', height:'100%'}} >
                    <div className='panel_worldmap' style={{width:'100%', height:'100%'}}>
                        <ContainerOne ref={ref => this.container = ref} {...this.props} data={this.state.receivedData} gotoNext={this.gotoNext} zoomIn={this.zoomIn} zoomOut={this.zoomOut} resetMap={this.resetMap}></ContainerOne>
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
                <Table.HeaderCell width={3} textAlign='center' sorted={column === key ? direction : null} onClick={this.handleSort(key)}>
                    {key}
                </Table.HeaderCell>
                :
                <Table.HeaderCell textAlign='center' width={(headL)?headL[i]:widthDefault} sorted={column === key ? direction : null} onClick={this.handleSort(key)}>
                    {key}
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
        this.setState({detailViewData:item, openDetail:true})
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
                                        <Table.Cell key={j} textAlign='center' style={{whiteSpace:'nowrap'}}>
                                            <Button disabled={this.props.dimmInfo.onlyView} onClick={() => this.setState({openDelete: true, selected:item})}>Delete</Button>
                                            <Button disabled key={`key_${j}`} color='teal' onClick={() => this.onHandleClick(true, item)}>Edit</Button>
                                        </Table.Cell>
                                    :
                                    (value === 'Mapped_ports')?
                                        <Table.Cell key={j} textAlign='left'>
                                            <Icon name='server' size='big' onClick={() => this.onPortClick(value, item)} style={{cursor:'pointer'}}></Icon>
                                        </Table.Cell>
                                    :
                                    (value === 'CloudletLocation')?
                                        <Table.Cell key={j} textAlign='left' onClick={() => this.detailView(item)}  style={{cursor:'pointer'}}>
                                            <div ref={ref => this.tooltipref = ref}  data-tip='tooltip' data-for='happyFace'>
                                            {
                                                `Latitude : ${item[value].latitude}
                                                Longitude : ${item[value].longitude}`
                                            }
                                            </div>
                                        </Table.Cell>
                                    :
                                    (!( String(hidden).indexOf(value) > -1 )) ?
                                        <Table.Cell key={j} textAlign={(j === 0)?'left':'center'} ref={cell => this.tableCell = cell} onClick={() => this.detailView(item)} style={{cursor:'pointer'}}>
                                            <div ref={ref => this.tooltipref = ref}  data-tip='tooltip' data-for='happyFace'>
                                            {String(item[value])}
                                            </div>
                                        </Table.Cell>
                                    : null
                                ))}
                            </Table.Row>
                        ))
                    : <Table.Row>
                        <Table.Cell colSpan={Object.keys(this.state.dummyData[0]).length} textAlign='center' style={{fontSize:'28px'}}>
                            No Data
                        </Table.Cell>
                    </Table.Row>

                }
            </Table.Body>

        </Table>
    )
    handleSpinner(value) {
        _self.setState({loading:value})
    }
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
    componentDidUpdate(prevProps, prevState, snapshot) {
        console.log('-----component did update ------', prevState.dummyData, this.state.dummyData)
    }

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
        if(nextProps.devData) {
            this.setState({dummyData:nextProps.devData})
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
                                       handleSpinner={this.handleSpinner} userToken={this.props.userToken}
                                       success={this.successfully} zoomIn={this.zoomIn} zoomOut={this.zoomOut} resetMap={this.resetMap}
                        />

                        <DeleteItem open={this.state.openDelete}
                                    selected={this.state.selected} close={this.close} siteId={this.props.siteId}
                                    handleSpinner={this.handleSpinner}
                                    success={this.successfully}
                        ></DeleteItem>

                        <ReactGridLayout
                            layout={this.state.layout}
                            onLayoutChange={this.onLayoutChange}
                            {...this.props}
                            style={{width:width, height:height-20}}
                        >
                            {this.generateDOM(open, dimmer, width, height)}
                        </ReactGridLayout>

                        <div className="loadingBox">
                            <GridLoader
                                sizeUnit={"px"}
                                size={20}
                                color={'#70b2bc'}
                                loading={this.state.loading}
                            />
                        </div>
                        {(this.state.tooltipVisible) ?
                            <ReactTooltip className='customToolTip' id='happyFace' type='dark'>
                                <span>{this.state.tooltipMsg}</span>
                            </ReactTooltip>
                            : null
                        }
                        <PopDetailViewer data={this.state.detailViewData} dimmer={false} open={this.state.openDetail} close={this.closeDetail}></PopDetailViewer>
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

    return {
        accountInfo,
        dimmInfo,
        clickCity: state.clickCityList.list
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
        handleRefreshData: (data) => { dispatch(actions.refreshData(data))}
    };
};

export default connect(mapStateToProps, mapDispatchProps)(MapWithListView);


