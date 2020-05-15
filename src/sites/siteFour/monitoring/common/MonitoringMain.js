import React, {useState} from "react";
import PageMonitoringForDeveloper from "../view/MonitoringView";
import PageMonitoringForAdmin from "../view/AdmMonitoringView";
import {Card} from "@material-ui/core";

export default function MonitoringMain() {
    const [userRole, setUserRole] = useState(localStorage.getItem('selectRole'));

    const renderMainPage = () => {
        try {
            if (userRole.includes('Admin')) {
                return (
                    <PageMonitoringForAdmin/>
                )
            } else {
                return (
                    <PageMonitoringForDeveloper/>
                )
            }
        } catch (e) {

        }
    }

    return (
        <Card style={{width: '100%', height: '100%', backgroundColor: '#292c33', padding: 10, color: 'white'}}>
            {renderMainPage()}
        </Card>
    );
}
