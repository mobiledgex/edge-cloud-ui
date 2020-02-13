import React from 'react'
import { Form, Segment } from 'semantic-ui-react';
import { set } from 'd3';
const MexCheckbox = (props) => {
    let form = props.form

    const [value, setValue] = React.useState(props.form.value ? props.form.value : false)

    const onChange = (checked)=>
    {
      setValue(checked)
      props.onChange(form, checked, props.parentForm)
    }
    return (
        form ?
        <Segment compact style={{backgroundColor: 'transparent'}}>
        <Form.Checkbox toggle onChange={(e, { checked })=>onChange(checked)} checked={value}/>
        </Segment>
        : null
    )
}
export default MexCheckbox