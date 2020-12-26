import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Icon } from 'semantic-ui-react';
import { Collapse } from '@material-ui/core';

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const MexChartList = (props) => {
  const classes = useStyles();

  const data = props.data
  const rows = props.filter.parent.metricListKeys

  const validateRegionFilter = (region) => {
    let regionFilter = props.filter.region
    return regionFilter.includes(region)
  }

  const onCellClick = (region, value, key) => {
    props.onCellClick(region, value, key)
  }

  const rowValue = (row, value) => {
    let customData = props.filter.parent.customData
    let data = value[row.field]
    if (data && row.isArray) {
      return data[props.filter.summary.position]
    }
    else {
      return data ? row.customData ? customData(row.field, value) : data : '-'
    }
  }

  return (
    <Collapse in={!props.minimize}>
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
                  <TableRow>
                    <TableCell colSpan={'100%'}><b>{`Region: ${region}`}</b></TableCell>
                  </TableRow>
                  {valueKeys.map((key, i) => {
                    let value = values[key]
                    let visible = value.hidden ? false : true
                    if (visible) {
                      return (key.includes(props.filter.search) ?
                        <TableRow key={i}>
                          <TableCell onClick={(event) => onCellClick(region, value, key)}><Icon style={{ color: value.color }} name={`${value.selected ? 'line graph' : 'circle'}`} /></TableCell>
                          {rows.map((row, j) => (
                            row.visible ? <TableCell key={j} onClick={(event) => onCellClick(region, value, key)}>{rowValue(row, value)}</TableCell> : null
                          ))
                          }
                        </TableRow> : null)
                    }
                  })}
                </React.Fragment> : null
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Collapse>
  );
}
export default MexChartList