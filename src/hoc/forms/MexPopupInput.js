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
import React from 'react'
import { Icon, Popup, Input } from 'semantic-ui-react';
const MexPopupInput = (props) => {

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
            <Input
                icon={form.error ? <Icon color='red' name='times circle outline' /> : null}
                label={form.unit ? { content: form.unit } : null}
                labelPosition={form.unit ? 'right' : null}
                placeholder={form.placeholder ? form.placeholder : null}
                onChange={(e, { value }) => onValueChange(value)}
                onBlur={(e) => onBlurChange(e.target.value)}
                type={form.rules ? form.rules.type : 'text'}
                required={form.required ? form.rules.required : false}
                autoComplete={form.autocomplete ? form.autocomplete : 'on'}
                disabled={props.disabled}
                value={value}
                style={form.style ? form.style : form.error ? { width: form.unit ? 'calc(100% - 45px)' : '100%', backgroundColor: 'rgba(211, 46, 46, 0.1)' } : { width: form.unit ? 'calc(100% - 45px)' : '100%' }}
            />
    )
    return (
        <Popup
        trigger={getForm()}
        position='bottom center'
        style={{zIndex:999999}}
        inverted
        content={form.popup(form)}
        on='focus'
      />

    )
}
export default MexPopupInput
