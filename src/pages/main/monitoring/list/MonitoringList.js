import React from 'react';
import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow, Paper, Grow, Popper, ClickAwayListener, MenuList, MenuItem } from '@material-ui/core'
import { Icon } from '../../../../hoc/mexui';
import { lightGreen } from '@material-ui/core/colors';
import { monitoringActions } from '../helper/Constant';

const Action = (props) => {
  const { anchorEl, onClose, actionMenu, onClick, group } = props
  return (
    <React.Fragment>
      <Popper open={Boolean(anchorEl)} anchorEl={anchorEl} role={undefined} transition disablePortal style={{ zIndex: 1 }}>
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
                      const visible = group ? action.group : true
                      return visible ? <MenuItem key={i} onClick={(e) => { onClick(e, action) }}>{action.label}</MenuItem> : null
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

const getGroupedData = (rows, groupBy) => {
  let dataList = []
  Object.keys(rows).forEach(key => {
    let regionData = rows[key]
    let dataKeys = Object.keys(regionData)
    if (dataKeys.length > 0) {
      dataList = dataKeys.map(dataKey => {
        return { ...regionData[dataKey], key: dataKey }
      })
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
  return {'all' : dataList}
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
class MonitoringList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      anchorEl: null
    }
    const filter = props.filter
    this.rows = filter.parent.metricListKeys
    this.groupBy = filter.parent.groupBy
    this.colLen = this.rows.filter(row => (row.visible)).length + 1 + (this.groupBy.action ? 0 : 1)
    this.actionMenu = monitoringActions(props.id)
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

  render() {
    const { anchorEl } = this.state
    const { filter, onCellClick, data } = this.props
    const dataList = getGroupedData(data, this.groupBy)
    return (
      <React.Fragment>
        <TableContainer component={Paper}>
          <Table aria-label="mex chart list" stickyHeader size={'small'}>
            <TableHead>
              <TableRow>
                <TableCell style={{ backgroundColor: '#292c33' }}></TableCell>
                {this.rows.map((row, i) => {
                  return row.visible ? <TableCell key={i} style={{ backgroundColor: '#292c33' }}>{row.label}</TableCell> : null
                })}
                {this.actionMenu && this.actionMenu.length > 0 ? <TableCell style={{ backgroundColor: '#292c33' }}>Actions</TableCell> : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {Object.keys(dataList).map(key => {
                let values = dataList[key]
                return (
                  <React.Fragment key={key}>
                    {this.groupBy && values[0].key.includes(filter.search) ? <TableRow style={{ backgroundColor: '#1d1d26' }} >
                      <TableCell colSpan={this.colLen}><b>{this.groupByFormat(values[0], this.groupBy)}</b></TableCell>
                      {this.groupBy.action ? <ActionButton actionMenu={this.actionMenu} onClick={(e) => { this.actionMenuClick(e, values, true) }} /> : null}
                    </TableRow> : null}
                    {
                      values.map((value, i) => {
                        let visible = value.hidden ? false : true
                        if (visible) {
                          return (value.key.includes(filter.search) ?
                            <TableRow key={i} style={{ backgroundColor: value.selected ? `${value.color}1A` : `transparent` }}>
                              <TableCell onClick={(e) => onCellClick(value)}><Icon style={{ color: value.color }}>{`${value.selected ? 'check_box' : 'check_box_outline_blank'}`}</Icon></TableCell>
                              {this.rows.map((row, j) => (
                                row.visible ? <TableCell key={j} onClick={(e) => onCellClick(value)}>{rowValue(filter, row, value)}</TableCell> : null
                              ))
                              }
                              <ActionButton actionMenu={this.actionMenu} onClick={(e) => { this.actionMenuClick(e, [value], false) }} />
                            </TableRow> : null)
                        }
                      })
                    }
                  </React.Fragment>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Action anchorEl={anchorEl} group={this.group} onClose={this.onActionClose} onClick={this.onAcionClick} actionMenu={this.actionMenu} />
      </React.Fragment>
    )
  }
}
export default MonitoringList