import React from "react";
import ChartWidget from "../container/ChartWidget";

const ItemComponent = defaultValue => {
    const [item, setItem] = React.useState();
    React.useEffect(() => {
        console.log("20200610 request defaultValue.item =", defaultValue.item, ":", item);
        if (defaultValue.item !== item) setItem(defaultValue.item);
    }, [defaultValue.item]);

    return (
        <ChartWidget
            {...item}
        />
    );
};
export default ItemComponent;
