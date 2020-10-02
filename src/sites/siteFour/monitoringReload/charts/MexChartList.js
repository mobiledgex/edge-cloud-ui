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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

export default function BasicTable(props) {
  const classes = useStyles();

  const data = props.data
  const rows = props.rows

  const validateRegionFilter = (region) => {
    let regionFilter = props.filter.region
    return regionFilter.includes(region)
  }

  const handleClick = (region, value, index) => {
    props.onRowClick(region, value, index)
  }

  const rowValue = (row, value) => {
    let data = value[row.field]
    if (data && row.isArray) {
      return data[props.filter.summary.position]
    } 
    else {
      return data? data : '-'
    }
  }

  return (
    <TableContainer component={Paper} style={{ height: 200, overflow: 'auto' }}>
      <Table className={classes.table} aria-label="simple table" stickyHeader size={'small'}>
        <TableHead>
          <TableRow>
            <TableCell style={{backgroundColor:'#292c33'}}></TableCell>
            {rows.map((row, i) => {
              return <TableCell key={i} style={{backgroundColor:'#292c33'}}>{row.label}</TableCell>
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(data).map(region => {
            let values = data[region]
            return validateRegionFilter(region) ?
              values.map((value, i) => (
                value.key.includes(props.filter.search) ?
                  <TableRow key={i} onClick={(event) => handleClick(region, value, i)}>
                    <TableCell><Icon style={{ color: value.color }} name={`${value.selected ? 'line graph' : 'circle'}`} /></TableCell>
                    {rows.map((row, j) => (
                      <TableCell key={j}>{rowValue(row, value)}</TableCell>
                    ))
                    }
                  </TableRow> : null
              )) : null
          })}

        </TableBody>
      </Table>
    </TableContainer>
  );
}