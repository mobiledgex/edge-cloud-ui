import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { TableCell, Divider, Typography } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { Icon, IconButton } from '../mexui';
import { lightGreen } from '@material-ui/core/colors';
import Actions from '../../pages/main/monitoring/list/Actions';
import { fields } from '../../services';
import { NoData } from '../../helper/formatter/ui';

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
    },
    tableRowHover: {
        '&:hover': {
            // backgroundColor: theme.palette.grey[200],
        },
    },
    tableCell: {
        flex: 1,
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

class MuiVirtualizedTable extends React.PureComponent {

    constructor(props) {
        super(props)
        this.isGroup = false
        this.val = undefined
    }
    static defaultProps = {
        headerHeight: 35,
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
        const { columns, classes, rowHeight, onRowClick, selection, formatter } = this.props;
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
                    column.type === ELE_BUTTON ? <IconButton ><Icon style={{ color: lightGreen['A700'], height: 18 }}>list</Icon></IconButton> :
                        column.type === ELE_CHECKBOX ? <IconButton ><Icon className={classes.checkbox} style={{ color: rowData.color }}>{`${selection.includes(rowData.uuid) ? 'check_box' : 'check_box_outline_blank'}`}</Icon></IconButton> :
                            column.format ? formatter(column, rowData) :
                                cellData
                }
            </TableCell>
        );
    };

    headerRenderer = ({ label, columnIndex }) => {
        const { headerHeight, columns, classes } = this.props;
        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, classes.noClick)}
                variant="head"
                style={{ height: headerHeight }}
                align={columns[columnIndex].numeric || false ? 'right' : 'left'}
            >
                <span>{label}</span>
            </TableCell>
        );
    };

    render() {
        const { classes, columns, formatter, rowHeight, headerHeight, action, ...tableProps } = this.props;
        return (
            <AutoSizer>
                {({ height, width, rowData }) => {
                    //normalize width where 150 is reserved
                    let columnWidth = (width - (action ? 180 : 80)) / (columns.length - 2)
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

export default function DataGrid(props) {
    const { loading, groupBy, searchValue, dataList, keys, formatter, actionMenu, cellClick, selected, setSelected, onActionClose } = props
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

    const columns = [
        { field: fields.checkbox, label: false, type: 'checkbox', visible: true, width: 80, fixedWidth: true, clickable: true },
        ...keys.filter(key => {
            let valid = key.visible
            if (groupBy && groupBy.length > 0 && key.field === groupBy[0].field) {
                valid = false
            }
            return valid
        })
    ]

    if (actionMenu && actionMenu.length > 0) {
        columns.push({ field: fields.actions, label: 'Actions', type: 'button', visible: true, width: 100, fixedWidth: true, clickable: true })
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
        <React.Fragment>
            {
                groupList.length > 0 ?
                    groupList.map((group, i) => (
                        select === undefined || select === group.value ? <div key={i} ><div style={{ height: 50, backgroundColor: '#1D1D26', display: 'flex', alignItems: 'center' }}>
                            <IconButton onClick={() => { groupClick(group) }}><Icon>{select ? 'keyboard_arrow_down' : 'chevron_right'}</Icon></IconButton>
                            <Typography>{group.value}</Typography>
                        </div><Divider /></div> : null
                    ))
                    : null
            }
            {
                itemList.length === 0 && groupList.length === 0 ? <NoData search={searchValue} loading={loading} /> :
                    itemList.length > 1 ? <Paper id='table-container' style={{ height: 'inherit', width: '100%' }}>
                        <VirtualizedTable
                            rowCount={itemList.length}
                            rowGetter={({ index }) => itemList[index]}
                            columns={columns}
                            formatter={formatter}
                            onRowClick={onRowClick}
                            onCellClick={onCellClick}
                            selection={selected}
                            action={actionMenu && actionMenu.length > 0}
                        />
                    </Paper> : null
            }
            <Actions anchorEl={anchorEl && anchorEl.target} onClose={() => { setAnchorEl(undefined) }} onClick={onActionClick} actionMenu={actionMenu} group={anchorEl && anchorEl.group} />
        </React.Fragment>
    );
}