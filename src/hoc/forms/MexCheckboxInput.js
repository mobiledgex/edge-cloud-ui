import React, { useState } from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Paper, Box, Tooltip, Checkbox, Divider, MenuList, Popper, ClickAwayListener } from '@material-ui/core';
import { Icon } from 'semantic-ui-react';
import CheckBoxIcon from '@material-ui/icons/CheckBox';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        position: 'relative'
    },
    paper: {
        marginRight: theme.spacing(2),
    },
    marginLeftCheckbox: {
        marginLeft: '10%'
    },
    textColor: {
        color: '#ACACAC'
    },
    iconPointer: {
        cursor: 'pointer'
    }
}));

const StyledPaper = withStyles({
    root: {
        backgroundColor: '#16181D',
        borderBottom: '1px solid #96C8DA',
        borderLeft: '1px solid #96C8DA',
        borderRight: '1px solid #96C8DA',
        borderBottomLeftRadius: 4,
        borderBottomRightRadius: 4,
        borderTopLeftRadius: 0,
        borderTopRightRadius: 0,
    }
})(Paper);

const CustomCheckBox = (props) => {
    const classes = useStyles();
    const { placeholder, value } = props
    return <div style={{ alignItems: "center", display: 'flex' }} >
        <Checkbox {...props} checkedIcon={<CheckBoxIcon className={classes.textColor} />} icon={<CheckBoxOutlineBlankIcon className={classes.textColor} />} />
        <span>{placeholder ? placeholder : value}</span>
    </div>
}


export default function MexCheckboxInput(props) {
    let form = props.form;
    const options = form.options
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(form.value ? form.value : []);
    const isAllSelected = options.length > 0 && selected.length === options.length;
    const anchorRef = React.useRef(null);

    const handleChange = (event) => {
        const value = event.target.value;
        if (value === "all") {
            const selectedValue = selected.length === options.length ? [] : options
            setSelected(selectedValue);
            if (selectedValue.length === 0) {
                return
            }
            form.value = selectedValue
            return
        }

        // added below code to update selected options
        const list = [...selected];
        const index = list.indexOf(value);
        index === -1 ? list.push(value) : list.splice(index, 1);
        setSelected(list);

    };

    const handleListKeyDown = (event) => {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const clearSelection = (e) => {
        e.stopPropagation()
        form.value = undefined
        props.onChange(form)
    }

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
        props.onChange(form, selected) // call api on dropdown close
    };

    const listItem = options.map((option) => {
        return (
            <CustomCheckBox
                value={option}
                onChange={handleChange}
                checked={selected.includes(option)}
            />
        );
    });

    return (
        <div className={classes.root}>
            <div
                id={form.field}
                style={{ backgroundColor: `${form.error ? 'rgba(211, 46, 46, 0.1)' : 'none'}` }}
                className={clsx(open ? 'header_active' : 'header')}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Box display="flex">
                    <Box p={1} flexGrow={1} width={'75%'}>
                        <div className='select-tree-output'>{Array.isArray(selected) && selected.length > 0 ? selected.join(', ') : form.placeholder}</div>
                    </Box>
                    <Box p={1}>
                        {
                            selected.length === 0 ? <Icon name={`${selected.length > 0 ? 'close' : 'dropdown'}`} className={clsx(classes.textColor, classes.iconPointer)}></Icon> :
                                <Tooltip title={'clear'} aria-label="clear">
                                    <Icon name={`${selected.length > 0 ? 'close' : 'dropdown'}`} onClick={(clearSelection)} className={clsx(classes.textColor, classes.iconPointer)}></Icon>
                                </Tooltip>
                        }
                    </Box>
                    {form.error ?
                        <Box p={1}><Tooltip title={form.error} aria-label="clear">
                            <Icon color='red' name='times circle outline' />
                        </Tooltip>
                        </Box> : null}
                </Box>
            </div>
            <Popper className='tree_popper' open={open} anchorEl={anchorRef.current} role={undefined}
                placement="bottom-start" transition disablePortal modifiers={{
                    flip: {
                        enabled: false,
                    },
                    hide: {
                        enabled: false
                    },
                    preventOverflow: {
                        enabled: false,
                    }
                }}>
                <StyledPaper className='tree_dropdown'>
                    <ClickAwayListener onClickAway={handleClose}>
                        <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                            <Divider />
                            <div className='marginLeftCheckbox' className={classes.textColor}>
                                <CustomCheckBox value="all" onChange={handleChange} checked={isAllSelected} placeholder="Select All" />
                                {listItem}
                            </div>
                        </MenuList>
                    </ClickAwayListener>
                </StyledPaper >
            </Popper>
        </div>
    )

}