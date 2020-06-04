
import React from "react";
import RateOfMehtods from "../components/RateOfMethods";

const ContainerMethod = defaultProps => {
    const [data, setData] = React.useState({ key: "Register", value: 20 });
    return (
        <div style={{ width: "100%", height: "100%", overflow: "auto" }}>
            <div className="page-monitoring_circle-chart">
                <div className="page-monitoring_circle-chart_item">
                    <RateOfMehtods data={data} method={key: 0}/>
                </div>
                <div className="page-monitoring_circle-chart_item">
                    <RateOfMehtods data={data} method={key: 1}/>
                </div>
                <div className="page-monitoring_circle-chart_item">
                    <RateOfMehtods data={data} method={key: 2}/>
                </div>
            </div>
        </div>
    );
};

export default ContainerMethod;
