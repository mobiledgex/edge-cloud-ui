import React from 'react';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import { Input, RadioGroup, FormControlLabel, Radio, InputAdornment} from '@material-ui/core';
import TreeView from '@material-ui/lab/TreeView';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import SearchIcon from '@material-ui/icons/Search';
import TreeItem from '@material-ui/lab/TreeItem';
import './mexSelectTree.css'

const useStyles = makeStyles((theme) => ({
    root: {
        width:'100%'
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
        borderBottom:'1px solid #96C8DA',
        borderLeft:'1px solid #96C8DA',
        borderRight:'1px solid #96C8DA',
        borderBottomLeftRadius:4,
        borderBottomRightRadius:4,
        borderTopLeftRadius:0,
        borderTopRightRadius:0,
    }
})(Paper);


export default function MexSelectRadioTree(props) {
    let form = props.form;  
    let rawDataList = [];

    const filterOptions = () => {
        let optionList = []
        let dataList = form.options
        let forms = props.forms
        let dependentKey = []
        let dependentData = form.dependentData
        let dependentForm = undefined
        if (dataList && dataList.length > 0) {
            if (dependentData && dependentData.length > 0) {
                dependentForm = forms[dependentData[0].index]
                if (dependentForm.value === undefined) {
                    dataList = []
                }
                for (let j = 0; j < dependentForm.value.length; j++) {
                    dependentKey[j] = dependentForm.value[j]
                }
            }
            if (dataList && dataList.length > 0) {
                for (let i = 0; i < dependentKey.length; i++) {
                    let key = dependentKey[i]
                    let childrenList = []
                    dataList.map(data => {
                        if (data[dependentForm.field] === key) {
                            childrenList.push({ label: data[form.field] })
                        }
                    })
                    optionList.push({ label: key, children: childrenList })
                }
            }
        }
        rawDataList = JSON.parse(JSON.stringify(optionList))
        return optionList
    }

    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(form.value ? form.value : []);
    const [output, setOutput] = React.useState(form.value ? form.value.map(item => {return item.parent + '>' + item.value + '  '}) : form.placeholder);
    const [list, setList] = React.useState(filterOptions());
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
    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
            anchorRef.current.focus();
        }
        prevOpen.current = open;
    }, [open]);

    const handleChange = (event, index, item) => {
        let valuearray = form.value ? form.value : []
        valuearray[index] = { parent: item.label, value: event.target.value }
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

    return (
        <div className={classes.root}>
            <button
                className={open ? 'header_active' : 'header'}
                ref={anchorRef}
                aria-controls={open ? 'menu-list-grow' : undefined}
                aria-haspopup="true"
                onClick={handleToggle}
            >
                {output}
            </button>
            <Popper className='tree_popper' open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                        <StyledPaper className='tree_dropdown'>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                    <StyledMenuItem>
                                        <Input
                                            disableUnderline={true}
                                            className="select_tree_search"
                                            inputProps={{ style: { backgroundColor: '#1D2025', color:'white', border:'none' } }}
                                            variant="outlined"
                                            startAdornment={
                                                <InputAdornment position="start">
                                                    <SearchIcon />
                                                </InputAdornment>
                                            }
                                            onChange={(e) => { onFilterValue(e) }} />
                                    </StyledMenuItem>
                                    {list && list.length > 0 ? list.map((item, i) => {
                                        return (
                                            <StyledMenuItem key={i}>
                                                <TreeView
                                                    style={{ color: '#ACACAC', width: '100%' }}
                                                    key={i}
                                                    className={classes.root}
                                                    defaultCollapseIcon={<ExpandMoreIcon />}
                                                    defaultExpandIcon={<ChevronRightIcon />}
                                                >
                                                    <TreeItem nodeId={i+""} label={<p style={{backgroundColor:'#16181D', width:'100%'}}>{item.label}</p>}>
                                                        <RadioGroup aria-label={item.label} name={item.label} value={value[i] ? value[i].value : undefined} onChange={(e) => { handleChange(e, i, item) }}>
                                                            {item.children.map((child, j) => {
                                                                return <FormControlLabel style={{ color: 'inherit' }} key={j} value={child.label} control={<Radio style={{ color: 'inherit' }} />} label={child.label} />
                                                            })}
                                                        </RadioGroup>
                                                    </TreeItem>
                                                </TreeView>
                                            </StyledMenuItem>
                                        )
                                    }) : null}
                                </MenuList>
                            </ClickAwayListener>
                        </StyledPaper>
                    </Grow>
                )}
            </Popper>
        </div>
    );
}