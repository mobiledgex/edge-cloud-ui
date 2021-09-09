import React from 'react';
import { Icon, IconButton } from '../../../../hoc/mexui';

const Help = (props) => {
    const { style, className, color } = props

    const renderHelp = () => {
        return (
            <div>
                <ul style={{ fontSize: 13 }}>
                    {props.data.map((help, i) => (
                        <li key={i} style={{ marginBottom: 5 }}>
                            {help}
                        </li>
                    ))}
                </ul>
            </div>
        )
    }

    return (
        <React.Fragment>
            <IconButton style={style} className={className} tooltip={renderHelp()}>
                <Icon outlined={true} style={{ color }}>info_out</Icon>
            </IconButton>
        </React.Fragment>
    )
}

export default Help