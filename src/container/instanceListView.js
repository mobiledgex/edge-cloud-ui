import React from 'react';
import { Modal, Grid, Header, Button, Table, Menu, Icon, Input, Divider, List } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import ContainerDimensions from 'react-container-dimensions'

import SelectFromTo from '../components/selectFromTo';

import './styles.css';

const ReactGridLayout = WidthProvider(RGL);


const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 13;
var layout = [
    {"w":19,"h":18,"x":0,"y":0,"i":"0","moved":false,"static":false, "title":"Developer"},
]

class InstanceListView extends React.Component {
    constructor(props) {
        super(props);

        const layout = this.generateLayout();
        this.state = { layout,open: false, dimmer:true};
        this.dummyData = [
            {"Index":"110", "id":"5011", "Developer Name":"Mobiledgex SDK Demo", "Application Name":"Face Detection Demo1",
                "Version":"1.0", "Image Path":"mexdemo-hamburg-cloudlet.tdg.mobiledgex.net","Image Type":"ImageTypeDocker",
                "URI":"mobiledgexsdkdemofacedectiondemo10.mexdemo-westindia-cloudlet.azure.mobiledgex.net", "Flavor":"x1.small",
                "Cloudlet Key":"azure", "Cloudlet Name":"mexdemo-hamburg-cloudlet"},
            {"Index":"110", "id":"5011", "Developer Name":"Mobiledgex SDK Demo", "Application Name":"Face Detection Demo2",
                "Version":"1.0", "Image Path":"mexdemo-hamburg-cloudlet.tdg.mobiledgex.net","Image Type":"ImageTypeDocker",
                "URI":"mobiledgexsdkdemofacedectiondemo10.mexdemo-westindia-cloudlet.azure.mobiledgex.net", "Flavor":"x1.small",
                "Cloudlet Key":"azure", "Cloudlet Name":"mexdemo-hamburg-cloudlet"},
            {"Index":"110", "id":"5011", "Developer Name":"Mobiledgex SDK Demo", "Application Name":"Face Detection Demo3",
                "Version":"1.0", "Image Path":"mexdemo-hamburg-cloudlet.tdg.mobiledgex.net","Image Type":"ImageTypeDocker",
                "URI":"mobiledgexsdkdemofacedectiondemo10.mexdemo-westindia-cloudlet.azure.mobiledgex.net", "Flavor":"x1.small",
                "Cloudlet Key":"azure", "Cloudlet Name":"mexdemo-hamburg-cloudlet"},
            {"Index":"110", "id":"5011", "Developer Name":"Mobiledgex SDK Demo", "Application Name":"Face Detection Demo4",
                "Version":"1.0", "Image Path":"mexdemo-hamburg-cloudlet.tdg.mobiledgex.net","Image Type":"ImageTypeDocker",
                "URI":"mobiledgexsdkdemofacedectiondemo10.mexdemo-westindia-cloudlet.azure.mobiledgex.net", "Flavor":"x1.small",
                "Cloudlet Key":"azure", "Cloudlet Name":"mexdemo-hamburg-cloudlet"},
            {"Index":"110", "id":"5011", "Developer Name":"Mobiledgex SDK Demo", "Application Name":"Face Detection Demo5",
                "Version":"1.0", "Image Path":"mexdemo-hamburg-cloudlet.tdg.mobiledgex.net","Image Type":"ImageTypeDocker",
                "URI":"mobiledgexsdkdemofacedectiondemo10.mexdemo-westindia-cloudlet.azure.mobiledgex.net", "Flavor":"x1.small",
                "Cloudlet Key":"azure", "Cloudlet Name":"mexdemo-hamburg-cloudlet"},
            {"Index":"110", "id":"5011", "Developer Name":"Mobiledgex SDK Demo", "Application Name":"Face Detection Demo6",
                "Version":"1.0", "Image Path":"mexdemo-hamburg-cloudlet.tdg.mobiledgex.net","Image Type":"ImageTypeDocker",
                "URI":"mobiledgexsdkdemofacedectiondemo10.mexdemo-westindia-cloudlet.azure.mobiledgex.net", "Flavor":"x1.small",
                "Cloudlet Key":"azure", "Cloudlet Name":"mexdemo-hamburg-cloudlet"},
            {"Index":"110", "id":"5011", "Developer Name":"Mobiledgex SDK Demo", "Application Name":"Face Detection Demo7",
                "Version":"1.0", "Image Path":"mexdemo-hamburg-cloudlet.tdg.mobiledgex.net","Image Type":"ImageTypeDocker",
                "URI":"mobiledgexsdkdemofacedectiondemo10.mexdemo-westindia-cloudlet.azure.mobiledgex.net", "Flavor":"x1.small",
                "Cloudlet Key":"azure", "Cloudlet Name":"mexdemo-hamburg-cloudlet"}

        ]
    }

    onHandleClick(data) {
        console.log('on handle click == ', data)
        this.setState({ dimmer:data, open: true })
        //this.props.handleChangeSite(data.children.props.to)
    }

    show = (dim) => this.setState({ dimmer:dim, open: true })
    close = () => this.setState({ open: false })

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

    InputExampleFluid = () => <Input fluid placeholder='' />

    generateDOM(open, dimmer) {

        return layout.map((item, i) => (
            <div className="round_panel" key={i} style={{display:'flex'}}>
                <div style={{flex:1, width:'100%'}}>
                    <ContainerDimensions>
                        { ({ width, height }) =>
                            <div style={{width:width, height:height, display:'flex', overflowY:'auto', overflowX:'hidden'}}>{this.TableExampleVeryBasic()}</div>
                        }
                    </ContainerDimensions>

                </div>
                <Modal size={'small'} dimmer={dimmer} open={open} onClose={this.close}>
                    <Modal.Header>New Apps</Modal.Header>
                    <Modal.Content>
                        <Grid divided>
                            <Grid.Row columns={2}>
                                <Grid.Column width={5} className='detail_item'>
                                    <div>Developer Name</div>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    {this.InputExampleFluid()}
                                </Grid.Column>
                                <Divider vertical></Divider>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <Grid.Column width={5} className='detail_item'>
                                    <div>User Name</div>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    {this.InputExampleFluid()}
                                </Grid.Column>
                                <Divider vertical></Divider>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <Grid.Column width={5} className='detail_item'>
                                    <div>Address</div>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    {this.InputExampleFluid()}
                                </Grid.Column>
                                <Divider vertical></Divider>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <Grid.Column width={5} className='detail_item'>
                                    <div>Email</div>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    {this.InputExampleFluid()}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button onClick={this.close}>
                            Cancel
                        </Button>
                        <Button
                            positive
                            icon='checkmark'
                            labelPosition='right'
                            content="Save"
                            onClick={this.close}
                        />
                    </Modal.Actions>
                </Modal>
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
            {this.dummyData.map((data)=>(
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
                                    <Button onClick={() => alert('good')}>Delete</Button>
                                    <Button color='teal' onClick={() => this.onHandleClick(true)}>Edit</Button>
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
    }
    componentDidMount() {
        this.setState({sizeH:800})
    }

    render() {
        const { open, dimmer } = this.state;
        return (
            <ReactGridLayout
                layout={this.state.layout}
                onLayoutChange={this.onLayoutChange}
                {...this.props}
            >
                {this.generateDOM(open, dimmer)}

            </ReactGridLayout>
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

    return {
        accountInfo: account + Math.random()*10000
    };
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},

    };
};

export default connect(mapStateToProps, mapDispatchProps)(InstanceListView);


