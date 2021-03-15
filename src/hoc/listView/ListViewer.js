import React from 'react'
import { Table, TableBody, TableRow, IconButton, TableCell, TableContainer, Paper, TablePagination, ClickAwayListener, MenuList, Grow, Popper, MenuItem, Avatar } from '@material-ui/core'
import ListToolbar from './ListToolbar'
import ListHeader from './ListHeader'
import ListBody from './ListBody'
import * as constant from '../../constant'
//icon
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { getUserRole } from '../../services/model/format'
import { StyledTableRow, StyledTableCell, stableSort, getComparator } from './ListConstant'

const canEdit = (viewerEdit, action) => {
    let valid = true
    if (action.type === 'Edit') {
        let role = getUserRole()
        if (role && role.includes(constant.VIEWER)) {
            valid = false
        }
    }
    return valid || viewerEdit
}

const getHeight = (props) => {
    let tableHeight = props.tableHeight
    let selectedLength = props.selected.length
    let height = props.isMap ? 574 : 174
    height = selectedLength > 0 ? height + 40 : height
    return `calc(100vh - ${tableHeight ? tableHeight : height}px)`
}

class ListViewer extends React.Component {
    constructor(props) {
        super(props)
        this.requestInfo = props.requestInfo
        this.state = {
            expandedGroups: [],
            order: 'asc',
            orderBy: this.requestInfo.sortBy && this.requestInfo.sortBy.length > 0 ? this.requestInfo.sortBy[0] : 'region',
            page: 0,
            rowsPerPage: 25,
            actionEl: null,
            selectedRow: {}
        }
        this.actionMenu = props.actionMenu ? props.actionMenu.filter(action => { return canEdit(props.viewerEdit, action) }) : []
        this.columnLength = 0
    }

    handleChangePage = (e, newPage) => {
        this.setState({ page: newPage });
    };

    handleChangeRowsPerPage = (e) => {
        this.setState({ page: 0, rowsPerPage: parseInt(e.target.value, 10) });
    };

    getGroupedData = rows => {
        if (this.props.dropList.length > 0) {
            const groupedData = rows.reduce((acc, item) => {
                let key = item[this.props.dropList[0].field];
                let groupData = acc[key] || [];
                acc[key] = groupData.concat([item]);
                return acc;
            }, {});

            const expandedGroups = {};
            Object.keys(groupedData).forEach(item => {
                expandedGroups[item] = this.state.expandedGroups.indexOf(item) !== -1;
            });
            return groupedData;
        }
    };

    expandRow = key => {
        let expandedGroups = this.state.expandedGroups;
        if (expandedGroups.includes(key)) {
            expandedGroups = expandedGroups.filter(item => item !== key);
        } else {
            expandedGroups.push(key)
        }
        this.setState({ expandedGroups });
    };

    handleRequestSort = (event, property) => {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({ order: isAsc ? 'desc' : 'asc', orderBy: property })
    };

    updateColLength = (columnLength) => {
        this.columnLength += 1
    }

    actionMenuView = () => {
        const { actionEl, selectedRow } = this.state
        const {viewerEdit} = this.props
        return (
            this.actionMenu.length > 0 ?
                <Popper open={Boolean(actionEl)} anchorEl={actionEl} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                            {...TransitionProps}
                            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center right' }}
                        >
                            <Paper style={{ backgroundColor: '#212121', color: 'white' }}>
                                <ClickAwayListener onClickAway={() => this.setState({ actionEl: null })}>
                                    <MenuList autoFocusItem={Boolean(actionEl)} id="menu-list-grow" >
                                        {this.actionMenu.map((action, i) => {
                                            let visible = canEdit(viewerEdit, action) ? action.visible ? action.visible(selectedRow) : true : false
                                            return visible ? <MenuItem key={i} onClick={(e) => { this.actionClose(action) }} disabled={action.disable ? action.disable(selectedRow) : false}>{action.label}</MenuItem> : null
                                        })}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper> : null
        )
    }

    handleActionView = (e) => {
        this.setState({ actionEl: e.currentTarget })
    }

    actionClose = (action) => {
        this.setState({ actionEl: null })
        this.props.actionClose(action)
    }

    handleSelectAllClick = (e) => {
        if (e.target.checked) {
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

    setSelectedRow = (header, row) => {
        this.setState({ selectedRow: row })
        this.props.cellClick(header, row)
    }

    groupActionClose = (action) => {
        this.props.groupActionClose(action, this.props.selected)
    }

    isDropped = (item) => {
        this.setState({ page: 0 });
        this.props.isDropped(item)
    }


    render() {
        const grouping = this.requestInfo.grouping
        const dropList = this.props.dropList
        const { expandedGroups, page, rowsPerPage, order, orderBy } = this.state
        const {style} = this.props
        let groupedData = grouping ? this.getGroupedData(this.props.dataList) : [];
        let isGrouping = grouping && dropList.length > 0
        return (
            <div style={{ width: '100%' }}>
                <Paper style={{ backgroundColor: '#292C33' }}>
                    <ListToolbar
                        numSelected={this.props.selected.length}
                        groupActionMenu={this.props.groupActionMenu}
                        groupActionClose={this.groupActionClose} />
                    <TableContainer style={style ? style : { height: `${getHeight(this.props)}`, overflow: 'auto', marginTop: `${this.props.selected.length > 0 ? '0px' : '-40px'}` }}>
                        <Table
                            stickyHeader
                            size={'small'}>
                            <ListHeader
                                numSelected={this.props.selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                headCells={this.props.keys}
                                rowCount={this.props.dataList.length}
                                requestInfo={this.requestInfo}
                                updateColLength={this.updateColLength}
                                actionMenuLength={this.actionMenu.length}
                                isDropped={this.isDropped}
                            />
                            <TableBody>
                                {
                                    isGrouping ?
                                        stableSort(groupedData, getComparator(order, orderBy), isGrouping)
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((key, j) => {
                                                return (
                                                    <React.Fragment key={j}>
                                                        <StyledTableRow>
                                                            <StyledTableCell
                                                                colSpan={this.columnLength}
                                                                style={{ fontWeight: "bold", cursor: "pointer" }}
                                                                onClick={this.expandRow.bind(null, key)}>
                                                                <IconButton>
                                                                    {expandedGroups.includes(key) ? <ExpandMoreIcon /> : <ChevronRightIcon />}
                                                                </IconButton>
                                                                <span style={{ display: 'inline', marginRight: 5 }}>{key}</span>
                                                                <div style={{ display: 'inline' }}>{`(${groupedData[key].length})`}</div>
                                                            </StyledTableCell>
                                                        </StyledTableRow>
                                                        {expandedGroups.includes(key) ?
                                                            <ListBody
                                                                colSpan={this.columnLength}
                                                                dataList={groupedData[key]}
                                                                keys={this.props.keys}
                                                                requestInfo={this.requestInfo}
                                                                selected={this.props.selected}
                                                                setSelected={this.props.setSelected}
                                                                selectedRow={this.setSelectedRow}
                                                                handleActionView={this.handleActionView} /> : null}
                                                    </React.Fragment>
                                                )
                                            }) : stableSort(this.props.dataList, getComparator(order, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, j) => {
                                                    return (
                                                        <React.Fragment key={j}>
                                                            <ListBody
                                                                row={row}
                                                                index={j}
                                                                keys={this.props.keys}
                                                                requestInfo={this.requestInfo}
                                                                selected={this.props.selected}
                                                                setSelected={this.props.setSelected}
                                                                selectedRow={this.setSelectedRow}
                                                                handleActionView={this.handleActionView} />
                                                        </React.Fragment>
                                                    )
                                                })
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[25, 50, 75]}
                        component="div"
                        count={isGrouping ? Object.keys(groupedData).length : this.props.dataList.length}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                    />
                </Paper>
                {this.actionMenuView()}
            </div>
        )
    }
}

export default ListViewer