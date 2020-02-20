import React, {useState, useEffect} from 'react'
import { Form, Popup, Icon } from 'semantic-ui-react';



const defaultData = [
    { key: 'None', value: 'None', text: 'None' }
  ]

const MexSelect = (props) => {


    const [selected, setSelected] = useState(props.form.value ? props.form.value : null)

    const onSelected = (value) => {
        setSelected(value)
        props.onChange(form, value, props.parentForm)
    }

    
    
    const getForm = () => (
        <Form.Select
            icon={form.error ? <Icon color='red' name='times circle outline' style={{marginRight:10, position:'absolute',right: '0px'}}/> : null}
            placeholder={form.placeholder ? form.placeholder : null}
            label={props.label ? props.label : null}
            required={props.required}
            disabled={props.disabled}
            options={form.options ? form.options : null}
            onChange={(e, { value }) => onSelected(value)}
            value={selected}
            style={form.style}
        />
    )

    let form = props.form;

    return (
        form ?
            form.error ?
                <Popup
                    trigger={getForm()}
                    content={form.error}
                    inverted
                /> :
                getForm()
            : null
    )
}
export default MexSelect