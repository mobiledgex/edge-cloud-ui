import React from 'react'
import { InputAdornment, TextField, MenuItem, Select, InputLabel, FormControl, makeStyles, IconButton } from '@material-ui/core';
import DeleteOutlineOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import DataUsageIcon from '@material-ui/icons/DataUsage';
import sortBy from 'lodash/sortBy';

const tagList = sortBy([
    'app',
    'apporg',
    'appver',
    'cloudlet',
    'cloudletorg',
    'cluster',
    'clusterorg',
    'duration',
    'email',
    'hostname',
    'lineno',
    'method',
    'org',
    'region',
    'remote-ip',
    'request',
    'response',
    'spanid',
    'state',
    'status',
    'traceid',
    'username'
], 'asc')

const useStyles = makeStyles(theme => ({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120
    },
    selectEmpty: {
      marginTop: theme.spacing(2)
    },
    menuPaper: {
      maxHeight: 200
    }
  }));

const Tags = (props) => {
    const classes = useStyles();
    const [key, setKey] = React.useState(props.data && props.data.key ? props.data.key:'')
    const [value, setValue] = React.useState(props.data && props.data.value ? props.data.value:'')

    const onKeyChange = (e)=>{
        setKey(e.target.value)
        props.onChange(props.uuid, e.target.value, value)
    }

    const onValueChange = (e)=>{
        setValue(e.target.value)
        props.onChange(props.uuid, key, e.target.value)
    }

    return (
        <React.Fragment>
            <div style={{ width: 130 }}>
                <FormControl>
                    <InputLabel shrink id="demo-simple-select-placeholder-label-label">
                        Tags
                    </InputLabel>
                    <Select style={{ width: 130 }} onChange={onKeyChange} value={key} MenuProps={{ classes: { paper: classes.menuPaper } }}>
                            {tagList.map(tag => (
                                <MenuItem key={tag} value={tag}>{tag}</MenuItem>
                            ))}
                    </Select>
                </FormControl>
            </div>
            <div style={{ width: 130, marginBottom: 10}}>
                <TextField
                    label="Value"
                    fullWidth
                    disabled={key === undefined}
                    value={value}
                    onChange={onValueChange}
                    placeholder={'Search'} />
            </div>
            <IconButton key={props.uuid}  onClick={()=>{props.onDelete(props.uuid)}}><DeleteOutlineOutlinedIcon/></IconButton>
        </React.Fragment>
    )
}
export default Tags