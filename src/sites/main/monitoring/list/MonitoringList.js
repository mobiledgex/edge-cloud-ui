import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Icon } from 'semantic-ui-react';
import { Collapse } from '@material-ui/core';
import ListToolbar from './MonitoringListToolbar'
import { monitoringActions } from '../helper/Constant';
import { appMetricsListKeys, customData } from '../../../../services/model/appMetrics';
import { fields } from '../../../../services/model/format';

const hidden = [fields.cloudletName, fields.healthCheck, fields.cloudletLocation]
const MexTable = (props) => {
  const { rows, data, filter, validateRegionFilter, onCellClick, header } = props
  const [selected, setSelected] = React.useState(null)

  const onRowClick = (region, value, key) => {
    let subData = value.subData
    if (selected && selected.key === key) {
      setSelected(null)
    }
    else if (subData['appinst']) {
      let subRows = appMetricsListKeys
      subRows.forEach(row => {
        row.visible = hidden.includes(row.field) ? false : row.visible
      })
      setSelected({ key, rows: subRows, data: { 'EU': subData['appinst'] } })
    }
    onCellClick(region, value, key)
  }

  const rowValue = (row, value) => {
    // let customData = props.filter.parent.customData
    let data = value[row.field]
    if (data && row.isArray) {
      return data[props.filter.summary.position]
    }
    else {
      return data ? row.customData ? customData(row.field, value) : data : '-'
    }
  }


  return (
    <TableContainer component={Paper} style={{ height: 170, overflow: 'auto' }}>
      <Table aria-label="mex chart list" stickyHeader size={'small'}>
        <TableHead>
          <TableRow>
            <TableCell style={{ backgroundColor: '#292c33' }}></TableCell>
            {rows.map((row, i) => {
              return row.visible ? <TableCell key={i} style={{ backgroundColor: '#292c33' }}>{row.label}</TableCell> : null
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(data).map(region => {
            let values = data[region]
            let valueKeys = Object.keys(values)
            return validateRegionFilter(region) && valueKeys.length > 0 ?
              <React.Fragment key={region}>
                {header ? null : <TableRow>
                  <TableCell colSpan={'100%'}><b>{`Region: ${region}`}</b></TableCell>
                </TableRow>}
                {valueKeys.map((key, i) => {
                  let value = values[key]
                  let visible = value.hidden ? false : true
                  if (visible) {
                    return (key.includes(filter.search) ?
                      <React.Fragment key={i}>
                        <TableRow style={{ backgroundColor: value.selected ? `${value.color}1A` : `transparent` }}>
                          <TableCell onClick={(event) => onRowClick(region, value, key)}>
                            <Icon style={{ color: value.color }} name={`${value.subData ? selected ? 'chevron up' : 'chevron right' : 'circle'}`} />
                          </TableCell>
                          {rows.map((row, j) => (
                            row.visible ? <TableCell key={j} onClick={(event) => onRowClick(region, value, key)}>{rowValue(row, value)}</TableCell> : null
                          ))
                          }
                        </TableRow>

                        {selected && selected.key === key ?
                          <TableRow>
                            <TableCell colSpan="100%">
                              <MexTable header={true} rows={selected.rows} data={selected.data} validateRegionFilter={validateRegionFilter} onCellClick={onCellClick} filter={filter} />
                            </TableCell>
                          </TableRow>
                          : null}

                      </React.Fragment> : null)
                  }
                })}
              </React.Fragment> : null
          })}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
const MexChartList = (props) => {
  const data = props.data
  const rows = props.filter.parent.metricListKeys
  const actions = monitoringActions(props.filter.parent.id)

  const validateRegionFilter = (region) => {
    let regionFilter = props.filter.region
    return regionFilter.includes(region)
  }

  const onCellClick = (region, value, key) => {
    props.onCellClick(region, value, key)
  }

  const onToolbar = (action) => {
    props.onToolbarClick(action)
  }


  return (
    <Collapse in={!props.minimize}>
      {props.rowSelected === 1 && actions && actions.length > 0 ? <ListToolbar actions={actions} click={onToolbar} /> : null}
      <MexTable rows={rows} data={data} validateRegionFilter={validateRegionFilter} onCellClick={onCellClick} filter={props.filter} />
    </Collapse>
  );
}
export default MexChartList