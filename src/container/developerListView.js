import React from 'react';
import { Modal, Grid, Header, Button, Table, Menu, Icon, Input, Divider, Container } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
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

class DeveloperListView extends React.Component {
    constructor(props) {
        super(props);

        const layout = this.generateLayout();
        this.state = { layout,open: false, dimmer:true};
        this.dummyData = [
            {Index:'110', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'109', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'108', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'107', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'106', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'105', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'104', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'103', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'102', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'101', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''}
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
            <div style={{display:'flex', flexGrow:3}}>{title}</div>
            <SelectFromTo style={{display:'flex', alignSelf:'flex-end'}}></SelectFromTo>
        </Header>
    )
    makeHeader_select =(title)=> (
        <Header className='panel_title'>{title}</Header>
    )

    InputExampleFluid = () => <Input fluid placeholder='' />

    generateDOM(open, dimmer) {

        return layout.map((item, i) => (
            <div className="round_panel" key={i}>
                {this.TableExampleVeryBasic()}
                <Modal size={'small'} dimmer={dimmer} open={open} onClose={this.close}>
                    <Modal.Header>New Apps</Modal.Header>
                    <Modal.Content image>
                        <Grid divided>
                            <Grid.Row columns={2}>
                                <Grid.Column width={5} style={{alignContent:'center'}}>
                                    <div style={{alignSelf:'center'}}>Develper Name</div>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    {this.InputExampleFluid()}
                                </Grid.Column>
                                <Divider vertical></Divider>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <Grid.Column width={5}>
                                    <div>Develper Name</div>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    {this.InputExampleFluid()}
                                </Grid.Column>
                                <Divider vertical></Divider>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <Grid.Column width={5}>
                                    <div>Develper Name</div>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    {this.InputExampleFluid()}
                                </Grid.Column>
                                <Divider vertical></Divider>
                            </Grid.Row>
                            <Grid.Row columns={2}>
                                <Grid.Column width={5}>
                                    <div>Develper Name</div>
                                </Grid.Column>
                                <Grid.Column width={11}>
                                    {this.InputExampleFluid()}
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Modal.Content>
                    <Modal.Actions>
                        <Button color='black' onClick={this.close}>
                            Nope
                        </Button>
                        <Button
                            positive
                            icon='checkmark'
                            labelPosition='right'
                            content="Yep, that's me"
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
        <Table basic='very' striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell textAlign='center'>Index</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Developer Name</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>User Name</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Address</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Email</Table.HeaderCell>
                    <Table.HeaderCell width={3}  textAlign='center'>Edit</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {
                    this.dummyData.map((item, i) => (
                        <Table.Row key={i}>
                            {Object.keys(item).map((value, j) => (
                                (value === 'Edit')?
                                    <Table.Cell key={j} style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                                        <Button onClick={() => alert('good')}>Delete</Button>
                                        <Button key={`key_${j}`} color='teal' onClick={() => this.onHandleClick(true)}>Edit</Button>
                                    </Table.Cell>
                                :
                                    <Table.Cell key={j} textAlign='center'>{item[value]}</Table.Cell>
                            ))}
                        </Table.Row>
                    ))
                }
            </Table.Body>
            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell colspan={100}>
                        <Menu floated={'center'} pagination>
                            <Menu.Item as='a' icon>
                                <Icon name='chevron left' />
                            </Menu.Item>
                            <Menu.Item as='a'>1</Menu.Item>
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
        </Table>
    )
    componentWillReceiveProps(nextProps, nextContext) {
                console.log('nextProps')
        if(nextProps.accountInfo){
            this.setState({ dimmer:'blurring', open: true })
        }
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

export default connect(mapStateToProps, mapDispatchProps)(DeveloperListView);


