import React from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Popper from "@material-ui/core/Popper";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import RoomIcon from "@material-ui/icons/Room";
import HelpIcon from "@material-ui/icons/Help";
import { Dropdown } from "semantic-ui-react";
import Tooltip from "@material-ui/core/Tooltip";

const HtmlTooltip = withStyles((theme) => ({
    tooltip: {
        maxWidth: 220,
        fontSize: theme.typography.pxToRem(12)
    },
}))(Tooltip);

let _selectedFilterObj = null;

export default function FilterMenu(defaultProps) {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [regionOptions, setRegionOptions] = React.useState(null);
    const [cloudletOptions, setCloudletOptions] = React.useState(null);
    const [clusterOptions, setClusterOptions] = React.useState(null);
    const [appinstOptions, setAppinstOptions] = React.useState(null);
    const [valueZero, setValueZero] = React.useState("All");
    const [enableApply, setEnableApply] = React.useState(false);
    const [applyMent, setApplyMent] = React.useState("");
    const [selectedFilterObj, setSelectedFilterObj] = React.useState({});
    const [showHelp, setShowHelp] = React.useState(false);

    const handleClick = event => {
        setAnchorEl(anchorEl ? null : event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleApply = event => {
        setApplyFilter(selectedFilterObj);
        defaultProps.onHandleApplyFilter(selectedFilterObj);
        setAnchorEl(null);
    };

    const onChangeSelect = (event, selectItem) => {
        // if (selectItem.id === "region") setValueZero(selectItem.id);
        const newObj = selectedFilterObj;
        if (selectItem.value === "") {
            delete newObj[selectItem.id];
        } else {
            newObj[selectItem.id] = { depth: selectItem.depth, value: selectItem.value };
        }
        setSelectedFilterObj(newObj);
        defaultProps.onSelectItem(selectItem);

        if (selectItem.id) {
            setEnableApply(true); // visilbe apply button
            setApplyMent(selectItem.id); // lead to skip next depth click
        }

        setShowHelp(true);

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
                <BreadCrum data={selectedFilterObj} handleApply={handleApply} />
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
                    <span>Select location</span>
                    {showHelp
                        ? <HtmlTooltip
                            title={
                                <>
                                    {"Your can apply "}<b>{applyMent}</b>{" by click the apply button"}
                                </>
                            }
                        >
                            <HelpIcon style={{ color: 'rgba(255,255,255,.7)', marginLeft: 5 }} fontSize={'small'}/>
                        </HtmlTooltip> : null
                    }
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
                            depth={0}
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
                            depth={1}
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
                            placeholder="Select cluster"
                            clearable
                            fluid
                            search
                            selection
                            depth={2}
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
                            placeholder="Select Appinstance"
                            fluid
                            search
                            selection
                            depth={3}
                            id="appinst"
                            options={appinstOptions}
                            onChange={onChangeSelect}
                        />
                    </div>
                </div>
                <div style={{
                    display: "flex", flexDirection: "row", justifyContent: "flex-end", alignItem: "center", padding: 5
                }}
                >
                    {enableApply
                        ? <div className="page_monitoring_location_apply">
                            <Button onClick={handleApply} style={{ backgroundColor: "#9acd32", color: "#fff" }} variant="contained">Apply</Button>
                        </div> : null}
                    <div>
                        <Button onClick={handleClose} style={{ backgroundColor: "#6b7487", color: "#fff" }} variant="contained">Cancel</Button>
                    </div>
                </div>
            </Popper>
        </div>
    );
}

export const BreadCrum = defaultProps => {
    const [category, setCategory] = React.useState("ALL");
    const onHandleClick = value => {
        // send selected info to handler
        const selectedCrumObj = value;
        defaultProps.handleApply(selectedCrumObj);
    };

    React.useEffect(() => {
        if (defaultProps.data) {
            const keys = Object.keys(defaultProps.data);
            if (keys.length > 0) {
                const crums = keys.map(key => (
                    <span style={{ cursor: "pointer" }} onClick={() => onHandleClick(defaultProps.data[key])} value={defaultProps.data[key].value}>{`${defaultProps.data[key].value} / `}</span>
                ));
                setCategory(crums);
            }
        }
    }, [defaultProps]);

    return (
        <div>
            {category}
        </div>
    );
};

export const setApplyFilter = selectedFilterObj => {
    _selectedFilterObj = selectedFilterObj;
};
export const getApplyFilter = () => (
    _selectedFilterObj
);
