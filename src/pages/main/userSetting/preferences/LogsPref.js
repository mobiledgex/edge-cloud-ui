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
