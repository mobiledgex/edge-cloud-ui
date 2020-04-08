import React, { useState } from "react";

const HeaderComponent = (defaultValue: string) => {
    const [value, setValue] = useState(defaultValue);
    function changeValue(e) {
        setValue(e.target.value);
    }
    return (
        <div
            className="headerBar react-grid-dragHandleExample"
            style={{
                width: "100%",
                height: "38px",
                backgroundColor: "#4b4b4b"
            }}
        >
            <div>{value.defaultProps}</div>
        </div>
    );
};
export default HeaderComponent;
