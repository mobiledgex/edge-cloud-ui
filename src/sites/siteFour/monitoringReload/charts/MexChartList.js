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

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

const MexChartList = (props) => {
  const classes = useStyles();

  const data = props.data
  const rows = props.rows

  const validateRegionFilter = (region) => {
    let regionFilter = props.filter.region
    return regionFilter.includes(region)
  }

  const handleClick = (region, value, key) => {
    props.onRowClick(region, value, key)
  }

  const rowValue = (row, value) => {
    let data = value[row.field]
    if (data && row.isArray) {
      return data[props.filter.summary.position]
    }
    else {
      return data ? data : '-'
    }
  }

  return (
    <TableContainer component={Paper} style={{ height: 200, overflow: 'auto' }}>
      <Table aria-label="mex chart list" stickyHeader size={'small'}>
        <TableHead>
          <TableRow>
            <TableCell style={{ backgroundColor: '#292c33' }}></TableCell>
            {rows.map((row, i) => {
              return <TableCell key={i} style={{ backgroundColor: '#292c33' }}>{row.label}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(data).map(region => {
            let values = data[region]
            return validateRegionFilter(region) ?
              Object.keys(values).map((key, i) => {
                let value = values[key]
                return (key.includes(props.filter.search) ?
                  <TableRow key={i} onClick={(event) => handleClick(region, value, key)}>
                    <TableCell><Icon style={{ color: value.color }} name={`${value.selected ? 'line graph' : 'circle'}`} /></TableCell>
                    {rows.map((row, j) => (
                      <TableCell key={j}>{rowValue(row, value)}</TableCell>
                    ))
                    }
                  </TableRow> : null)
              }) : null
          })}

        </TableBody>
      </Table>
    </TableContainer>
  );
}
export default MexChartList