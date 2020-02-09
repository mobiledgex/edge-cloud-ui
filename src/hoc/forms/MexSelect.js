import React, {useState} from 'react'
import { Form } from 'semantic-ui-react';



const defaultData = [
    { key: 'None', value: 'None', text: 'None' }
  ]

const MexSelect = (props) => {

    const [selected, setSelected] = useState(props.form.value ? props.form.value : null)

    const onSelected = (value) => {
        setSelected(value)
        props.onChange(form, value)
    }

    let form = props.form;
    return (
        form ?
            <Form.Select
                placeholder={form.placeholder ? form.placeholder : null}
                label={props.label ? props.label : null}
                required={props.required}
                disabled = {props.disabled}
                options={form.options ? form.options : defaultData}
                onChange={(e, { value }) => onSelected(value)}
                value = {selected}
            /> : null
    )
}
export default MexSelect