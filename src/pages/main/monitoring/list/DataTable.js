import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { withStyles } from '@material-ui/core/styles';
import TableCell from '@material-ui/core/TableCell';
import Paper from '@material-ui/core/Paper';
import { AutoSizer, Column, Table } from 'react-virtualized';
import { Icon } from '../../../../hoc/mexui';

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
    static defaultProps = {
        headerHeight: 35,
        rowHeight: 48,
    };

    getRowClassName = ({ index }) => {
        const { classes, onRowClick } = this.props;

        return clsx(classes.tableRow, classes.flexContainer, {
            [classes.tableRowHover]: index !== -1 && onRowClick != null,
        });
    };

    cellRenderer = ({ rowData, cellData, columnIndex, rowIndex }) => {
        const { columns, classes, rowHeight, onRowClick, selection, formatter } = this.props;
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

    render() {
        const { classes, columns, formatter, rowHeight, headerHeight, ...tableProps } = this.props;
        return (
            <AutoSizer>
                {({ height, width }) => {
                    //normalize width where 100 is reserved
                    let columnWidth = (width - 100) / (columns.length - 1)
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
    const { dataList, keys, formatter } = props
    const [selection, setSelection] = React.useState({ count: 0 })
    const columns = [{ field: false, label: false, type: 'checkbox', visible:true, width:50 }, ...keys.filter(key => key.visible)]
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
                />

                {/* <div style={{ height: 350, backgroundColor: '#2A2C34', width: '100%', borderRadius: 5 }}>
                    <div style={{ height: 310 }}></div>
                    <div align='center'>
                        {props.children}
                    </div>
                </div> */}
            </Paper>
        </React.Fragment>
    );
}