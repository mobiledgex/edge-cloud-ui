import React, { useState } from "react";

const HeaderComponent = (defaultValue) => {
    const [value, setValue] = useState(defaultValue);
    const [info, setInfo] = useState(defaultValue.panelInfo);
    const onHandleClick = (a, b) => {
        console.log("20200507 on click ...", a, ":", b)
    };
    return (
        <div className='page_monitoring_title_area'>
            <div className='page_monitoring_title_row'>
                <div className='page_monitoring_title_label'
                    // className="headerBar react-grid-dragHandleExample"
                    // style={{
                    //     width: "100%",
                    //     height: "30px",
                    //     backgroundColor: "#4b4b4b",
                    //     display: "flex",
                    //     position: "absolute",
                    //     justifyContent: (info.title.align === "left") ? "flex-start" : "center",
                    //     alignItems: "center"
                    // }}
                >
                    {info.title.value}
                </div>
                <div className='page_monitoring_title_button'>
                    <div
                        onClick={() => value.onClick("info", info.title)}
                    >
                        info
                    </div>
                    <div
                        onClick={() => value.onClick("edit", info.title)}
                    >
                        edit
                    </div>
                    <div
                        onClick={() => value.onPutItem(value.idx)}
                    >
                        close
                    </div>
                </div>
            </div>
        </div>
    );
};
export default HeaderComponent;
