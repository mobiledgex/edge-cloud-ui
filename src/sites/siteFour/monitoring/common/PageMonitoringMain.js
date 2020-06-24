import React, {useState} from "react";
import PageMonitoringView from "../view/PageMonitoringView";
import {Card} from "@material-ui/core";

export default function PageMonitoringMain() {
    const [userRole, setUserRole] = useState(localStorage.getItem('selectRole'));
    const renderMainPage = () => {
        return <PageMonitoringView/>
    }

    return (
        <Card style={{width: '100%', height: '100%', backgroundColor: '#292c33', padding: 10, color: 'white'}}>
            {renderMainPage()}
        </Card>
    );
}
