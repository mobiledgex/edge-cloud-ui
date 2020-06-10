import React from "react";
import ChartWidget from "../container/ChartWidget";

const ItemComponent = defaultValue => {
    const [item, setItem] = React.useState(defaultValue.item);
    const [panelInfo, setPanelInfo] = React.useState(defaultValue.panelInfo);
    React.useEffect(() => {
        console.log("20200610 defaultValue.item =", defaultValue.item);
        if (defaultValue.item) setItem(defaultValue.item);
    }, [defaultValue]);

    return (
        <ChartWidget
            {...item}
            panelInfo={{ legendShow: false }}
        />
    );
};
export default ItemComponent;
