import React, { Fragment } from "react";
import {Field, initialize, reduxForm} from "redux-form";
import {Form} from "semantic-ui-react";
import './styles.css';


let _errors = null;
const validate = values => {
    const errors = {}
    if (!values.username) {
        errors.username = 'Required'
    } else if(!/^[-_.0-9a-zA-Z]+$/.test(values.username)){
        errors.username = 'Username can only contain letters, digits, "_", ".", "-".'
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
    _errors = errors;
    return errors
}

const renderInput = field => (
    <div>
        <Form.Input
            {...field.input}
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
            value={field.initialValue}
        />
        {field.meta.touched && ((field.meta.error && <span className="text-danger login-danger">{field.meta.error}</span>) || (field.meta.warning && <span>{field.meta.warning}</span>))}
    </div>
);

let _props = null;
let _self = null;
class RegistryUserForm extends React.Component{
    constructor() {
        super();
        _self = this;
        this.state = {
            lastProps: {}
        }
        this.username = 'Username';
        this.email = 'Email';
        this.usernameValue = null;
        this.emailValue = null
    }

    onHandleSubmit =(a,b)=> {
        //if  any has error as validation
        this.props.handleSubmit();
        if(_errors && Object.keys(_errors).length) {
            
            return;

        }
        setTimeout(() => {
            _self.props.dispatch(initialize('profile', {
                submitSucceeded: false
            }))
        },1000);

    }
    onChangeField =(a, b) => {
        if(a.target.name === 'username') this.usernameValue = null;
        if(a.target.name === 'email') this.emailValue = null;
        localStorage.setItem('userInfo',null);
    }
    
    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        this.setState({lastProps:nextProps})
        let userInfo = localStorage.getItem('userInfo');
        let userInfoObj = (userInfo)?JSON.parse(userInfo):null;
        if(userInfoObj) {
            this.usernameValue = userInfoObj.username;
            this.emailValue = userInfoObj.email;
        }
    }

    render() {

        return (
            <Fragment>
                <Form onSubmit={this.onHandleSubmit} className={"fieldForm"}>
                    <Form.Group widths="equal" style={{flexDirection:'column', alignContent:'space-around'}}>
                        <Field className={"fieldInput"}
                               component={renderInput}
                               name="username"
                               type="input"
                               placeholder={this.username}
                               initialValue={this.usernameValue}
                               onChange={this.onChangeField}
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
                               placeholder={this.email}
                                initialValue={this.emailValue}
                               onChange={this.onChangeField}
                        />
                    </Form.Group>
                    <Form.Group className={"submitButtonGroup"} id={"submitButtonGroup"} inline style={{flexDirection:'column', marginBottom:0}}>
                        <Form.Button primary>Sign Up</Form.Button>
                    </Form.Group>
                </Form>
            </Fragment>
        );
    }

};

export default reduxForm({
    form: "profile",
    validate,
})(RegistryUserForm);
