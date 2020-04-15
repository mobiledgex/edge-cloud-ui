import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles, makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import ListIcon from '@material-ui/icons/List';
import { fields } from '../../services/model/format';
import {Popper, Grow, Paper, ClickAwayListener, MenuList, MenuItem, lighten} from '@material-ui/core';
import { getUserRole } from '../../services/model/format';
import { Icon } from 'semantic-ui-react';


const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#1E2123',
        },
    },
}))(TableRow);

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}

function getComparator(order, orderBy) {
    return order === 'desc'
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

function checkRole(form) {
    let roles = form.roles
    if (roles) {
        let visible = false
        form.detailView = false
        for (let i = 0; i < roles.length; i++) {
            let role = roles[i]
            if (role === getUserRole()) {
                visible = true
                form.detailView = true
                break;
            }
        }
        form.visible = form.visible ? visible : form.visible
    }
}

function EnhancedTableHead(props) {
    const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead >
            <TableRow >
                {props.requestInfo.selection ? <TableCell padding="checkbox" style={{ backgroundColor: '#2A2C33' }}>
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all desserts' }}
                    />
                </TableCell> : null}
                {props.headCells.map((headCell) => {
                    checkRole(headCell)
                    if (headCell.visible) {
                        return <TableCell
                            style={{ backgroundColor: '#2A2C33' }}
                            key={headCell.field}
                            align={headCell.numeric ? 'right' : 'left'}
                            padding={headCell.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === headCell.field ? order : false}
                        >
                            {headCell.sortable ?
                                <TableSortLabel
                                    active={orderBy === headCell.field}
                                    direction={orderBy === headCell.field ? order : 'asc'}
                                    onClick={createSortHandler(headCell.field)}
                                >
                                    {headCell.label}
                                    {orderBy === headCell.field ? (
                                        <span className={classes.visuallyHidden}>
                                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                        </span>
                                    ) : null}
                                </TableSortLabel> : headCell.label}
                        </TableCell>
                    }
                })}
            </TableRow>
        </TableHead>
    );
}

EnhancedTableHead.propTypes = {
    classes: PropTypes.object.isRequired,
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
};

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

const EnhancedTableToolbar = (props) => {
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
                    props.groupActionMenu().map(actionMenu => {
                        return (
                            <Tooltip title={actionMenu.label}>
                                <IconButton aria-label={actionMenu.label} onClick={() => { props.groupActionClose(actionMenu) }}>
                                    <Icon color={actionMenu.color} name={actionMenu.icon} />
                                </IconButton>
                            </Tooltip>)
                    }) : null
            ) : null}
        </Toolbar>
    );
};

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
    root: {
        width: '100%',
    },
    paper: {
        width: '100%',
        marginBottom: theme.spacing(2),
    },
    table: {
        minWidth: 750,
    },
    visuallyHidden: {
        border: 0,
        clip: 'rect(0 0 0 0)',
        height: 1,
        margin: -1,
        overflow: 'hidden',
        padding: 0,
        position: 'absolute',
        top: 20,
        width: 1,
    },
}));

export default function EnhancedTable(props) {
    const classes = useStyles();
    const [order, setOrder] = React.useState('asc');
    const [orderBy, setOrderBy] = React.useState(props.requestInfo.sortBy && props.requestInfo.sortBy.length>0 ? props.requestInfo.sortBy[0] : 'region');
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(25);
    const [actionEl, setActionEl] = React.useState(null)
    const [selectedRow, setSelectedRow] = React.useState({})

    const handleRequestSort = (event, property) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelecteds = props.dataList.map((n) => n);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, row) => {
        const selectedIndex = selected.indexOf(row);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected, row);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        } else if (selectedIndex === selected.length - 1) {
            newSelected = newSelected.concat(selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1),
            );
        }

        setSelected(newSelected);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name) => selected.indexOf(name) !== -1;

    const cellClick = (header, row)=>
    {
        setSelectedRow(row)
        props.cellClick(header, row)
    }

    /*Action Block*/

    const actionClose = (action) => {
        setActionEl(null);
        props.actionClose(action)
    }

    const getActionMenu = () => {
        return (
            props.actionMenu ?
                <Popper open={Boolean(actionEl)} anchorEl={actionEl} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center right' }}
                        >
                            <Paper style={{ backgroundColor: '#212121', color: 'white' }}>
                                <ClickAwayListener onClickAway={() => setActionEl(null)}>
                                    <MenuList autoFocusItem={Boolean(actionEl)} id="menu-list-grow" >
                                        {props.actionMenu.map((action, i) => {
                                            let visible = action.visible ? action.visible(selectedRow) : true
                                            return visible ? <MenuItem key={i} onClick={(e) => { actionClose(action) }}>{action.label}</MenuItem> : null
                                        })}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper> : null
        )
    }

    const getAction = (item) => {
        return (
            <IconButton aria-label="Action" onClick={(e) => { setActionEl(e.currentTarget) }}>
                <ListIcon style={{ color: '#76ff03' }} />
            </IconButton>
        )
    }

    const groupActionClose = (action)=>
    {
        props.groupActionClose(action, selected)
        setSelected([])
    }

    /*Action Block*/

    return (
        <div className={classes.root}>
            <Paper style={{ backgroundColor: '#2A2C33' }}>
                <EnhancedTableToolbar numSelected={selected.length} groupActionMenu={props.groupActionMenu} groupActionClose={groupActionClose}/>
                <TableContainer style={{ height: window.innerHeight - (props.isMap ? 500 : 200) }}>
                    <Table
                        stickyHeader
                        aria-labelledby="tableTitle"
                        size={'small'}
                        aria-label="enhanced table"
                    >
                        <EnhancedTableHead
                            classes={classes}
                            numSelected={selected.length}
                            order={order}
                            orderBy={orderBy}
                            onSelectAllClick={handleSelectAllClick}
                            onRequestSort={handleRequestSort}
                            headCells={props.keys}
                            rowCount={props.dataList.length}
                            requestInfo={props.requestInfo}
                        />
                        <TableBody>
                            {stableSort(props.dataList, getComparator(order, orderBy))
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row, index) => {
                                    const isItemSelected = isSelected(row);
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <StyledTableRow
                                            key={index}
                                            hover
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                        >
                                            {props.requestInfo.selection ?
                                                <TableCell style={{ borderBottom: "none" }} padding="checkbox"
                                                    onClick={(event) => handleClick(event, row)}>
                                                    <Checkbox
                                                        checked={isItemSelected}
                                                        inputProps={{ 'aria-labelledby': labelId }}
                                                    />
                                                </TableCell> : null}
                                            {props.keys.map((header, j) => {
                                                checkRole(header)
                                                if (header.visible) {
                                                    let field = header.field;
                                                    return (
                                                        <TableCell key={j} style={{ borderBottom: "none" }}
                                                            onClick={(event) => cellClick(header, row)}>
                                                            {
                                                                field === fields.actions ? getAction(row) :
                                                                    header.customizedData ? header.customizedData(row) : row[field]
                                                            }
                                                        </TableCell>
                                                    )
                                                }
                                            })
                                            }
                                        </StyledTableRow>
                                    );
                                })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[25, 50, 75]}
                    component="div"
                    count={props.dataList.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={handleChangePage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </Paper>
            {getActionMenu()}
        </div>
    );
}
