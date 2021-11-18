import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import {TableCell} from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table, defaultTableRowRenderer } from 'react-virtualized';
import { Icon, IconButton } from '../../../../hoc/mexui';
import { lightGreen } from '@material-ui/core/colors';
import Actions from './Actions';
import AppGroupView from '../modules/app/AppGroupView';

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
});

class MuiVirtualizedTable extends React.PureComponent {

    constructor(props){
        super(props)
        this.isGroup = false
    }
    static defaultProps = {
        headerHeight: 35,
        rowHeight: 40,
    };

    getRowClassName = ({ index }) => {
        const { classes, onRowClick } = this.props;

        return clsx(classes.tableRow, classes.flexContainer, {
            [classes.tableRowHover]: index !== -1 && onRowClick != null,
        });
    };

    cellRenderer = ({ rowData, cellData, columnIndex, rowIndex }) => {
        const { columns, classes, rowHeight, onRowClick, selection, formatter, onAction } = this.props;
        let column = columns[columnIndex]
        return (
            <TableCell
                component="div"
                className={clsx(classes.tableCell, classes.flexContainer, {
                    [classes.noClick]: onRowClick == null,
                })}
                variant="body"
                style={{ height: rowHeight }}
                align={(columnIndex != null && columns[columnIndex].numeric) || false ? 'right' : 'left'}
            >
                {
                    column.type === 'button' ? <IconButton onClick={(e)=>{onAction(e, rowData)}}><Icon style={{ color: lightGreen['A700'], height: 18 }}>list</Icon></IconButton> :
                    column.type === 'checkbox' ? <Icon style={{ color: rowData.color }}>{`${selection[rowData.key] ? 'check_box' : 'check_box_outline_blank'}`}</Icon> :
                        column.format ? formatter(column, cellData) :
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

    rowRenderer = (props) => {
        const { index, style, className, key, rowData } = props
        const { onAction, groupBy } = this.props
        if (rowData.group) {
            return (
                <div
                    style={{ ...style, backgroundColor: '#1d1d26'}}
                    className={className}
                    key={key}
                >
                    <div
                        style={{
                            marginLeft: 20,
                            width: style.width - 85,
                            fontSize: 14
                        }}
                    >
                        <AppGroupView data={rowData}/>
                    </div>
                    <div style={{ display: 'inline', width: 85 }}>
                        <IconButton onClick={(e) => { onAction(e, rowData) }}><Icon style={{ color: lightGreen['A700'], height: 18 }}>list</Icon></IconButton>
                    </div>
                </div>
            )
        }
        return defaultTableRowRenderer(props);
    }

    render() {
        const { classes, columns, formatter, rowHeight, headerHeight, action, ...tableProps } = this.props;
        return (
            <AutoSizer>
                {({ height, width, rowData }) => {
                    //normalize width where 150 is reserved
                    let columnWidth = (width - (action ? 150 : 50)) / (columns.length - 2)
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
                            rowRenderer={this.rowRenderer}
                            rowClassName={this.getRowClassName}
                        >
                            {columns.map((column, index) => {
                                column.width = column.width && column.width > 0 ? column.width : columnWidth
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

export default function ReactVirtualizedTable(props) {
    const { dataList, keys, formatter, handleAction, actionMenu, groupBy } = props
    const [selection, setSelection] = React.useState({ count: 0 })
    const [anchorEl, setAnchorEl] = React.useState(undefined)

    const columns = [
        { field: false, label: false, type: 'checkbox', visible: true, width: 50 },
        ...keys.filter(key => key.visible)
    ]

    if (actionMenu && actionMenu.length > 0) {
        columns.push({ field: false, label: 'Actions', type: 'button', visible: true, width: 100 })
    }

    const onRowClick = (e) => {
        const { rowData } = e
        let data = { ...selection }
        data[rowData.key] = !data[rowData.key]
        data.count = data.count + (data[rowData.key] ? 1 : -1)
        setSelection(data)
        if (props.onRowClick) {
            props.onRowClick(data)
        }
    }

    const onActionClick = (e, action) => {
        handleAction(action, anchorEl.data)
        setAnchorEl(undefined)
    }

    const onActionMenu = (e, rowData)=>{
        setAnchorEl({target:e.currentTarget, data:rowData})
        e.stopPropagation()
    }

    return (
        <React.Fragment>
            <Paper id='table-container' style={{ height: 'inherit', width: '100%' }}>
                <VirtualizedTable
                    rowCount={dataList.length}
                    rowGetter={({ index }) => dataList[index]}
                    columns={columns}
                    formatter={formatter}
                    onRowClick={onRowClick}
                    selection={selection}
                    action={actionMenu && actionMenu.length > 0}
                    onAction={onActionMenu}
                    groupBy={groupBy}
                />
            </Paper>
            <Actions anchorEl={anchorEl && anchorEl.target} onClose={() => { setAnchorEl(undefined) }} onClick={onActionClick} actionMenu={actionMenu} />
        </React.Fragment>
    );
}