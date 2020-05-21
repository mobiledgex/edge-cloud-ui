import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
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
        <div className={classes.root} style={{ margin: 0 }}>
            <Grid
                container
                direction="row"
                justify="space-between"
                alignItems="center"
                spacing={3}
            >
                <Grid item xs>
                    a
                </Grid>
                <Grid item xs={6}>
                    <FilterMenu />
                </Grid>
                <Grid item xs>
                    c
                </Grid>
            </Grid>
        </div>
    );
};
export default HeaderFiltering;
