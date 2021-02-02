import React from 'react';
import { IconButton, Tooltip } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import FilterListRoundedIcon from '@material-ui/icons/FilterListRounded';

const Help = (props) => {

    const handleClick = (e) => {
        setAnchorEl(e.currentTarget);
    };

    const auditHelp = [
        <p>By default audit/event log provides current logs with default limit of 25 which is refreshed at a fixed interval</p>,
        <p>Click on <FilterListRoundedIcon style={{ verticalAlign: -6 }} />  icon to fetch specific data</p>,
        <p>If startime is greater than endtime, starttime date will be changed to previous day</p>,
        <p>Maximum 24 hours data can be fetched</p>
    ]

    const renderHelp = () => {
        return (
            <div>
                <ul style={{ fontSize: 13 }}>
                    {auditHelp.map((help, i) => (
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
                <IconButton onClick={handleClick}>
                    <InfoOutlinedIcon fontSize={'small'} />
                </IconButton>
            </Tooltip>
        </React.Fragment>
    )
}

export default Help