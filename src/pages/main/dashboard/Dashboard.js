import { Grid } from '@material-ui/core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { showAppInsts } from '../../../services/modules/appInst'
import { showCloudlets } from '../../../services/modules/cloudlet'
import { showCloudletInfoData } from '../../../services/modules/cloudletInfo'
import { showClusterInsts } from '../../../services/modules/clusterInst'
import { multiAuthSyncRequest } from '../../../services/service'
import DashbordWorker from './services/dashboard.worker.js'
import AuditLog from './auditLog/AuditLog'
import Control from './control/Control'
import { processWorker } from '../../../services/worker/interceptor'
import { sequence } from './sequence'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            chartData: undefined,
            rawList: undefined,
            total: undefined
        }
        this.worker = new DashbordWorker()
    }



    render() {
        const { chartData, total, rawList } = this.state
        return (
            <div style={{ height: 'calc(100vh - 55px)', overflowY: 'auto', overflowX: 'hidden', padding: 7 }}>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={1}>
                    <Grid item xs={12}>
                        <Control chartData={chartData} total={total} rawList={rawList} worker={this.worker}>
                            <AuditLog />
                        </Control>
                    </Grid>

                </Grid>
            </div>
        )
    }

    fetchData = () => {
        let requestList = [];
        ['EU'].forEach(async (region) => {
            [showCloudlets, showCloudletInfoData, showClusterInsts, showAppInsts].forEach(requestType => {
                let request = requestType(this, Object.assign({}, { region }))
                requestList.push(request)
            })
            if (requestList.length > 0) {
                let mcList = await multiAuthSyncRequest(this, requestList, false)
                let response = await processWorker(this.worker, {
                    region,
                    rawList: mcList,
                    initFormat: true,
                    sequence
                })
                if (response.status === 200) {
                    const { data: chartData, total, dataList: rawList } = response
                    this.setState({ chartData, total: total, rawList })
                }
            }
        })
    }

    componentDidMount() {
        this.fetchData()
    }
}

export default withRouter(Dashboard)