import React from 'react'
import { IconButton, makeStyles, Toolbar, Tooltip, Typography } from '@material-ui/core';
import PhoneIphoneRoundedIcon from '@material-ui/icons/PhoneIphoneRounded';
import CodeOutlinedIcon from '@material-ui/icons/CodeOutlined';
import clsx from 'clsx';
import { LIST_TOOLBAR_TERMINAL, LIST_TOOLBAR_TRACK_DEVICES } from '../helper/Constant';

const useStyles = makeStyles((theme) => ({
    table: {
        minWidth: 650,
    },
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
    },
    highlight:
    {
        color: theme.palette.text.primary,
        backgroundColor: '#16181C',
    },
    title: {
        flex: '1 1 100%',
    },
}));

const ListToolbar = (props) => {

    const classes = useStyles();

    return (
        <Toolbar className={clsx(classes.root, {
            [classes.highlight]: true,
        })}>

            <Typography className={classes.title}></Typography>
            <Tooltip title="Track Devices">
                <IconButton onClick={()=>{props.click(LIST_TOOLBAR_TRACK_DEVICES)}}>
                    <PhoneIphoneRoundedIcon />
                </IconButton>
            </Tooltip>
            {/* <Tooltip title="Terminal">
                <IconButton onClick={()=>{props.click(LIST_TOOLBAR_TERMINAL)}}>
                    <CodeOutlinedIcon />
                </IconButton>
            </Tooltip> */}
        </Toolbar>
    )
}

export default ListToolbar