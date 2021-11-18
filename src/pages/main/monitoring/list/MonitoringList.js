import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper, Grow, Popper, ClickAwayListener, MenuList, MenuItem, TableSortLabel, makeStyles } from '@material-ui/core'
import { Icon } from '../../../../hoc/mexui';
import { lightGreen } from '@material-ui/core/colors';
import { validateRole } from '../helper/constant';
import { useSelector } from 'react-redux';
import { redux_org } from '../../../../helper/reduxData';
import { fields } from '../../../../services/model/format';
import { getComparator, stableSort } from '../../../../hoc/listView/ListConstant';
import MBullet from '../charts/bullet/BulletChart';

const useStyles = makeStyles((theme) => ({
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1
  }
}));

const Action = (props) => {
  const { anchorEl, onClose, actionMenu, onClick, group } = props
  const orgInfo = useSelector(state => state.organizationInfo.data)
  return (
    <React.Fragment>
      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} role={undefined} transition disablePortal style={{ zIndex: 999 }}>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center right' }}
          >
            <Paper style={{ backgroundColor: '#212121', color: 'white' }}>
              <ClickAwayListener onClickAway={onClose}>
                <MenuList autoFocusItem={Boolean(anchorEl)} id="menu-list-grow" >
                  {
                    actionMenu.map((action, i) => {
                      let visible = group ? action.group : true
                      visible = visible && action.roles ? validateRole(action.roles, redux_org.roleType(orgInfo)) : visible
                      return visible ? <MenuItem key={i} onClick={(e) => { onClick(e, { ...action, group }) }}>{action.label}</MenuItem> : null
                    })
                  }
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  )
}

const ActionButton = (props) => {
  const { actionMenu, onClick } = props
  return (
    actionMenu && actionMenu.length > 0 ? <TableCell>
      <button onClick={onClick} style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}><Icon style={{ color: lightGreen['A700'], height: 18 }}>list</Icon></button>
    </TableCell> : null
  )
}

const getGroupedData = (region, rows, groupBy) => {
  let dataList = []
  Object.keys(rows).forEach(key => {
    if (region.includes(key)) {
      let regionData = rows[key]
      let dataKeys = Object.keys(regionData)
      if (dataKeys.length > 0) {
        dataKeys.forEach(dataKey => {
          dataList.push({ ...regionData[dataKey], key: dataKey })
        })
      }
    }
  })
  if (groupBy) {
    const fields = groupBy.fields
    const groupedData = dataList.reduce((acc, item) => {
      let key = undefined
      fields.forEach(field => {
        key = key ? (key + '_') : ''
        key = key + item[field]
      })
      let groupData = acc[key] || [];
      acc[key] = groupData.concat([item]);
      return acc;
    }, {});
    return groupedData
  }
  return { 'all': dataList }
};

const rowValue = (filter, row, value) => {
  let customData = filter.parent.customData
  let data = value[row.field]
  if (data && row.isArray) {
    return data[filter.summary.position]
  }
  else {
    return data ? row.customData ? customData(row.field, value) : data : '-'
  }
}

const MTableHead = (props) => {
  const { orderBy, order, headCells, actionMenu, onRequestSort } = props
  const classes = useStyles()
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };
  return (
    <TableHead>
      <TableRow>
        <TableCell style={{ backgroundColor: '#292c33' }}></TableCell>
        {headCells.map((headCell) => (
          headCell.visible ?
            <TableCell
              key={headCell.field}
              style={{ backgroundColor: '#292c33', cursor: 'default' }}
              align={headCell.numeric ? "right" : "left"}
              padding={headCell.disablePadding ? "none" : "normal"}
              sortDirection={orderBy === headCell.field ? order : false}
            >
              {
                headCell.sortable ? <TableSortLabel
                  active={orderBy === headCell.field}
                  direction={orderBy === headCell.field ? order : "asc"}
                  onClick={createSortHandler(headCell.field)}
                >
                  {headCell.label}
                  {orderBy === headCell.field ? (
                    <span className={classes.visuallyHidden}>
                      {order === "desc" ? "sorted descending" : "sorted ascending"}
                    </span>
                  ) : null}
                </TableSortLabel> : headCell.label
              }
            </TableCell> : null
        ))}
        {actionMenu && actionMenu.length > 0 ? <TableCell style={{ backgroundColor: '#292c33', cursor: 'default' }}>Actions</TableCell> : null}
      </TableRow>
    </TableHead>
  )
}
class MonitoringList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null,
      order: 'asc',
      orderBy: 'appName',
    }
    const filter = props.filter
    this.rows = filter.parent.metricListKeys
    this.groupBy = filter.parent.groupBy
    this.colLen = this.rows.filter(row => (row.visible)).length + 1 + (this.groupBy.action ? 0 : 1)
    this.selection = []

  }

  actionMenuClick = (e, data, group) => {
    this.selection = data
    this.group = group
    this.setState({ anchorEl: e.currentTarget })
  }

  onActionClose = () => {
    this.setState({ anchorEl: null })
  }

  onAcionClick = (e, action) => {
    this.props.onActionClick(action, this.selection)
    this.onActionClose()
  }

  groupByFormat = (data, groupBy) => {
    let format = undefined
    const fields = groupBy.fields
    const label = groupBy.label
    fields.map(field => {
      format = format ? (format + ' [') : ''
      format = format + data[field]
      format = format.includes('[') ? (format + ']') : format
    })
    return `${label}: ${format}`
  }

  handleRequestSort = (event, property) => {
    const { orderBy, order } = this.state
    const isAsc = orderBy === property && order === 'asc';
    this.setState({ order: isAsc ? 'desc' : 'asc', orderBy: property }, () => {
    })
  };

  onFormat = (row, data)=>{

  }
  render() {
    const { anchorEl, order, orderBy } = this.state
    const { filter, onCellClick, data, classes } = this.props
    const dataList = getGroupedData(filter.region, data, this.groupBy)
    return (
      <React.Fragment>
        <TableContainer component={Paper}>
          <Table aria-label="mex chart list" stickyHeader size={'small'}>
            <MTableHead headCells={this.rows} order={order} orderBy={orderBy} actionMenu={this.actionMenu} onRequestSort={this.handleRequestSort} />
            <TableBody>
              {
                Object.keys(dataList).map(key => {
                  let values = dataList[key]
                  return (
                    <React.Fragment key={key}>
                      {this.groupBy && values[0].key.includes(filter.search) ? <TableRow style={{ backgroundColor: '#1d1d26' }} >
                        <TableCell colSpan={this.colLen}><b>{this.groupByFormat(values[0], this.groupBy)}</b></TableCell>
                        {this.groupBy.action ? <ActionButton actionMenu={this.actionMenu} onClick={(e) => { this.actionMenuClick(e, values, true) }} /> : null}
                      </TableRow> : null}
                      {
                        stableSort(values, getComparator(order, orderBy)).map((value, i) => {
                          let visible = value.hidden ? false : true
                          if (visible) {
                            return (value.key.includes(filter.search) ?
                              <TableRow key={i} style={{ backgroundColor: value.selected ? `${value.color}1A` : `transparent` }}>
                                <TableCell onClick={(e) => onCellClick(value)}><Icon style={{ color: value.color }}>{`${value.selected ? 'check_box' : 'check_box_outline_blank'}`}</Icon></TableCell>
                                {this.rows.map((row, j) => (
                                  row.visible ? <TableCell key={j} onClick={(e) => onCellClick(value)}>{row.format ? this.onFormat(row, value) : rowValue(filter, row, value)}</TableCell> : null
                                ))
                                }
                                <ActionButton actionMenu={this.actionMenu} onClick={(e) => { this.actionMenuClick(e, [value], false) }} />
                              </TableRow> : null)
                          }
                        })
                      }
                    </React.Fragment>
                  )
                })
              }
            </TableBody>
          </Table>
        </TableContainer>
        <Action anchorEl={anchorEl} group={this.group} onClose={this.onActionClose} onClick={this.onAcionClick} actionMenu={this.actionMenu} />
      </React.Fragment>
    )
  }
}
export default MonitoringList;