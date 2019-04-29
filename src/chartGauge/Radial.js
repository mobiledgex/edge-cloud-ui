import React, { Component } from 'react';
import * as d3 from "d3";

class Radial extends Component {
    static propTypes = {
        width: 100,
        height: 100,
        innerRadius: 10,
        outerRadius: 15,
        startAngle: 0,
        endAngle: 300,
        transform: '0 0 10 10'
    };

    render() {

        const arc = d3.arc()
            .innerRadius(this.props.innerRadius)
            .outerRadius(this.props.outerRadius)
            .startAngle(this.props.startAngle)
            .endAngle(this.props.endAngle);

        return (
            <g transform={this.props.transform}>
                <path d={arc()} {...this.props}/>
            </g>
        );
    }
}

export default Radial;