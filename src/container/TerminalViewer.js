
import React, { Component } from 'react';
import Terminal from '../hoc/terminal/mexTerminal'
import * as serviceMC from '../services/model/serviceMC'
import * as serverData from '../services/model/serverData'
import * as actions from "../actions";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Image, Label } from 'semantic-ui-react';
import * as style from '../hoc/terminal/TerminalStyle';
import { Paper, Box } from '@material-ui/core';
import MexForms from '../hoc/forms/MexForms';
import {fields} from '../services/model/format'
import * as constant from '../constant'


const CMD_CLEAR = 'clear';
const CMD_CLOSE = 'close';
const RUN_COMMAND = 'Run Command';
const SHOW_LOGS = 'Show Logs';

class MexTerminal extends Component {

    constructor(props) {
        super(props)
        this.state = ({
            success: false,
            history: [],
            status: this.props.data.vm ? 'Connected' : 'Not Connected',
            statusColor: this.props.data.vm ? 'green' : 'red',
            path: '#',
            open: false,
            forms: [],
            cmd: '',
            optionView: true,
            editable: false,
            containerIds : [],
            vmURL : null,
            isVM : false
        })
        this.ws = undefined
        this.request = RUN_COMMAND
        this.requestTypes = [RUN_COMMAND, SHOW_LOGS]
        this.success = false;
        this.localConnection = null;
        this.sendChannel = null;
        this.vmPage = React.createRef()
    }

    sendWSRequest = (url, data) =>{
        this.ws = new WebSocket(url)
        this.ws.onopen = () => {
            this.success = true;
            this.setState({
                statusColor: 'green',
                status: 'Connected'
            })
        }
        this.ws.onmessage = evt => {
            this.setState({
                editable: data.Request === RUN_COMMAND ? true : false
            })
            this.setState(prevState => ({
                history: [...prevState.history, evt.data]
            }))
        }
    
        this.ws.onclose = evt => {
            this.ws = undefined
            this.setState({
                statusColor: 'red',
                status: 'Not Connected',
                editable: false
            })
        }
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
                    cloudlet_key: { organization: this.props.data[fields.operatorName] , name: this.props.data[fields.cloudletName] },
                    organization: this.props.data[fields.clusterdeveloper]
                }
            },
        }
        
        let method = ''
        if (this.state.isVM) {
            method = serviceMC.getEP().SHOW_CONSOLE
        }
        else {
            execRequest.container_id = terminaData.Container
            if (terminaData.Request === RUN_COMMAND) {
                method = serviceMC.getEP().RUN_COMMAND;
                execRequest.cmd = { command: terminaData.Command }
            }
            else if (terminaData.Request === SHOW_LOGS) {
                method = serviceMC.getEP().SHOW_LOGS;
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
        let requestData = {
            token: token,
            method: method,
            data: requestedData
        }
        let mcRequest = await serverData.sendRequest(this, requestData)
        if (mcRequest) {
            if (mcRequest.response && mcRequest.response.data) {
                let data = mcRequest.response.data;
                let url = data.access_url
                if (url) {
                    if (this.state.isVM) {
                        this.setState({ vmURL: url })
                        if (this.vmPage && this.vmPage.current) {
                            this.vmPage.current.focus()
                        }
                    }
                    else {
                        this.sendWSRequest(url, terminaData)
                    }
                }
                else
                {
                    this.props.handleAlertInfo('error', 'Access denied')
                    this.close()
                    this.setState({
                        optionView: true,
                    }) 
                }
            }
            else if (mcRequest.error) {
                this.close()
                this.setState({
                    optionView: true,
                })
            }
        }
        else
        {
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
        this.success = false;
        if(this.ws)
        {
            this.ws.close()
        }
        this.setState({
            optionView: true,
            history: [],
            path: '#',
            statusColor: 'red',
            status: 'Not Connected'
        })
    }

    onEnter = (cmd) => {
        if (cmd === CMD_CLEAR) {
            let history = this.state.history
            history = history[history.length-1].split('\r')
            history = history[history.length-1]
            this.setState({
                container: [],
                history: [history]
            })
        }
        else if (this.ws) {
            if (cmd === CMD_CLOSE) {
                this.close()
            }
            else {
                if (this.ws.readyState === WebSocket.OPEN) {
                    this.ws.send(cmd + '\n')
                }
                else {
                    this.props.handleAlertInfo('error', 'Terminal not connected, please try again')
                    this.close();
                }
            }
        }
    }

    onContainerSelect = (event) => {
        this.setState({
            containerId: event.target.value
        })
    }

    onCmd = (event) => {
        this.setState({
            cmd: event.target.value
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
            { field: 'Timestamps', label: 'Timestamps', formType: 'Checkbox', visible: true, labelStyle: style.label, style: { color: 'green' } },
            { field: 'Follow', label: 'Follow', formType: 'Checkbox', visible: true, labelStyle: style.label, style: { color: 'green' } }
        ]
    )

    getForms = (containerIds) => (
        [
            { field: 'Request', label: 'Request', formType: 'Select', rules: { required: true }, visible: true, labelStyle: style.label, style: style.cmdLine, options: this.getOptions([RUN_COMMAND, SHOW_LOGS]), value: RUN_COMMAND },
            { field: 'Container', label: 'Container', formType: 'Select', rules: { required: true }, visible: true, labelStyle: style.label, style: style.cmdLine, options: this.getOptions(containerIds), value: containerIds[0] },
            { field: 'Command', label: 'Command', formType: 'Input', rules: { required: true }, visible: this.request === RUN_COMMAND ? true : false, labelStyle: style.label, style: style.cmdLine },
            { uuid: 'ShowLogs', field: 'LogOptions', formType: 'MultiForm', visible: this.request === 'Show Logs' ? true : false, forms: this.getLogOptions(), width: 4 },
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
            <iframe title='VM' ref={this.vmPage} src={this.state.vmURL} style={{ width: '100%', height:window.innerHeight - 65}}></iframe> : null
    }

    loadCommandSelector = (containerIds) => {
        return (
            containerIds.length > 0 ?
                this.state.optionView ?
                    <div style={style.layout}>
                        <div style={style.container} align='center'>
                            <Paper variant="outlined" style={style.optionBody}>
                                <MexForms forms={this.state.forms} onValueChange={this.onValueChange} reloadForms={this.reloadForms} />
                            </Paper>
                        </div>
                    </div>
                    :
                    <div style={{ paddingLeft: 20, paddingTop: 30, height: constant.getHeight() }}>
                        <Terminal editable={this.state.editable} open={this.state.open} close={this.close} path={this.state.path} onEnter={this.onEnter} history={this.state.history} />
                    </div> : null)
    }

    render() {
        return (
            <div style={{ backgroundColor: 'black', height: '100%' }}>
                {this.loadHeader()}
                {
                    this.state.isVM ? this.loadVMPage() : 
                    this.loadCommandSelector(this.state.containerIds)
                }
            </div>)
    }

    componentDidMount() {
        let data = this.props.data
        if (data[fields.deployment] === constant.DEPLOYMENT_TYPE_VM) {
            this.setState({isVM : true})
            setTimeout(()=>{this.sendRequest()}, 1000)
        }
        else if(data[fields.runtimeInfo] && data[fields.runtimeInfo][fields.container_ids])
        {
            this.setState({isVM : false})
            let tempContainerIds = data[fields.runtimeInfo][fields.container_ids];
            
            let containerIds = []
            for(let i=0;i<tempContainerIds.length;i++)
            {
                let id = tempContainerIds[i]
                let containEnvoy = id.substring(0, 5)
                if(containEnvoy !== 'envoy')
                {
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

};
const mapDispatchProps = (dispatch) => {
    return {
        handleLoadingSpinner: (data) => { dispatch(actions.loadingSpinner(data)) },
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MexTerminal));
