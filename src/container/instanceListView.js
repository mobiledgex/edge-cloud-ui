import React from 'react';
import { Modal, Grid, Header, Button, Table, Icon, Input, Divider, List } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import ContainerDimensions from 'react-container-dimensions'

import SelectFromTo from '../components/selectFromTo';
import RegistNewItem from './registNewItem';

import './styles.css';

const ReactGridLayout = WidthProvider(RGL);


const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 20;
var layout = [
    {"w":19,"h":20,"x":0,"y":0,"i":"0","moved":false,"static":false, "title":"Developer"},
]

class InstanceListView extends React.Component {
    constructor(props) {
        super(props);

        const layout = this.generateLayout();
        this.state = {
            layout,open: false,
            dimmer:true,
            dummyData:[],
            selected:{}
        };

    }

    onHandleClick(dim, data) {
        console.log('on handle click == ', data)
        this.setState({ dimmer:dim, open: true, selected:data })

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





    generateDOM() {

        return layout.map((item, i) => (
            <div className="round_panel" key={i} style={{display:'flex'}}>
                <div className='grid_table'>
                    <ContainerDimensions>
                        { ({ width, height }) =>
                            <div style={{width:width, height:height-4, display:'flex', overflowY:'auto', overflowX:'hidden'}}>{this.TableExampleVeryBasic()}</div>
                        }
                    </ContainerDimensions>
                </div>
            </div>
        ))
    }

    generateLayout() {
        const p = this.props;

        return layout
    }

    onLayoutChange(layout) {
        //this.props.onLayoutChange(layout);
        console.log('changed layout = ', JSON.stringify(layout))
    }
    TableExampleVeryBasic = () => (
        <List divided style={{width:'100%'}}>
            {this.state.dummyData.map((data, i)=>(
                <List.Item className='detail_list'>
                    <List.Header>{data['Application Name']}</List.Header>
                    <Grid>
                        <Grid.Row columns={3}>
                            <Grid.Column width={3} className='detail_item'>
                                {Object.keys(data).map((key)=>(
                                    <div>{key}</div>
                                ))}
                            </Grid.Column>
                            <Grid.Column width={10}>
                                {Object.keys(data).map((key)=>(
                                    <div>{data[key]}</div>
                                ))}
                            </Grid.Column>
                            <Grid.Column width={3} style={{display:'flex', alignItems:'flex-end', justifyContent:'flex-end'}}>
                                <div>
                                    <Button onClick={() => alert('Are you sure?')}>Delete</Button>
                                    <Button disabled color='teal' bId={'edit_'+i} onClick={() => this.onHandleClick(true, data)}>Edit</Button>
                                </div>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </List.Item>
            ))}
        </List>
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
    componentDidMount() {
        this.setState({sizeH:800})
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
                            useCSSTransforms={false}
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
        width: 1600
    };
}

const mapStateToProps = (state) => {
    let account = state.registryAccount.account;
    console.log('account -- '+account)

    return (account)?{
        accountInfo: account + Math.random()*10000
    }:null;
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))}
    };
};

export default connect(mapStateToProps, mapDispatchProps)(InstanceListView);

