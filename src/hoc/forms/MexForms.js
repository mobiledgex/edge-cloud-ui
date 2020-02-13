import React from 'react'
import MexSelect from './MexSelect';
import MexInput from './MexInput';
import MexDualList from './MexDualList';
import MexCheckbox  from './MexCheckbox';
import { Form, Grid, Divider } from 'semantic-ui-react';
import { IconButton } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';

export const HEADER = 'Header'
export const SELECT = 'Select'
export const DUALLIST = 'DualList'
export const INPUT = 'Input'
export const CHECKBOX = 'Checkbox'

const MexForms = (props) => {

    const onValueSelect = (form, value, parentForm) => {
        form.value = value;
        if(props.onValueChange)
        {
            props.onValueChange(form, parentForm)
        }
        
    }
    const onRemoveMultiForm = (index, form)=>
    {
        form.onClick(index)
    }
    
    const loadHeader = (index, form)=>
    {
        let subForm = form.forms
        return (
            <div key={index} style={{ width: '100%' }}>
                <h2 style={{ color: "white", display: 'inline' }}>{form.label}
                    {
                        subForm ? subForm.type === 'Button' ? 
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
    
    const loadHorizontalForms = (parentId, forms)=>
    {
        let parentForm = props.forms[parentId];
        return forms.map((form, i) => {
            
            let required = false;
            let disabled = false;
            if (form.rules) {
                let rules = form.rules;
                required = rules.required ? rules.required : false;
                disabled = rules.disabled ? rules.disabled : false;
            }
            return (
                form.field && form.visible ?
                    <Grid.Column width={3} key={i}>
                        {form.label}{required ? ' *' : ''}
                        {
                            form.type === INPUT ?
                                <MexInput parentForm={parentForm} form={form} required={required} disabled={disabled} onChange={onValueSelect} /> :
                            form.type === SELECT ?
                                <MexSelect parentForm={parentForm} form={form} required={required} disabled={disabled} onChange={onValueSelect} /> :
                                null
                        }
                    </Grid.Column> : null
            )
        })
    }
    
    const loadForms = (index, form)=>
    {
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
                        <div>{form.label}{required ? ' *' : ''}</div>
                    </Grid.Column>
                    <Grid.Column width={11}>
                        {
                            form.type === SELECT ?
                                <MexSelect form={form} required={required} disabled={disabled} onChange={onValueSelect} /> :
                                form.type === DUALLIST ?
                                    <MexDualList form={form} onChange={onValueSelect} /> :
                                    form.type === INPUT ?
                                        <MexInput form={form} required={required} disabled={disabled} onChange={onValueSelect} /> :
                                    form.type === CHECKBOX ?
                                        <MexCheckbox form={form} onChange={onValueSelect}/>:
                                        null
                        }
                    </Grid.Column>
                </Grid.Row> : null
        )
    }
    
    const loadMultiForm=(index, form)=>
    {
        return (
            <Grid.Row columns={2} key={index}>
                {loadHorizontalForms(index, form.forms) }
                {
                    index === props.forms.length-1 && form.showDelete? 
                        <div>
                            <p></p>
                            <IconButton style={{color:'white'}} onClick={()=>{onRemoveMultiForm(index, form)}} ><DeleteOutlinedIcon/></IconButton>
                        </div> : 
                        null
                }
                
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
                                form.visible ?
                                    form.type === HEADER ?
                                        loadHeader(i, form) :
                                    form.type === 'MultiForm' ? 
                                        form.forms ? loadMultiForm(i, form): null :
                                        loadForms(i, form) :
                                    null
                            )
                        })}
                    </Grid>
                </Form.Group>
                <Form.Group className={"submitButtonGroup orgButton"} id={"submitButtonGroup"} inline style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
                    <Form.Group inline>
                        {forms.map((form, i) => {
                            return (form.type === 'Button' ?
                                <Form.Button
                                    key={i}
                                    positive
                                    content={form.label}
                                    onClick={(e) => { form.onClick() }}
                                /> : null)
                        })}

                    </Form.Group>
                </Form.Group>
            </Form> : null
    )
}
export default MexForms