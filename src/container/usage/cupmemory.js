/**
 * Created by inkikim on 19/12/2018.
 */

import React from 'react';
import CircularProgress from '../../chartGauge/circularProgress';


class CPUMEMUsage extends React.Component {
    constructor() {
        super();

    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {

    }
    render() {
        return (
            <div className='circular_chart' style={{width:this.props.w, height:this.props.h}}>
                <CircularProgress value={this.props.value}/>
                <div className='label' style={this.props.labelStyle}>{this.props.label}</div>
            </div>
        );
    }
}
CPUMEMUsage.defaultProps = {
    label:'CPU/Memory',
    value:10,
    w:90,
    h:90
}
export default CPUMEMUsage;



