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
                            return (
                                <Grid.Row columns={3} key={i}>
                                    <Grid.Column width={4} className='detail_item'>
                                        <div>{form.label}{form.required ? ' *' : ''}</div>
                                    </Grid.Column>
                                    <Grid.Column width={11}>
                                        {
                                            form.type === SELECT ?
                                                <MexSelect form={form} onChange={onValueSelect} /> :
                                                form.type === DUAL_LIST ?
                                                    <MexDualList /> :
                                                    form.type === Input ?
                                                        <MexInput form={form} onChange={onValueSelect}/> :
                                                        null
                                        }
                                    </Grid.Column>
                                </Grid.Row>
                            )
                        })}
                    </Grid>
                </Form.Group>
                <Form.Group className={"submitButtonGroup orgButton"} id={"submitButtonGroup"} inline style={{ flexDirection: 'row', marginLeft: 10, marginRight: 10 }}>
                    <Form.Group inline>
                        <span style={{ marginRight: '1em' }}>
                            <Form.Button>
                                Cancel
                            </Form.Button>
                        </span>
                        {forms.map((form, i) => {
                            return (form.type === 'Button' ?
                                <Form.Button
                                    primary
                                    positive
                                    icon='checkmark'
                                    labelPosition='right'
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