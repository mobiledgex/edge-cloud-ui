import React from 'react'
import { Form } from 'semantic-ui-react';


const MexButton = (props)=>
{
    let form  = props.form;

    const getForms = () => (
        <Form.Button
            className='sumitFormButton'
            positive = {form.style ? false : true}
            style = {form.style}
            content={form.label}
            onClick={(e) => { props.onClick(form)}}
        />
    )

    return (
        form ?
            getForms() : null 
    )
}

export default MexButton
