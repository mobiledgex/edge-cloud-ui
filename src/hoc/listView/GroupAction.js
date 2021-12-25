import React from 'react'
import { makeStyles, Tooltip, IconButton, Typography, Toolbar, Divider } from '@material-ui/core';
import clsx from 'clsx';
import { Icon } from '../mexui';

const useToolbarStyles = makeStyles((theme) => ({
    root: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(1),
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1),
        height:50
    },
    highlight:
    {
        color: theme.palette.text.primary
    },
    title: {
        flex: '1 1 100%',
    },
}));

const ICON_DELETE = 'delete'
const ICON_UPGRADE = 'upgrade'
const ICON_REFRESH = 'refresh'

const icons = (action) => {
    let color = 'white'
    let icon = undefined
    let style = { color }
    switch (action) {
        case ICON_DELETE:
            icon = 'delete_sweep'
            break;
        case ICON_UPGRADE:
            icon = 'arrow_upward'
            style = { color, border: '0.143em solid white', borderRadius: 50, fontSize: 14, marginTop: 1, width: 18, height: 18 }
            break;
        case ICON_REFRESH:
            icon = 'refresh'
            break;

    }
    return icon ? <Icon outlined={true} style={style}>{icon}</Icon> : undefined
}

const selectionLabel = (props)=>{
    const { numSelected, length } = props;
    let label = `Total Rows: ${length}` 
    label = numSelected > 0 ? `Rows Selected: ${numSelected}/${length}` : label
    return label
}

const GridAction = (props) => {
    const classes = useToolbarStyles();
    const { numSelected, length } = props;
    return (
        <React.Fragment>
            <Toolbar className={clsx(classes.root)}>
                <Typography className={classes.title} color="inherit" variant="subtitle1" component="div">
                    <strong >{selectionLabel(props)}</strong>
                </Typography>
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
        </React.Fragment>
    );
}

export default GridAction