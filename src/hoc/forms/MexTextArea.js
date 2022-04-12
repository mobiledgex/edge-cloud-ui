import React from 'react'
import { Icon, Popup, TextArea } from 'semantic-ui-react';

const MexTextArea = (props) => {
    const { label, form } = props
    const { field, placeholder, rules, error } = form
    const [value, setValue] = React.useState(form.value ?? '')

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
            id={field}
            rows={rules?.rows ?? 4}
            icon={error ? <Icon color='red' name='times circle outline' /> : null}
            label={label}
            placeholder={placeholder}
            onChange={(e, { value }) => onValueChange(value)}
            type={rules ? rules.type : 'text'}
            required={rules?.required ? rules.required : false}
            disabled={props.disabled}
            onBlur={(e) => onBlurChange(e.target.value)}
            value={value}
            style={{
                border: 'solid 1px rgba(255,255,255,.2)',
                backgroundColor: error ? 'rgba(211, 46, 46, 0.1)' : '#18191E',
                color: '#939396'
            }}
        />
    )
    return (
        form ?
            error ?
                <Popup
                    trigger={getForm()}
                    content={error}
                    inverted
                /> :
                getForm()
            : null
    )
}
export default MexTextArea