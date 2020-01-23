import React from 'react';
import { Grid, Paper, Box} from '@material-ui/core';
import { useStyles } from './terminalOptionsStyle' 


export default function TerminalOptions(props) {
  const classes = useStyles();
  return (
    <div className={classes.layout}>
      <div className={classes.container}>
        <Paper variant="outlined" className={classes.optionBody}>
          <Grid container spacing={3}>
            <Grid item xs={4}>
              <label className={classes.label}>CONTAINER</label>
            </Grid>
            <Grid item xs={8}>
              <select className={classes.cmdLine} onChange={props.onContainerSelect} value={props.containerId}>
                {
                  props.containerIds.map((item, i) => {
                    return <option style={{fontFamily: 'Inconsolata, monospace'}} key={i} value={item}>{item}</option>
                  })
                }
              </select>
            </Grid>
            <Grid item xs={4}>
              <label className={classes.label}>COMMAND</label>
            </Grid>
            <Grid item xs={8}>
              <input value={props.cmd} className={classes.cmdLine}  onChange={props.onCmd} />
            </Grid>
          </Grid>
          <Box display="flex" flexDirection="row-reverse">
            <button className={classes.connect} onClick={props.connect}>CONNECT</button>
          </Box>
        </Paper>
      </div>
    </div>
  );
}
