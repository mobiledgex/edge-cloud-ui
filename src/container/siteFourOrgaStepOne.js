import React, { Fragment } from "react";
import {Button, Form, Item, Message, List, Grid, Card, Header} from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import MaterialIcon from "../sites/siteFour_page_createOper";
import './styles.css';

const validate = values => {
    const errors = {}
    if (!values.username) {
        errors.username = 'Required'
    } else if (values.username.length > 15) {
        errors.username = 'Must be 15 characters or less'
    }
    if (!values.email) {
        errors.email = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
    if (!values.age) {
        errors.age = 'Required'
    } else if (isNaN(Number(values.age))) {
        errors.age = 'Must be a number'
    } else if (Number(values.age) < 18) {
        errors.age = 'Sorry, you must be at least 18 years old'
    }
    if (!values.organizationName) {
        errors.organizationName = 'Required'
    }
    if (!values.address) {
        errors.address = 'Required'
    }
    if (!values.phone) {
        errors.phone = 'Required'
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

    <Grid columns={2} style={{lineHeight:'38px'}}>
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


const SiteFourOrgaOne = props => {
    const { handleSubmit, reset, type } = props;

    return (
        <Fragment>
            <Grid>
                <Grid.Column width={11}>
                    <Form onSubmit={handleSubmit} className={"fieldForm"}>
                        <Header>Create your organization account</Header>
                        <Form.Group widths="equal" style={{flexDirection:'column', alignContent:'space-around'}}>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={5}>
                                        <div>Type</div>
                                    </Grid.Column>
                                    <Grid.Column width={11}>
                                        {typeOperator(type)}
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Form.Group>
                        <Form.Group widths="equal" style={{flexDirection:'column', alignContent:'space-around'}}>
                            <Grid>
                                <Grid.Row>
                                    <Grid.Column width={5}>
                                        <div>OrganizationName</div>
                                    </Grid.Column>
                                    <Grid.Column width={11}>
                                        <Field
                                            component={renderInput}
                                            name="name"
                                            type="input"
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={5}>
                                        <div>Address</div>
                                    </Grid.Column>
                                    <Grid.Column width={11}>
                                        <Field
                                            component={renderInput}
                                            name="address"
                                            type="input"
                                        />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={5}>
                                        <div>Phone</div>
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
                            <Form.Button onClick={reset}>Reset</Form.Button>
                            <Form.Button positive primary>Continue</Form.Button>
                        </Form.Group>
                    </Form>
                </Grid.Column>
                <Grid.Column width={5}>
                </Grid.Column>
            </Grid>

        </Fragment>
    );
};

export default reduxForm({
    form: "orgaStepOne",
    validate
})(SiteFourOrgaOne);
