import React from 'react';
import ProgressBarGradient from '../charts/progressBarGradient';
import { Grid } from 'semantic-ui-react';
import './networkTrafficIO.css';

class NetworkTrafficIOLabel extends React.PureComponent {
    makeRow = (obj) => (
        <div><div className="traffic_label">{obj.label}</div></div>
    )
    render() {
        return (
            <div>
                {this.makeRow(this.props.data)}
            </div>
        )
    }
}
NetworkTrafficIOLabel.defaultProps = {
    data: []
}
export default NetworkTrafficIOLabel;