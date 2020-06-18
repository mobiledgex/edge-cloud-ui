import React from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import NativeSelect from "@material-ui/core/NativeSelect";
import InputBase from "@material-ui/core/InputBase";
import * as serviceMC from "../../../../services/model/serviceMC";
import * as filterOptions from "../formatter/filterOptions";
import { Dropdown } from "semantic-ui-react";
import { ACTION_REGION } from "../../../../container/MexToolbar";

const BootstrapInput = withStyles(theme => ({
    root: {
        "label + &": {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 2,
        position: "relative",
        backgroundColor: theme.palette.background.paper,
        border: "1px solid #ced4da",
        fontSize: 9,
        padding: "3px 3px 3px 3px",
        transition: theme.transitions.create(["border-color", "box-shadow"]),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            "-apple-system",
            "BlinkMacSystemFont",
            "\"Segoe UI\"",
            "Roboto",
            "\"Helvetica Neue\"",
            "Arial",
            "sans-serif",
            "\"Apple Color Emoji\"",
            "\"Segoe UI Emoji\"",
            "\"Segoe UI Symbol\"",
        ].join(","),
        "&:focus": {
            borderRadius: 1,
            borderColor: "#80bdff",
            boxShadow: "0 0 0 0.2rem rgba(0,123,255,.25)",
        },
    },
}))(InputBase);

const useStyles = makeStyles(theme => ({
    margin: {
        margin: 5,
    },
}));

const FilteringComponent = props => {
    const classes = useStyles();
    const [selectedItem, setSelectedItem] = React.useState("");
    const [data, setData] = React.useState(props.data);
    const [filter, setFilter] = React.useState(props.filterInfo);

    const menuItems = [];

    React.useEffect(() => {
        const id = props.id;
        if (props.data && props.data[id] && props.data[id].length > 0) {
            setData(props.data[id]);
        }
        if (props.filterInfo) {
            setFilter(props.filterInfo);
            if (props.filterInfo.method === serviceMC.getEP().METRICS_CLOUDLET) {
                setSelectedItem(filterOptions.DISK_USED);
            }
        }
    }, [props]);

    const handleChange = (event, value) => {
        //setSelectedItem(event.target.value);
        setSelectedItem(value.value);
        props.onHandleFilter(value.value);
    };

    const makeMenuItem = items => {
        let utilsKeys = [];
        let ipsKeys = [];
        let allKeys = [];
        if (filter.method === serviceMC.getEP().METRICS_CLOUDLET) {
            utilsKeys = Object.keys(items[0].resData_util[0]);
            ipsKeys = Object.keys(items[0].resData_ip[0]);
            allKeys = utilsKeys.concat(ipsKeys);
        }
        return allKeys.map((item, i) => (

            <MenuItem value={item} key={i}>
                {item}
            </MenuItem>

        ));
    };
    const makeMenuOption = items => {
        let utilsKeys = [];
        let ipsKeys = [];
        let allKeys = [];
        if (filter.method === serviceMC.getEP().METRICS_CLOUDLET) {
            utilsKeys = Object.keys(items[0].resData_util[0]);
            ipsKeys = Object.keys(items[0].resData_ip[0]);
            allKeys = utilsKeys.concat(ipsKeys);
        }
        let option = [];
        allKeys.map(key => {
            option.push({key: key, text: key, value: key})
        })
        return option
    };
    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', height: 38 }}>
            <FormControl className={classes.margin}>
                <Dropdown
                    selection
                    options={(data && data.length > 0) ? makeMenuOption(data[0]) : null}
                    defaultValue={"diskUsed"}
                    onChange={handleChange}
                    className='page_monitoring_network_filter'
                />
                {/*<Select*/}
                {/*    labelId="demo-customized-select-label"*/}
                {/*    id="demo-customized-select"*/}
                {/*    value={selectedItem} // <--- selectedItem 이 바뀌지 않는 것 같음*/}
                {/*    onChange={handleChange}*/}
                {/*    input={<BootstrapInput />}*/}
                {/*>*/}
                {/*    {(data && data.length > 0) ? makeMenuItem(data[0]) : null}*/}
                {/*</Select>*/}
            </FormControl>
        </div>
    );
};

export default FilteringComponent;
