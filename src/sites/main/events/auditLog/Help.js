import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

const Help = (props) => {

    
    const renderHelp = () => {
        return (
            <div>
                <ul style={{ fontSize: 13 }}>
                    {props.data.map((help, i) => (
                        <li key={i} style={{marginBottom:5}}>
                            {help}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <React.Fragment>
            <Tooltip title={renderHelp()}>
                <IconButton>
                    <InfoOutlinedIcon fontSize={'small'} style={props.style}/>
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )
}

export default Help