import React from "react";
import { CircleProgress } from "react-gradient-progress";

/**
* Let's go https://codesandbox.io/s/vymm4oln6y
* */

const GradientProgress = defaultProps => {
    const [percentage, setPercentage] = React.useState(0);

    React.useEffect(() => {
        if (defaultProps.data) setPercentage(defaultProps.data);
    }, [defaultProps]);

    return (
        <CircleProgress style={{ width: "100%", height: "100%" }} percentage={90} strokeWidth={8} secondaryColor="#f0f0f0" />
    );
};
export default GradientProgress;
