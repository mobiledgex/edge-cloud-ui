import React, { useState } from "react";
import MoreIcon from '@material-ui/icons/More';
import CropFreeIcon from '@material-ui/icons/CropFree';
import DeleteIcon from '@material-ui/icons/Delete';

const HeaderComponent = (defaultValue) => {
    const [value, setValue] = useState(defaultValue);
    const [info, setInfo] = useState(defaultValue.panelInfo);
    const onHandleClick = (a, b) => {
        console.log("20200507 on click ...", a, ":", b)
    };
    return (
        <div className='page_monitoring_title_area'>
            <div className='page_monitoring_title_row'>
                <div className="page_monitoring_title_label"
                     id="react-grid-dragHandleExample"
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
                    {info.legend &&
                    <div
                        onClick={() => value.onClick("info", info.title)}
                    >
                        <MoreIcon fontSize={'small'} />
                    </div>
                    }
                    {/* 기능추가 될 부분
                    <div
                        onClick={() => value.onClick("edit", info.title)}
                    >
                        <CropFreeIcon fontSize={'small'} />
                    </div>
                    <div
                        onClick={() => value.onPutItem(value.idx)}
                    >
                        <DeleteIcon fontSize={'small'} />
                    </div>
                    */}
                </div>
            </div>
        </div>
    );
};
export default HeaderComponent;
