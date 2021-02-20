import React from 'react'
import { Switch } from '@material-ui/core';
import { makeStyles, withStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  root: props => props,
})
const MexCheckbox = (props) => {
  let form = props.form
  const classes = useStyles(form.style);
  const [value, setValue] = React.useState(props.form.value ? props.form.value : false)

  const onChange = (checked) => {
    setValue(checked)
    props.onChange(form, checked, props.parentForm)
  }

  const CustomSwitch = withStyles({
    switchBase: {
      color: '#ab2424',
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
      backgroundColor: '#ab2424',
      opacity: 1,
    },
  })(Switch);

  const getMaterialCheckBox = () =>
  (
    <CustomSwitch className={classes.root} onChange={(e) => onChange(e.target.checked)} value={value} checked={value} disabled={form.rules && form.rules.disabled} />
  )


  return (
    form ?
      getMaterialCheckBox()
      : null
  )
}
export default MexCheckbox