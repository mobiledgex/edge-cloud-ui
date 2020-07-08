import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import { Dialog, Input, DialogTitle, DialogContent, InputAdornment, IconButton, Box } from '@material-ui/core';
import { setMexTimezone } from '../../../utils/sharedPreferences_util'
import SearchIcon from '@material-ui/icons/Search';
import CloseIcon from '@material-ui/icons/Close';
import cloneDeep from 'lodash/cloneDeep';


let filterText = ''

export default function VirtualizedList(props) {

    const timezones = cloneDeep(props.data)
    const [timezoneList, setTimezoneList] = React.useState(timezones)

    const onFilterValue = (e) => {
        filterText = e.target.value.toLowerCase()
        setTimezoneList(timezones.filter(info => {
            return info.toLowerCase().includes(filterText)
        }))
    }

    const onClose = () => {
        setTimezoneList(timezones)
        props.close()
    }

    const selectTimezone = (index) => {
        let value = timezoneList[index]
        setMexTimezone(value)
        onClose()
    }

    const renderRow = (virtualProps) => {
        const { index, style } = virtualProps;
        return (
            <ListItem button onClick={() => selectTimezone(index)} style={style} key={index}>
                <ListItemText primary={timezoneList[index]} />
            </ListItem>
        );
    }

    return (
        <Dialog
            open={props.open}
            onClose={props.close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle>
                <Box display="flex">
                    <Box p={1} flexGrow={1}>
                        <h3>{props.header}</h3>
                    </Box>
                    <Box>
                        <IconButton onClick={onClose}><CloseIcon /></IconButton>
                    </Box>
                </Box>
            </DialogTitle>
            <DialogContent>
                <Input
                    disableUnderline={true}
                    className='select_tree_search'
                    inputProps={{ style: { backgroundColor: '#1D2025', color: '#ACACAC', border: 'none' } }}
                    variant="outlined"
                    startAdornment={
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                    }
                    onChange={(e) => { onFilterValue(e) }} />
                <br /><br />
                <FixedSizeList height={400} width={300} itemSize={46} itemCount={timezones.length}>
                    {renderRow}
                </FixedSizeList>
            </DialogContent>
        </Dialog>
    );
}