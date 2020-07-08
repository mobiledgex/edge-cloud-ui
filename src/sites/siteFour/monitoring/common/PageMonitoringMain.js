import React from "react";
import PageMonitoringView from "../view/PageMonitoringView";
import {Card} from "@material-ui/core";

export default function PageMonitoringMain() {
    return (
        <Card style={{width: '100%', height: '100%', backgroundColor: '#292c33', padding: 10, color: 'white'}}>
            <PageMonitoringView/>
        </Card>
    );
}
