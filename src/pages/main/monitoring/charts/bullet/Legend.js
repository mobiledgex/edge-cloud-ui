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

const Legend = (props) => {
    return (
        <React.Fragment>
            {([{ label: 'Total Allotted', color: '#3C815D' }, { label: 'Total Used', color: '#1B432C' }, { label: 'Allotted', color: '#FFF' }, { label: 'Used', color: '#42A46E' }]).map((value, i) => {
                return (
                    <div key={i} style={{ display: 'inline-block', marginRight: 10 }}>
                        <div style={{ height: 10, width: 10, backgroundColor: value.color, display: 'inline-block', marginRight: 5 }}></div>
                        {value.label}
                    </div>
                )
            })}
        </React.Fragment>
    )
}

export default Legend