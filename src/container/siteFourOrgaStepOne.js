import React, { Fragment } from "react";
import {Button, Form, Item, Message, List, Grid, Card, Header, Image, Input} from "semantic-ui-react";
import {Field, reduxForm, initialize, reset, stopSubmit} from "redux-form";
import './styles.css';

const validate = values => {
    const errors = {}
    if (!values.type) {
        errors.type = 'Required'
    }
    if (!values.name) {
        errors.name = 'Required'
    }else if(!/^[-_0-9a-zA-Z .&,!]+$/.test(values.name)){
        errors.name = 'Invalid characters in organization name'
    } else if(/\s/g.test(values.name)){
        errors.name = 'Invalid characters in organization name'
    }
    if (!values.address) {
        errors.address = 'Required'
    }
    if (!values.phone) {
        errors.phone = 'Required'
    }else if (!/^[\+]?[(]?[0-9]{3}[)]?[-]?[0-9]{3}[-]?[0-9]{4,7}$/im.test(values.phone)) {
        errors.phone = 'Invalid phone Number. (ex) (123)456-7890, 123-456-7890, 1234567890, +121234567890'
    }
    return errors
}
let type = 'Developer';
let role = 'Manage';
let typeValue = 1;
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
        style={{height:'33px', paddingTop:'10px'}}
        checked={!!field.input.value}
        name={field.input.name}
        label={field.label}
        onChange={(e, { checked }) => field.input.onChange(checked)}
    />
);

const renderRadio = field => (
    <div>
        <Form.Radio
            style={{height: '38px', paddingTop: '10px'}}
            checked={field.input.value === field.radioValue}
            label={field.label}
            name={field.input.name}
            onChange={(e, { checked }) => field.input.onChange(field.radioValue)}
        />
        {field.meta.touched && ((field.meta.error && <span className="text-danger">{field.meta.error}</span>) || (field.meta.warning && <span>{field.meta.warning}</span>))}
    </div>
);

const renderSelect = field => (
    <Form.Select
        label={field.label}
        name={field.input.name}
        onChange={(e, { value }) => field.input.onChange(value)}
        options={field.options}
        placeholder={field.placeholder}
        value={field.input.value}
    />
);

const renderTextArea = field => (
    <Form.TextArea
        {...field.input}
        label={field.label}
        placeholder={field.placeholder}
    />
);

const renderInputNum = field => (
    <Form.Field
        {...field.input}
        type={field.type}
        // placeholder={field.placeholder}
    >
        <label>{field.label}</label>
        <Input type="number"></Input>
    </Form.Field>
);
const renderInput = ({ input, placeholder, type, meta: { touched, error, warning } }) => (
    <div>
         <Form.Input
            {...input}
            type={type}
            placeholder={placeholder}
        />
        {touched && ((error && <span className="text-danger">{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
   
);
const typeOperator = (selected, value) => (

    <Grid columns={2}>
        <Grid.Column>
            <Field
                component={renderRadio}
                label="Developer"
                name="type"
                radioValue={'Developer'}
            />
        </Grid.Column>
        <Grid.Column>
            <Field
                component={renderRadio}
                label="Operator"
                name="type"
                radioValue={'Operator'}
            />
        </Grid.Column>
    </Grid>
)

let _self = null;
class SiteFourOrgaOne extends React.Component {
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
        //this.handleInitialize();
    }

    componentWillReceiveProps(nextProps) {
        if(this.props.toggleSubmit) {
            this.props.dispatch(stopSubmit('orgaStepOne',{}))
        }
    }



    onHandleSubmit = () => {
        this.props.handleSubmit();
    }

    cancelClick = (e) => {
        e.preventDefault();
        this.props.changeOrg()
    }

    render (){
        const { handleSubmit, reset, org, type } = this.props;
        return (
            <Fragment>
                <Grid>
                    <Grid.Column width={11}>
                        <Form onSubmit={this.onHandleSubmit} className={"fieldForm"}>
                            <Header>Create Your Organization.</Header>
                            <Form.Group widths="equal" style={{flexDirection:'column', alignContent:'space-around'}}>
                                <Grid>
                                    <Grid.Row className="newOrg1-1" style={{alignItems:'center'}}>
                                        <Grid.Column width={5}>
                                            <div>Type *</div>
                                        </Grid.Column>
                                        <Grid.Column width={11}>
                                            {typeOperator(type)}
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form.Group>
                            <Form.Group widths="equal" style={{flexDirection:'column', alignContent:'space-around'}}>
                                <Grid>
                                    <Grid.Row className="newOrg1-2">
                                        <Grid.Column width={5}>
                                            <div>Organization Name *</div>
                                        </Grid.Column>
                                        <Grid.Column width={11}>
                                            <Field
                                                component={renderInput}
                                                name="name"
                                                type="input"
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row className="newOrg1-3">
                                        <Grid.Column width={5}>
                                            <div>Address *</div>
                                        </Grid.Column>
                                        <Grid.Column width={11}>
                                            <Field
                                                component={renderInput}
                                                name="address"
                                                type="input"
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                    <Grid.Row className="newOrg1-4">
                                        <Grid.Column width={5}>
                                            <div>Phone *</div>
                                        </Grid.Column>
                                        <Grid.Column width={11}>
                                            <Field
                                                component={renderInput}
                                                name="phone"
                                                type="input"
                                            />
                                        </Grid.Column>
                                    </Grid.Row>
                                </Grid>
                            </Form.Group>
                            <Form.Group className={"submitButtonGroup orgButton"} id={"submitButtonGroup"} inline style={{flexDirection:'row'}}>
                                <Form.Button onClick={this.cancelClick}>Cancel</Form.Button>
                                <Form.Button className="newOrg1-5" positive primary>Create Organization</Form.Button>
                            </Form.Group>
                        </Form>
                    </Grid.Column>
                    <Grid.Column width={5}>
                    </Grid.Column>
                </Grid>

            </Fragment>
        )

    }
};


export default reduxForm({
    form: "orgaStepOne",
    validate
})(SiteFourOrgaOne);
