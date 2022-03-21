import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { TableCell, Divider, Typography, Checkbox } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { Icon, IconButton } from '../mexui';
import Actions from './action/Action';
import { NoData } from '../../helper/formatter/ui';
import { ICON_COLOR } from '../../helper/constant/colors'; 
import CheckBoxOutlinedIcon from '@material-ui/icons/CheckBoxOutlined';
import CheckBoxOutlineBlankOutlinedIcon from '@material-ui/icons/CheckBoxOutlineBlankOutlined';
import { localFields } from '../../services/fields';

const styles = (theme) => ({
    flexContainer: {
        display: 'flex',
        alignItems: 'center',
        boxSizing: 'border-box',
    },
    table: {
        // temporary right-to-left patch, waiting for
        // https://github.com/bvaughn/react-virtualized/issues/454
        '& .ReactVirtualized__Table__headerRow': {
            flip: false,
            paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined
        },
    },
    tableRow: {
        cursor: 'pointer'
    },
    tableRowHover: {
        '&:hover': {
            backgroundColor: '#181a1f',
        },
    },
    tableHeader: {
        "&:hover #sort-icon": {
            visibility: 'visible'
        }
    },
    tableCell: {
        flex: 1
    },
    textHeader: {
        fontSize: '.975rem',
        color: '#CECECE',
        fontWeight: 900,
        lineHeight: 1.5715
    },
    textBody: {
        fontSize: '.875rem',
        color: '#E8E8E8',
        fontWeight: 900,
        lineHeight: 1.5715
    },
    noClick: {
        cursor: 'initial',
    },
    checkbox: {
        "&&:hover": {
            backgroundColor: "#3E4046",
        }
    },
    sortIcon: {
        transition: theme.transitions.create(["transform"], {
            duration: theme.transitions.duration.short
        })
    },
    arrowUp: {
        transform: "rotate(-180deg)"
    },
    arrowDown: {
        transform: "rotate(0)"
    },
    sortIconVisible: {
        visibility: 'hidden'
    }
});

export const getComparator = (order, orderBy) => {
    return order === "desc"
        ? (a, b) => (a[orderBy] > b[orderBy] ? -1 : 1)
        : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

export const stableSort = (dataList, comparator, isGrouping) => {
    const stabilizedThis = dataList.map((key, index) => [key, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

const ELE_BUTTON = 'button'
const ELE_CHECKBOX = 'checkbox'
const ELE_ICON = 'icon'

class MuiVirtualizedTable extends React.PureComponent {

    constructor(props) {
        super(props)
        this.isGroup = false
        this.val = undefined
        this.selectAll = false
    }
    static defaultProps = {
        headerHeight: 50,
        rowHeight: 50,
    };



    getRowClassName = ({ index }) => {
        const { classes, onRowClick } = this.props;

        return clsx(classes.tableRow, classes.flexContainer, {
            [classes.tableRowHover]: index !== -1 && onRowClick !== null,
        });
    };

    //block row click
    onCellClick = (e, column, data) => {
        this.props.onCellClick(e, column, data)
        if (column.clickable) {
            e.stopPropagation()
        }
    }

    cellRenderer = ({ rowData, cellData, columnIndex, rowIndex }) => {
        const { columns, classes, rowHeight, onRowClick, selected, formatter, iconKeys } = this.props;
        let column = columns[columnIndex]
        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, {
                    [classes.noClick]: onRowClick === null || column.clickable === true,
                })}
                onClick={(e) => { this.onCellClick(e, column, rowData) }}
                variant="body"
                style={{ height: rowHeight, width:column.width }}
                align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
            >
                {
                    column.type === ELE_ICON ? iconKeys.map((key, j) => {
                        const isSVG = key.icon.includes('.svg')
                        return (
                            <React.Fragment key={j}>
                                {rowData[key.field] ? isSVG ? <img src={`/assets/icons/${key.icon}`} width={24} style={{ marginTop: 5 }} /> : <Icon color={'#388E3C'} size={24} outlined={true}>{key.icon}</Icon> : null}
                            </React.Fragment>
                        )
                    }) :
                        column.type === ELE_BUTTON ? <IconButton id={`mex-data-grid-row-${column.field}`}><Icon style={{ height: 18 }} color={ICON_COLOR}>list</Icon></IconButton> :
                            column.type === ELE_CHECKBOX ? <Checkbox className={classes.checkbox} checked={selected.includes(rowData.uuid)} checkedIcon={<CheckBoxOutlinedIcon/>} icon={<CheckBoxOutlineBlankOutlinedIcon/>}/> :
                                column.format ? formatter(column, rowData) :
                                    <span id={`mex-data-grid-row-${column.field}`} className={classes.textBody}>{cellData}</span>
                }
            </TableCell>
        );
    };

    onSelectAll = (e) => {
        this.selectAll = !this.selectAll
        if (this.selectAll) {
            let selectall = []
            selectall = this.props.dataList.map(data => {
                return data.uuid
            })
            this.props.setSelected(selectall);
        }
        else {
            this.props.setSelected([]);
        }
    };

    headerRenderer = ({ label, columnIndex }) => {
        const { headerHeight, columns, classes, order, orderBy, onSortClick, selected, rowCount } = this.props;
        let column = columns[columnIndex]
        return (
            <TableCell
                component="div"
                className={clsx(classes.tableHeader, classes.tableCell, classes.flexContainer, { [classes.noClick]: !column.sortable })}
                variant="head"
                style={{ height: headerHeight, width:column.width }}
                onClick={() => { onSortClick(column) }}
                align={column.numeric || false ? 'right' : 'left'}
            >
                {
                    column.type === ELE_CHECKBOX ? <Checkbox className={classes.checkbox} onChange={this.onSelectAll} checked={selected.length === rowCount} checkedIcon={<CheckBoxOutlinedIcon/>} icon={<CheckBoxOutlineBlankOutlinedIcon/>}/> :
                        <span className={classes.textHeader}>{label}</span>
                }
                {
                    column.sortable ? <Icon id='sort-icon' className={clsx(classes.sortIcon, order === 'asc' ? classes.arrowDown : classes.arrowUp, { [classes.sortIconVisible]: column.field !== orderBy })}>{'arrow_drop_up'}</Icon> : null
                }
            </TableCell>
        );
    };

    render() {
        const { classes, columns, columnCount, formatter, iconKeys, rowHeight, headerHeight, selection, action, ...tableProps } = this.props;
        return (
            <AutoSizer>
                {({ height, width, rowData }) => {
                    let reservedWidth = (selection ? 60 : 0) + (action ? 100 : 0) + (iconKeys && iconKeys.length > 0 ? 37 * iconKeys.length  : 0)
                    let columnWidth = (width - reservedWidth) / columnCount
                    return (
                        <Table
                            height={height}
                            width={width}
                            rowHeight={rowHeight}
                            gridStyle={{
                                direction: 'inherit',
                            }}
                            headerHeight={headerHeight}
                            className={classes.table}
                            {...tableProps}
                            rowClassName={this.getRowClassName}
                        >
                            {columns.map((column, index) => {
                                column.width = column.fixedWidth ? column.width : columnWidth
                                return (
                                    <Column
                                        key={column.field}
                                        headerRenderer={(headerProps) =>
                                            this.headerRenderer({
                                                ...headerProps,
                                                columnIndex: index,
                                            })
                                        }
                                        className={classes.flexContainer}
                                        cellRenderer={this.cellRenderer}
                                        dataKey={column.field}
                                        {...column}
                                    />
                                );
                            })}
                        </Table>
                    )
                }}
            </AutoSizer>
        );
    }
}

MuiVirtualizedTable.propTypes = {
    classes: PropTypes.object.isRequired,
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            field: PropTypes.any.isRequired,
            label: PropTypes.any.isRequired,
            // numeric: PropTypes.bool,
            // width: PropTypes.number.isRequired,
        }),
    ).isRequired,
    headerHeight: PropTypes.number,
    onRowClick: PropTypes.func,
    rowHeight: PropTypes.number,
};

const VirtualizedTable = withStyles(styles)(MuiVirtualizedTable);

const getHeight = (props, table) => {
    const { tableHeight, isMap, iconKeys, groupBy } = props
    let height = isMap ? 553 : 153
    height = tableHeight ? tableHeight : height
    height = iconKeys ? height + 40 : height
    height = table && (groupBy && groupBy.length > 0) ? height + 50 : height
    return `calc(100vh - ${height}px)`
}


export default function MexTable(props) {
    const { loading, groupBy, searchValue, dataList, keys, formatter, actionMenu, cellClick, selected, setSelected, selection, onActionClose, iconKeys, viewerEdit, sortBy, style } = props
    const [itemList, setList] = React.useState([])
    const [groupList, setGroupList] = React.useState([])
    const [order, setOrder] = React.useState('asc')
    const [orderBy, setOrderBy] = React.useState((sortBy && sortBy.length > 0) ? sortBy[0] : undefined)
    const [select, setSelect] = React.useState(undefined)
    const [anchorEl, setAnchorEl] = React.useState(undefined)

    const getGroupedData = rows => {
        if (groupBy.length > 0) {
            const groupedData = rows.reduce((acc, item) => {
                let key = item[groupBy[0].field];
                let groupData = acc[key] || [];
                acc[key] = groupData.concat([item]);
                return acc;
            }, {});
            return groupedData;
        }
    };

    const sortData = (list, order, orderBy) => {
        setList(stableSort(list, getComparator(order, orderBy)))
    }

    const groupClick = (group) => {
        if (select) {
            setSelect(undefined)
            setList([])
        }
        else {
            setSelect(group.value)
            sortData(group.data, order, orderBy)
        }
    }

    const onSortClick = (column) => {
        if (column.sortable) {
            let isAsc = orderBy === column.field && order === 'asc'
            let newOrder = isAsc ? 'desc' : 'asc'
            setOrderBy(column.field)
            setOrder(newOrder)
            sortData(itemList, newOrder, column.field)
        }
    }

    const updateGroupList = () => {
        if (groupBy && groupBy.length > 0) {
            let groups = getGroupedData(dataList)
            if (groups) {
                let groupList = []
                Object.keys(groups).map(group => {
                    groupList.push({ value: group, data: groups[group] })
                })
                setGroupList(groupList)
                setList([])
                setSelect(undefined)
            }
        }
    }

    useEffect(() => {
        if (groupBy && groupBy.length > 0) {
            updateGroupList()
        }
        else {
            setGroupList([])
            sortData(dataList, order, orderBy)
            setSelect(undefined)
        }
    }, [groupBy]);

    useEffect(() => {
        sortData(dataList, order, orderBy)
        updateGroupList()
    }, [dataList]);

    let columns = []
    if (selection) { columns.push({ field: localFields.checkbox, label: false, type: ELE_CHECKBOX, visible: true, width: 60, fixedWidth: true, clickable: true }) }
    let columnCount = 0

    if (iconKeys && iconKeys.length > 0) {
        columns.push({ field: localFields.listFilter, label: '', type: ELE_ICON, visible: true, width: 37 * iconKeys.length , fixedWidth: true })
    }
    columns = [...columns, ...keys.filter(key => {
        let valid = key.visible
        if (groupBy && groupBy.length > 0 && key.field === groupBy[0].field) {
            valid = false
        }
        columnCount = valid ? (columnCount + 1) : columnCount
        return valid
    })]

    if (actionMenu && actionMenu.length > 0) {
        columns.push({ field: localFields.actions, label: 'Actions', type: ELE_BUTTON, visible: true, width: 100, fixedWidth: true, clickable: true })
    }

    const onRowClick = (e) => {
        const { rowData, index } = e
        cellClick && cellClick(undefined, rowData)
    }

    const onCellClick = (e, column, data) => {
        if (column.field === localFields.actions) {
            setAnchorEl({ target: e.currentTarget, data })
        }
        else if (column.field === localFields.checkbox) {
            const exist = selected.includes(data.uuid);
            let newSelected = [];

            if (exist) {
                newSelected = props.selected.filter(select => {
                    return select !== data.uuid
                })
            }
            else {
                newSelected = [...props.selected, data.uuid]
            }
            setSelected(newSelected);
        }
        else if (column.clickable) {
            cellClick && cellClick(column, data)
        }
    }

    const onActionClick = (e, action) => {
        onActionClose && onActionClose(action, anchorEl.data)
        setAnchorEl(undefined)
    }

    return (
        <div id='mex-data-grid'>
            {props.children}
            {
                groupList.length > 0 ?
                    <div style={{ height: `${select ? '50px' : getHeight(props)}`, overflow: 'auto' }}>
                        <Divider />
                        {
                            groupList.map((group, i) => (
                                select === undefined || select === group.value ?
                                    <div key={i} >
                                        <div style={{ height: 50, display: 'flex', alignItems: 'center' }}>
                                            <IconButton onClick={() => { groupClick(group) }}><Icon>{select ? 'keyboard_arrow_down' : 'chevron_right'}</Icon></IconButton>
                                            <Typography>{group.value !== 'undefined' ? group.value : ''}</Typography>
                                        </div><Divider />
                                    </div> : null
                            ))
                        }
                    </div>
                    : null
            }
            {
                itemList.length === 0 && groupList.length === 0 ? <div style={{ height: getHeight(props, true) }}><NoData search={searchValue} loading={loading} style={{ width: '100%' }} /></div> :
                    itemList.length > 0 && (groupList.length === 0 || select !== undefined) ?
                        <Paper id='table-container' style={style ? style : { height: `${getHeight(props, true)}` }}>
                            <VirtualizedTable
                                rowCount={itemList.length}
                                rowGetter={({ index }) => itemList[index]}
                                columns={columns}
                                columnCount={columnCount}
                                formatter={formatter}
                                onRowClick={onRowClick}
                                onCellClick={onCellClick}
                                onSortClick={onSortClick}
                                iconKeys={iconKeys}
                                selection={selection}
                                selected={selected}
                                setSelected={setSelected}
                                dataList={itemList}
                                order={order}
                                orderBy={orderBy}
                                action={actionMenu && actionMenu.length > 0}
                            />
                        </Paper> : null
            }
            <Actions anchorEl={anchorEl && anchorEl.target} onClose={() => { setAnchorEl(undefined) }} onClick={onActionClick} actionMenu={actionMenu} viewerEdit={viewerEdit} group={anchorEl && anchorEl.group} data={anchorEl && anchorEl.data} />
        </div>
    );
}