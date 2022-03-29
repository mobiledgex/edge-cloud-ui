import React from 'react'
import { connect } from 'react-redux'
import { Card, Divider, LinearProgress, withStyles } from '@material-ui/core'
import PassFail from '../../../../hoc/charts/passFail/PassFail'
import { Header1 } from '../../../../hoc/mexui/headers/Header1'
import { responseValid } from '../../../../services/config'
import { showAudits } from '../../../../services/modules/audit'
import { currentDate, FORMAT_FULL_T_Z, FORMAT_MMM_DD, subtractDays, utcTime } from '../../../../utils/date_util'
import { toFirstUpperCase } from '../../../../utils/string_utils'
import { Icon, IconButton } from '../../../../hoc/mexui'
import { showAuditLog } from '../../../../actions'
import { AUDIT } from '../../../../helper/constant/perpetual'

const auditNoMatchNames = ['/api/v1/auth/ctrl/RunDebug', '/api/v1/auth/config/update', '/api/v1/usercreate', '/api/v1/auth/user/show', '/api/v1/auth/role/showuser', '/ws/api/v1/auth/ctrl/Stream*', '/api/v1/auth/ctrl/Show*', '/api/v1/login', '/api/v1/auth/user/current', '/api/v1/auth/wstoken', '/api/v1/auth/federator/self/show', '/api/v1/auth/federation/show', '/api/v1/auth/report/show', '/api/v1/auth/report/show', '/api/v1/auth/ctrl/AccessCloudlet', '/api/v1/auth/ctrl/RunCommand', '/api/v1/publicconfig', '/api/v1/auth/user/delete', '/api/v1/auth/ctrl/FindFlavorMatch', '/api/v1/auth/ctrl/UpdateSettings', '/api/v1/auth/restricted/user/update', '/api/v1/auth/ctrl/DeleteFlowRateLimitSettings', '/api/v1/auth/ctrl/CreateFlowRateLimitSettings']

const styles = theme => ({
    header: {
        paddingLeft: 10,
        display:'flex',
        alignItems:'center',
        justifyContent:'space-between'
    },
    loader: {
        height: 1,
    },
    content: {
        padding: 10,
        marginTop: 10,
        height: 260
    }
})

class AuditLog extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            logs: undefined,
            loading: false
        }
        this._isMounted = false
        this.endtime = currentDate()
        this.starttime = subtractDays(30, this.endtime)
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    processAuditLog = (logs, data) => {
        let date = utcTime(FORMAT_MMM_DD, data.timestamp)
        let mtags = data.mtags
        if (data.name.includes('/ws/') || data.name.includes('/wss/')) {
            mtags.status = mtags.response.includes('"code":400') ? 400 : mtags.status
        }
        logs[date] = logs[date] ? logs[date] : { failed: 0, total: 0 }
        logs[date].total = logs[date].total + 1
        logs[date].failed = logs[date].failed + (parseInt(mtags.status) !== 200 ? 1 : 0)
    }

    processEventLog = (logs, data)=>{
        let date = utcTime(FORMAT_MMM_DD, data.timestamp)
        logs[date] = logs[date] ? logs[date] : { failed: 0, total: 0 }
        logs[date].total = logs[date].total + 1
        logs[date].failed = logs[date].failed + (Boolean(data.error) ? 1 : 0)
         
    }

    fetchLogs = async () => {
        const { type } = this.props
        this.updateState({ loading: true })
        let mc = await showAudits(this, { starttime: this.starttime, endtime: this.endtime, type, limit: 5000, nomatch: { names: type === AUDIT ? auditNoMatchNames : [] } })
        if (responseValid(mc)) {
            let logs = {}
            let dataList = mc.response.data
            dataList.map(data => {
                if (type === AUDIT) {
                    this.processAuditLog(logs, data)
                }
                else
                {
                    this.processEventLog(logs, data)
                }
            })
            this.updateState({ logs })
        }
        this.updateState({ loading: false })
    }

    onRefresh = ()=>{
        this.fetchLogs()
    }

    onPassFailClick = (date) => {
        const { type } = this.props
        let starttime = utcTime(FORMAT_FULL_T_Z, date + ' 00:00:00')
        let endtime = utcTime(FORMAT_FULL_T_Z, date + ' 23:59:59')
        this.props.handleShowAuditLog({ starttime, endtime, type })
    }

    render() {
        const { logs, loading } = this.state
        const { type, classes } = this.props
        return (
            <Card id='mex-chart-heatmap' className='logs'>
                <div className={classes.header}>
                    <Header1 size={14}>{`${toFirstUpperCase(type)} Logs`}</Header1>
                    <div>
                        <IconButton disabled={loading} tooltip={'Refresh'} onClick={this.onRefresh}><Icon>refresh</Icon></IconButton>
                    </div>
                </div>
                <Divider />
                {loading ? <LinearProgress className={classes.loader} /> : null}
                <div className={classes.content}>
                    <PassFail onClick={this.onPassFailClick} range={{ starttime: this.starttime, endtime: this.endtime }} logs={logs} />
                </div>
            </Card>
        )
    }

    componentDidMount() {
        this._isMounted = true
        this.fetchLogs()
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

const mapDispatchProps = (dispatch) => {
    return {
        handleShowAuditLog: (data) => { dispatch(showAuditLog(data)) },
    };
};

export default connect(mapStateToProps, mapDispatchProps)(withStyles(styles)(AuditLog));