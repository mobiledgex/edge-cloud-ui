
import React, { useState, createRef } from 'react';
import { useStyles } from './mexTerminalStyle';
import Ansi from "ansi-to-react";

const MexTerminal = (props) => {

    const [cmd, setCmd] = useState('');
    let cmdInput = createRef();
    const classes = useStyles();

    //TODO function to support tab yet to be implemented
    const onKeyDown = (e) =>{
        // var keyCode = e.keyCode || e.which;
        // if (keyCode === 9) { 
        //     e.preventDefault()
        //     props.onEnter(cmd + '\t');
        //     setCmd('')
        // }
    }
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
        if (cmdInput && cmdInput.current) {
            cmdInput.current.focus();
        }
    }

    return (
            <div onClick={onTerminal} className={classes.terminalBody}>
                <div style={{ maxHeight: '90%', overflow: 'auto' }}>
                    {
                        props.history ?
                            props.history.map((info, i) => {
                                return <p key={i} className={classes.history} style={{display:'inline'}}><Ansi>{info}</Ansi></p>
                            }) :
                            null
                    }
                    {
                        props.editable ? 
                            <input style={{display:'inline'}} ref={cmdInput} autoComplete='off' value={cmd} onChange={onCmdChange} onKeyPress={onEnter} onKeyDown={onKeyDown} className={classes.cmdInput} type="text" id="input" autoFocus={true} /> : 
                            null
                    }
                </div>
            </div>
    )
}

export default MexTerminal;