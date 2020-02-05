import React from 'react'
import { Form } from 'semantic-ui-react';
const MexSelect = (props) => {
    let form = props.form
    return (
        form ?
        <Form.Input
            label = {props.label ? props.label : null}
            placeholder = {form.placeholder ? form.placeholder : null}
            onChange={(e, { value }) => props.onChange(form, value)}
            type={form.rules ? form.rules.type : 'text'}
            required={form.required ? form.rules.required : false}
        /> : null
    )
}
export default MexSelect