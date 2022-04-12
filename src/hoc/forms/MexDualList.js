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

import React, { useState } from 'react'
import DualListBox from 'react-dual-listbox';
import { Icon } from "semantic-ui-react";
import '../../css/components/dualListbox/react-dual-listbox.css'

const MexDualList = (props) => {
    let form = props.form;

    const [selected, setSelected] = useState(props.form.value ? props.form.value : [])
    const onSelected = (data) => {
        setSelected(data)
        props.onChange(form, data)
    }

    return (
        <DualListBox
            icons={{
                moveLeft: <Icon name="angle left" />,
                moveAllLeft: [
                    <Icon key={0} name="angle double left" />,
                ],
                moveRight: <Icon name="angle right" />,
                moveAllRight: [
                    <Icon key={0} name="angle double right" />,
                ],
                moveDown: <span className="fa fa-chevron-down" />,
                moveUp: <span className="fa fa-chevron-up" />,
            }}
            canFilter
            selected={selected}
            options={form.options ? form.options : []}
            onChange={onSelected}
            preserveSelectOrder
        />
    )
}
export default MexDualList