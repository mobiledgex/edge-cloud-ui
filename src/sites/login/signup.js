import React, { Fragment } from "react";
import MexForms, { INPUT, BUTTON } from "../../hoc/forms/MexForms";
import { fields } from "../../services/model/format";
import VpnKeyOutlinedIcon from '@material-ui/icons/VpnKeyOutlined';
import EmailOutlinedIcon from '@material-ui/icons/EmailOutlined';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';

class RegistryUserForm extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            forms:[]
        }
    }

    validateEmail = (form)=>
    {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value)) {
            form.error = 'Invalid email address'
            return false;
        }
        else {
            form.error = undefined
            return true;
        }   
    }

    validateUsername = (form)=>
    {
        if (!/^[-_.0-9a-zA-Z]+$/.test(form.value)) {
            form.error = 'Username can only contain letters, digits, "_", ".", "-".'
            return false;
        }
        else {
            form.error = undefined
            return true;
        }   
    }

    validatePassword = (currentForm) => {
        if (currentForm.value.length < 8) {
            currentForm.error = 'Must be at least 8 characters'
            return false;
        }
        else if (currentForm.field === fields.confirmPassword) {
            let forms = this.state.forms
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i]
                if (form.field === fields.password) {
                    if (currentForm.value !== form.value) {
                        currentForm.error = 'Password and Confirm Password do not match'
                        return false;
                    }
                    else
                    {
                        currentForm.error = undefined
                        return true;
                    }
                    break;
                }
            }
        }
        else {
            currentForm.error = undefined
            return true;
        }
    }

    onCreate = (data)=>
    {
        this.props.createUser(data)
    }
    
    onValueChange = (form)=>
    {

    }

    reloadForms = () => {
        this.setState({
            forms: this.state.forms
        })
    }

    forms = () => (
        [
            { field: fields.username, label:'Username', labelIcon: <PersonOutlineOutlinedIcon style={{color:"#ADB0B1"}}/>, formType: INPUT, placeholder: 'Username', rules: { required: true, autoComplete:"off" }, visible: true, dataValidateFunc:this.validateUsername },
            { field: fields.password, label: 'Password', labelIcon: <VpnKeyOutlinedIcon style={{color:"#ADB0B1"}}/>, formType: INPUT, placeholder: 'Password', rules: { required: true, type: 'password' }, visible: true, dataValidateFunc:this.validatePassword },
            { field: fields.confirmPassword, label: 'Confirm Password', labelIcon: <VpnKeyOutlinedIcon style={{color:"#ADB0B1"}}/>, formType: INPUT, placeholder: 'Confirm Password', rules: { required: true, type: 'password' }, visible: true, dataValidateFunc:this.validatePassword },
            { field: fields.email, label: 'Email', labelIcon: <EmailOutlinedIcon style={{color:"#ADB0B1"}}/>, formType: INPUT, placeholder: 'Email ID', rules: { required: true, type: 'email' }, visible: true, dataValidateFunc:this.validateEmail },
        ]
    )

    render() {
        return (
            <Fragment>
                <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} isUpdate={this.isUpdate} />
            </Fragment>
        );
    }

    getFormData = () => {
        let forms = this.forms()
        forms.push({ label: 'Sign Up', formType: BUTTON, onClick: this.onCreate, validate: true, style:{width:'90%', position:'absolute', zIndex:9999, backgroundColor:'rgba(0, 85, 255, .25)', border:'solid 1px rgba(128, 170, 255, .5) !important', color:'white'} })
        this.setState({
            forms: forms
        })
    }

    componentDidMount()
    {
        this.getFormData()
    }
};

export default RegistryUserForm;
