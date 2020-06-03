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

const markerFlagPath = [
    "M 49.079712,2.9796334 C 34.921008,-7.2263031 20.764661,12.622368 6.6060855,5.7193432 V 4.2509015 c 0,-1.8237198 -1.4795849,-3.30330466 -3.3031739,-3.30330466 C 1.4793226,0.94759684 0,2.4271817 0,4.2509015 V 61.108987 c 0,1.823458 1.4793226,3.303042 3.3029116,3.303042 1.823589,0 3.3031739,-1.479584 3.3031739,-3.303042 V 37.021489 C 20.063542,43.580378 33.521261,25.974552 46.981079,32.980882 c 0.621277,0.324734 1.367756,0.303233 1.967402,-0.06253 0.600171,-0.363275 0.965808,-1.012741 0.965808,-1.716086 0,-8.863876 0,-17.728275 0,-26.5946405 -1.3e-4,-0.6427792 -0.312276,-1.2517346 -0.834577,-1.627989 z"
];

// self, city, i, config
const MarkerClient = defaultProps => {
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

            {/* flag */}
            <g fill="greenyellow"
                transform="translate(0 0) scale(0.3 0.3)"
            >
                <path d={markerFlagPath[0]} />
            </g>
        </Marker>
    );
};

export default MarkerClient;
