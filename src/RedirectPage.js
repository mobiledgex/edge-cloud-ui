import React from "react";
import {Redirect} from "react-router-dom";

const RedirectPage = props => {
    return <Redirect to={`/site4/pg=Monitoring&id=${props.match.params.appInstanceOne}`}
    />;
};

export default RedirectPage;
