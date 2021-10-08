import React from 'react'
import { Checkbox, Tooltip, IconButton, makeStyles } from '@material-ui/core';
import { fields } from '../../services/model/format';
import ListIcon from '@material-ui/icons/List';
import { StyledTableCell, StyledTableRow, stableSort, getComparator, checkRole } from './ListConstant';
import { lightGreen } from '@material-ui/core/colors';
import { useSelector } from 'react-redux';
import { ADMIN_MANAGER } from '../../helper/constant/perpetual';

const ColumnCheckBox = (props) => {
    const { row, onClick, selection, isItemSelected } = props
    return (
        selection ? <StyledTableCell padding="checkbox"
            onClick={(e) => onClick(e, row)}>
            <Checkbox
                checked={isItemSelected}
                inputProps={{ 'aria-label': 'row-check-box' }}
            />
        </StyledTableCell> : null
    )
}

const ColumnIcon = (props) => {
    const { row, iconKeys, onClick } = props
    return (
        iconKeys ? <StyledTableCell style={{ width: 70 }} onClick={(event) => onClick({ field: 'icon' }, row)}>
            {iconKeys.map((key, j) => {
                return (
                    row.role === ADMIN_MANAGER ?
                        <React.Fragment key={j}>
                            <Tooltip title={key.label}><img src={`/assets/icons/${key.icon}`} width={30} style={{ marginTop: 5 }} /></Tooltip>
                        </React.Fragment> :
                        (<React.Fragment key={j}>
                        {row[key.field] ? <Tooltip title={key.label}><img src={`/assets/icons/${key.icon}`} width={24} style={{ marginTop: 5 }} /></Tooltip> : null}
                        </React.Fragment>)
                )
            })}
        </StyledTableCell> : null
    )
}

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
    const { requestInfo, iconKeys } = props
    const { selection, formatData } = requestInfo

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
                <ColumnCheckBox row={row} selection={selection} isItemSelected={isItemSelected} onClick={handleClick} />
                <ColumnIcon row={row} iconKeys={iconKeys} onClick={cellClick} />
                {
                    props.keys.map((header, j) => {
                        let field = header.field;
                        let visible = header.roles ? checkRole(orgInfo, header) : true
                        return (
                            visible ? <StyledTableCell key={j} onClick={(event) => cellClick(header, row)}>
                                {field.indexOf('Name') !== -1 ?
                                    <Tooltip title={header.format ? formatData(header, row) : row[field] ? row[field] : ''} arrow>
                                        <div className={classes.tip}>
                                            {header.format ? formatData(header, row) : row[field]}
                                        </div>
                                    </Tooltip>
                                    :
                                    field === fields.actions ? actionView(row) :
                                        header.format ? formatData(header, row) : row[field]
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