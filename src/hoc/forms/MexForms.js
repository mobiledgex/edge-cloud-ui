import React from 'react'
import MexSelect from './MexSelect';
import MexInput from './MexInput';
import MexDualList from './MexDualList';
import { Form, Grid } from 'semantic-ui-react';

const SELECT = 'Select'
const DUAL_LIST = 'DualList'
const Input = 'Input'

let data = {}
const onValueSelect = (form, value) => {
    data[form.field] = value;
}

const MexForms = (props) => {
    let forms = props.forms
    return (
        forms ?
            <Form>
                <Form.Group widths="equal" style={{ flexDirection: 'column', marginLeft: 10, marginRight: 10, alignContent: 'space-around' }}>
                    <Grid columns={2}>
                        {forms.map((form, i) => {
                            data[form.field] = form.value;
                            let required = false;
                            let disabled = false;
                            if(form.rules)
                            {
                                let rules= form.rules;
                                required = rules.required ? rules.required : false;
                                disabled = rules.disabled ? rules.disabled : false; 
                            }
                            return (
                                form.field ?
                                    <Grid.Row columns={3} key={i}>
                                        <Grid.Column width={4} className='detail_item'>
                                            <div>{form.label}{required ? ' *' : ''}</div>
                                        </Grid.Column>
                                        <Grid.Column width={11}>
                                            {
                                                form.type === SELECT ?
                                                    <MexSelect form={form} required={required} disabled={disabled} onChange={onValueSelect} /> :
                                                    form.type === DUAL_LIST ?
                                                        <MexDualList form={form} onChange={onValueSelect}/> :
                                                        form.type === Input ?
                                                            <MexInput form={form} required={required} disabled={disabled} onChange={onValueSelect} /> :
                                                            null
                                            }
                                        </Grid.Column>
                                    </Grid.Row> : null
                            )
                        })}
                    </Grid>
                </Form.Group>
                <Form.Group className={"submitButtonGroup orgButton"} id={"submitButtonGroup"} inline style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
                    <Form.Group inline>
                        {forms.map((form, i) => {
                            return (form.type === 'Button' ?
                                <Form.Button
                                    positive
                                    content={form.label}
                                    onClick={(e) => { form.onClick(data) }}
                                /> : null)
                        })}

                    </Form.Group>
                </Form.Group>
            </Form> : null
    )
}
export default MexForms