import React, { useState, useEffect } from "react";
import { Card } from "@material-ui/core";

import PageMonitoringForDeveloper from "../view/PageDevOperMonitoringView";
import PageMonitoringForAdmin from "../view/PageAdminMonitoringView";
import MonitoringAdmin from "../index";
export default function PageMonitoringMain() {
    const [userRole, setUserRole] = useState(
        localStorage.getItem("selectRole")
    );

    const renderMainPage = () => {
        try {
            if (userRole.includes("Admin")) {
                return <MonitoringAdmin />;
            } else if (userRole.includes("Operator")) {
                return <PageMonitoringForOperator />;
            } else {
                return <PageMonitoringForDeveloper />;
            }
        } catch (e) {
        }
    };

    return (
        <Card style={{ width: '100%', height: '100%', backgroundColor: '#292c33', padding: 10, color: 'white' }}>
            {renderMainPage()}
        </Card>
    );
}
