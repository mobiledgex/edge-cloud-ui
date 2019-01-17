/**
 * Created by inkikim on 19/12/2018.
 */

import React from 'react';
import CircularProgress from '../../chartGauge/circularProgress';


class CPUMEMUsage extends React.Component {
    constructor() {
        super();
        this.state = {

        }

    }
    componentDidMount() {

    }
    componentWillReceiveProps(nextProps) {
        if(nextProps.value){
            
        }
    }
    render() {
        return (
            <div className='circular_chart' style={{width:this.props.w, height:this.props.h}}>
                <CircularProgress value={this.props.value} style={{fontSize:this.props.w/6}}/>
                <div className='unit' style={{width:this.props.w, top:this.props.h/1.68, fontSize:this.props.w/6}}>%</div>
                <div className='label' style={this.props.labelStyle}>{this.props.label}</div>
            </div>
        );
    }
}
CPUMEMUsage.defaultProps = {
    label:'CPU/Memory',
    value:Math.random()*100,
    w:90,
    h:90
}
export default CPUMEMUsage;



