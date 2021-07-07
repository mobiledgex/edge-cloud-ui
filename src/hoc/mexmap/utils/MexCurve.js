import React from 'react';
import { withLeaflet } from 'react-leaflet'
import { Curve } from 'react-leaflet-curve'

//mid point of the curve
const calculateControlPoint = (dataList) => {
    let latlngs = [];
    dataList.forEach(data => {
        let src = data[0]
        for (let i = 1; i < data.length; i++) {
            let dst = data[i]

            let offsetX = dst[1] - src[1],
                offsetY = dst[0] - src[0];

            let r = Math.sqrt(Math.pow(offsetX, 2) + Math.pow(offsetY, 2)),
                theta = Math.atan2(offsetY, offsetX);

            let thetaOffset = (3.14 / 10);

            let r2 = (r / 2) / (Math.cos(thetaOffset)),
                theta2 = theta + thetaOffset;

            let midpointX = (r2 * Math.cos(theta2)) + src[1],
                midpointY = (r2 * Math.sin(theta2)) + src[0];

            let midpoint = [midpointY, midpointX];

            latlngs = [...latlngs, 'M', src, 'Q', midpoint, dst];
        }
    })

    return latlngs
}

const CurveLeaflet = withLeaflet(Curve)

class MexCurve extends React.Component {

    constructor(props) {
        super(props)
        {

        }
    }
    //animate: {duration: 1000, iterations: Infinity, delay: 1000} }
    render() { 
        const {option} = this.props
        return <CurveLeaflet positions={calculateControlPoint(this.props.data)} option={option ? option : { color: this.props.color, fill: false, dashArray:'10'}}/> 
    }
}

export default MexCurve