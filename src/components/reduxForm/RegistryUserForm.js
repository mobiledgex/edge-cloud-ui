import React, { Fragment } from "react";
import { Field, reduxForm } from "redux-form";
import { Form, Message } from "semantic-ui-react";
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
  return errors
}

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
const renderInput = field => (
    <Form.Input
        {...field.input}
        type={field.type}
        label={field.label}
        placeholder={field.placeholder}
    />
);
const RegistryUserForm = props => {
    const { handleSubmit, reset } = props;

    return (
        <Fragment>
            <Form onSubmit={handleSubmit} className={"fieldForm"}>
                <Form.Group widths="equal" style={{flexDirection:'column', alignContent:'space-around'}}>
                    <Field className={"fieldInput"}
                        component={renderInput}
                        name="username"
                        type="input"
                        placeholder="Username"
                    />
                    <Field className={"fieldInput"}
                        component={renderInput}
                        name="password"
                        type="password"
                        placeholder="Password"
                    />
                    <Field className={"fieldInput"}
                           component={renderInput}
                           name="confirmpassword"
                           type="password"
                           placeholder="Confirm Password"
                    />
                    <Field className={"fieldInput"}
                        component={renderInput}
                        name="email"
                        type="email"
                        placeholder="Email"
                    />
                </Form.Group>
                <Form.Group className={"submitButtonGroup"} id={"submitButtonGroup"} inline style={{flexDirection:'column', marginBottom:0}}>
                    <Form.Button primary>Sign Up</Form.Button>
                    <Form.Button onClick={reset}>Reset</Form.Button>
                </Form.Group>
            </Form>
        </Fragment>
    );
};

export default reduxForm({
    form: "profile"
})(RegistryUserForm);
