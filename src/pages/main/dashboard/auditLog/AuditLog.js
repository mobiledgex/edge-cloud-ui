import { Card, Divider } from '@material-ui/core'
import React from 'react'
import PassFail from '../../../../hoc/charts/passFail/PassFail'
import { Header1 } from '../../../../hoc/mexui/headers/Header1'

class AuditLog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    render() {
        return (
            <Card id='mex-chart-heatmap' style={{height:'inherit'}}>
                <div style={{ paddingLeft: 10 }}>
                    <Header1 size={14}>Audit Logs</Header1>
                </div>
                <Divider />
                <div style={{ padding: 10 }}>
                    <PassFail />
                </div>
            </Card>
        )
    }
}

export default AuditLog