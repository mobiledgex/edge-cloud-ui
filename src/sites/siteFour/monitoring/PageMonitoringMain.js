import React, { useState, useEffect } from "react";
import PageMonitoringForOperator from "./oper/PageOperMonitoring";
import PageMonitoringForDeveloper from "./dev/PageDevMonitoring";
import MonitoringAdmin from "./";
import { Card } from "@material-ui/core";
import PageMonitoringForAdmin from "./admin/PageAdminMonitoring";

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
            /*  notification.success({
                placement: 'bottomLeft',
                duration: 3,
                message: e.toString(),
            });*/
        }
    };

    return (
        <Card
            style={{
                width: "100%",
                height: "100%",
                backgroundColor: "#292c33",
                paddingTop: 10,
                paddingLeft: 10,
                paddingRight: 10,
                color: "white"
            }}
        >
            {renderMainPage()}
        </Card>
    );
}
