import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { TableCell, Divider, Typography, Tooltip } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { Icon, IconButton } from '../mexui';
import { lightGreen } from '@material-ui/core/colors';
import Actions from './Action';
import { fields } from '../../services';
import { NoData } from '../../helper/formatter/ui';
import GridAction from './GroupAction';
import './style.css'
import IconBar from './ListIconBar';

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
            paddingRight: theme.direction === 'rtl' ? '0 !important' : undefined,
        },
    },
    tableRow: {
        cursor: 'pointer',
        "&:last-child th, &:last-child td": {
            borderBottom: '0px !important',
        },
    },
    tableRowHover: {
        '&:hover': {
            // backgroundColor: theme.palette.grey[200],
        },
    },
    tableCell: {
        flex: 1
    },
    textHeader: {
        fontSize: '.975rem',
        color: '#FFF',
        fontWeight: 900,
        lineHeight: 1.5715
    },
    textBody: {
        fontSize: '.875rem',
        fontWeight: 900,
        lineHeight: 1.5715
    },
    noClick: {
        cursor: 'initial',
    },
    checkbox: {
        cursor: 'pointer'
    }
});

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
        const { columns, classes, rowHeight, onRowClick, selection, formatter, iconKeys } = this.props;
        let column = columns[columnIndex]
        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, {
                    [classes.noClick]: onRowClick === null || column.clickable === true,
                })}
                onClick={(e) => { this.onCellClick(e, column, rowData) }}
                variant="body"
                style={{ height: rowHeight }}
                align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
            >
                {
                    column.type === ELE_ICON ? iconKeys.map((key, j) => {
                        return (
                            <React.Fragment key={j}>
                                {rowData[key.field] ? <img src={`/assets/icons/${key.icon}`} width={24} style={{ marginTop: 5 }} /> : null}
                            </React.Fragment>
                        )
                    }) :
                        column.type === ELE_BUTTON ? <IconButton ><Icon style={{ color: lightGreen['A700'], height: 18 }}>list</Icon></IconButton> :
                            column.type === ELE_CHECKBOX ? <IconButton ><Icon className={classes.checkbox} style={{ color: rowData.color }}>{`${selection.includes(rowData.uuid) ? 'check_box' : 'check_box_outline_blank'}`}</Icon></IconButton> :
                                column.format ? formatter(column, rowData) :
                                    <span className={classes.textBody}>{cellData}</span>
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
        const { headerHeight, columns, classes } = this.props;
        let column = columns[columnIndex]
        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
                variant="head"
                style={{ height: headerHeight }}
                align={column.numeric || false ? 'right' : 'left'}
            >
                {
                    column.type === ELE_CHECKBOX ? <IconButton onClick={this.onSelectAll}><Icon className={classes.checkbox}>{`${this.selectAll ? 'check_box' : 'check_box_outline_blank'}`}</Icon></IconButton>:
                        <span className={classes.textHeader}>{label}</span>
                }
            </TableCell>
        );
    };

    render() {
        const { classes, columns, columnCount, formatter, iconKeys, rowHeight, headerHeight, action, ...tableProps } = this.props;
        return (
            <AutoSizer>
                {({ height, width, rowData }) => {
                    let reservedWidth = 80 + (action ? 100 : 0) + (iconKeys && iconKeys.length > 0 ? 70 : 0)
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

const getHeight = (props) => {
    const { tableHeight, selected, isMap, iconKeys, groupBy } = props
    let height = isMap ? 535 : 135
    height = selected.length > 0 ? height + 62 : height
    if (tableHeight) {
        height = tableHeight
        height = selected.length > 0 ? height + 49 : height
    }
    height = iconKeys ? height + 39 : height
    height = groupBy.length > 0 ? height + 51 : height
    return `calc(100vh - ${height}px)`
}


export default function DataGrid(props) {
    const { loading, groupBy, searchValue, dataList, keys, formatter, actionMenu, cellClick, selected, setSelected, onActionClose, groupActionMenu, groupActionClose, iconKeys, onIconFilter, viewerEdit } = props
    const [itemList, setList] = React.useState([])
    const [groupList, setGroupList] = React.useState([])
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

    const groupClick = (group) => {
        if (select) {
            setSelect(undefined)
            setList([])
        }
        else {
            setSelect(group.value)
            setList(group.data)
        }
    }

    useEffect(() => {
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
        else {
            setGroupList([])
            setList(dataList)
            setSelect(undefined)
        }
    }, [groupBy]);

    useEffect(() => {
        if (!select)
            setList(dataList)
    }, [dataList]);

    let columns = [{ field: fields.checkbox, label: false, type: ELE_CHECKBOX, visible: true, width: 80, fixedWidth: true, clickable: true }]
    let columnCount = 0

    if (iconKeys && iconKeys.length > 0) {
        columns.push({ field: fields.listFilter, label: '', type: ELE_ICON, visible: true, width: 70, fixedWidth: true })
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
        columns.push({ field: fields.actions, label: 'Actions', type: ELE_BUTTON, visible: true, width: 100, fixedWidth: true, clickable: true })
    }

    const onRowClick = (e) => {
        const { rowData, index } = e
        cellClick(undefined, rowData)
    }

    const onCellClick = (e, column, data) => {
        if (column.field === fields.actions) {
            setAnchorEl({ target: e.currentTarget, data })
        }
        else if (column.field === fields.checkbox) {
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
            cellClick(column, data)
        }
    }

    const onActionClick = (e, action) => {
        onActionClose && onActionClose(action, anchorEl.data)
        setAnchorEl(undefined)
    }

    return (
        <div id='mex-data-grid' style={{ borderRadius: 5 }}>
            <IconBar keys={iconKeys} onClick={onIconFilter} />
            {selected && selected.length > 0 ? <GridAction numSelected={selected.length} groupActionMenu={groupActionMenu} groupActionClose={groupActionClose} /> : null}
            {
                groupList.length > 0 ?
                    groupList.map((group, i) => (
                        select === undefined || select === group.value ? <div key={i} ><div style={{ height: 50, display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => { groupClick(group) }}><Icon>{select ? 'keyboard_arrow_down' : 'chevron_right'}</Icon></IconButton>
                            <Typography>{group.value}</Typography>
                        </div><Divider /></div> : null
                    ))
                    : null
            }
            {
                itemList.length === 0 && groupList.length === 0 ? <div style={{ height: 'calc(100vh - 104px)' }}><NoData search={searchValue} loading={loading} style={{ width: '100%' }} /></div> :
                    itemList.length > 0 ?
                        <React.Fragment>
                            <Paper id='table-container' style={{ height: `${getHeight(props)}`, width: '100%' }}>
                                <VirtualizedTable
                                    rowCount={itemList.length}
                                    rowGetter={({ index }) => itemList[index]}
                                    columns={columns}
                                    columnCount={columnCount}
                                    formatter={formatter}
                                    onRowClick={onRowClick}
                                    onCellClick={onCellClick}
                                    iconKeys={iconKeys}
                                    selection={selected}
                                    setSelected={setSelected}
                                    dataList={itemList}
                                    action={actionMenu && actionMenu.length > 0}
                                />
                            </Paper>
                            <div className='footer'><strong>{`Total Rows: ${itemList.length}`}</strong></div>
                        </React.Fragment> : null
            }
            <Actions anchorEl={anchorEl && anchorEl.target} onClose={() => { setAnchorEl(undefined) }} onClick={onActionClick} actionMenu={actionMenu} viewerEdit={viewerEdit} group={anchorEl && anchorEl.group} data={anchorEl && anchorEl.data}/>
        </div>
    );
}