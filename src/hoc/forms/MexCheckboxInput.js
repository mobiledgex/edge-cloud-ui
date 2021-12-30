import React, { useState } from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Box, Tooltip, Checkbox } from '@material-ui/core';
import { Icon } from 'semantic-ui-react';


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

export default function MexCheckboxInput(props) {
    let form = props.form;
    const classes = useStyles();
    const [open, setOpen] = useState(false);
    const [region, setRegion] = useState(form.options)
    const [selected, setSelected] = useState(form.value ? form.value : []);
    const isAllSelected =
        region.length > 0 && selected.length === region.length;
    const anchorRef = React.useRef(null);


    const noSelectedData = () => {
        form.value = undefined
        props.onChange(form, undefined)
    }

    const selectedData = (data) => {
        setSelected(data);
        form.value = data
        props.onChange(form, data)
    }

    const handleChange = (event) => {
        const value = event.target.value;
        if (value === "all") {
            const selectedValue = selected.length === region.length ? [] : region
            if (selectedValue.length === 0) {
                noSelectedData()
                return
            }
            selectedData(selectedValue)
            return;
        }

        // added below code to update selected options
        const list = [...selected];
        const index = list.indexOf(value);
        index === -1 ? list.push(value) : list.splice(index, 1);
        if (list.length === 0) {
            noSelectedData()
            return
        }
        selectedData(list)
        return

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
    };

    const listItem = region.map((option) => {
        return (
            <div key={option}>
                <Checkbox
                    value={option}
                    onChange={handleChange}
                    checked={selected.includes(option)}
                />
                <span>{option}</span>
            </div>
        );
    });
    return (
        <div className={classes.root}>
            <div
                id={form.field}
                style={{ backgroundColor: `${form.error ? 'rgba(211, 46, 46, 0.1)' : 'none'}` }}
                className={open ? 'header_active' : 'header'}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Box display="flex">
                    <Box p={1} flexGrow={1} width={'75%'}>
                        <div className='select-tree-output'>{Array.isArray(selected) && selected.length > 0 ? selected.join(',') : form.placeholder}</div>
                    </Box>
                    <Box p={1}>
                        <Tooltip title={'clear'} aria-label="clear">
                            <Icon name="close" onClick={(clearSelection)}></Icon>
                        </Tooltip>
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
                            <hr></hr>
                            <div className='marginLeftCheckbox'>
                                <div style={{ alignItems: "center", margin: 10 }}>
                                    <Checkbox value="all" onChange={handleChange} checked={isAllSelected} />
                                    <span> Select All</span>
                                    {listItem}
                                </div>
                            </div>
                        </MenuList>
                    </ClickAwayListener>
                </StyledPaper >
            </Popper>
        </div>
    )

}