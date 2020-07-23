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
import './mexSelectTree.css'
import { Icon } from 'semantic-ui-react';

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

const processData = (form, dataList, formArray) => {
    let finalList = []
    if ((dataList && dataList.length > 0) && (formArray && formArray.length > 0)) {
        for (let i = 0; i < formArray.length; i++) {
            let keyData = formArray[i].value
            let dependentForm = formArray[i].form
            if (finalList.length === 0) {
                for (let j = 0; j < keyData.length; j++) {
                    let key = keyData[j]
                    let childrenList = []
                    dataList.map(data => {
                        if (data[dependentForm.field] === key) {
                            childrenList.push(i === formArray.length - 1 ? { label: data[form.field] } : data)
                        }
                    })
                    finalList.push({ label: key, children: childrenList })
                }
            }
            else
            {
                let newList = []
                for (let k = 0; k < finalList.length; k++) {
                    dataList = finalList[k].children
                    let label = finalList[k].label
                    for (let j = 0; j < keyData.length; j++) {
                        let key = keyData[j]
                        let childrenList = []
                        dataList.map(data => {
                            if (data[dependentForm.field] === key) {
                                childrenList.push(i === formArray.length - 1 ? { label: data[form.field] } : data)
                            }
                        })
                        newList.push({ label: label + '>' + key, children: childrenList })
                    }
                }
                finalList = newList
            }
        }
    } 
    return finalList
}


export default function MexSelectRadioTree(props) {
    let form = props.form;
    let rawDataList = [];
    const filterOptions = () => {
        let dataList = form.options
        let forms = props.forms
        let dependentData = form.dependentData
        let dependentForm = undefined
        let dependentArray = []
        if (dataList && dataList.length > 0) {
            if (dependentData && dependentData.length > 0) {
                for (let j = 0; j < dependentData.length; j++) {
                    let dependentKey = []
                    dependentForm = forms[dependentData[j].index]
                    if (dependentForm.value === undefined) {
                        dataList = []
                        dependentArray = []
                        break;
                    }
                    else if (dependentForm.value.includes('All')) {
                        let temp = cloneDeep(dependentForm.options)
                        temp.splice(0, 1)
                        dependentKey = { form: dependentForm, value: temp }
                    }
                    else {
                        dependentKey = { form: dependentForm, value: [dependentForm.value] }
                    }
                    dependentArray.push(dependentKey)
                }
            }
            let optionList = processData(form, dataList, dependentArray)
            rawDataList = cloneDeep(optionList)
            return optionList
        }
    }

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(form.value ? form.value : []);
    const [output, setOutput] = React.useState(form.value ? form.value.map(item => { return item.parent + '>' + item.value + '  ' }) : form.placeholder);
    const [list, setList] = React.useState(filterOptions());
    const [expandGroups, setExpandGroups] = React.useState([])
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

    const handleChange = (index, child, parent) => {
        form.currentSelection = child.label
        let valuearray = form.value ? form.value : []
        valuearray[index] = { parent: parent.label, value: child.label }
        setValue(valuearray);
        setOutput(valuearray.map(item => {
            return item.parent + '>' + item.value + '  '
        }))
        props.onChange(form, valuearray)
    };

    const onFilterValue = (e) => {
        filterText = e ? e.target.value.toLowerCase() : filterText
        let newList = []
        if (form.options && form.options.length > 0) {
            let newData = JSON.parse(JSON.stringify(rawDataList))
            for (let i = 0; i < newData.length; i++) {
                let parent = newData[i]
                let filterList = parent.children.filter(info => {
                    return info.label.toLowerCase().includes(filterText)
                })
                parent.children = filterList
                newList.push(parent)
            }
        }
        setList(newList)
    }

    const clearSelection = (e) => {
        e.stopPropagation()
        setValue([])
        setOutput(form.placeholder)
        props.onChange(form, [])
    }

    const copyCurrentSelection = (e) => {
        e.stopPropagation()
        if (form.currentSelection) {
            setValue([])
            let valueArray = []
            let output = ''
            list.map((parent, i) => {
                let children = parent.children
                for (let j = 0; j < children.length; j++) {
                    if (children[j].label === form.currentSelection) {
                        valueArray[i] = { parent: parent.label, value: form.currentSelection }
                        output = output + parent.label + '>' + form.currentSelection + '  '
                        break;
                    }
                }
            })
            if (valueArray.length > 0) {
                setOutput(output)
                setValue(valueArray)
                props.onChange(form, valueArray)
            }
            form.currentSelection = undefined
        }
    }

    const expandRow = (key)=>
    {
        let groups = cloneDeep(expandGroups)
        if(groups.includes(key))
        {
            groups = groups.filter(item => item !== key);
        }
        else
        {
            groups.push(key)
        }
        setExpandGroups(groups)
    }

    return (
        <div className={classes.root}>
            <div
                className={open ? 'header_active' : 'header'}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                <Box display="flex">
                    <Box p={1} flexGrow={1} >
                        {output}
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
                            {list && list.length > 0 ? list.map((parent, i) => {
                                return (
                                    <div key={i} style={{margin:10}}>
                                        <button onClick={(e) => { expandRow(parent.label) }} className='mex_select_tree_group'><Icon name={`${expandGroups.includes(parent.label) ? 'chevron down' : 'chevron right'}`} />{parent.label}</button>
                                        <div style={{maxHeight:100, overflow:'auto'}}>
                                            {expandGroups.includes(parent.label) && parent.children.map((child, j) => {
                                                return <button className={`${value[i] && value[i].value === child.label ? 'mex_select_tree_detail_select' : 'mex_select_tree_detail'}`} onClick={(e)=>{handleChange(i, child, parent)}} key={j}>{child.label}</button>
                                            })}
                                        </div>
                                    </div>
                                )
                            }) : null}
                        </MenuList>
                    </ClickAwayListener>
                </StyledPaper>
            </Popper>
        </div>
    )
}