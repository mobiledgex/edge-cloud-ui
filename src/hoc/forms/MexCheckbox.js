import React from 'react'
import { Form } from 'semantic-ui-react';
import { Switch } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
const MexCheckbox = (props) => {
    let form = props.form
    let style = form.style

    const getColor = ()=>
    {
      return style ? style.color : null
    }
    const [value, setValue] = React.useState(props.form.value ? props.form.value : false)

    const onChange = (checked)=>
    {
      setValue(checked)
      props.onChange(form, checked, props.parentForm)
    }

    const CustomSwitch = withStyles({
      switchBase: {
        color: '#D32F2F',
        '&$checked': {
          color: '#388E3C',
        },
        '&$checked + $track': {
          backgroundColor: '#388E3C',
        },
      },
      checked: {},
      track: {
        borderRadius: 26 / 2,
        backgroundColor: '#D32F2F',
        opacity: 1,
      },
    })(Switch);

  const getMaterialCheckBox = () =>
    (
      <CustomSwitch onChange={(e) => onChange(e.target.checked)} value={value} checked={value}/>
    )

    const getForm = ()=>(
       <Form.Checkbox toggle onChange={(e, { checked })=>onChange(checked)} checked={value}/>
    )
    return (
        form ?
         props.horizontal ?
         <div>
            {getMaterialCheckBox()}
          </div> : 
         getForm()
        : null
    )
}
export default MexCheckbox