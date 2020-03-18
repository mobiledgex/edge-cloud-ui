import React, { useState, useEffect } from 'react'
import { Form, Popup, Icon } from 'semantic-ui-react';

const MexMultiSelect = (props) => {
    const [selected, setSelected] = useState(props.form.value ? props.form.value : null)

    const onSelected = (value) => {
        setSelected(value)
        props.onChange(form, value, props.parentForm)
    }

    //Filter data based on dependData definition for given form
    const getFilteredData = (form) => {
        let forms = props.forms
        let dependentData = form.dependentData
        let dataList = form.options
        if (dependentData && dependentData.length > 0) {
            for (let i = 0; i < dependentData.length; i++) {
                let filteredList = []
                let dependentForm = forms[dependentData[i].index]
                for (let j = 0; j < dataList.length; j++) {
                    let data = dataList[j];
                    if (data[dependentForm.field] === dependentForm.value) {
                        if (data[form.field]) {
                            if(i === dependentData.length-1)
                            {
                                filteredList.push(data[form.field])
                            }
                            else
                            {
                                filteredList.push(data)
                            }
                        }
                    }
                }
                dataList = filteredList
            }
        }
        return [...new Set(dataList)];
    }

    //Convert data to semantic select format
    const getData = (form) => {
        let dataList = getFilteredData(form)
        if (dataList && dataList.length > 0) {
            return dataList.map(data => {
                let info = data[form.field] ? data[form.field] : data
                return { key: info, value: info, text: info }
            })
        }
    }

    const getForm = () => (
        <Form.Dropdown
            multiple
            selection
            icon={form.error ? <Icon color='red' name='times circle outline' style={{ marginRight: 10, position: 'absolute', right: '0px' }} /> : null}
            placeholder={form.placeholder ? form.placeholder : null}
            label={props.label ? props.label : null}
            required={props.required}
            disabled={props.disabled}
            options={getData(form)}
            onChange={(e, { value }) => onSelected(value)}
            value={selected}
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
export default MexMultiSelect