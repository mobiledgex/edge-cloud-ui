import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, MenuItem, InputLabel, Menu, Typography } from '@material-ui/core';
import SearchFilter from '../../filter/SearchFilter'
import KeyboardArrowDownOutlinedIcon from '@material-ui/icons/KeyboardArrowDownOutlined';
import { FixedSizeList } from 'react-window';
import { toFirstUpperCase } from '../../../utils/string_utils';

/**
 * optional params
 * width: width of the select
 * placeholder: tip
 * value: default value
 * search: enable/disable search option
 * underline: show bottom line
 * upper: first letter capital
 * height: dropdown height
**/

/**
 * mandatory params
 * list: width of the select
 * onChange: triggers on select
**/

const useStyles = makeStyles((theme) => ({
    formControl: props => ({
        maxWidth: 250,
        minWidth: props.width ? props.width : 100
    }),
    selectEmpty: {
        marginTop: theme.spacing(1),
    },
    icon: {
        float: 'right',
        marginRight: 2,
        marginLeft: 5
    },
    wrapIcon: {
        verticalAlign: 'middle',
        display: 'inline-flex',
    }
}));

export default function Select(props) {
    const classes = useStyles(props);
    const [anchorEl, setAnchorEl] = React.useState(null)
    const [value, setValue] = React.useState(props.value ? props.value : '');
    const [list, setList] = React.useState(props.list)

    useEffect(() => {
        if (value) {
            props.onChange(value)
        }
    }, [value]);

    const handleChange = (value) => {
        setAnchorEl(null)
        setValue(value);
    };

    const onFilter = (value) => {
        setList(props.list.filter(data => (data.toLowerCase().includes(value.toLowerCase()))))
    }

    const toUpper = (value) => {
        return props.upper ? toFirstUpperCase(value) : value
    }

    const renderRow = (virtualProps) => {
        const { index, style } = virtualProps;
        let value = list[index]
        return (
            <MenuItem onClick={() => { handleChange(value) }} style={style}>{toUpper(value)}</MenuItem>
        );
    }

    const selectLabel = () => {
        const { placeholder } = props
        return value ? toUpper(value) : placeholder ? placeholder : ''
    }

    return (
        <div>
            <FormControl className={classes.formControl}>
                {props.label ? <InputLabel shrink id="mex-ui-select">
                    {props.label}
                </InputLabel> : null}
                <div style={{ display: 'inline', cursor: 'pointer', marginTop: props.label ? 21 : 0 }} aria-controls="chart" aria-haspopup="true" onClick={(e) => { setAnchorEl(e.currentTarget) }}>
                    <Typography aria-controls="chart" aria-haspopup="true" className={classes.wrapIcon}>
                        {selectLabel()}
                    </Typography>
                    <KeyboardArrowDownOutlinedIcon className={classes.icon} />
                    <div style={{ borderBottom: props.underline ? '0.1em solid #BFC0C2' : '', marginTop: 3 }}></div>
                </div>
                <Menu
                    id="mex-ui-select"
                    onClose={() => { setAnchorEl(null) }}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                >
                    {props.search ? <SearchFilter onFilter={onFilter} style={{ marginBottom: 10 }} /> : null}
                    <FixedSizeList height={props.height ? props.height : 300} style={{ minWidth: 213 }} itemSize={40} itemCount={list.length}>
                        {renderRow}
                    </FixedSizeList>
                </Menu>
            </FormControl>
        </div>
    );
}