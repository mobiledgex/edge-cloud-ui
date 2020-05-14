import React, {useState} from "react";
import PageOperMonitoring_VERSION2 from "./oper/PageOperMonitoring_VERSION2";
import OLDVERSION___PageOperMonitoring from "./oper/OLDVERSION___PageOperMonitoring";
import PageMonitoringForDeveloper from "./dev/PageDevMonitoring";
import PageMonitoringForAdmin from "./admin/PageAdminMonitoring";
import {Card} from "@material-ui/core";

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
                    <PageOperMonitoring_VERSION2/>
                )
            } else {
                return (
                    <PageMonitoringForDeveloper/>
                )
            }
        } catch (e) {
          /*  notification.success({
                placement: 'bottomLeft',
                duration: 3,
                message: e.toString(),
            });*/
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
