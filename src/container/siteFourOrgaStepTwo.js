import React, { Fragment } from "react";
import {Button, Form, Table, List, Grid, Card, Header, Image} from "semantic-ui-react";
import { connect } from 'react-redux';
import * as actions from '../actions';
import {Field, reduxForm, stopSubmit} from "redux-form";
import MaterialIcon from "material-icons-react";
import './styles.css';

const validate = values => {
    const errors = {}
    if (!values.username) {
        errors.username = 'Required'
    }
    if (!values.orgName) {
        errors.orgName = 'Required'
    }
    if (!values.orgType) {
        errors.orgType = 'Required'
    }
    if (!values.selectRole) {
        errors.selectRole = 'Required'
    }
    
    return errors
}
const roles =
    {
        Developer: [
            { Users:'Manage', Cloudlets:'View', Flavor:'View', 'Cluster Flavor':'View', 'Cluster Instance':'Manage', Apps:'Manage', 'App Instance':'Manage'},
            { Users:'View', Cloudlets:'View', Flavor:'View', 'Cluster Flavor':'View', 'Cluster Instance':'Manage', Apps:'Manage', 'App Instance':'Manage'},
            { Users:'View', Cloudlets:'View', Flavor:'View', 'Cluster Flavor':'View', 'Cluster Instance':'View', Apps:'View', 'App Instance':'View'}
        ],
        Operator: [
            { Users:'Manage', Cloudlets:'Manage', Flavor:'disabled', 'Cluster Flavor':'disabled', 'Cluster Instance':'disabled', Apps:'disabled', 'App Instance':'disabled'},
            { Users:'View', Cloudlets:'View', Flavor:'disabled', 'Cluster Flavor':'disabled', 'Cluster Instance':'Manage', Apps:'disabled', 'App Instance':'disabled'},
            { Users:'View', Cloudlets:'View', Flavor:'disabled', 'Cluster Flavor':'disabled', 'Cluster Instance':'disabled', Apps:'disabled', 'App Instance':'disabled'},
        ]
    }



const makeRoleList = (selectedType, i) => (
    <List divided verticalAlign='middle'>
        <List.Item>
            <List.Content>
                {
                    Object.keys(roles[selectedType][i]).map((key) => (
                        <List.Header key={key}><div style={{color:((roles[selectedType][i][key] === 'Manage')?'rgba(136,221,0,.9)':'rgba(255,255,255,.6)')}}>{ key +" : "+ (roles[selectedType][i][key]) }</div></List.Header>
                    ))
                }

            </List.Content>
        </List.Item>
    </List>
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

const renderCheckbox = field => (
    <Form.Checkbox
        checked={!!field.input.value}
        name={field.input.name}
        label={field.label}
        onChange={(e, { checked }) => field.input.onChange(checked)}
    />
);

const renderRadio = field => (
    <Form.Radio
        checked={field.input.value === field.radioValue}
        label={field.label}
        name={field.input.name}
        onChange={(e, { checked }) => field.input.onChange(field.radioValue)}
    />
);

const renderSelect = field => (
    <div>
        <Form.Select
            label={field.label}
            name={field.input.name}
            onChange={(e, { value }) => field.input.onChange(value)}
            options={field.options}
            placeholder={field.placeholder}
            value={field.input.value}
        />
        {field.meta.touched && ((field.meta.error && <span className="text-danger">{field.meta.error}</span>) || (field.meta.warning && <span>{field.meta.warning}</span>))}
    </div>
);

const renderTextArea = field => (
    <Form.TextArea
        {...field.input}
        label={field.label}
        placeholder={field.placeholder}
    />
);
const renderInput = field => (
    <div>
        <Form.Input
            {...field.input}
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
        />
        {field.meta.touched && ((field.meta.error && <span className="text-danger">{field.meta.error}</span>) || (field.meta.warning && <span>{field.meta.warning}</span>))}
    </div>
);
const makeAdduser = () => (
    <Grid>
        <Grid.Row columns={2}>
            <Grid.Column>
                <Field
                    component={renderInput}
                    name="username"
                    type="input"
                    placeholder="Username"
                />
            </Grid.Column>
            <Grid.Column>
                <div style={{backgroundColor:'#ababab', width:50, height:23, borderRadius:3, display:'flex', justifyContent:'center', alignItems:'center', cursor:'pointer'}}><span>ADD</span></div>
            </Grid.Column>
        </Grid.Row>
    </Grid>
)
const makeListView = () => (
    <Table striped>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Type</Table.HeaderCell>
                <Table.HeaderCell>Username</Table.HeaderCell>
                <Table.HeaderCell>Role</Table.HeaderCell>
                <Table.HeaderCell>Check</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>
            <Table.Row>
                <Table.Cell>D</Table.Cell>
                <Table.Cell>user 1</Table.Cell>
                <Table.Cell>
                    <Field
                        component={renderSelect}
                        name="selectRole"
                        options={[
                            { key: "m", text: "Manager", value: "male" },
                            { key: "c", text: "Contributor", value: "female" },
                            { key: "v", text: "Viewer", value: "viewer" }
                        ]}
                        placeholder="Select Role"
                    />
                </Table.Cell>
                <Table.Cell><div><MaterialIcon icon={'close'} size={40}></MaterialIcon></div></Table.Cell>
            </Table.Row>
        </Table.Body>
    </Table>
)


// const userAvatar = [
//     'https://react.semantic-ui.com/images/avatar/large/matthew.png',
//     'https://react.semantic-ui.com/images/avatar/large/elliot.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/daniel.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/jenny.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/molly.png',
//     'https://react.semantic-ui.com/images/avatar/large/steve.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/helen.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/ade.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/nan.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/chris.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/veronika.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/stevie.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/justen.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/tom.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/christian.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/matt.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/joe.jpg',
//     'https://react.semantic-ui.com/images/avatar/large/zoe.jpg',
//
//
// ]

const userAvatar = [];

let avatarRandom = Math.floor(Math.random() * userAvatar.length);

const makeCardContent = (item, i, type) => (
    <Grid.Row key={i}>
        <Card>
            <Card.Content>
                <Card.Header>{item['header']}</Card.Header>
                <Card.Meta>{type}</Card.Meta>
                <Card.Description>
                    {makeRoleList(type, i)}
                </Card.Description>
                {/*<div style={{position:'absolute', top:'1em', right:'1em', width:'auto', display:'flex', alignItem:'right', justifyContent:'right' }}>*/}
                {/*    <MaterialIcon icon={(item['header'] === role)?'check_circle':'check_circle_outline'} size={40} color={(item['header'] === role)?'rgba(136,221,0,.9)':'rgba(255,255,255,.6)'}/>*/}
                {/*</div>*/}
            </Card.Content>
        </Card>
    </Grid.Row>
)

let _self = null;
class SiteFourOrgaTwo extends React.Component {
    constructor(props) {
        super(props);
        _self = this;
        this.state = {
            typeValue:''
        };
       
    }

    handleInitialize() {
        let cType = this.props.type.substring(0,1).toUpperCase() + this.props.type.substring(1);
        const initData = {
          "orgName": this.props.org,
          "orgType": cType
        };
    
        this.props.initialize(initData);
      }
      
    componentDidMount() {
        this.handleInitialize();
    }
    
    componentWillReceiveProps(nextProps) {
        if(this.props.toggleSubmitTwo) {
            this.props.dispatch(stopSubmit('orgaStepTwo',{}))
        }
    }



    onHandleSubmit = () => {
        
        _self.props.handleSubmit();
        // setTimeout(() => {
        //     //_self.props.dispatch(reset('orgaStepTwo'));
        //     _self.props.dispatch(initialize('orgaStepTwo', {
        //         submitSucceeded: false
        //     }))
        //     this.handleInitialize();
        // },0);
        
    }

    continueClick = (e) => {
        e.preventDefault();
        this.props.nextstep(3)
    }
    
    render (){
        const { handleSubmit, reset, org, type } = this.props;
        let cType = type.substring(0,1).toUpperCase() + type.substring(1);
        return (
            <Fragment>
                <Grid>
                    <Grid.Row columns={2}>
                        <Grid.Column width={11}>
                            <Form onSubmit={this.onHandleSubmit} className={"fieldForm"}>
                                <Header>Add Users to Your Organization!</Header>
                                <Form.Group widths="equal" style={{flexDirection:'column', marginLeft:10, marginRight:10, alignContent:'space-around'}}>
                                    <Grid>
                                        <Grid.Row className='avatar_img'>
                                            <Grid.Column>
                                                <Image src={userAvatar[avatarRandom]} width='210px' centered bordered/>
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row className="newOrg2-1">
                                            <Grid.Column width={5}>
                                                <div>Username</div>
                                            </Grid.Column>
                                            <Grid.Column width={11}>
                                                <Field
                                                    component={renderInput}
                                                    name="username"
                                                    type="input"
                                                    placeholder="Username"
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row className="newOrg2-2">
                                            <Grid.Column width={5}>
                                                <div>Organization Name</div>
                                            </Grid.Column>
                                            <Grid.Column width={11}>
                                                <Field
                                                    component={renderInput}
                                                    name="orgName"
                                                    type="input"
                                                    placeholder={org}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row className="newOrg2-3">
                                            <Grid.Column width={5}>
                                                <div>Type</div>
                                            </Grid.Column>
                                            <Grid.Column width={11}>
                                                <Field
                                                component={renderInput}
                                                name="orgType"
                                                type="input"
                                                placeholder={type}
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                        <Grid.Row className="newOrg2-4">
                                            <Grid.Column width={5}>
                                                <div>Role</div>
                                            </Grid.Column>
                                            <Grid.Column width={11}>
                                                <Field
                                                    component={renderSelect}
                                                    lable="Role"
                                                    name="selectRole"
                                                    options={[
                                                        { key: "m", text: "Manager", value: "Manager" },
                                                        { key: "c", text: "Contributor", value: "Contributor" },
                                                        { key: "v", text: "Viewer", value: "Viewer" }
                                                    ]}
                                                    placeholder="Select Role"
                                                />
                                            </Grid.Column>
                                        </Grid.Row>
                                    </Grid>
                                </Form.Group>

                                <Form.Group className={"submitButtonGroup orgButton"} id={"submitButtonGroup"} inline style={{flexDirection:'row', marginLeft:10, marginRight:10}}>
                                    {/*<Form.Button >Preview</Form.Button>*/}
                                    <Form.Button primary positive>Continue</Form.Button>
                                    <Form.Button className="newOrg2-5" onClick={this.continueClick}>Skip</Form.Button>

                                </Form.Group>
                            </Form>
                        </Grid.Column>
                        <Grid.Column width={5} className='step_side'>
                                {items.map((item, i) => (
                                    makeCardContent(item, i, cType)
                                ))}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Fragment>
        )
        
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data))}
    };
};

SiteFourOrgaTwo = connect(
    null,
    mapDispatchProps
)(SiteFourOrgaTwo);

export default reduxForm({
    form: "orgaStepTwo",
    validate
})(SiteFourOrgaTwo);
