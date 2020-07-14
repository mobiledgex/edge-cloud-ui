import React from "react";
import PageMonitoringView from "../view/PageMonitoringView";
import {Card} from "@material-ui/core";
import {showToast} from "../service/PageMonitoringCommonService";

export default function PageMonitoringMain() {
    try {
        return (
            <Card style={{width: '100%', height: '100%', backgroundColor: '#292c33', padding: 10, color: 'white'}}>
                <PageMonitoringView/>
            </Card>
        );
    } catch (e) {
        //showToast(e.toString())
    }
}
