import { Grid} from '@material-ui/core'
import React from 'react'
import { withRouter } from 'react-router-dom'
import { showAppInsts } from '../../../services/modules/appInst'
import { showCloudlets } from '../../../services/modules/cloudlet'
import { showCloudletInfoData } from '../../../services/modules/cloudletInfo'
import { showClusterInsts } from '../../../services/modules/clusterInst'
import { multiAuthSyncRequest } from '../../../services/service'
import DashbordWorker from './services/dashboard.worker.js'
// import AuditLog from './auditLog/AuditLog'
import Control from './control/Control'
import Total from './total/Total'
import { processWorker } from '../../../services/worker/interceptor'
import { sequence } from './control/format'

class Dashboard extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.worker = new DashbordWorker()
    }

    render() {
        const { height } = this.state
        return (
            <div style={{height:'calc(100vh - 55px)', overflowY: 'auto', overflowX: 'hidden', padding:7}}>
                <Grid container columns={{ xs: 4, sm: 8, md: 12 }} spacing={1}>
                    <Grid item xs={7}>
                        <Control />
                    </Grid>
                    <Grid item xs={5}>
                        <Grid container style={{ marginBottom: 3 }} spacing={1}>
                            <Grid item xs={4}>
                                <Total label='Cloudlet' />
                            </Grid>
                            <Grid item xs={4}>
                                <Total label='Cluster Instances' />
                            </Grid>
                            <Grid item xs={4}>
                                <Total label='App Instances' />
                            </Grid>
                        </Grid>
                        {/* <AuditLog /> */}
                    </Grid>
                </Grid>
            </div>
        )
    }

    fetchData = async () => {
        let requestList = [];
        [showCloudlets, showCloudletInfoData, showClusterInsts, showAppInsts].forEach(requestType => {
            let request = requestType(this, Object.assign({}, { region: 'EU' }))
            requestList.push(request)
        })
        if (requestList.length > 0) {
            let mcList = await multiAuthSyncRequest(this, requestList, false)
            let response = await processWorker(this.worker, {
                region:'EU',
                sequence,
                rawList : mcList
            })
        }
    }

    componentDidMount() {
        this.fetchData()
    }
}

export default withRouter(Dashboard)