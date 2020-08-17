import React from 'react'
import { TableCell, Checkbox, Tooltip, IconButton, makeStyles, Paper, TablePagination, TableContainer, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { getUserRole, fields } from '../../services/model/format';
import ListIcon from '@material-ui/icons/List';
import { StyledTableCell, StyledTableRow, stableSort, getComparator } from './ListConstant';

const useStyles = makeStyles((theme) => ({
    tip: {
        width: 'fit-content',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }
}));


const checkRole = (form) => {
    let roles = form.roles
    let visible = true
    if (roles) {
        visible = false
        form.detailView = false
        for (let i = 0; i < roles.length; i++) {
            let role = roles[i]
            if (role === getUserRole()) {
                visible = true
                form.detailView = true
                break;
            }
        }
    }
    return visible
}

const ListBody = (props) => {
    const classes = useStyles()

    const [page, setPage] = React.useState(0)
    const [rowsPerPage, settRowsPerPage] = React.useState(10)
    const [order, setOrder] = React.useState('asc')
    const [orderBy, setOrderBy] = React.useState(props.requestInfo.sortBy && props.requestInfo.sortBy.length > 0 ? props.requestInfo.sortBy[0] : 'region')

    const cellClick = (header, row) => {
        props.selectedRow(header, row)
    }

    const handleClick = (event, row) => {
        const selectedIndex = props.selected.indexOf(row);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(props.selected, row);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(props.selected.slice(1));
        } else if (selectedIndex === props.selected.length - 1) {
            newSelected = newSelected.concat(props.selected.slice(0, -1));
        } else if (selectedIndex > 0) {
            newSelected = newSelected.concat(
                props.selected.slice(0, selectedIndex),
                props.selected.slice(selectedIndex + 1),
            );
        }

        props.setSelected(newSelected);
    };

    const isSelected = (name) => props.selected.indexOf(name) !== -1;

    const actionView = (item) => {
        return (
            <IconButton aria-label="Action" onClick={props.handleActionView}>
                <ListIcon style={{ color: '#76ff03' }} />
            </IconButton>
        )
    }

    const getRowData = (row, index) => {
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
                    let roleVisible = checkRole(header)
                    if (header.visible && roleVisible) {
                        let field = header.field;
                        return (
                            <StyledTableCell key={j} onClick={(event) => cellClick(header, row)}>
                                {field.indexOf('Name') !== -1 ?
                                    <Tooltip title={header.customizedData ? header.customizedData(row) : row[field] ? row[field] : ''} arrow>
                                        <div className={classes.tip}>
                                            {header.customizedData ? header.customizedData(row) : row[field]}
                                        </div>
                                    </Tooltip>
                                    :
                                    field === fields.actions ? actionView(row) :
                                        header.customizedData ? header.customizedData(row) : row[field]
                                }
                            </StyledTableCell>
                        )
                    }
                })
                }
            </StyledTableRow>)
    }

    const handleChangePage = (e, newPage) => {
        setPage(newPage)
    };

    const handleChangeRowsPerPage = (e) => {
        setPage(0)
        settRowsPerPage(parseInt(e.target.value, 10))
    };

    return (
        props.dataList ?
            <React.Fragment>
                {stableSort(props.dataList, getComparator(order, orderBy))
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                        getRowData(row, index)
                    ))}
                <StyledTableRow>
                    <StyledTableCell colSpan={props.colSpan}>
                        <TablePagination
                            rowsPerPageOptions={[10, 20, 30]}
                            component="div"
                            count={props.dataList.length}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onChangePage={handleChangePage}
                            onChangeRowsPerPage={handleChangeRowsPerPage}
                        />
                    </StyledTableCell>
                </StyledTableRow>
            </React.Fragment>
            : getRowData(props.row, props.index)
    )
}

export default ListBody