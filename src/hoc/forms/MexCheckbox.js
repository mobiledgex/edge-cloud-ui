import React from 'react'
import { Form, Segment } from 'semantic-ui-react';
const MexCheckbox = (props) => {
    let form = props.form

    const onChange = (checked)=>
    {
      props.onChange(form, checked, props.parentForm)
    }
    return (
        form ?
        <Segment compact style={{backgroundColor: 'transparent'}}>
        <Form.Checkbox toggle onChange={(e, { checked })=>onChange(checked)}/>
        </Segment>
        : null
    )
}
export default MexCheckbox