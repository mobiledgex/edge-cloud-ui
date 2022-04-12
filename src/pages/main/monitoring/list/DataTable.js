/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import { TableCell } from '@material-ui/core';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table, defaultTableRowRenderer } from 'react-virtualized';
import { Icon, IconButton } from '../../../../hoc/mexui';
import Actions from './Actions';
import cloneDeep from 'lodash/cloneDeep';
import { ICON_COLOR } from '../../../../helper/constant/colors';
import GroupView from './GroupView';

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
    tableCell: {
        flex: 1,
    },
    noClick: {
        cursor: 'initial',
    },
});

class MuiVirtualizedTable extends React.PureComponent {

    constructor(props) {
        super(props)
        this.isGroup = false
    }
    static defaultProps = {
        headerHeight: 45,
        rowHeight: 45,
    };

    getRowClassName = ({ index }) => {
        const { classes, onRowClick } = this.props;

        return clsx(classes.tableRow, classes.flexContainer, {
            [classes.tableRowHover]: index !== -1 && onRowClick != null,
        });
    };

    cellRenderer = ({ rowData, cellData, columnIndex, rowIndex }) => {
        const { id, columns, classes, rowHeight, onRowClick, selection, formatter, onAction, onHover } = this.props;
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
                    column.type === 'button' ? <IconButton onClick={(e) => { onAction(e, rowData) }}><Icon color={ICON_COLOR} style={{ height: 18 }}>list</Icon></IconButton> :
                        column.type === 'checkbox' ? <Icon style={{ color: rowData.color }}>{`${selection[rowData.key] ? 'check_box' : 'check_box_outline_blank'}`}</Icon> :
                            column.format ? formatter(id, column, cellData) :
                                <span style={{ width: column.width - 10, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }} onMouseEnter={(e) => { onHover(e, { type: 'Default', column, data: cellData }) }} onMouseLeave={() => { onHover() }}>{cellData}</span>
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
        const { style, className, key, rowData } = props
        const { id } = this.props
        const { action, onAction } = this.props
        if (rowData.group) {
            return (
                <div
                    style={{ ...style, backgroundColor: '#1d1d26' }}
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
                        <GroupView id={id} data={rowData} />
                    </div>
                    {action ? <div style={{ display: 'inline', width: 85 }}>
                        <IconButton onClick={(e) => { onAction(e, rowData, true) }}><Icon color={ICON_COLOR} style={{ height: 18 }}>list</Icon></IconButton>
                    </div> : null}
                </div>
            )
        }
        return defaultTableRowRenderer(props);
    }

    render() {
        const { classes, columns, formatter, rowHeight, headerHeight, fixedWidth, columnCount, ...tableProps } = this.props;
        return (
            <AutoSizer>
                {({ height, width, rowData }) => {
                    //normalize width where 150 is reserved
                    let columnWidth = (width - fixedWidth) / (columnCount)
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

export default function ReactVirtualizedTable(props) {
    const { id, dataList, keys, formatter, handleAction, actionMenu, groupBy, onHover } = props
    const [selection, setSelection] = React.useState({ count: 0 })
    const [anchorEl, setAnchorEl] = React.useState(undefined)
    let fixedWidth = 50
    let columnCount = 0

    const columns = [
        { field: false, label: false, type: 'checkbox', visible: true, width: 50, fixedWidth: true },
        ...cloneDeep(keys).filter(key => {
            if (key.visible) {
                columnCount = columnCount + (key.width ? 0 : 1)
                fixedWidth = fixedWidth + (key.width ?? 0)
                key.fixedWidth = Boolean(key.width)
                return true
            }
        })
    ]
    if (actionMenu?.length > 0) {
        fixedWidth = fixedWidth + 100
        columns.push({ field: false, label: 'Actions', type: 'button', visible: true, width: 100, fixedWidth: true })
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

    const onActionMenu = (e, rowData, group) => {
        setAnchorEl({ target: e.currentTarget, data: rowData, group })
        e.stopPropagation()
    }

    return (
        <React.Fragment>
            <Paper id='table-container' style={{ height: 'inherit', width: '100%' }}>
                <VirtualizedTable
                    id={id}
                    rowCount={dataList.length}
                    rowGetter={({ index }) => dataList[index]}
                    columns={columns}
                    formatter={formatter}
                    onRowClick={onRowClick}
                    selection={selection}
                    action={actionMenu?.length > 0}
                    onAction={onActionMenu}
                    groupBy={groupBy}
                    onHover={onHover}
                    fixedWidth={fixedWidth}
                    columnCount={columnCount}
                />
            </Paper>
            <Actions anchorEl={anchorEl?.target} onClose={() => { setAnchorEl(undefined) }} onClick={onActionClick} actionMenu={actionMenu} group={anchorEl?.group} />
        </React.Fragment>
    );
}