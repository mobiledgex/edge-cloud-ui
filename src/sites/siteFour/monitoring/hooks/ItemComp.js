import React from "react";
import ChartWidget from "../container/ChartWidget";

const ItemComponent = defaultValue => {
    const [item, setItem] = React.useState(defaultValue.item);
    const [panelInfo, setPanelInfo] = React.useState(defaultValue.panelInfo);
    React.useEffect(() => {
        if (defaultValue.item) setItem(defaultValue.item);
    }, [defaultValue]);
    const makeComponent = item => (
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

    return (
        <ChartWidget
            {...item}
            panelInfo={{ legendShow: false }}
        />
    );
};
export default ItemComponent;
