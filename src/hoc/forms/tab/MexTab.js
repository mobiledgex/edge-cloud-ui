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
import { Tab, Menu } from 'semantic-ui-react';
import './style.css'

const MexTab = (props) => {

    let form = props.form

    const getPanes = () => {
        return form.panes.map((pane, i) => {
            return { menuItem: <Menu.Item onClick={pane.onClick} key={i}><label style={{ color: '#FFF'}}>{pane.label}</label></Menu.Item>, render: () => <Tab.Pane>{pane.tab}</Tab.Pane> }
        })
    }
    const getForm = () => (
        <Tab
            menu={{ inverted: true, attached: true, tabular: true }}
            activeIndex={props.activeIndex ? props.activeIndex : 0}
            panes={getPanes()}
            style={{ width: '100%', height: '100%'}} />
    )
    return (
        getForm()
    )
}
export default MexTab