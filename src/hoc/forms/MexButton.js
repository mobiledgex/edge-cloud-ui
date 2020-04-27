import React from 'react'
import { Form } from 'semantic-ui-react';
import { Button } from '@material-ui/core';


const MexButton = (props)=>
{
    let form  = props.form;

    const getStyle = (form) =>
    {
        return form.style ? form.style : {backgroundColor:'#74AA19', color:'white', margin:10}
    }
    const getForms = () => (
        <Button
            className = {props.className ? props.className : ''}
            variant="contained" 
            style={getStyle(form)}
            onClick={(e) => { props.onClick(form) }}>
            {form.label}
        </Button>
    )

    return (
        form ?
            getForms() : null 
    )
}

export default MexButton
