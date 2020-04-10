import React, {useState, useEffect} from "react";
import PageMonitoringForOperator from "./oper/PageOperMonitoring";
import {Grid} from "semantic-ui-react";
import PageMonitoringForDeveloper from "./dev/PageDevMonitoring";
import PageMonitoringForAdmin from "./admin/PageAdminMonitoring";
import {Card} from "@material-ui/core";

export default function PageMonitoringMain() {
    const [userRole, setUserRole] = useState(localStorage.getItem('selectRole'));

    const renderMainPage = () => {
        if (userRole.includes('Admin')) {
            return (
                <PageMonitoringForAdmin/>
            )
        } else if (userRole.includes('Operator')) {
            return (
                <PageMonitoringForOperator/>
            )
        } else {//Developer***
            return (
                <PageMonitoringForDeveloper/>
            )
        }
    }

    return (
        <Card style={{ width: '100%', height: '100%', backgroundColor: '#292c33', padding: 10, color: 'white' }}>
            {renderMainPage()}
        </Card>
    );
}
