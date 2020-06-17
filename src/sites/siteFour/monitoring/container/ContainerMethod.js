
import React from "react";
import RateOfMehtods from "../components/RateOfMethods";

const ContainerMethod = defaultProps => {
    const [data, setData] = React.useState([]);
    const [size, setsize] = React.useState({width:90, height:50});

    React.useEffect(() => {
        if (defaultProps.size) setsize({width:(defaultProps.size.width - 20)/3, height:defaultProps.size.height});

        if (defaultProps.data) setData(defaultProps.data)


    }, [defaultProps]);


    return (
        <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <div className="page_monitoring_rate_grid">
                <div className="page_monitoring_rate_grid_item">
                    <RateOfMehtods size={size} data={data} method={{ key: 0 }} />
                </div>
                <div className="page_monitoring_rate_grid_item">
                    <RateOfMehtods size={size} data={data} method={{ key: 1 }} />
                </div>
                <div className="page_monitoring_rate_grid_item">
                    <RateOfMehtods size={size} data={data} method={{ key: 2 }} />
                </div>
            </div>
        </div>
    );
};

export default ContainerMethod;
