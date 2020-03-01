import React from 'react'
import MexSelect from './MexSelect';
import MexInput from './MexInput';
import MexDualList from './MexDualList';
import MexCheckbox from './MexCheckbox';
import MexButton from './MexButton';
import { Form, Grid, Divider } from 'semantic-ui-react';
import { IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

export const HEADER = 'Header'
export const SELECT = 'Select'
export const DUALLIST = 'DualList'
export const INPUT = 'Input'
export const CHECKBOX = 'Checkbox'
export const ICON_BUTTON = 'IconButton'


const getIcon = (id) => {
    switch (id) {
        case 'delete':
            return <DeleteOutlineOutlinedIcon />

    }
}

const isDisabled = (form) => {
    let disabled = false;
    if (form.rules) {
        let rules = form.rules;
        return rules.disabled === undefined ? false : rules.disabled;
    }
    return disabled;
}


const MexForms = (props) => {

    const validateRules = (form, valid) => {
        if (valid) {
            if (form.forms) {
                for (let i = 0; i < form.forms.length; i++) {
                    valid = validateRules(form.forms[i], valid)
                    if (!valid) {
                        break;
                    }
                }
            }
            else if (form.editable && !isDisabled(form)) {
                let rules = form.rules;
                if (rules) {
                    if (rules.required) {
                        if (form.value === undefined || form.value.length === 0) {
                            form.error = `${form.label} is mandatory`
                            valid = false;
                        }
                        else {
                            form.error = undefined
                        }
                    }
                }
            }
        }
        if (valid && form.dataValidateFunc) {
            valid = form.dataValidateFunc(form)
        }
        return valid
    }

    const onSubmit = (form) => {
        let valid = true;
        if (form.validate) {
            for (let i = 0; i < props.forms.length; i++) {
                let form = forms[i]
                valid = form.editable ? validateRules(form, valid) : valid
                if (!valid) {
                    break;
                }
            }
        }
        if (valid && form.onClick) {
            form.onClick();
        }
        else if (props.reloadForms) {
            props.reloadForms()
        }
    }

    const onValueSelect = (form, value, parentForm) => {
        form.value = value;
        if (props.onValueChange) {
            props.onValueChange(form, parentForm)
        }

    }

    const loadHeader = (index, form) => {
        form.id = { id: index }
        let subForm = form.forms
        return (
            <div key={index} style={{ width: '100%' }}>
                <h2 style={{ color: "white", display: 'inline' }}>{form.label}
                    {
                        subForm ? subForm.formType === 'Button' ?
                            <IconButton style={{ color: "white", display: 'inline' }} onClick={subForm.onClick}>
                                <AddIcon />
                            </IconButton> :
                            null :
                            null
                    }
                </h2>
                <Divider />
            </div>
        )
    }

    const loadHorizontalForms = (parentId, forms) => {

        let parentForm = props.forms[parentId];
        return forms.map((form, i) => {
            let key = parentForm.uuid + '' + i
            let required = false;
            let disabled = false;
            form.id = { id: i }
            form.parent = { id: parentId, form: parentForm }
            if (form.rules) {
                let rules = form.rules;
                required = rules.required ? rules.required : false;
                disabled = rules.disabled ? rules.disabled : false;
            }
            return (
                form.editable ?
                    <Grid.Column width={parentForm.width} key={key}>
                        <label style={form.labelStyle}>{form.label}{required ? ' *' : ''}</label>
                        {
                            form.formType === INPUT ?
                                <MexInput parentForm={parentForm} form={form} required={required} disabled={disabled} onChange={onValueSelect} /> :
                                form.formType === SELECT ?
                                    <MexSelect parentForm={parentForm} form={form} required={required} disabled={disabled} onChange={onValueSelect} /> :
                                form.formType === CHECKBOX ?   
                                    <MexCheckbox horizontal={true} form={form} onChange={onValueSelect} /> : 
                                form.formType === ICON_BUTTON ?
                                    <IconButton onClick={() => { form.onClick(form) }} style={{ color: form.color, top: 15 }}>{getIcon(form.icon)}</IconButton> :
                                    null
                        }
                    </Grid.Column> : null
            )
        })
    }

    const loadForms = (index, form) => {
        form.id = { id: index }
        let required = false;
        let disabled = false;
        if (form.rules) {
            let rules = form.rules;
            required = rules.required ? rules.required : false;
            disabled = rules.disabled ? rules.disabled : false;
        }
        return (
            form.field ?
                <Grid.Row columns={3} key={index}>
                    <Grid.Column width={4} className='detail_item'>
                        <div style={form.labelStyle}>{form.label}{required ? ' *' : ''}</div>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        {
                            form.formType === SELECT ?
                                <MexSelect form={form} required={required} disabled={disabled} onChange={onValueSelect} /> :
                                form.formType === DUALLIST ?
                                    <MexDualList form={form} onChange={onValueSelect} /> :
                                    form.formType === INPUT ?
                                        <MexInput form={form} required={required} disabled={disabled} onChange={onValueSelect} /> :
                                        form.formType === CHECKBOX ?
                                            <MexCheckbox form={form} onChange={onValueSelect} /> :
                                            null
                        }
                    </Grid.Column>
                </Grid.Row> : null
        )
    }

    const loadMultiForm = (index, form) => {
        return (
            <Grid.Row columns={2} key={index} id={form.field}>
                {loadHorizontalForms(index, form.forms)}
            </Grid.Row>
        )
    }

    let forms = props.forms
    return (
        forms ?
            <Form>
                <Form.Group widths="equal" style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10, alignContent: 'space-around' }}>
                    <Grid columns={2}>
                        {forms.map((form, i) => {
                            return (
                                form.editable ?
                                    form.formType === HEADER ?
                                        loadHeader(i, form) :
                                        form.formType === 'MultiForm' ?
                                            form.forms ? loadMultiForm(i, form) : null :
                                            loadForms(i, form) :
                                    null
                            )
                        })}
                    </Grid>
                </Form.Group>
                <Form.Group className={"submitButtonGroup orgButton"} id={"submitButtonGroup"} inline style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
                    <Form.Group inline>
                        {forms.map((form, i) => {
                            return (form.formType === 'Button' ?
                                <MexButton
                                    form={form}
                                    key={i}
                                    onClick={onSubmit} />
                                : null)
                        })}

                    </Form.Group>
                </Form.Group>
            </Form> : null
    )
}
export default MexForms