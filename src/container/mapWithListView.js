import _ from 'lodash'
import React from 'react';
import { Modal, Grid, Header, Button, Table, Menu, Icon, Input, Divider, Container, Sticky } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import SelectFromTo from '../components/selectFromTo';
import RegistNewItem from './registNewItem';
import './styles.css';
import ContainerDimensions from 'react-container-dimensions'
import ClustersMap from '../libs/simpleMaps/with-react-motion/index_clusters';

const ReactGridLayout = WidthProvider(RGL);


const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 13;

var layout = [
    {"w":19,"h":8,"x":0,"y":0,"i":"0","moved":false,"static":false, "title":"LocationView"},
    {"w":19,"h":14,"x":0,"y":8,"i":"1","moved":false,"static":false, "title":"Developer"},
]
let headerLayout = [1,2,1,3,2,2,3,2,1,2]

const ContainerOne = (props) => (

    <ClustersMap parentProps={props}/>

);
let _self = null;
class MapWithListView extends React.Component {
    constructor(props) {
        super(props);

        const layout = this.generateLayout();
        this.state = {
            layout,
            open: false,
            dimmer:true,
            activeItem:'',
            dummyData : [],
            selected:{},
            sideVisible:null,
            receivedData:null,
            direction:null,
            column:null,
            isDraggable: false,
        };

        _self = this;

    }

    onHandleClick(dim, data) {
        console.log('on handle click == ', data)
        this.setState({ dimmer:dim, open: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }

    show = (dim) => this.setState({ dimmer:dim, open: true })
    close = () => {
        this.setState({ open: false })
        this.props.handleInjectDeveloper(null)
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
                data: _.sortBy(dummyData, [clickedColumn]),
                direction: 'ascending',
            })

            return
        }

        this.setState({
            data: dummyData.reverse(),
            direction: direction === 'ascending' ? 'descending' : 'ascending',
        })
    }
    generateDOM(open, dimmer, width, height) {

        return layout.map((item, i) => (

            (i === 1)?
                <div className="round_panel" key={i} style={{padding:10, display:'flex', flexDirection:'column'}} >

                    <div style={{width:'100%', height:height-50, overflowY:'auto'}}>
                        {this.TableExampleVeryBasic(width, height, headerLayout)}
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
                <div className="round_panel" key={i} style={{ padding:10, display:'flex', flexDirection:'column'}} >
                    <div style={{width:'100%', height:'100%', overflow:'hidden'}}>
                        clusters position on the Map
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

    makeHeader(_keys, headL) {
        const { column, direction } = this.state
        let keys = Object.keys(_keys);
        let widthDefault = Math.round(16/keys.length);
        console.log('default width header -- ', widthDefault)
        return keys.map((key, i) => (
            (i === keys.length -1) ?
                <Table.HeaderCell style={{color:'#c8c8c8'}} width={3} textAlign='center' sorted={column === key ? direction : null} onClick={this.handleSort(key)}>
                    {key}
                </Table.HeaderCell>
                :
                <Table.HeaderCell style={{color:'#c8c8c8'}} textAlign='center' width={(headL)?headL[i]:widthDefault} sorted={column === key ? direction : null} onClick={this.handleSort(key)}>
                    {key}
                </Table.HeaderCell>
        ));
    }

    onLayoutChange(layout) {
        //this.props.onLayoutChange(layout);
        console.log('changed layout = ', JSON.stringify(layout))
    }
    onPortClick(a,b) {
        alert(b[a])
    }
    TableExampleVeryBasic = (w, h, headL) => (
        <Table className="viewListTable" basic='very' striped celled fixed sortable ref={ref => this.viewListTable = ref} style={{width:'100%'}}>
            <Table.Header className="viewListTableHeader"  style={{width:'100%'}}>
                <Table.Row style={{color:'#eeeeee'}}>
                    {(this.state.dummyData.length > 0)?this.makeHeader(this.state.dummyData[0], headL):null}
                </Table.Row>
            </Table.Header>
            <Table.Body className="tbBodyList">
                {
                    this.state.dummyData.map((item, i) => (
                        <Table.Row key={i}>
                            {Object.keys(item).map((value, j) => (
                                (value === 'Edit')?
                                    <Table.Cell key={j} textAlign='center'>
                                        <Button onClick={() => alert('Are you sure?')}>Delete</Button>
                                        <Button key={`key_${j}`} color='teal' onClick={() => this.onHandleClick(true, item)}>Edit</Button>
                                    </Table.Cell>
                                :
                                (value === 'Mapped_ports')?
                                    <Table.Cell key={j} textAlign='left'>
                                        <Icon name='server' size='big' onClick={() => this.onPortClick(value, item)} style={{cursor:'pointer'}}></Icon>
                                    </Table.Cell>
                                :
                                (value === 'CloudletLocation')?
                                    <Table.Cell key={j} textAlign='left'>
                                        {
                                            `L : ${item[value].latitude}
                                            R : ${item[value].longitude}`
                                        }
                                    </Table.Cell>
                                :
                                    <Table.Cell key={j} textAlign='left'>{String(item[value])}</Table.Cell>
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
        return (
            <ContainerDimensions>
                { ({ width, height }) =>
                    <div style={{width:width, height:height, display:'flex', overflowY:'auto', overflowX:'hidden'}}>
                        <RegistNewItem data={this.state.dummyData} dimmer={this.state.dimmer} open={this.state.open} selected={this.state.selected} close={this.close}/>
                        <ReactGridLayout
                            layout={this.state.layout}
                            onLayoutChange={this.onLayoutChange}
                            {...this.props}
                            style={{width:width, height:height-20}}
                        >
                            {this.generateDOM(open, dimmer, width, height)}
                        </ReactGridLayout>
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
    console.log('account -- '+account)

    return (account)? {
        accountInfo: account + Math.random()*10000
    }:null;
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))}
    };
};

export default connect(mapStateToProps, mapDispatchProps)(MapWithListView);


