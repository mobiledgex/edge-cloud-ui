import React from 'react'
import { TableCell, Checkbox, Tooltip, IconButton, makeStyles } from '@material-ui/core';
import { fields } from '../../services/model/format';
import ListIcon from '@material-ui/icons/List';
import { StyledTableCell, StyledTableRow, stableSort, getComparator, checkRole } from './ListConstant';
import { lightGreen } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';

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
    const orgInfo = useSelector(state => state.organizationInfo.data)
    const cellClick = (header, row) => {
        props.selectedRow(header, row)
    }

    const handleClick = (event, row) => {
        const exist = props.selected.includes(row.uuid);
        let newSelected = [];

        if (exist) {
            newSelected = props.selected.filter(select => {
                return select !== row.uuid
            })
        }
        else {
            newSelected = [...props.selected, row.uuid]
        }
        props.setSelected(newSelected);
    };

    const isSelected = (id) => props.selected.includes(id);

    const actionView = (item) => {
        return (
            <IconButton aria-label="Action" onClick={props.handleActionView}>
                <ListIcon style={{ color: lightGreen['A700'] }} />
            </IconButton>
        )
    }

    const getRowData = (row, index) => {
        const isItemSelected = isSelected(row.uuid);
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
                    let field = header.field;
                    let visible = header.roles ? checkRole(orgInfo, header) : true
                    return (
                        visible ? <StyledTableCell key={j} onClick={(event) => cellClick(header, row)}>
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
                        </StyledTableCell> : null
                    )
                })
                }
            </StyledTableRow>)
    }

    const { page, rowsPerPage, order, orderBy } = props
    return (
        props.dataList ?
            <React.Fragment>
                {
                    stableSort(props.dataList, getComparator(order, orderBy))
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, index) => (
                            getRowData(row, index)
                        ))
                }
            </React.Fragment>
            : getRowData(props.row, props.index)
    )
}

export default ListBody