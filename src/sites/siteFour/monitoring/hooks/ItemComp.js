import React from "react";
import ChartWidget from "../container/ChartWidget";

const ItemComponent = defaultValue => {
    const [item, setItem] = React.useState();
    React.useEffect(() => {
        if (defaultValue.item !== item) setItem(defaultValue.item);
    }, [defaultValue.item]);

    return (
        <ChartWidget
            {...item}
        />
    );
};
export default ItemComponent;
