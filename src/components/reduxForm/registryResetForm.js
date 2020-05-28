import React, { Fragment } from "react";
import {Field, initialize, reduxForm} from "redux-form";
import {Form} from "semantic-ui-react";
import './styles.css';

const validate = values => {
    const errors = {}
    if (!values.username) {
        errors.username = 'Required'
    }

    if (!values.password) {
        errors.password = 'Required'
    } else if (values.password.length < 8) {
        errors.password = 'Must be at least 8 characters'
    }

    if (!values.confirmpassword) {
        errors.confirmpassword = 'Required'
    } else if (values.password !== values.confirmpassword) {
        errors.confirmpassword = 'Password and Confirm Password do not match'
    }


    if (!values.email) {
        errors.email = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
   
    return errors
}

const renderInput = field => (
    <div>
        <Form.Input
            {...field.input}
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
        />
        {field.meta.touched && ((field.meta.error && <span className="text-danger login-danger">{field.meta.error}</span>) || (field.meta.warning && <span>{field.meta.warning}</span>))}
    </div>
);

let _props = null;
let _self = null;
class RegistryResetForm extends React.Component{
    constructor() {
        super();
        _self = this;
    }
    onHandleSubmit =(a,b)=> {
        this.props.handleSubmit();
        setTimeout(() => {
            _self.props.dispatch(initialize('profile', {
                submitSucceeded: false
            }))
        },1000);

    }
    render() {
        const { handleSubmit, reset } = this.props;

        return (
            <Fragment>
                <Form onSubmit={this.onHandleSubmit} className={"fieldForm"}>
                    <Form.Group widths="equal" style={{flexDirection:'column', alignContent:'space-around'}}>
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
                    </Form.Group>
                    <Form.Group className={"submitButtonGroup"} id={"submitButtonGroup"} inline style={{flexDirection:'column', marginBottom:0}}>
                        <Form.Button primary>Update New Password</Form.Button>
                    </Form.Group>
                </Form>
            </Fragment>
        );
    }

};

export default reduxForm({
    form: "profile",
    validate,
    enableReinitialize: false
})(RegistryResetForm);
