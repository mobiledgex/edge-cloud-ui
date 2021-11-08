import React, { useEffect } from 'react';
import cloneDeep from 'lodash/cloneDeep';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Input, InputAdornment, Box, Tooltip } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { Icon } from 'semantic-ui-react';
import { FixedSizeList } from 'react-window';
import './mexSelectTree.css'

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
        position: 'relative'
    },
    paper: {
        marginRight: theme.spacing(2),
    }
}));

const StyledMenuItem = withStyles({
    root: {
        backgroundColor: "transparent",
        '&:hover': {
            backgroundColor: "transparent",
        },
    }
})(MenuItem);

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

const renderOutput = (valuearray) => (
    Object.keys(valuearray).map(key => (
        <p key={key}><b >{`${key} --> `}</b>{valuearray[key]}</p>
    ))
)

export default function MexSelectRadioTree(props) {
    let form = props.form;
    const filterOptions = () => {
        let optionList = {};
        let dataList = form.options
        if (dataList) {
            let keys = Object.keys(dataList)
            if (keys.length > 0) {
                keys.map(key => {
                    let data = dataList[key]
                    const childrenList = data.map(item => (item[form.showField ? form.showField : form.field]))
                    optionList[key] = childrenList
                })
            }
        }
        setRawDataList(cloneDeep(optionList))
        return optionList
    }

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(form.value ? form.value : undefined);
    const [output, setOutput] = React.useState(form.value ? renderOutput(form.value ) : form.placeholder);
    const [list, setList] = React.useState({});
    const [rawDataList, setRawDataList] = React.useState(undefined);
    const [expandGroups, setExpandGroups] = React.useState(undefined)
    const anchorRef = React.useRef(null);

    let filterText = '';

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
            return;
        }
        setOpen(false);
    };

    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
            event.preventDefault();
            setOpen(false);
        }
    }

    const prevOpen = React.useRef(open);
    
    useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    useEffect(() => {
        setRawDataList(undefined)
        setList(undefined)
        setList(filterOptions())
    }, [form.options]);

    const handleChange = (key, child) => {
        form.currentSelection = child
        let valuearray = form.value ? form.value : {}
        valuearray[key] = child
        setValue(valuearray);
        setOutput(valuearray && renderOutput(valuearray))
        props.onChange(form, valuearray)
    };

    const multiClick = (key, child) => {
        // form.currentSelection = [...form.currentSelection, child.label]
        let valuearray = form.value ? form.value : {}
        let value = []
        if (valuearray[key] && valuearray[key].length > 0) {
            value = valuearray[key]
        }
        if (value.includes(child)) {
            value = value.filter(v => {
                return v !== child
            })
        }
        else {
            value.push(child)
        }
        valuearray[key] = value
        setValue(valuearray);
        setOutput(valuearray && renderOutput(valuearray))
        props.onChange(form, valuearray)
    }

    const validateCheck = (key, child) => {
        let checked = false
        let valuearray = value
        if (valuearray[key]) {
            let value = valuearray[key]
            if (value && value.length > 0) {
                checked = value.includes(child)
            }
        }
        return checked
    }

    const onFilterValue = (e) => {
        filterText = e ? e.target.value.toLowerCase() : filterText
        if (rawDataList) {
            const keys = Object.keys(rawDataList)
            if (keys.length > 0) {
                let newList = {}
                keys.map(key => {
                    let values = rawDataList[key]
                    let filterList = values.filter(value => {
                        return value.toLowerCase().includes(filterText)
                    })
                    newList[key] = filterList
                })
                setList(newList)
            }
        }
    }

    const clearSelection = (e) => {
        e.stopPropagation()
        setValue(undefined)
        setOutput(form.placeholder)
        props.onChange(form)
    }

    const copyCurrentSelection = (e) => {
        e.stopPropagation()
        if (form.currentSelection) {
            setValue([])
            let valueArray = {}
            Object.keys(list).map((key, i) => {
                let values = list[key]
                for (let j = 0; j < values.length; j++) {
                    if (values[j] === form.currentSelection) {
                        valueArray[key] = form.currentSelection
                        break;
                    }
                }
            })
            if (valueArray) {
                setOutput(renderOutput(valueArray))
                setValue(valueArray)
                props.onChange(form, valueArray)
            }
            form.currentSelection = undefined
        }
    }

    const expandRow = (key) => {
        if (expandGroups === key) {
            setExpandGroups(undefined)
        }
        else {
            setExpandGroups(key)
        }
    }

    const renderRow = (virtualProps) => {
        const { data, index, style } = virtualProps;
        let key = data.key
        let keyValue = data.values[index]
        return (
            <div style={style}>
                {
                    form.multiple ? <div className={`${value && value[key] && value[key].includes(keyValue) ? 'mex_select_tree_detail_select' : 'mex_select_tree_detail'}`}  onClick={(e) => { multiClick(key, keyValue) }}><Icon style={{ marginTop: 2 }} name={validateCheck(key, keyValue) ? 'check square outline' : 'square outline'}></Icon> <label >{keyValue}</label></div> :
                        <button className={`${value && value[key] && value[key] === keyValue ? 'mex_select_tree_detail_select' : 'mex_select_tree_detail'}`}   onClick={(e) => { handleChange(key, keyValue) }}>{keyValue}</button>
                }
            </div>
        );
    }

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
                        <div className='select-tree-output'>{output}</div>
                    </Box>
                    {form.rules ? form.rules.copy ?
                        <Box p={1}>
                            <Tooltip title={'copy current selection to all'} aria-label="clear">
                                <Icon name="copy outline" onClick={(copyCurrentSelection)}></Icon>
                            </Tooltip>
                        </Box> : null : null}
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
                            <StyledMenuItem>
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
                            </StyledMenuItem>
                            {
                            list && Object.keys(list).map((key, i) => {
                                return (
                                    <div key={i} style={{ margin: 10 }}>
                                        <button onClick={(e) => { expandRow(key) }} className='mex_select_tree_group'><Icon name={`${expandGroups === key ? 'chevron down' : 'chevron right'}`} />{key}</button>
                                        <div>
                                            {
                                                expandGroups === key ?
                                                    <FixedSizeList height={100} itemSize={25} itemCount={list[key].length} itemData={{ key, values: list[key]}}>
                                                        {renderRow}
                                                    </FixedSizeList> : null
                                            }
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </MenuList>
                    </ClickAwayListener>
                </StyledPaper>
            </Popper>
        </div>
    )
}