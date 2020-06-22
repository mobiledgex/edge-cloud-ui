import React from 'react';
import { Dialog, DialogActions, Divider, ListItem, ListItemText, Button, DialogContent } from '@material-ui/core';
import { Dropdown, Icon } from 'semantic-ui-react';
import { timezones } from '../../../utils/date_util'
import {setMexTimezone, getMexTimezone} from '../../../utils/sharedPreferences_util'


const getTimeZones = () => {
    return timezones().map(item => {
        return { key: item, value: item, text: item }
    })
}


export default function Preferences(props) {

    const [timezone, setTimezone] = React.useState(getMexTimezone())

    const selectTimezone = (value) => {
        setTimezone(value)
        setMexTimezone(value)
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.close}
            fullWidth={true}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogContent>
                <h3 style={{color:'#76FF03'}}>Preferences</h3>
                <Divider style={{backgroundColor:'#76FF03'}}/>
                <br/><br/>
            </DialogContent>
            <DialogContent style={{ height: 400 }}>
                Timezone &nbsp;&nbsp;&nbsp;
                <Dropdown
                    search
                    selection
                    options={getTimeZones()}
                    style={{backgroundColor:'transparent'}}
                    placeholder='Select Timezone'
                    value={timezone}
                    onChange={(e, { value }) => selectTimezone(value)}
                />

            </DialogContent>
            <DialogActions>
                <Button onClick={props.close}>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
}
