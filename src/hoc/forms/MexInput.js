import React from 'react'
import { Form } from 'semantic-ui-react';
const MexInput = (props) => {

    const [value, setValue] = React.useState(props.form.value ? props.form.value : '')
    
    const onValueChange = (form, value) =>
    {
        setValue(value)
        props.onChange(form, value, props.parentForm)
    }
    let form = props.form
    return (
        form ?
        <Form.Input
            label = {props.label ? props.label : null}
            placeholder = {form.placeholder ? form.placeholder : null}
            onChange={(e, { value }) => onValueChange(form, value)}
            type={form.rules ? form.rules.type : 'text'}
            required={form.required ? form.rules.required : false}
            disabled = {props.disabled}
            value = {value}
        /> : null
    )
}
export default MexInput