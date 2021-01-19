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