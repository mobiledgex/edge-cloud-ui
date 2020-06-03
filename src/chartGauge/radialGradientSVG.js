import React, { Component } from "react";

const RadialGradientSVG = defaultProps => {
    const {
        startColor, endColor, middleColor, idCSS, rotation
    } = defaultProps;

    const gradientTransform = `rotate(${rotation})`;

    return (
        <svg height="0" width="0" className={idCSS}>
            <defs>
                <radialGradient id={idCSS} cx="50%" cy="50%" r="50%" fx="50%" fy="50%" gradientTransform={gradientTransform}>
                    <stop offset="0%" stopColor={startColor} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={endColor} stopOpacity={1} />
                </radialGradient>
            </defs>
        </svg>
    );
};


export default RadialGradientSVG;
