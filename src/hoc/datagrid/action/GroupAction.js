import React from 'react'
import { makeStyles, Tooltip, IconButton, Typography, Toolbar } from '@material-ui/core';
import clsx from 'clsx';
import { Icon } from '../../mexui';

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
        color:'#E8E8E8'
    },
}));

const ICON_DELETE = 'delete'
const ICON_UPGRADE = 'upgrade'
const ICON_REFRESH = 'refresh'

const icons = (action) => {
    let icon = undefined
    switch (action) {
        case ICON_DELETE:
            icon = 'delete_sweep'
            break;
        case ICON_UPGRADE:
            icon = 'arrow_circle_up'
            break;
        case ICON_REFRESH:
            icon = 'refresh'
            break;
        default:
            icon = action

    }
    return icon ? <Icon outlined={true} color='white'>{icon}</Icon> : undefined
}

const selectionLabel = (props) => {
    const { numSelected, actualLength, filterLength } = props;
    let isFiltered = filterLength !== actualLength
    let totalrows = isFiltered ? `${filterLength}/${actualLength}` : actualLength
    let label = `Visible Rows: ${totalrows}`
    label = (
        <div style={{ display: 'inline-flex', alignItems: 'center' }}>
            <span style={{ backgroundColor: 'rgba(255,255,255, 0.2)', borderRadius: 5, padding: '0 5px 0 5px' }}>{label}</span>
            {numSelected > 0 ? <span style={{ backgroundColor: 'rgba(255,255,255, 0.2)', borderRadius: 5, padding: '0 5px 0 5px', marginLeft: 10 }}>{`Rows Selected: ${numSelected}`}</span> : null}
        </div>
    )
    return label
}

const GridAction = (props) => {
    const classes = useToolbarStyles();
    const { numSelected } = props;
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