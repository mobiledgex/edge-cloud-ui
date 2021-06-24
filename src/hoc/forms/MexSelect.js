import React, { useState, useRef, useEffect } from 'react'
import { Popup, Icon, Dropdown } from 'semantic-ui-react';
import { toFirstUpperCase } from '../../utils/string_utils';


const MexSelect = (props) => {

    let form = props.form;
    const refSelect = useRef(null);
    const [selected, setSelected] = useState(props.form.value ? props.form.value : null)

    useEffect(() => {
        if (refSelect && refSelect.current && refSelect.current.searchRef && refSelect.current.searchRef.current && refSelect.current.searchRef.current.type !== 'search') {
            refSelect.current.searchRef.current.type = 'search'
        }
    }, []);

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
                    if ((form.strictDependency === undefined || form.strictDependency) && (dependentForm.value === undefined || dependentForm.value.length === 0)) {
                        if (dependentData[i].strictDependency === undefined || dependentData[i].strictDependency) {
                            dataList = []
                            break;
                        }
                    }
                    for (let j = 0; j < dataList.length; j++) {
                        let data = dataList[j];
                        let valid = false
                        if(dependentForm.value === undefined || dependentForm.value.length === 0)
                        {
                            valid = true
                        }
                        else if(Array.isArray(dependentForm.value))
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
        let firstCaps = rules ? rules.firstCaps ? rules.firstCaps : false : false
        let optionList = []
        let dataList = getFilteredData(form)
        if (dataList && dataList.length > 0) {
            optionList = dataList.map(data => {
                let info = data[form.field] ? data[form.field] : data
                return { key: info, value: info, text: allCaps ? info.toUpperCase() : firstCaps ? toFirstUpperCase(info) : info }
            })
        }
        return optionList
    }

    const onSelected = (value) => {
        form.error = undefined
        setSelected(value)
        props.onChange(form, value)
    }

    const getBasicForm = () => (
        <select style={form.style}
            onChange={(e) => { onSelected(e.target.value) }}
            value={selected}
            required={props.required}
            disabled={props.disabled}>
            {
                form.options.map((options, i) => {
                    return <option key={i}>{options.text}</option>
                })
            }
        </select>
    )

    const getIcon = ()=>
    {
        let style ={ marginRight: 10, position: 'absolute', right: '0px' }
        return (
            form.error ? 
                <Icon color='red' name='times circle outline' style={style} /> : undefined
        )
    }
    const getForm = () => (
        form.style ?
            getBasicForm() :
            <Dropdown 
            id={form.field}
            ref = {refSelect}
            clearable = {form.clear !== undefined ? form.clear : true}
            fluid
            search
            icon={getIcon()}
            placeholder={form.placeholder ? form.placeholder : null}
            label={props.label ? props.label : null}
            selection 
            required={props.required}
            disabled={props.disabled}
            options={getData(form)} 
            onChange={(e, { value }) => onSelected(value)}
            value={selected}
            style={{padding:12, backgroundColor:`${form.error ? 'rgba(211, 46, 46, 0.1)' : '#16181D'}`}}/>
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
export default MexSelect