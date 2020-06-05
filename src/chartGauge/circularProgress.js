import React from "react";
import {
    CircularProgressbar,
    CircularProgressbarWithChildren,
    buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import "./styles.css";

/**
* Let's go https://github.com/kevinsqi/react-circular-progressbar
* https://codesandbox.io/s/vymm4oln6y
* */

const CircularProgress = defaultProps => {
    const [percentage, setPercentage] = React.useState(0);

    React.useEffect(() => {
        if (defaultProps.data) setPercentage(defaultProps.data);
    }, [defaultProps]);

    return (
        <CircularProgressbarWithChildren
            value={percentage}
            strokeWidth={20}
            // text={`${percentage}%`}
            styles={{
                // Customize the root svg element
                root: {},
                // Customize the path, i.e. the "completed progress"
                path: {
                    // Path color
                    stroke: `#6498FF`,
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'butt',
                    // Customize transition animation
                    transition: 'stroke-dashoffset 0.5s ease 0s',
                    // Rotate the path
                    transform: 'rotate(0turn)',
                    transformOrigin: 'center center',
                },
                // Customize the circle behind the path, i.e. the "total progress"
                trail: {
                    // Trail color
                    stroke: '#fff',
                    // Whether to use rounded or flat corners on the ends - can use 'butt' or 'round'
                    strokeLinecap: 'butt',
                    // Rotate the trail
                    transform: 'rotate(0turn)',
                    transformOrigin: 'center center',
                },
                // Customize the text
                text: {
                    // Text color
                    fill: 'fff',
                    // Text size
                    fontSize: '16px',
                },
                // Customize background - only used when the `background` prop is true
                background: {
                },
            }}
        >
            <div style={{ fontSize: 18, marginTop: 0 }}>
                <p>{`${percentage}%`}</p>
            </div>
        </CircularProgressbarWithChildren>
    );
};
export default CircularProgress;
