import React from "react";
import ChartWidget from "../container/ChartWidget";

const ItemComponent = defaultValue => {
    const [item, setItem] = React.useState(defaultValue.item);
    const [panelInfo, setPanelInfo] = React.useState(defaultValue.panelInfo);

    return (
        <ChartWidget
            id={item.id}
            title={item.title}
            filter={item.filter}
            method={item.method}
            chartType={item.chartType}
            type={item.type}
            size={item.sizeInfo}
            cloudlets={item.cloudlets}
            appinsts={item.appinsts}
            clusters={item.clusters}
            page={item.page}
            itemCount={item.itemCount}
            legend={item.legend}
        />
    );
};
export default ItemComponent;
