import React, {useState} from "react";
import PageMonitoringForOperator from "./oper/PageOperMonitoring";
import PageMonitoringForDeveloper from "./dev/PageDevMonitoring";
import PageMonitoringForAdmin from "./admin/PageAdminMonitoring";
import {Card} from "@material-ui/core";
import {notification} from "antd";

export default function PageMonitoringMain() {
    const [userRole, setUserRole] = useState(localStorage.getItem('selectRole'));

    const renderMainPage = () => {
        try {
            if (userRole.includes('Admin')) {
                return (
                    <PageMonitoringForAdmin/>
                )
            } else if (userRole.includes('Operator')) {
                return (
                    <PageMonitoringForOperator/>
                )
            } else {
                return (
                    <PageMonitoringForDeveloper/>
                )
            }
        } catch (e) {
            notification.success({
                placement: 'bottomLeft',
                duration: 3,
                message: 'There are some errors, please contact the administrator.',
            });
        }
    }

    return (
        <Card style={{
            width: '100%',
            height: '100%',
            backgroundColor: '#292c33',
            paddingTop: 10,
            paddingLeft: 10,
            paddingRight: 10,
            color: 'white'
        }}>
            {renderMainPage()}
        </Card>
    );
}
