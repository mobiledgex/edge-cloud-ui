import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormControl, MenuItem, InputLabel, Menu, Typography, Tooltip } from '@material-ui/core';
import SearchFilter from '../../filter/SearchFilter'
import { FixedSizeList } from 'react-window';
import { toFirstUpperCase } from '../../../utils/string_utils';
import Icon from '../Icon';

/**
 * optional params
 * placeholder: tip
 * value: default value
 * search: enable/disable search option
 * underline: show bottom line
 * title: first letter capital
 * height: dropdown height
**/

/**
 * mandatory params
 * list: width of the select
 * onChange: triggers on select
**/

const useStyles = makeStyles((theme) => ({
    selectEmpty: {
        marginTop: theme.spacing(1),
    },
    icon: {
        position: 'absolute',
        right: 0
    },
    wrapIcon: {
        width: '90%',
        textOverflow: 'ellipsis',
        overflow: 'hidden',
        fontSize:13,
        fontWeight:900
    }
}));

export default function Select(props) {
    const classes = useStyles(props);
    const { title } = props
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
        return title ? toFirstUpperCase(value) : value
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
        return value ? toUpper(value) : placeholder ?? ''
    }

    const color = { color: props.color ? props.color : '#CECECE' }

    return (
        <div>
            <FormControl className={classes.formControl}>
                {props.label ? <InputLabel shrink id="mex-ui-select">
                    {props.label}
                </InputLabel> : null}
                <div style={{ cursor: 'pointer', ...color, marginTop: props.header ? 20.5 : 0 }} aria-controls="chart" aria-haspopup="true" onClick={(e) => { setAnchorEl(e.currentTarget) }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap:10 }}>
                        <Tooltip title={selectLabel()}>
                            {<strong style={{ fontSize: 13 }}>{selectLabel()}</strong>}
                        </Tooltip>
                        <Icon color={color}>keyboard_arrow_down</Icon>
                    </div>

                    <div style={{ borderBottom: props.underline ? '0.1em solid #BFC0C2' : '', marginTop: 3 }}></div>
                </div>
                <Menu
                    id="mex-ui-select"
                    onClose={() => { setAnchorEl(null) }}
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                >
                    {props.search ? <SearchFilter onFilter={onFilter} style={{ marginBottom: 10 }} clear={true}/> : null}
                    <FixedSizeList height={props.height ? props.height : 300} style={{ minWidth: 213 }} itemSize={40} itemCount={list.length}>
                        {renderRow}
                    </FixedSizeList>
                </Menu>
            </FormControl>
        </div>
    );
}