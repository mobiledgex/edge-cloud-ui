import React from "react";
import { Marker } from "react-simple-maps";
import uuid from "uuid";
import { scaleLinear } from "d3-scale";
import styles from "../../../css/worldMapStyles";

const grdColors = ["#000000", "#00CC44", "#88ff00", "#FFEE00", "#FF7700", "#FF0022", "#66CCFF", "#FF78A5", "#fffba7"];
const cityScale = scaleLinear()
    .domain([0, 37843000])
    .range([1, 48]);
const markerSize = [20, 24];

const markerShapePaths = [
    "M 38.875 12.960938 C 37.613281 6.019531 31.59375 0.75 24.351562 0.75 C 18.582031 0.75 13.59375 4.089844 11.160156 8.949219 C 5.210938 9.640625 0.59375 14.738281 0.59375 20.929688 C 0.59375 27.554688 5.875 32.921875 12.414062 32.992188 L 38.183594 32.992188 C 43.664062 32.992188 48.113281 28.496094 48.113281 22.957031 C 48.113281 17.667969 44.035156 13.328125 38.875 12.960938 Z M 38.875 12.960938",
    "M 20.832031 8.332031 L 8.332031 8.332031 C 6.042969 8.332031 4.1875 10.207031 4.1875 12.5 L 4.167969 37.5 C 4.167969 39.792969 6.042969 41.667969 8.332031 41.667969 L 41.667969 41.667969 C 43.957031 41.667969 45.832031 39.792969 45.832031 37.5 L 45.832031 16.667969 C 45.832031 14.375 43.957031 12.5 41.667969 12.5 L 25 12.5 Z M 20.832031 8.332031",
    "M 34.945312 17.558594 C 34.945312 27.097656 17.539062 49.683594 17.539062 49.683594 C 17.539062 49.683594 0.132812 27.097656 0.132812 17.558594 C 0.132812 8.019531 7.921875 0.289062 17.539062 0.289062 C 27.152344 0.289062 34.945312 8.019531 34.945312 17.558594 Z M 34.945312 17.558594"
];

const markerCloudPath = [
    "m 13.77178,1.5591837 c -6.7336566,0 -12.2125963,5.4789397 -12.2125963,12.2125963 0,6.73366 5.4789397,12.212594 12.2125963,12.212594 6.73366,0 12.212594,-5.478934 12.212594,-12.212594 0,-6.7336566 -5.478934,-12.2125963 -12.212594,-12.2125963 z M 19.250719,18.665183 H 8.8783758 c -2.0075512,0 -3.6805048,-1.631133 -3.6805048,-3.638682 0,-2.007551 1.6311313,-3.68051 3.6805048,-3.68051 H 9.0456646 C 9.5893738,9.2547906 11.471453,7.6654816 13.771774,7.6654816 c 2.676731,0 4.893399,2.1748453 4.893399,4.8934034 h 0.627364 c 1.672959,0 3.053146,1.380188 3.053146,3.053152 0,1.672959 -1.380187,3.053146 -3.094974,3.053146 z"
];

// self, city, i, config
const MarkerComponent = defaultProps => {
    const [idx, setIdx] = React.useState(defaultProps.idx);
    const [city, setCity] = React.useState(defaultProps.city);
    const [self, setSelf] = React.useState(defaultProps.self);
    const [config, setConfig] = React.useState(defaultProps.config);
    const [keyName, setKeyName] = React.useState(defaultProps.keyName);

    React.useEffect(() => {
        if (defaultProps.city) setCity(defaultProps.city);
    }, [defaultProps]);

    /** ******************************
    * 
    ********************************* */
    const handleCityClick = () => {
        //
    };

    const handleMoveMk = () => {
        //
    };

    const handleLeaveMk = () => {
        //
    };
    /** ******************************* */
    return (
        // eslint-disable-next-line jsx-a11y/mouse-events-have-key-events
        <Marker
            className="markerTwo"
            key={uuid()}
            coordinates={city.coordinates}
            onClick={handleCityClick}
            onMouseMove={handleMoveMk}
            onMouseLeave={handleLeaveMk}
            style={{}}
        >
            {/* icon cloud circle */}
            <g fill="greenyellow"
                transform="translate(-12 -10) scale(0.8 0.8)"
            >
                <path d={markerCloudPath[0]} />
            </g>
        </Marker>
    );
};

export default MarkerComponent;
