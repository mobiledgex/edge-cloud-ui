import React, { useEffect, useState } from 'react'
import MexForms, { SWITCH } from '../../../../hoc/forms/MexForms'
import { PREF_LOGS } from '../../../../utils/sharedPreferences_util'

const LogsPref = (props) => {
  const [forms, setForms] = useState([])

  useEffect(() => {
    let forms = getforms()
    let data = props.data
    if (data) {
      for (let i = 0; i < forms.length; i++) {
        let form = forms[i]
        form.value = data[form.field] !== undefined ? data[form.field] : form.value
      }
    }
    setForms(forms)
  }, []);

  const onValueChange = (form) => {
    let data = props.data
    data[form.field] = form.value
    props.update(data)
  }
  const getforms = () => (
    [
      { field: PREF_LOGS, label: 'Show Logs', value: true, formType: SWITCH, visible: true, tip: `Option to show/hide logs menu by default` },
    ]
  )
  return (
    <div style={{ paddingLeft: 15 }}>
      <MexForms headerWidth={5} forms={forms} onValueChange={onValueChange} style={{ height: 400, width: 600 }} />
    </div>
  )
}

export default LogsPref
