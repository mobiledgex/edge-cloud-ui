import React from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import GradientSVG from './gradientSVG';
import 'react-circular-progressbar/dist/styles.css';
import './styles.css';

class CircularProgress extends React.Component {
    constructor() {
        super();
        this.state = {
            vWidth: 600,
            vHeight: 300
        }
    }
    componentDidMount() {

    }

    render() {
        const percentage = this.props.value;
        const grdColors = ['#ff0000', '#ffff00', '#00ff00']
        return (
            <div className='circular_outer'>
                <CircularProgressbar
                    percentage={percentage}
                    text={`${percentage}`}
                    styles={{
                        path: { stroke: `rgba(62, 152, 199, ${percentage})` }
                    }}
                >

                </CircularProgressbar>
                <GradientSVG startColor={grdColors[0]} middleColor={grdColors[1]} endColor={grdColors[2]} idCSS="gradientTwo" rotation={0}/>
            </div>
        );
    }
}
CircularProgress.defaultProps = {
        value: Math.random() * 100
}
export default CircularProgress;

