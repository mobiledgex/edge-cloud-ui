import React, {useState, useEffect} from "react";
import PageMonitoringForOperator from "./oper/PageOperMonitoring";
import {Grid} from "semantic-ui-react";
import PageMonitoringForDeveloper from "./dev/PageDevMonitoring";
import PageMonitoringForAdmin from "./admin/PageAdminMonitoring";


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
        <Grid.Row className='view_contents'>
            {renderMainPage()}
        </Grid.Row>
    );
}
