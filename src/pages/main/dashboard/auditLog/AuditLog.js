import { Card, CircularProgress, Divider } from '@material-ui/core'
import React from 'react'
import { connect } from 'react-redux'
import PassFail from '../../../../hoc/charts/passFail/PassFail'
import { Header1 } from '../../../../hoc/mexui/headers/Header1'
import { showAudits } from '../../../../services/modules/audit'
import { responseValid } from '../../../../services/service'
import { currentDate, subtractDays, utcTime } from '../../../../utils/date_util'

class AuditLog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            logs: undefined,
            loading:false
        }
        this.endtime = currentDate()
        this.starttime = subtractDays(30, this.endtime)
    }

    fetchLogs = async () => {
        this.setState({ loading: true })
        let mc = await showAudits(this, { starttime: this.starttime, endtime: this.endtime, type: 'audit', limit:1000 })
        if (responseValid(mc)) {
            let logs = {}
            let dataList = mc.response.data
            dataList.map(data => {
                let date = utcTime('MMM DD', data.timestamp)
                let mtags = data.mtags
                if (data.name.includes('/ws/') || data.name.includes('/wss/')) {
                    mtags.status = mtags.response.includes('"code":400') ? 400 : mtags.status
                }
                logs[date] = logs[date] ? logs[date] : { failed: 0, total: 0 }
                logs[date].total = logs[date].total + 1
                logs[date].failed = logs[date].failed + (parseInt(mtags.status) !== 200 ? 1 : 0)
            })
            this.setState({ logs })
        }
        this.setState({ loading: false })
    }

    render() {
        const { logs,loading } = this.state
        return (
            <Card id='mex-chart-heatmap'>
                <div style={{ paddingLeft: 10 }}>
                    <Header1 size={14}>Audit Logs</Header1>
                </div>
                <Divider />
                <div style={{ padding: 10, height: 210 }}>
                    {loading ? <div style={{display:'flex', justifyContent:'center', alignItems:'center', height:'100%'}}><CircularProgress size={150} thickness={1}/></div> :
                        <PassFail range={{ starttime: this.starttime, endtime: this.endtime }} logs={logs} />
                    }
                </div>
                <div style={{ height: 50 }}>

                </div>
            </Card>
        )
    }

    componentDidMount() {
        this.fetchLogs()
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

export default connect(mapStateToProps, null)(AuditLog);