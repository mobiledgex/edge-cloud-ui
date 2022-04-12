/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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