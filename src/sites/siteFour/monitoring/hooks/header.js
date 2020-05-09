import React, { useState } from "react";

const HeaderComponent = (defaultValue: string) => {
    const [value, setValue] = useState(defaultValue);
    const [info, setInfo] = useState(defaultValue.panelInfo)
    const onHandleClick = (a, b) => {
        console.log("20200507 on click ...", a, ":", b)
    }
    console.log("20200507 header info == ", info)
    return (
        <div style={{ position: "relative" }}>
            <div
                className="headerBar react-grid-dragHandleExample"
                style={{
                    width: "100%",
                    height: "30px",
                    backgroundColor: "#4b4b4b",
                    display: "flex",
                    position: "absolute",
                    justifyContent: (info.title.align === "left") ? "flex-start" : "center",
                    alignItems: "center"
                }}
            >
                <div style={{ paddingLeft: 8 }}>{info.title.value}</div>
            </div>
            <div
                style={{
                    width: "130px",
                    height: "25px",
                    borderColor: "#696969",
                    borderWidth: "1px",
                    borderRadius: 2,
                    position: "absolute",
                    display: "flex",
                    justifyContent: "center",
                    alignSelf: "flex-end",
                    alignItems: "center",
                    right: "3px",
                    cursor: "pointer",
                    alignContent: "space-between"
                }}
            >
                <div
                    className="info-button"
                    onClick={() => value.onClick("info", info.title)}
                    style={{ padding: "3px" }}
                >
                    info
                </div>
                <div
                    className="edit-button"
                    onClick={() => value.onClick("edit", info.title)}
                    style={{ padding: "3px" }}
                >
                    edit
                </div>
                <div
                    className="hide-button"
                    onClick={() => value.onPutItem(value.idx)}
                    style={{ padding: "3px" }}
                >
                    close
                </div>
            </div>
        </div>
    );
};
export default HeaderComponent;
