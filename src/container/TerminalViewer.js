
import React, { Component, Suspense, lazy } from 'react';
import * as actions from "../actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Image, Label } from 'semantic-ui-react';
import * as style from '../hoc/terminal/TerminalStyle';
import { Paper, Box } from '@material-ui/core';
import MexForms, { SWITCH } from '../hoc/forms/MexForms';
import { fields } from '../services/model/format'
import { redux_org } from '../helper/reduxData';
import { RUN_COMMAND, SHOW_LOGS, DEVELOPER_VIEWER, DEPLOYMENT_TYPE_VM } from '../constant'
import { service } from '../services'
import { endpoint } from '../helper/constant';
import '../hoc/terminal/style.css'
const Terminal = lazy(() => import('../hoc/terminal/mexTerminal'))


class MexTerminal extends Component {

    constructor(props) {
        super(props)
        this.state = ({
            status: this.props.data.vm ? 'Connected' : 'Not Connected',
            statusColor: this.props.data.vm ? 'green' : 'red',
            open: false,
            forms: [],
            cmd: '',
            optionView: true,
            containerIds: [],
            vmURL: null,
            isVM: false,
            tempURL: undefined
        })
        this.ws = undefined
        this.request = redux_org.role(this) === DEVELOPER_VIEWER ? SHOW_LOGS : RUN_COMMAND
        this.localConnection = null;
        this.sendChannel = null;
        this.vmPage = React.createRef()
    }

    sendRequest = async (terminaData) => {
        let execRequest =
        {
            app_inst_key:
            {
                app_key:
                {
                    organization: this.props.data[fields.organizationName],
                    name: this.props.data[fields.appName],
                    version: this.props.data[fields.version]
                },
                cluster_inst_key:
                {
                    cluster_key: { name: this.props.data[fields.clusterName] },
                    cloudlet_key: { organization: this.props.data[fields.operatorName], name: this.props.data[fields.cloudletName] },
                    organization: this.props.data[fields.clusterdeveloper]
                }
            },
        }

        let method = ''
        if (this.state.isVM) {
            method = endpoint.SHOW_CONSOLE
        }
        else {
            execRequest.container_id = terminaData.Container
            if (terminaData.Request === RUN_COMMAND) {
                method = endpoint.RUN_COMMAND;
                execRequest.cmd = { command: terminaData.Command }
            }
            else if (terminaData.Request === SHOW_LOGS) {
                method = endpoint.SHOW_LOGS;
                let showLogs = terminaData.ShowLogs
                let tail = showLogs.Tail ? parseInt(showLogs.Tail) : undefined
                execRequest.log = showLogs ? { since: showLogs.Since, tail: tail, timestamps: showLogs.Timestamps, follow: showLogs.Follow } : {}
            }
        }

        let requestedData = {
            region: this.props.data[fields.region],
            execRequest: execRequest
        }

        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        let request = {
            token: token,
            method: method,
            data: requestedData
        }
        let mc = await service.authSyncRequest(this, request)
        if (mc) {
            if (mc.response && mc.response.data) {
                let data = mc.response.data;
                let url = data.access_url
                if (url) {
                    if (this.state.isVM) {
                        this.setState({ vmURL: url })
                        if (this.vmPage && this.vmPage.current) {
                            this.vmPage.current.focus()
                        }
                    }
                    else {
                        this.setState({ tempURL: url, forceClose: false })
                    }
                }
                else {
                    this.props.handleAlertInfo('error', 'Access denied')
                    this.close()
                    this.setState({
                        tempURL: undefined,
                        optionView: true,
                    })
                }
            }
            else if (mc.error) {
                this.close()
                this.setState({
                    tempURL: undefined,
                    optionView: true,
                })
            }
        }
        else {
            this.close()
        }
    }

    openTerminal = (data) => {
        this.sendRequest(data)
    }

    start = () => {
        this.setState({
            open: true
        })
    }

    onTerminalClose = () => {
        this.close()
        if (this.state.optionView && this.props.onClose) {
            this.props.onClose()
        }
    }

    close = () => {
        if (this.ws) {
            this.ws.close()
        }
        this.setState({
            optionView: true,
            statusColor: 'red',
            status: 'Not Connected',
            tempURL: undefined,
        })
    }

    formattedData = () => {
        let data = {};
        let forms = this.state.forms;
        for (let i = 0; i < forms.length; i++) {
            let form = forms[i];
            if (form.field) {
                if (form.forms) {
                    data[form.uuid] = {};
                    let subForms = form.forms
                    for (let j = 0; j < subForms.length; j++) {
                        let subForm = subForms[j];
                        data[form.uuid][subForm.field] = subForm.value;
                    }

                }
                else {
                    data[form.field] = form.value;
                }
            }
        }
        return data
    }

    onConnect = (data) => {
        this.setState({
            forms: this.getForms(this.state.containerIds)
        })
        this.setState({
            statusColor: 'orange',
            status: "connecting",
            optionView: false
        })
        this.openTerminal(data)
    }

    getOptions = (dataList) => {
        return dataList.map(data => {
            return { key: data, value: data, text: data }
        })
    }

    getLogOptions = () => (
        [
            { field: 'Since', label: 'Since', formType: 'Input', visible: true, labelStyle: style.label, style: style.logs },
            { field: 'Tail', label: 'Tail', formType: 'Input', rules: { type: 'number' }, visible: true, labelStyle: style.label, style: style.logs },
            { field: 'Timestamps', label: 'Timestamps', formType: SWITCH, visible: true, labelStyle: style.label, style: { color: 'green' } },
            { field: 'Follow', label: 'Follow', formType: SWITCH, visible: true, labelStyle: style.label, style: { color: 'green' } }
        ]
    )

    getForms = (containerIds) => (
        [
            { field: 'Request', label: 'Request', formType: 'Select', rules: { required: true }, visible: true, labelStyle: style.label, style: style.cmdLine, options: this.getOptions(redux_org.role(this) === DEVELOPER_VIEWER ? [SHOW_LOGS] : [RUN_COMMAND, SHOW_LOGS]), value: this.request },
            { field: 'Container', label: 'Container', formType: 'Select', rules: { required: true }, visible: true, labelStyle: style.label, style: style.cmdLine, options: this.getOptions(containerIds), value: containerIds[0] },
            { field: 'Command', label: 'Command', formType: 'Input', rules: { required: true }, visible: this.request === RUN_COMMAND ? true : false, labelStyle: style.label, style: style.cmdLine },
            { uuid: 'ShowLogs', field: 'LogOptions', formType: 'MultiForm', visible: this.request === SHOW_LOGS ? true : false, forms: this.getLogOptions(), width: 4 },
            { label: 'Connect', formType: 'Button', style: style.button, onClick: this.onConnect, validate: true }
        ])

    onValueChange = (currentForm) => {
        let forms = this.state.forms;
        if (currentForm.field === 'Request') {
            this.request = currentForm.value
            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                if (form.field === 'Command') {
                    form.visible = currentForm.value === SHOW_LOGS ? false : true
                }
                if (form.field === 'LogOptions') {
                    form.visible = currentForm.value === SHOW_LOGS ? true : false
                }
            }
            this.reloadForms()
        }
    }

    reloadForms = () => {
        this.setState({
            forms: this.state.forms
        })
    }

    loadHeader = () => (
        <Box display="flex" p={1}>
            <Box p={1} flexGrow={1}>
                <Image wrapped size='small' src='/assets/brand/logo_mex.svg' />
            </Box>
            {
                this.state.isVM ? null :
                    <Box p={1} alignSelf="flex-center">
                        <Label color={this.state.statusColor} style={{ color: 'white', fontFamily: 'Inconsolata, monospace', marginRight: 10 }}>{this.state.status}</Label>
                    </Box>
            }
            <Box p={1}>
                <div onClick={() => { this.onTerminalClose() }} style={{ cursor: 'pointer' }}>
                    <Label color='grey' style={{ color: 'white', fontFamily: 'Inconsolata, monospace', marginRight: 10 }}>{this.state.optionView ? 'CLOSE' : 'BACK'}</Label>
                </div>
            </Box>
        </Box>
    )

    loadVMPage = () => {
        return this.state.vmURL ?
            <iframe title='VM' ref={this.vmPage} src={this.state.vmURL} style={{ width: '100%', height: window.innerHeight - 65 }}></iframe> : null
    }

    socketStatus = (flag, diff, ws) => {
        this.ws = ws
        this.setState({
            statusColor: flag ? 'green' : 'red',
            status: flag ? 'Connected' : 'Not Connected'
        })
        if (diff > 5000) {
            this.setState({ optionView: !flag, tempURL: undefined })
        }
    }

    loadCommandSelector = (containerIds) => {
        return (
            containerIds.length > 0 ?
                this.state.optionView ?
                    <div style={style.layout}>
                        <div style={style.container} align='center'>
                            <Paper variant="outlined" style={style.optionBody}>
                                <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} style={{}} />
                                <div>
                                    <p style={{ color: '#FFC107' }}>Note: Only running containers are accessible</p>
                                </div>
                            </Paper>
                        </div>
                    </div>
                    :
                    this.state.tempURL ?
                        <Suspense fallback={<div></div>}>
                            <div className={`${this.request === RUN_COMMAND ? 'terminal_run_head' : 'terminal_log_head'}`}>
                                <Terminal status={this.socketStatus} url={this.state.tempURL} request={this.request} />
                            </div>
                        </Suspense> :
                        null
                : null)
    }

    render() {
        return (
            <div style={{ backgroundColor: 'black', height: 'inherit' }}>
                {this.loadHeader()}
                {
                    this.state.isVM ? this.loadVMPage() :
                        this.loadCommandSelector(this.state.containerIds)
                }
            </div>)
    }

    componentDidMount() {
        let data = this.props.data
        if (data[fields.deployment] === DEPLOYMENT_TYPE_VM) {
            this.setState({ isVM: true })
            setTimeout(() => { this.sendRequest() }, 1000)
        }
        else if (data[fields.runtimeInfo] && data[fields.runtimeInfo][fields.container_ids]) {
            this.setState({ isVM: false })
            let tempContainerIds = data[fields.runtimeInfo][fields.container_ids];

            let containerIds = []
            for (let i = 0; i < tempContainerIds.length; i++) {
                let id = tempContainerIds[i]
                let containEnvoy = id.substring(0, 5)
                if (containEnvoy !== 'envoy') {
                    containerIds.push(id)
                }
            }
            if (containerIds.length > 0) {
                this.setState({
                    containerIds: containerIds,
                    forms: this.getForms(containerIds)
                })
            }
        }
    }

    componentWillUnmount() {
        this.close();
    }

}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};
const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MexTerminal));
