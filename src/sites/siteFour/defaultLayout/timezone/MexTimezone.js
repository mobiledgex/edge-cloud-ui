import { Tooltip } from '@material-ui/core';
import React from 'react';
import { timezonePref } from '../../../../utils/sharedPreferences_util';
import MiniClockComponent from "./MiniClockComponent";

const MexTimezone = (props) => {

    return (
        <React.Fragment>
            <Tooltip title={<strong style={{ fontSize: 13 }}>{timezonePref()}</strong>}>
                <div><MiniClockComponent /></div>
            </Tooltip>
        </React.Fragment>
    );
}

export default MexTimezone 