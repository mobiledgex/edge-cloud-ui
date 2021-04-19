import React from 'react'
import { TableCell, Checkbox, Tooltip, IconButton, makeStyles, TablePagination } from '@material-ui/core';
import { fields } from '../../services/model/format';
import ListIcon from '@material-ui/icons/List';
import { StyledTableCell, StyledTableRow, stableSort, getComparator, checkRole } from './ListConstant';

const useStyles = makeStyles((theme) => ({
    tip: {
        width: 'fit-content',
        maxWidth: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    }
}));

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
        const exist = props.selected.includes(row.uuid);
        let newSelected = [];

        if(exist)
        {
            newSelected = props.selected.filter(select=>{
                return select !== row.uuid
            })
        }
        else
        {
            newSelected = [...props.selected, row.uuid]
        }
        props.setSelected(newSelected);
    };

    const isSelected = (id) => props.selected.includes(id);

    const actionView = (item) => {
        return (
            <IconButton aria-label="Action" onClick={props.handleActionView}>
                <ListIcon style={{ color: '#76ff03' }} />
            </IconButton>
        )
    }

    const getRowData = (row, index) => {
        const isItemSelected = isSelected(row.uuid);
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
                            inputProps={{ 'aria-label': 'select all' }}
                        />
                    </TableCell> : null}

                {props.keys.map((header, j) => {
                    let roleVisible = checkRole(header)
                    if (header.visible && roleVisible) {
                        let field = header.field;
                        return (
                            <StyledTableCell key={j} onClick={(event) => cellClick(header, row)}>
                                {field.indexOf('Name') !== -1 ?
                                    <Tooltip title={header.format ? props.requestInfo.formatData(header, row) : row[field] ? row[field] : ''} arrow>
                                        <div className={classes.tip}>
                                            {header.format ? props.requestInfo.formatData(header, row) : row[field]}
                                        </div>
                                    </Tooltip>
                                    :
                                    field === fields.actions ? actionView(row) :
                                        header.format ? props.requestInfo.formatData(header, row) : row[field]
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