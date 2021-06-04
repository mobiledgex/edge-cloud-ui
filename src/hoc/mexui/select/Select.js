import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, MenuItem, InputLabel, Menu, Typography } from '@material-ui/core';
import SearchFilter from '../../filter/SearchFilter'
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import { FixedSizeList } from 'react-window';

const useStyles = makeStyles((theme) => ({
    formControl: {
        width: 212,
    },
    selectEmpty: {
        marginTop: theme.spacing(1),
    },
    icon: {
        float: 'right',
        marginRight: 2
    },
    wrapIcon: {
        verticalAlign: 'middle',
        display: 'inline-flex',
    }
}));

export default function Select(props) {
    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [value, setValue] = React.useState(props.value ? props.value : '');
    const [list, setList] = React.useState(props.list)

    useEffect(() => {
        props.onChange(value)
    }, [value]);

    const handleChange = (value) => {
        setAnchorEl(null)
        setValue(value);
    };

    const onFilter = (value) => {
        setList(props.list.filter(data => (data.toLowerCase().includes(value.toLowerCase()))))
    }

    const renderRow = (virtualProps) => {
        const { index, style } = virtualProps;
        let value = list[index]
        return (
            <MenuItem onClick={() => { handleChange(value) }} style={style}>{value}</MenuItem>
        );
    }

    return (
        <div>
            <FormControl className={classes.formControl}>
                {props.label ? <InputLabel shrink id="mex-ui-select">
                    {props.label}
                </InputLabel> : null}
                <div style={{ display: 'inline', cursor: 'pointer', marginTop: 21 }} aria-controls="chart" aria-haspopup="true" onClick={(e) => { setAnchorEl(e.currentTarget) }}>
                    <Typography aria-controls="chart" aria-haspopup="true" className={classes.wrapIcon}>
                        {value}
                    </Typography>
                    <KeyboardArrowDownOutlinedIcon className={classes.icon} />
                    <div style={{ borderBottom: '0.1em solid #BFC0C2', marginTop: 3 }}></div>
                </div>
                <Menu
                    id="mex-ui-select"
                    onClose={() => { setAnchorEl(null) }}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                >
                    {props.search ? <SearchFilter onFilter={onFilter} style={{ marginBottom: 10 }} /> : null}
                    <FixedSizeList height={300} itemSize={40} itemCount={list.length}>
                        {renderRow}
                    </FixedSizeList>
                </Menu>
            </FormControl>
        </div>
    );
}