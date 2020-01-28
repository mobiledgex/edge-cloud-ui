
import React, { useState, createRef } from 'react';
import { useStyles } from './mexTerminalStyle';

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
        <div onClick={onTerminal} className={classes.terminalBody}>
            {
                props.history ?
                    props.history.map((info, i) => {
                        return <p key={i} className={classes.history}>{info}</p>
                    }) :
                    null
            }
            <div className={classes.cmdHead}>
                <span className={classes.cmdPath} id="path">
                    {'\n' + props.path}
                </span>
                <input ref={cmdInput} autoComplete='off' value={cmd} onChange={onCmdChange} onKeyPress={onEnter} className={classes.cmdInput} type="text" id="input" autoFocus={true} />
            </div>
        </div>)
}

export default MexTerminal;