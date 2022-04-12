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

import { Tooltip } from '@material-ui/core';
import React, { useEffect } from 'react';
import { timezonePref } from '../../../../utils/sharedPreferences_util';
import MiniClockComponent from "./MiniClockComponent";

const MexTimezone = (props) => {

    const [timezone, setTimezone] = React.useState(timezonePref())
    useEffect(() => {
        // initiate the event handler
        window.addEventListener('MexTimezoneChangeEvent', () => {
            setTimezone(timezonePref())
        }, false);
    
        // this will clean up the event every time the component is re-rendered
        return function cleanup() {
          window.removeEventListener('MexTimezoneChangeEvent', ()=>{

          })
        }
      })

    return (
        <React.Fragment>
            <Tooltip title={<strong style={{ fontSize: 13 }}>{timezone}</strong>}>
                <div><MiniClockComponent /></div>
            </Tooltip>
        </React.Fragment>
    );
}

export default MexTimezone 
