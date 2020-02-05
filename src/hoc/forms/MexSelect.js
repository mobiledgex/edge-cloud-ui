import React from 'react'
import { Form } from 'semantic-ui-react';

const defaultData = [
    { key: 'None', value: 'None', text: 'None' }
  ]
const MexSelect = (props) => {
    let form = props.form;

    return (
        form ?
            <Form.Select
                placeholder={form.placeholder ? form.placeholder : null}
                label={props.label ? props.label : null}
                required={form.required ? form.required : false}
                options={form.data ? form.data : defaultData}
                onChange={(e, { value }) => props.onChange(form, value)}
            /> : null
    )
}
export default MexSelect