import React from 'react'
import { Icon, Popup, TextArea } from 'semantic-ui-react';
const MexInput = (props) => {

    let form = props.form
    const [value, setValue] = React.useState(props.form.value ? props.form.value : '')

    const onValueChange = (value) => {
        setValue(value)
        props.onChange(form, value)
    }

    const getForm = () => (
        <TextArea
            icon={form.error ? <Icon color='red' name='times circle outline' /> : null}
            label={props.label ? props.label : null}
            placeholder={form.placeholder ? form.placeholder : null}
            onChange={(e, { value }) => onValueChange(value)}
            type={form.rules ? form.rules.type : 'text'}
            required={form.required ? form.rules.required : false}
            disabled={props.disabled}
            value={value}
            style={form.style ? form.style : {backgroundColor:'#18191E', color:'#FFF'}}
        />
    )
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
export default MexInput