/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * rules : {onBlur : if true then value will be updated only when input losses focus}
 * **/
import React, { useEffect } from 'react'
import { Icon, Popup, Input } from 'semantic-ui-react';

const MexInput = (props) => {
    let form = props.form
    let rules = form.rules
    const [value, setValue] = React.useState('')

    useEffect(() => {
        setValue(form.value !== undefined ? form.value : '')
    }, [form.value]);

    const onValueChange = (inp) => {
        form.hasChanged = inp !== value
        if (form.hasChanged) {
            setValue(inp)
            if (rules && rules.onBlur !== true) {
                props.onChange(form, inp)
            }
        }
    }

    const onBlurChange = (inp) => {
        if (rules && rules.onBlur && form.hasChanged) {
            let value = inp && new String(inp).trim().length > 0 ? inp : undefined
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
                min={form.rules ? form.rules.min : 0}
                required={form.required ? form.rules.required : false}
                autoComplete={form.autocomplete ? form.autocomplete : 'on'}
                disabled={props.disabled}
                value={new String(value)}
                style={form.style ? form.style : form.error ? { width: form.unit ? 'calc(100% - 45px)' : '100%', backgroundColor: 'rgba(211, 46, 46, 0.1)' } : { width: form.unit ? 'calc(100% - 45px)' : '100%', backgroundColor: 'rgba(22, 24, 29, 0.5)' }}
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
