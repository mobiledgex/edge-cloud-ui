import React from 'react'
import uuid from 'uuid';
import MexSelect from './MexSelect';
import MexMultiSelect from './MexMultiSelect'
import MexInput from './MexInput';
import MexTextArea from './MexTextArea';
import MexDualList from './MexDualList';
import MexCheckbox from './MexCheckbox';
import MexButton from './MexButton';
import { Form, Grid, Divider } from 'semantic-ui-react';
import { IconButton, Tooltip } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import FolderOpenIcon from '@material-ui/icons/FolderOpen';
import ClearIcon from '@material-ui/icons/Clear';
import ContactSupportOutlinedIcon from '@material-ui/icons/ContactSupportOutlined';

export const HEADER = 'Header'
export const SELECT = 'Select'
export const MULTI_SELECT = 'MultiSelect'
export const DUALLIST = 'DualList'
export const INPUT = 'Input'
export const CHECKBOX = 'Checkbox'
export const ICON_BUTTON = 'IconButton'
export const TEXT_AREA = 'TextArea'
export const BUTTON = 'Button'
export const MULTI_FORM = 'MultiForm'

const MexForms = (props) => {
    let forms = props.forms

    const getIcon = (id) => {
        switch (id) {
            case 'delete':
                return <DeleteOutlineOutlinedIcon />
            case 'add':
                return <AddIcon />
            case 'browse':
                return <FolderOpenIcon />
            case 'clear':
                return <ClearIcon />
            case 'help':
                return <ContactSupportOutlinedIcon />
            default:
                return id
        }
    }

    //Validate form before loading
    const initValidateRules = (form) => {
        let rules = form.rules ? form.rules : {};
        let disabled = rules.disabled ? rules.disabled : false;
        if (props.isUpdate) {
            disabled = form.update ? disabled : true;
        }
        rules.disabled = disabled;
        form.rules = rules;
    }

    const isDisabled = (form) => {
        let disabled = false;
        if (form.rules) {
            let rules = form.rules;
            return rules.disabled === undefined ? false : rules.disabled;
        }
        return disabled;
    }

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
            else if (form.visible && !isDisabled(form)) {
                let rules = form.rules;
                if (rules) {
                    if (rules.required) {
                        if (form.value === null || form.value === undefined || form.value.length === 0) {
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

    /***
     * Map values from form to field
     * ***/
    const formattedData = () => {
        let data = {};
        let forms = props.forms
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field) {
                if (form.forms) {
                    data[form.uuid] = {};
                    let subForms = form.forms
                    for (let j = 0; j < subForms.length; j++) {
                        let subForm = subForms[j];
                        if (subForm.field) {
                            data[form.uuid][subForm.field] = subForm.value;
                        }
                    }

                }
                else {
                    data[form.field] = form.value;
                }
            }
        }
        return data
    }

    const onSubmit = (form) => {
        let valid = true;
        if (form.validate) {
            for (let i = 0; i < props.forms.length; i++) {
                let form = forms[i]
                valid = form.visible ? validateRules(form, valid) : valid
                if (!valid) {
                    break;
                }
            }
        }
        if (valid && form.onClick) {
            form.onClick(formattedData());
        }
        else if (props.reloadForms) {
            props.reloadForms()
        }
    }

    const onValueSelect = (form, value) => {
        form.value = value;
        if (props.onValueChange) {
            props.onValueChange(form)
        }

    }

    const loadInputForms = (form, required, disabled) => {
        return (
            form.formType === INPUT ?
                <MexInput form={form} required={required} disabled={disabled} onChange={onValueSelect} /> :
                form.formType === TEXT_AREA ?
                    <MexTextArea form={form} required={required} disabled={disabled} onChange={onValueSelect} /> :
                    null
        )
    }

    const loadDropDownForms = (form, required, disabled) => {
        return (form.formType === SELECT ?
            <MexSelect form={form} forms={forms} required={required} disabled={disabled} onChange={onValueSelect} /> :
            form.formType === MULTI_SELECT ?
                <MexMultiSelect form={form} forms={forms} required={required} disabled={disabled} onChange={onValueSelect} /> :
                form.formType === DUALLIST ?
                    <MexDualList form={form} onChange={onValueSelect} /> : null)
    }

    const loadButton = (form, index) => {
        return (
            form.formType === ICON_BUTTON ?
                <IconButton key={index} style={form.style} onClick={(e) => { form.onClick(e, form) }}>{getIcon(form.icon)}</IconButton>
                :
                form.formType === BUTTON ?
                    <MexButton
                        form={form}
                        key={index}
                        onClick={(e) => { form.onClick(e, form) }} /> :
                    null)
    }

    const loadHeader = (index, form) => {
        form.id = { id: index }
        let subForms = form.forms
        return (
            <div key={index} style={{ width: '100%' }}>
                <br/>
                <h2 style={{ color: "white", display: 'inline' }}>{form.label}
                    {
                        subForms ? subForms.map((subForm, i) => {
                            subForm.parent = { id: index, form: form }
                            return loadButton(subForm, i)
                        }) : null
                    }
                    {
                        form.tip ? showTip(form) : null
                    }
                </h2>
                <Divider />
            </div>
        )
    }

    const loadHorizontalForms = (parentId, forms) => {

        let parentForm = props.forms[parentId];
        return forms.map((form, i) => {
            initValidateRules(form)
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
                form.visible ?
                    <Grid.Column width={form.width ? form.width : parentForm.width} key={key}>
                        {form.label ? <label style={form.labelStyle}>{form.label}{required ? ' *' : ''}</label> : null}
                        {
                            form.formType === INPUT || form.formType === TEXT_AREA ?
                                loadInputForms(form, required, disabled) :
                                form.formType === SELECT ?
                                    loadDropDownForms(form, required, disabled) :
                                    form.formType === CHECKBOX ?
                                        <MexCheckbox horizontal={true} form={form} onChange={onValueSelect} /> :
                                        form.formType === ICON_BUTTON || form.formType === BUTTON ?
                                            loadButton(form, i) :
                                            null
                        }
                    </Grid.Column> : null
            )
        })
    }

    const showTip = (form) => {
        return (
            <Tooltip title={form.tip.split('\n').map((info)=>{return <strong>{info}<br/></strong>})} aria-label="tip">
                {getIcon('help')}
            </Tooltip>
        )
    }

    const checkRole = (form)=>
    {
        let currentRole = localStorage.selectRole
        let roles = form.roles
        if(roles)
        {
            form.visible = false;
            for(let i=0;i<roles.length;i++)
            {
                let role = roles[i]
                if(role === currentRole)
                {
                    form.visible = true
                }
            }
        }
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
                <Grid.Row columns={3} key={uuid() + '' + index}>
                    <Grid.Column width={4} className='detail_item'>
                        <div style={form.labelStyle}>{form.label}{required ? ' *' : ''}</div>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        {
                            form.forms ?
                            <Grid key={index} id={form.field} style={{ marginLeft: -13, width: '100%' }}>{loadHorizontalForms(index, form.forms)}</Grid> :
                                form.formType === SELECT || form.formType === MULTI_SELECT || form.formType === DUALLIST ?
                                    loadDropDownForms(form, required, disabled) :
                                    form.formType === INPUT || form.formType === TEXT_AREA ?
                                        loadInputForms(form, required, disabled) :
                                        form.formType === CHECKBOX ?
                                            <MexCheckbox form={form} onChange={onValueSelect} /> :
                                            null
                        }
                    </Grid.Column>
                    {
                        form.tip ?
                            <Grid.Column width={1}>
                                {showTip(form)}
                            </Grid.Column> :
                            null
                    }
                </Grid.Row> : null
        )
    }

    return (
        forms ?
            <Form>
                <Form.Group widths="equal" style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10, alignContent: 'space-around' }}>
                    <Grid columns={2}>
                        {forms.map((form, i) => {
                            initValidateRules(form);
                            checkRole(form)
                            return (
                                form.visible ?
                                    form.formType === HEADER ?
                                        loadHeader(i, form) :
                                        form.formType === MULTI_FORM ?
                                            form.forms ?
                                                <Grid.Row key={i} id={form.field} style={{ marginLeft: -13, width: '100%' }}>{loadHorizontalForms(i, form.forms)}</Grid.Row>
                                                : null :
                                            loadForms(i, form) :
                                    null
                            )
                        })}
                    </Grid>
                </Form.Group>
                <Form.Group className={"submitButtonGroup orgButton"} id={"submitButtonGroup"} inline style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
                    <Form.Group inline>
                        {forms.map((form, i) => {
                            return (form.formType === BUTTON ?
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
