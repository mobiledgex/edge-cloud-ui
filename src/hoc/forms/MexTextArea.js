import React from 'react'
import { Icon, Popup, TextArea } from 'semantic-ui-react';

const MexTextArea = (props) => {

    let form = props.form
    let rules = form.rules
    const [value, setValue] = React.useState(props.form.value ? props.form.value : '')

    const onValueChange = (inp) => {
        form.hasChanged = inp !== value
        if (form.hasChanged) {
            setValue(inp)
            if (rules === undefined || (rules && !rules.onBlur)) {
                props.onChange(form, inp)
            }
        }
    }

    const onBlurChange = (value) => {
        if (rules && rules.onBlur && form.hasChanged) {
            props.onChange(form, value)
        }
    }

    const getForm = () => (
        <TextArea
            id={form.field}
            rows={rules?.rows ?? 5}
            icon={form.error ? <Icon color='red' name='times circle outline' /> : null}
            label={props.label ? props.label : null}
            placeholder={form.placeholder ? form.placeholder : null}
            onChange={(e, { value }) => onValueChange(value)}
            type={form.rules ? form.rules.type : 'text'}
            required={form.required ? form.rules.required : false}
            disabled={props.disabled}
            onBlur={(e) => onBlurChange(e.target.value)}
            value={value}
            style={form.style ? form.style : { backgroundColor: `${form.error ? 'rgba(211, 46, 46, 0.1)' : '#18191E'}`, color: '#939396' }}
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
export default MexTextArea