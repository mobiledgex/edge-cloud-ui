import React from 'react'
import { makeStyles, Tooltip, IconButton, Typography, Toolbar } from '@material-ui/core';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import RefreshOutlinedIcon from '@material-ui/icons/RefreshOutlined';
import ArrowUpwardOutlinedIcon from '@material-ui/icons/ArrowUpwardOutlined';
import DeleteSweepOutlinedIcon from '@material-ui/icons/DeleteSweepOutlined';
import clsx from 'clsx';

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
    {
        color: theme.palette.text.primary,
        backgroundColor: '#6E6E6D',
    },
    title: {
        flex: '1 1 100%',
    },
}));

const ICON_DELETE = 'delete'
const ICON_UPGRADE = 'upgrade'
const ICON_REFRESH = 'refresh'

const icons = (icon) =>{
    let color = 'white'
    switch(icon)
    {
        case ICON_DELETE:
            return <DeleteSweepOutlinedIcon style={{color}}/>
        case ICON_UPGRADE:
            return <ArrowUpwardOutlinedIcon style={{color, border:'0.13em solid white', borderRadius:50, fontSize:16, marginTop:1}}/>
        case ICON_REFRESH:
            return <RefreshOutlinedIcon style={{color}}/>

    }
}

const ListToolbar = (props)=>
{
    const classes = useToolbarStyles();
    const { numSelected } = props;
    return (
        <Toolbar className={clsx(classes.root, {
            [classes.highlight]: numSelected > 0,
        })}>
            {numSelected > 0 ? (
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    {numSelected} selected
                </Typography>
            ) : null}
            {numSelected > 0 ? (
                props.groupActionMenu ?
                    props.groupActionMenu().map((actionMenu, i) => {
                        return (
                            <Tooltip key={i} title={actionMenu.label}>
                                <IconButton aria-label={actionMenu.label} onClick={() => { props.groupActionClose(actionMenu) }}>
                                    {icons(actionMenu.icon)}
                                </IconButton>
                            </Tooltip>)
                    }) : null
            ) : null}
        </Toolbar>
    );
}

export default ListToolbar