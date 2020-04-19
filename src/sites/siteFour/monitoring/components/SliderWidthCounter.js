import React from "react";
import { Paper } from "@material-ui/core";

const ItemComp = props =>
    props && props.item ? (
        <Paper>
            <h2>{props.item.name}</h2>
            <p>{props.item.description}</p>
        </Paper>
    ) : (
        <div></div>
    );

export default ItemComp;
