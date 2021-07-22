import React, { useState, useEffect } from 'react'
import { Form, Popup, Icon } from 'semantic-ui-react';

const MexMultiSelect = (props) => {
    const [selected, setSelected] = useState(props.form.value ? props.form.value : [])

    const onSelected = (value) => {
        if(value.length < selected.length)
        {
            props.onChange(form, value, props.parentForm)
        }
        setSelected(value)
    }

    //Filter data is based on dependent data array defined in form
    const getFilteredData = (form) => {
        let filteredList = []
        let forms = props.forms
        let dependentData = form.dependentData
        let dataList = form.options
        if (dataList && dataList.length > 0) {
            if (dependentData && dependentData.length > 0) {
                for (let i = 0; i < dependentData.length; i++) {
                    filteredList = []
                    let dependentForm = forms[dependentData[i].index]
                    if(dependentForm.value === undefined)
                    {
                        dataList = []
                        break;
                    }
                    for (let j = 0; j < dataList.length; j++) {
                        let data = dataList[j];
                        let valid = false
                        if(Array.isArray(dependentForm.value))
                        {
                            valid =  dependentForm.value.includes(data[dependentForm.field])
                        }
                        else if (data[dependentForm.field] === dependentForm.value) {
                            valid = true
                        }
                        if(valid)
                        {
                            if (data[form.field]) {
                                if (i === dependentData.length - 1) {
                                    filteredList.push(data[form.field])
                                }
                                else {
                                    filteredList.push(data)
                                }
                            }
                        }
                    }
                    dataList = filteredList
                }
            }
            else {
                for (let j = 0; j < dataList.length; j++) {
                    let data = dataList[j];
                    filteredList.push(data[form.field] ? data[form.field] : data)
                }
                dataList = filteredList
            }
        }
        return [...new Set(dataList)];
    }

    //Convert data to semantic select format
    const getData = (form) => {
        let rules = form.rules
        let allCaps = rules ? rules.allCaps ? rules.allCaps : false : false
        let optionList = []
        let dataList = getFilteredData(form)
        if (dataList && dataList.length > 0) {
            optionList = dataList.map(data => {
                let info = data[form.field] ? data[form.field] : data
                return { key: info, value: info, text: allCaps ? info.toUpperCase() : info }
            })
        }
        return optionList
    }

    const getForm = () => (
        <Form.Dropdown
            id={form.field}
            multiple
            selection
            icon={form.error ? <Icon color='red' name='times circle outline' style={{ marginRight: 10, marginTop:7, position: 'absolute', right: '0px' }} /> : null}
            placeholder={form.placeholder ? form.placeholder : null}
            label={props.label ? props.label : null}
            required={props.required}
            disabled={props.disabled}
            options={getData(form)}
            style={{backgroundColor:`${form.error ? 'rgba(211, 46, 46, 0.1)' : '#16181D'}`}}
            onChange={(e, { value }) => onSelected(value)}
            onClose = {()=>{props.onChange(form, selected, props.parentForm)}}
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