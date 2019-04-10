import React from 'react';
import {Table, Header, Step, Icon, Checkbox, Button, Form, Card, Item, List} from 'semantic-ui-react';
import ContainerDimensions from 'react-container-dimensions'

const roles =
    {
        Developer: [
            { Flavor:'View', ClusterFlavor:'View', Users:'Manage', Cloudlets:'View', ClusterInst:'Manage', Apps:'Manage', AppInst:'Mange'},
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
                        <List.Header><div style={{color:((roles[selectedType][i][key] === 'Manage')?'#13aa6d':'#6a6a6a')}}>{ key +" : "+ (roles[selectedType][i][key]) }</div></List.Header>
                    ))
                }

            </List.Content>
        </List.Item>
    </List>
)



const FormExampleForm = () => (
    <Form>
        <Form.Field>
            <label>User Name</label>
            <input placeholder='UserName' />
        </Form.Field>
        <Form.Field>
            <label>Email</label>
            <input placeholder='Email' />
        </Form.Field>
        <Form.Field style={{color:'#ababab'}}>
            <Checkbox  style={{color:'#ababab'}} label='This account is owned by a business.' />
        </Form.Field>

    </Form>
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
        this.state = {
            step : '1',
            type:'Developer'
        }
        _self = this;
    }

    onChangeType(value) {

    }

    makeCardContent = (item, i) => (
        <Card>
            <Card.Content>
                <Card.Header>{item['header']}</Card.Header>
                <Card.Meta>{this.state.type}</Card.Meta>
                <Card.Description>
                    {makeRoleList(this.state.type, i)}
                </Card.Description>
            </Card.Content>
        </Card>
    )
    render() {
        return (
            <ContainerDimensions>
                { ({ width, height }) =>
                    <div>
                        <Header as='h1'>Create new </Header>

                        <Step.Group stackable='tablet'>
                            <Step>
                                <Icon name='info circle' />
                                <Step.Content>
                                    <Step.Title>Step 1</Step.Title>
                                    <Step.Description>Set up the organization</Step.Description>
                                </Step.Content>
                            </Step>
                            <Step active>
                                <Icon name='info circle' />
                                <Step.Content>
                                    <Step.Title>Step 2</Step.Title>
                                    <Step.Description>Invite members</Step.Description>
                                </Step.Content>
                            </Step>
                            <Step disabled>
                                <Icon name='info circle' />
                                <Step.Content>
                                    <Step.Title>Step 3</Step.Title>
                                    <Step.Description>Organization details</Step.Description>
                                </Step.Content>
                            </Step>
                        </Step.Group>
                        <Item>
                            <div>Choose type</div>
                            {typeOperator(this.state.type, _self)}
                        </Item>

                        {FormExampleForm()}
                        { (this.state.step === '1') ?
                            <Card.Group>
                                {items.map((item, c) => this.makeCardContent(item, c))}
                            </Card.Group>
                            : null
                        }
                        <Button type='submit'>Create organization</Button>
                    </div>
                }
            </ContainerDimensions>
        )
    }
}
