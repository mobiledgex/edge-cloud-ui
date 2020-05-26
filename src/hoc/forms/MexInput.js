/**
 * rules : {onBlur : if true then value will be updated only when input losses focus}
 * **/
import React from 'react'
import { Icon, Popup, Input } from 'semantic-ui-react';
const MexInput = (props) => {

    let form = props.form
    let rules = form.rules
    const [value, setValue] = React.useState(props.form.value ? props.form.value : '')

    const onValueChange = (value) => {
        setValue(value)
        if (rules && rules.onBlur !== true) {
            props.onChange(form, value)
        }
    }

    const onBlurChange = (value) => {
        if (rules && rules.onBlur) {
            props.onChange(form, value)
        }
    }

    const getForm = () => (
        <div>
            <Input
                icon={form.error ? <Icon color='red' name='times circle outline' /> : null}
                label={form.unit ? { content: form.unit } : null}
                labelPosition={form.unit ? 'right' : null}
                placeholder={form.placeholder ? form.placeholder : null}
                onChange={(e, { value }) => onValueChange(value)}
                onBlur={(e) => onBlurChange(e.target.value)}
                type={form.rules ? form.rules.type : 'text'}
                required={form.required ? form.rules.required : false}
                disabled={props.disabled}
                value={value}
                style={form.style ? form.style : { width: form.unit ? 'calc(100% - 45px)' : '100%' }}
            />
        </div >
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
