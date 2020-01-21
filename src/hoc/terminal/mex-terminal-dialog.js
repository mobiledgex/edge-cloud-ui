
import React, { useState, createRef } from 'react';
import { Dialog, DialogContent, DialogContentText, Box, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import { useStyles } from './terminalStyle'

const MexTerminal = (props) => {

    const [cmd, setCmd] = useState('');
    let cmdInput = createRef();
    const classes = useStyles();

    const onEnter = (event) => {
        if (event.key === 'Enter') {
            props.onEnter(cmd);
            setCmd('')
        }
    }

    const onCmdChange = (event) => {
        setCmd(event.target.value)
    }

    const onTerminal = () => {
        cmdInput.current.focus();
    }

    return (
        <div>
            {
                <Dialog open={props.open} onClose={props.close} className={classes.terminal}>
                    <div className={classes.terminalHead}>
                        <Box className={classes.close} display="flex">
                            <Box textAlign="left" flexGrow={1} style={{ fontWeight: 500, margin: 8 }}>Mex Terminal</Box>
                            <Box textAlign="right"><Button onClick={props.close} className={classes.close}><CloseIcon fontSize="small" /></Button></Box>
                        </Box>
                    </div>
                    <DialogContent onClick={onTerminal} className={classes.terminalBody}>
                        {
                            props.history ?
                                props.history.map((info, i) => {
                                    return <DialogContentText key={i} className={classes.history}>{info}</DialogContentText>
                                }) :
                                null
                        }
                        <div className={classes.cmdHead}>
                            <span className={classes.cmdPath} id="path">
                                {'\n' + props.path}
                            </span>
                            <input ref={cmdInput} autoComplete='off' value={cmd} onChange={onCmdChange} onKeyPress={onEnter} className={classes.cmdInput} type="text" id="input" autoFocus={true} />>
                        </div>
                    </DialogContent>
                </Dialog>}
        </div>)
}

export default MexTerminal;