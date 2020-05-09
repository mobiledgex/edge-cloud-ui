import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import * as serviceMC from "../../../../services/model/serviceMC";
import * as filterOptions from "../formatter/filterOptions";

const BootstrapInput = withStyles((theme) => ({
    root: {
        'label + &': {
            marginTop: theme.spacing(3),
        },
    },
    input: {
        borderRadius: 2,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 9,
        padding: '3px 3px 3px 3px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 1,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const useStyles = makeStyles((theme) => ({
    margin: {
        margin: "1px",
    },
}));

const FilteringComponent = (props) => {
    const classes = useStyles();
    const [selecteditem, setSelecteditem] = React.useState('');
    const [data, setData] = React.useState(props.data);
    const [filter, setFilter] = React.useState(props.filterInfo)

    let menuItems = [];

    React.useEffect(() => {
        if (props.data && props.data.length > 0) {
            console.log("20200509 data in filtering comp ... ", props);
            setData(props.data)
        }
        if (props.filterInfo) {
            setFilter(props.filterInfo)
            if (props.filterInfo.method = serviceMC.getEP().METRICS_CLOUDLET) {
                setSelecteditem(filterOptions.DISK_USED)
            }
        }

    }, [props]);

    const handleChange = (event) => {
        setSelecteditem(event.target.value);
    };
    const makeMenuItem = (items) => {

        let utilsKeys = [];
        let ipsKeys = [];
        let allKeys = [];
        console.log("20200509 filter comp ... ", items[0]);
        if (filter.method = serviceMC.getEP().METRICS_CLOUDLET) {
            utilsKeys = Object.keys(items[0]["resData_util"][0]);
            ipsKeys = Object.keys(items[0]["resData_ip"][0]);
            allKeys = utilsKeys.concat(ipsKeys)
        }
        return allKeys.map((item, i) => (

            <MenuItem value={item} key={i}>
                {item}
            </MenuItem>

        ))



    }
    return (
        <div style={{ height: 25 }}>
            <FormControl className={classes.margin}>
                <Select
                    labelId="demo-customized-select-label"
                    id="demo-customized-select"
                    value={selecteditem}
                    onChange={handleChange}
                    input={<BootstrapInput />}
                >
                    {(data && data.length > 0) ? makeMenuItem(data) : null}
                </Select>
            </FormControl>
        </div>
    );
}

export default FilteringComponent;
