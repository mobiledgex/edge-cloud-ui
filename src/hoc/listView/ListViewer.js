import React from 'react'
import { connect } from 'react-redux'
import { Table, TableBody, IconButton, TableContainer, Paper, TablePagination, ClickAwayListener, MenuList, Grow, Popper, MenuItem, Avatar, TableRow, TableCell } from '@material-ui/core'
import ListToolbar from './ListToolbar'
import ListHeader from './ListHeader'
import ListBody from './ListBody'
import { StyledTableRow, StyledTableCell, stableSort, getComparator, checkRole } from './ListConstant'
import { redux_org } from '../../helper/reduxData'
import { perpetual } from '../../helper/constant'
import { NoData } from '../../helper/formatter/ui'
import Icon from '../mexui/Icon'
import { lightGreen } from '@material-ui/core/colors'

const filterColumns = (keys, organizationInfo, actionMenuLength) => {
    let filteredKeys = []
    filteredKeys = keys.filter(key => {
        let roleVisible = checkRole(organizationInfo, key)
        if (key.label === 'Actions' && key.visible && roleVisible && actionMenuLength > 0) {
            key.visible = actionMenuLength > 0
        }
        if (key.visible) {
            return true
        }

    })
    return filteredKeys
}

const canEdit = (self, viewerEdit, action) => {
    let valid = true
    if (action.type === 'Edit') {
        if (redux_org.isViewer(self)) {
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
            expandedGroups: undefined,
            order: 'asc',
            orderBy: this.requestInfo.sortBy && this.requestInfo.sortBy.length > 0 ? this.requestInfo.sortBy[0] : 'region',
            page: 0,
            rowsPerPage: 25,
            actionEl: null,
            selectedRow: {},
            groupAction:undefined
        }
        this.actionMenu = props.actionMenu ? props.actionMenu.filter(action => { return canEdit(this, props.viewerEdit, action) }) : []
        this.keys = filterColumns(props.keys, props.organizationInfo, this.actionMenu.length)
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
                expandedGroups[item] = this.state.expandedGroups === item;
            });
            return groupedData;
        }
    };

    expandRow = key => {
        this.setState(prevState=>{
            let expandedGroups = prevState.expandedGroups
            expandedGroups = expandedGroups === key ? undefined : key
            return {expandedGroups}
        })
    };

    handleRequestSort = (event, property) => {
        const isAsc = this.state.orderBy === property && this.state.order === 'asc';
        this.setState({ order: isAsc ? 'desc' : 'asc', orderBy: property })
    };

    actionLabel = (action, data) => {
        if (typeof action.label === 'function') {
            return action.label(perpetual.ACTION_LABEL, action, data)
        }
        else {
            return action.label
        }
    }

    actionMenuView = () => {
        const { actionEl, selectedRow, groupAction } = this.state
        const { viewerEdit } = this.props
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
                                            let visible = canEdit(this, viewerEdit, action) ? action.visible ? action.visible(selectedRow) : true : false
                                            visible = action.visibility ? action.visibility(perpetual.ACTION_VISIBLE, action, selectedRow) : visible
                                            visible = groupAction ? action.group : visible
                                            return visible ? <MenuItem key={i} onClick={(e) => { this.actionClose(action, groupAction) }} disabled={action.disable ? action.disable(perpetual.ACTION_DISABLE, action, selectedRow) : false}>{this.actionLabel(action, selectedRow)}</MenuItem> : null
                                        })}
                                    </MenuList>
                                </ClickAwayListener>
                            </Paper>
                        </Grow>
                    )}
                </Popper> : null
        )
    }

    handleActionView = (e, group) => {
        this.setState({ actionEl: e.currentTarget, groupAction: group})
    }

    actionClose = (action, groupAction) => {
        this.props.actionClose(action, groupAction)
        this.setState({ actionEl: null, groupAction:undefined })
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
        const {grouping, groupingAction, selection} = this.requestInfo
        const { style, dataList, dropList, selected, groupActionMenu, setSelected } = this.props
        const { expandedGroups, page, rowsPerPage, order, orderBy } = this.state
        let groupedData = grouping ? this.getGroupedData(dataList) : [];
        let isGrouping = grouping && dropList.length > 0
        const columnLength = this.keys.length + (selection ? 1 : 0)
        return (
            <div style={{ width: '100%' }}>
                <Paper style={{ backgroundColor: '#292C33' }}>
                    <ListToolbar
                        numSelected={selected.length}
                        groupActionMenu={groupActionMenu}
                        groupActionClose={this.groupActionClose} />
                    <TableContainer style={style ? style : { height: `${getHeight(this.props)}`, overflow: 'auto', marginTop: `${selected.length > 0 ? '0px' : '-40px'}` }}>
                        <Table
                            stickyHeader
                            size={'small'}>
                            <ListHeader
                                numSelected={selected.length}
                                order={order}
                                orderBy={orderBy}
                                onSelectAllClick={this.handleSelectAllClick}
                                onRequestSort={this.handleRequestSort}
                                headCells={this.keys}
                                rowCount={dataList.length}
                                requestInfo={this.requestInfo}
                                actionMenuLength={this.actionMenu.length}
                                isDropped={this.isDropped}
                            />
                            {dataList.length > 0 ? <TableBody>
                                {
                                    isGrouping ?
                                        stableSort(groupedData, getComparator(order, orderBy), isGrouping)
                                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((key, j) => {
                                                return (
                                                    <React.Fragment key={j}>
                                                        {expandedGroups === undefined || expandedGroups === key ?
                                                            <StyledTableRow>
                                                                <StyledTableCell
                                                                    colSpan={columnLength - (groupingAction ? 1 : 0)}
                                                                    style={{ fontWeight: "bold", cursor: "pointer" }}
                                                                    onClick={this.expandRow.bind(null, key)}>
                                                                    <IconButton>
                                                                        <Icon>{expandedGroups === key ? 'expand_more' : 'chevron_right'}</Icon>
                                                                    </IconButton>
                                                                    <span style={{ display: 'inline', marginRight: 5 }}>{key}</span>
                                                                    <div style={{ display: 'inline' }}>{`(${groupedData[key].length})`}</div>
                                                                </StyledTableCell>
                                                                {groupingAction ? <StyledTableCell>
                                                                    <IconButton aria-label="Action" onClick={(e)=>{this.handleActionView(e, groupedData[key])}}>
                                                                        <Icon style={{ color: lightGreen['A700'] }}>list</Icon>
                                                                    </IconButton>
                                                                </StyledTableCell> : null}
                                                            </StyledTableRow> : null}
                                                        {expandedGroups === key ?
                                                            <ListBody
                                                                colSpan={columnLength}
                                                                dataList={groupedData[key]}
                                                                keys={this.keys}
                                                                page={page}
                                                                rowsPerPage={rowsPerPage}
                                                                order={order}
                                                                orderBy={orderBy}
                                                                requestInfo={this.requestInfo}
                                                                selected={selected}
                                                                setSelected={setSelected}
                                                                selectedRow={this.setSelectedRow}
                                                                handleActionView={this.handleActionView} /> : null}
                                                    </React.Fragment>
                                                )
                                            }) : stableSort(dataList, getComparator(order, orderBy))
                                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row, j) => {
                                                    return (
                                                        <React.Fragment key={j}>
                                                            <ListBody
                                                                row={row}
                                                                index={j}
                                                                keys={this.keys}
                                                                requestInfo={this.requestInfo}
                                                                selected={selected}
                                                                setSelected={setSelected}
                                                                selectedRow={this.setSelectedRow}
                                                                handleActionView={this.handleActionView} />
                                                        </React.Fragment>
                                                    )
                                                })
                                }
                            </TableBody> : null}
                        </Table>
                        {dataList.length === 0 ? <NoData /> : null}
                    </TableContainer>
                    <TablePagination
                        rowsPerPageOptions={[25, 50, 75]}
                        component="div"
                        count={expandedGroups  ? groupedData[expandedGroups] && groupedData[expandedGroups].length : (isGrouping ? Object.keys(groupedData).length : dataList.length)}
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

    componentDidMount() {
      
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
}

export default connect(mapStateToProps, null)(ListViewer);