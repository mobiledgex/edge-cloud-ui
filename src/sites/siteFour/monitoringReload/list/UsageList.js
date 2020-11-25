import React from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { Box, Collapse, IconButton, Toolbar } from '@material-ui/core';
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';



const MexUsageList = (props) => {
  const [minimize, setMinimize] = React.useState(false)
  const dataList = props.data
  const dataExist = Object.keys(dataList).length > 0
  const rows = props.keys
  const header = props.header

  const validateRegionFilter = (region) => {
    let regionFilter = props.filter.region
    return regionFilter.includes(region)
  }

  const onCellClick = (region, value, key) => {
    props.onCellClick(region, value, key)
  }

  const rowValue = (row, value) => {
    return value[row.serverField]
  }

  const renderToolbar = () => (
    <Toolbar style={{marginLeft:-15}}>
      <h3 style={{width:300}}>{header}</h3>
      {
        <div style={{ width: '100%' }}>
          <Box display="flex" justifyContent="flex-end">
            <Box>
              <IconButton size="small" onClick={() => { setMinimize(!minimize) }}><IndeterminateCheckBoxOutlinedIcon style={{ color: 'rgba(118, 255, 3, 0.7)' }}/></IconButton></Box>
          </Box>
        </div>
      }
    </Toolbar>
  )

  return (
    <div>
      {renderToolbar()}
      <div>
        <Collapse in={!minimize}>
          {dataExist ? <TableContainer component={Paper} style={{ height: 170, overflow: 'auto' }}>
            <Table aria-label="mex chart list" stickyHeader size={'small'}>
              <TableHead>
                <TableRow>
                  {rows.map((row, i) => {
                    return <TableCell key={i} style={{ backgroundColor: '#292c33' }}>{row.label}</TableCell>
                  })}
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.keys(dataList).map(region => {
                  return dataList[region].map((value, i) => {
                    return (
                      <TableRow key={i}>
                        {rows.map((row, j) => (
                          <TableCell key={j} onClick={(event) => onCellClick(region, value, key)}>{rowValue(row, value)}</TableCell>
                        ))
                        }
                      </TableRow>)
                  })
                })}
              </TableBody>
            </Table>
          </TableContainer> :
            <div align="center"><h3 style={{ marginTop: '5vh', minHeight: 170 }}><b>No Data</b></h3></div>}
        </Collapse>
      </div>
    </div>
  );
}
export default MexUsageList