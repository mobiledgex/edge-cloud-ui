import React from 'react'
import { makeStyles, Tooltip, IconButton, Typography, Toolbar } from '@material-ui/core';
import MaterialIcon from 'material-icons-react';
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
                                    <MaterialIcon icon={actionMenu.icon} color={'white'} />
                                </IconButton>
                            </Tooltip>)
                    }) : null
            ) : null}
        </Toolbar>
    );
}

export default ListToolbar