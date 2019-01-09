import React, { Component } from 'react';
import * as d3 from 'd3';
class GradientSVG extends Component {
    render() {
        let { startColor, endColor, middleColor, idCSS, rotation } = this.props;

        let gradientTransform = `rotate(${rotation})`;

        return (
            <svg style={{ height: 0 }}>
                <defs>
                    <linearGradient id={idCSS} gradientTransform={gradientTransform}>
                        <stop offset="0%" stopColor={startColor} />
                        <stop offset="50%" stopColor={middleColor} />
                        <stop offset="100%" stopColor={endColor} />
                    </linearGradient>
                </defs>
            </svg>
        );
    }
}

export default GradientSVG;