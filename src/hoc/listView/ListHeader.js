import React from 'react';
import PropTypes from 'prop-types';
import { TableHead, TableRow, Checkbox, TableSortLabel, TableCell, makeStyles } from '@material-ui/core';
import { checkRole } from './ListConstant';
import { useSelector } from 'react-redux';

const useStyles = makeStyles((theme) => ({
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
    }
}));

const ListHead = (props) => {
    const classes = useStyles()
    
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort, requestInfo } = props;
    const { iconKeys, selection} = requestInfo

    const orgInfo = useSelector(state => state.organizationInfo.data)
    const createSortHandler = (property) => (event) => {
        onRequestSort(event, property);
    };

    const headerLabel = (headCell) => {
        return (
            headCell.label
        )
    }

    return (
        <TableHead>
            <TableRow style={{ height: 50 }}>
                {selection ? <TableCell padding="checkbox" style={{ backgroundColor: '#292C33' }}>
                    <Checkbox
                        indeterminate={numSelected > 0 && numSelected < rowCount}
                        checked={rowCount > 0 && numSelected === rowCount}
                        onChange={onSelectAllClick}
                        inputProps={{ 'aria-label': 'select all' }}
                    />
                </TableCell> : null}
                {iconKeys ? <TableCell style={{ backgroundColor: '#292C33' }}></TableCell> : null}
                {props.headCells.map((headCell) => {
                    let visible = headCell.roles ? checkRole(orgInfo, headCell) : true
                    return visible ? <TableCell
                        style={{ backgroundColor: '#292C33' }}
                        key={headCell.field}
                        align={headCell.numeric ? 'right' : 'left'}
                        padding={headCell.disablePadding ? 'none' : 'normal'}
                        sortDirection={orderBy === headCell.field ? order : false}
                    >
                        {headCell.sortable ?
                            <TableSortLabel
                                active={orderBy === headCell.field}
                                direction={orderBy === headCell.field ? order : 'asc'}
                                onClick={createSortHandler(headCell.field)}
                            >
                                {headerLabel(headCell)}
                                {orderBy === headCell.field ? (
                                    <span className={classes.visuallyHidden}>
                                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                                    </span>
                                ) : null}
                            </TableSortLabel> : headerLabel(headCell)}
                    </TableCell> : null
                })}
            </TableRow>
        </TableHead>
    );
}

export default ListHead

ListHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onRequestSort: PropTypes.func.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    order: PropTypes.oneOf(['asc', 'desc']).isRequired,
    orderBy: PropTypes.string.isRequired,
    rowCount: PropTypes.number.isRequired,
    actionMenuLength: PropTypes.number.isRequired
};