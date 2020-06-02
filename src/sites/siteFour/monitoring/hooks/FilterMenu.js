import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Popper from "@material-ui/core/Popper";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import RoomIcon from "@material-ui/icons/Room";
import { Dropdown } from "semantic-ui-react";

export default function FilterMenu(defaultProps) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [regionOptions, setRegionOptions] = React.useState(null);
    const [cloudletOptions, setCloudletOptions] = React.useState(null);
    const [clusterOptions, setClusterOptions] = React.useState(null);
    const [appinstOptions, setAppinstOptions] = React.useState(null);
    const [valueZero, setValueZero] = React.useState("All");

    const handleClick = event => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const onChangeSelect = (event, selectItem) => {
        console.log("20200602 on change select == ", selectItem);
        // if (selectItem.id === "region") setValueZero(selectItem.id);
        defaultProps.onSelectItem(selectItem.value, selectItem.id);
    };

    React.useEffect(() => {
        if (defaultProps.regions) setRegionOptions(defaultProps.regions);
        if (defaultProps.depthOne) setCloudletOptions(defaultProps.depthOne);
        if (defaultProps.depthTwo) setClusterOptions(defaultProps.depthTwo);
        if (defaultProps.depthThree) setAppinstOptions(defaultProps.depthThree);
    }, [defaultProps]);

    return (
        <div className="page_monitoring_location">
            <Button
                className="page_monitoring_location_button"
                aria-describedby="customized-popper"
                // aria-controls="customized-menu"
                // aria-haspopup="true"
                variant="contained"
                onClick={handleClick}
            >
                <RoomIcon style={{ color: "rgb(118, 255, 3)" }} />
            </Button>
            <div className="page_monitoring_location_text">
                All
            </div>
            <Popper
                elevation={0}
                // getContentAnchorEl={null}
                placement="bottom-start"
                modifiers={{
                    flip: {
                        enabled: false,
                    },
                    preventOverflow: {
                        enabled: false,
                    },
                }}
                transformOrigin={{
                    vertical: "top",
                    horizontal: "left",
                }}
                style={{
                    marginTop: 5,
                    border: "1px solid #96c8da",
                    borderRadius: 4,
                    backgroundColor: "#1b1c1d",
                    padding: "5px 20px 10px 20px"
                }}
                id="customized-popper"
                keepMounted
                open={Boolean(anchorEl)}
                anchorEl={anchorEl}
            // onClose={handleClose}
            >
                <div className="page_monitoring_location_header">
                    Select location
                </div>
                <div className="page_monitoring_location_row">
                    <div className="page_monitoring_location_label">
                        Region
                    </div>
                    <div className="page_monitoring_location_Select">
                        <Dropdown
                            className="dropdownName"
                            placeholder="All"
                            clearable
                            fluid
                            search
                            selection
                            id="region"
                            options={regionOptions}
                            onChange={onChangeSelect}
                        />
                    </div>
                </div>
                <div className="page_monitoring_location_row">
                    <div className="page_monitoring_location_label">
                        Cloudlet
                    </div>
                    <div className="page_monitoring_location_Select">
                        <Dropdown
                            className="dropdownName"
                            placeholder="Select cloudlet"
                            clearable
                            fluid
                            search
                            selection
                            id="cloudlet"
                            options={cloudletOptions}
                            onChange={onChangeSelect}
                        />
                    </div>
                </div>
                <div className="page_monitoring_location_row">
                    <div className="page_monitoring_location_label">
                        Cluster
                    </div>
                    <div className="page_monitoring_location_Select">
                        <Dropdown
                            className="dropdownName"
                            placeholder="All"
                            clearable
                            fluid
                            search
                            selection
                            id="cluster"
                            options={clusterOptions}
                            onChange={onChangeSelect}
                        />
                    </div>
                </div>
                <div className="page_monitoring_location_row">
                    <div className="page_monitoring_location_label">
                        App Instance
                    </div>
                    <div className="page_monitoring_location_Select">
                        <Dropdown
                            className="dropdownName"
                            placeholder="All"
                            fluid
                            search
                            selection
                            id="appinst"
                            options={appinstOptions}
                            onChange={onChangeSelect}
                        />
                    </div>
                </div>
                <div className="page_monitoring_location_apply">
                    <Button onClick={handleClose} style={{ backgroundColor: "#6b7487", color: "#fff" }} variant="contained">Apply</Button>
                </div>
            </Popper>
        </div>
    );
}
/*
TODO : 6월 2일 해야 할 일
@Smith
모든 appinstance리스트를 가져오게 되면 역순으로
appinst / clusterinst / cloudlet 의 정보가 포함되어 있음
이를 분리하여 각 셀렉트 박스에 넣으면 됨
*/
