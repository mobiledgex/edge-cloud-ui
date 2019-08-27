import React from 'react';
import {
    Table,
    Header,
    Step,
    Icon,
    Label,
    Checkbox,
    Button,
    Form,
    Card,
    Item,
    List,
    Menu,
    Grid,
    Input
} from 'semantic-ui-react';
import RGL, { WidthProvider } from "react-grid-layout";
import '../css/index.css';
import './styles.css';
import ContainerDimensions from 'react-container-dimensions'
import MaterialIcon, {colorPalette} from 'material-icons-react';
import RegistNewItem from "./registNewItem";
import PopDetailViewer from "./popDetailViewer";
import * as reducer from "../utils";

const ReactGridLayout = WidthProvider(RGL);

const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 20;
var layout = [
    {"w":19,"h":20,"x":0,"y":0,"i":"0","moved":false,"static":false, "title":"Developer"},
]

const roles =
    {
        Developer: [
            { Flavor:'View', ClusterFlavor:'View', Users:'Manage', Cloudlets:'View', ClusterInst:'Manage', Apps:'Manage', AppInst:'Manage'},
            { Flavor:'View', ClusterFlavor:'View', Users:'View', Cloudlets:'View', ClusterInst:'Manage', Apps:'Manage', AppInst:'Manage'},
            { Flavor:'View', ClusterFlavor:'View', Users:'View', Cloudlets:'View', ClusterInst:'View', Apps:'View', AppInst:'View'}
        ],
        Operator: [
            { Flavor:'disabled', ClusterFlavor:'disabled', Users:'Manage', Cloudlets:'Manage', ClusterInst:'disabled', Apps:'disabled', AppInst:'disabled'},
            { Flavor:'disabled', ClusterFlavor:'disabled', Users:'View', Cloudlets:'View', ClusterInst:'Manage', Apps:'disabled', AppInst:'disabled'},
            { Flavor:'disabled', ClusterFlavor:'disabled', Users:'View', Cloudlets:'View', ClusterInst:'disabled', Apps:'disabled', AppInst:'disabled'},
        ]
    }


const makeRoleList = (selectedType, i) => (
    <List divided verticalAlign='middle'>
        <List.Item>
            <List.Content>
                {
                    Object.keys(roles[selectedType][i]).map((key) => (
                        <List.Header><div style={{color:((roles[selectedType][i][key] === 'Manage')?'rgba(136,221,0,.9)':'rgba(255,255,255,.6)')}}>{ key +" : "+ (roles[selectedType][i][key]) }</div></List.Header>
                    ))
                }

            </List.Content>
        </List.Item>
    </List>
)



const orgcreateform = () => (

    <Form>
        <Form.Input fluid label="OrganizationName" />
        <Form.Input fluid label="Address" />
        <Form.Input fluid label="Phone" />
        {/*<Form.Field style={{color:'#ababab'}}>*/}
        {/*    <Checkbox  style={{color:'#ababab'}} label='This account is owned by a business.' />*/}
        {/*</Form.Field>*/}
    </Form>
)

const orgcreateform2 = () => (

    <Form>
        <Form.Input fluid placeholder="Username" />
        <Form.Input fluid placeholder="Email" />
    </Form>
)

const nametag = () => (

    <div className="name_tag">
        <Label image>
            <span className='username'>Adrienne</span>
            <Icon name='delete' />
        </Label>
        <Label image>
            <span className='username'>Zoe</span>
            <Icon name='delete' />
        </Label>
        <Label image>
            <span className='username'>Nan</span>
            <Icon name='delete' />
        </Label>
    </div>
)

const items = [
    {
        header: 'Manager',
        description: `Leverage agile frameworks to provide a robust synopsis \n\r for high level overviews.`,
        meta: 'ROI: 30%',
    },
    {
        header: 'Contributor',
        description: 'Bring to the table win-win survival strategies to ensure proactive domination.',
        meta: 'ROI: 34%',
    },
    {
        header: 'Viewer',
        description:
            'Capitalise on low hanging fruit to identify a ballpark value added activity to beta test.',
        meta: 'ROI: 27%',
    },
]
const typeOperator = (selected, target) => (

    <Button.Group>
        <Button positive={(selected === 'Developer')}>Developer</Button>
        <Button.Or />
        <Button positive={(selected === 'Operator')}>Operator</Button>
    </Button.Group>
)




let _self = null;
export default class SiteFourCreateOper extends React.Component{


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
            step : '1',
            type:'Developer',
            role:'Manager'
        }
        _self = this;
    }

    generateLayout() {
        const p = this.props;

        return layout
    }

    stepChange(num) {
        let stepNum = num+1;
        this.setState({step:stepNum})
    }

    onChangeActive(num) {
        if(this.state.step == num+1){
            return true;
        } else {
            return false;
        }
    }

    makeCardContent = (item, i) => (
        <Grid.Column>
            <Card>
                <Card.Content>
                    <Card.Header>{item['header']}</Card.Header>
                    <Card.Meta>{this.state.type}</Card.Meta>
                    <Card.Description>
                        {makeRoleList(this.state.type, i)}
                    </Card.Description>
                    <div style={{position:'absolute', top:'1em', right:'1em', width:'auto', display:'flex', alignItem:'right', justifyContent:'flex-end' }}>
                        <MaterialIcon icon={(item['header'] === this.state.role)?'check_circle':'check_circle_outline'} size={40} color={(item['header'] === this.state.role)?'rgba(136,221,0,.9)':'rgba(255,255,255,.6)'}/>
                    </div>
                </Card.Content>
            </Card>
        </Grid.Column>
    )

    

    orgStepOne = () => (

        <Grid>
            <Grid.Column width={10}>
                <div>
                    <Header>Create your organization account</Header>
                    <Item>
                        <label>Choose type</label>
                        {typeOperator(this.state.type, _self)}
                    </Item>
                    {orgcreateform()}
                    <div className='orgButton'>
                        <Button type='submit'>Continue</Button>
                        <span style={{marginLeft:10}}><Button type='submit' >Reset</Button></span>
                    </div>
                    <Grid columns={3} className='role_card'>
                        <Grid.Row>
                            {items.map((item, c) => this.makeCardContent(item, c))}
                        </Grid.Row>
                    </Grid>
                </div>
            </Grid.Column>
            <Grid.Column width={6}>
                <div></div>
            </Grid.Column>
        </Grid>



    )

    orgStepTwo = () => (

        <Grid>
            <Grid.Column width={10}>
                <div>
                    <Header>Add user to the Organization!</Header>
                    {orgcreateform2()}
                    <Grid columns={3} className='role_card'>
                        <Grid.Row>
                            {items.map((item, c) => this.makeCardContent(item, c))}
                        </Grid.Row>
                    </Grid>
                    <div className='orgButton'>
                        <Button type='submit'>Add User</Button>
                    </div>
                    {nametag()}
                    <div className='orgButton'>
                        <Button type='submit'>Continue</Button>
                        <span style={{marginLeft:10}}><Button type='submit' >Reset</Button></span>
                    </div>
                </div>
            </Grid.Column>
            <Grid.Column width={6}>
                <div></div>
            </Grid.Column>
        </Grid>

    )
    
    orgStepThree = () => (

        <Grid>
            <Grid.Column width={10}>
                <div>
                    <Header>Congratulation! Start MobiledgeX right now!</Header>
                    <div className='orgButton'>
                        <Button type='submit' style={{width:'100%'}}>Check your Organization</Button>
                    </div>
                    <div className='orgButton'>
                        <Button type='submit' style={{width:'100%'}}>Check User</Button>
                    </div>
                    <div className='orgButton'>
                        <Button type='submit' style={{width:'100%'}}>Move to Flavor</Button>
                    </div>
                </div>
            </Grid.Column>
            <Grid.Column width={6}>
                <div></div>
            </Grid.Column>
        </Grid>
    )

    generateDOM(stepData, step, open, dimmer, width, height, hideHeader) {

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
                    <div style={{width:'100%', height:'auto', overflowY:'auto', backgroundColor:'#292c33'}}>
                        {this.makeSteps(stepData,step)}
                    </div>
                </div>
                :
                <div className="round_panel" key={i} style={{ width:width, height:height, display:'flex', flexDirection:'column'}} >
                    <div style={{width:'100%', height:'100%', overflowY:'auto'}}>
                        Map viewer
                    </div>
                </div>


        ))
    }

    makeSteps = (stepData,step) => (

        <Item className='content create-org' style={{margin:'20px auto 20px auto', maxWidth:1200}}>
            <div className='content_title' style={{padding:'0px 0px 10px 0'}}>Create new Organization</div>

            <Step.Group stackable='tablet' style={{width:'100%'}}>
                {
                    stepData.map((item,i) => (
                        <Step onClick={() => this.stepChange(i)} active={this.onChangeActive(i)} >
                            <Icon name='info circle' />
                            <Step.Content>
                                <Step.Title>{item.step}</Step.Title>
                                <Step.Description>{item.description}</Step.Description>
                            </Step.Content>
                        </Step>
                    ))
                }
            </Step.Group>

            {
                (step ==1) ? this.orgStepOne() :
                    (step ==2) ? this.orgStepTwo() :
                        (step ==3) ? this.orgStepThree() : null
            }

            {/*<Button type='submit'>Create organization</Button>*/}
        </Item>
    )

    componentDidMount() {
        
    }

    componentWillReceiveProps(nextProps) {

    }

    render() {
        const { step } = this.state
        const { open, dimmer } = this.state;
        const { hideHeader } = this.props;
        const stepData = [
            {
                step:"Step 1",
                description:"Set up the organization"
            },
            {
                step:"Step 2",
                description:"Invite members"
            },
            {
                step:"Step 3",
                description:"Check the organization"
            },
        ]
        return (
            <ContainerDimensions>
                { ({ width, height }) =>
                    <div style={{width:width, height:height, display:'flex', overflowY:'auto', overflowX:'hidden'}}>
                        <ReactGridLayout
                            layout={this.state.layout}
                            useCSSTransforms={false}
                            {...this.props}
                            style={{width:width, height:height-20}}
                        >
                            {this.generateDOM(stepData, step, open, dimmer, width, height, hideHeader)}
                        </ReactGridLayout>
                    </div>
                }
            </ContainerDimensions>
        )
    }
}
