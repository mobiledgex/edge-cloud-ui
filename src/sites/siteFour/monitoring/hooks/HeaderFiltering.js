import React, { useState } from "react";
import { Toolbar, Grid } from '@material-ui/core'
import { makeStyles } from "@material-ui/core/styles";
import FilterMenu from "./FilterMenu";

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
    },
}));
const HeaderFiltering = props => {
    const classes = useStyles();
    const [title, setTitle] = useState("M");

    React.useEffect(() => {
        if (props.data && props.data.length > 0) {
        }
        if (props.title) {
            setTitle(props.title);
        }
    }, [props]);

    return (
        
        <Toolbar className='monitoring_title' >
            <label className='content_title_label'>Monitoring</label>
            <FilterMenu />
        </Toolbar>
    );
};
export default HeaderFiltering;
