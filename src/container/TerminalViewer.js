
import React, { Component } from 'react';
import Terminal from '../hoc/terminal/mexTerminal'
import * as serviceMC from '../services/serviceMC'
import stripAnsi from 'strip-ansi'
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
        })
        this.containerIds = [];
        if (props.data[fields.runtimeInfo] && props.data[fields.runtimeInfo][fields.container_ids]) {
            this.containerIds = props.data[fields.runtimeInfo][fields.container_ids];
        }
        this.request = 'Run Command'
        this.requestTypes = ['Run Command', 'Show Logs']
        this.success = false;
        this.localConnection = null;
        this.sendChannel = null;
        this.vmPage = React.createRef()
    }

    setRemote = (mcRequest) => {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                this.localConnection.setRemoteDescription(new RTCSessionDescription(JSON.parse(response.data.answer)));
            }
            else if (mcRequest.error) {
                this.close()
                this.setState({
                    optionView: true,
                })
            }
        }
    }

    sendRequest = (terminaData) => { 
        let ExecRequest =
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
            container_id: terminaData.Container,
            offer: JSON.stringify(this.localConnection.localDescription)
        }

        let method = '';
        if (terminaData.Request === 'Run Command') {
            method = serviceMC.getEP().RUN_COMMAND;
            ExecRequest.cmd = { command: terminaData.Command }
        }
        else if (terminaData.Request === 'Show Logs') {
            method = serviceMC.getEP().SHOW_LOGS;
            let showLogs = terminaData.ShowLogs
            let tail = showLogs.Tail ? parseInt(showLogs.Tail) : undefined
            ExecRequest.log = showLogs ? { since: showLogs.Since, tail: tail, timestamps: showLogs.Timestamps, follow: showLogs.Follow } : {}
        }
        let requestedData = {
            region: this.props.data[fields.region],
            ExecRequest: ExecRequest
        }

        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        let requestData = {
            token: token,
            method: method,
            data: requestedData
        }
        serviceMC.sendRequest(this, requestData, this.setRemote)
    }

    pathExist = (data) => {
        let newData = '';
        let dataList = data.split('\r\n')
        dataList.map(arr => {
            if (!arr.includes('/') && !arr.includes(' #')) {
                newData += arr + '\r\n';
            }
            else {
                this.setState({
                    path: arr
                })
            }
            return null;
        })
        return newData;
    }

    onRemoteMessage = (event, data) => {

        if (!this.success) {
            this.success = true;
            this.setState({
                statusColor: 'green',
                status: 'Connected'
            })
            this.setState({
                editable: data.Request === 'Run Command' ? true : false
            })
        }
        var textDecoder = new TextDecoder("utf-8");
        let arr = textDecoder.decode(event.data);
        arr = stripAnsi(arr).trim();
        arr = this.pathExist(arr);
        if (arr.length > 0) {
            arr = arr
            this.setState(preveState => ({
                history: [...preveState.history, arr]
            }))
        }
        this.currentCmd = '';
    }

    openTerminal = (data) => {
        try {
            this.localConnection = new RTCPeerConnection({
                iceServers: [
                    {
                        urls: 'turn:stun.mobiledgex.net:19302',
                        username: 'fake',
                        credential: 'fake'
                    }
                ]
            })

            this.sendChannel = this.localConnection.createDataChannel('mex')

            this.sendChannel.onclose = () => {
                this.setState({
                    editable: false
                })
            }
            this.sendChannel.onopen = () => {
            }

            this.sendChannel.onmessage = e => { this.onRemoteMessage(e, data) }

            this.localConnection.oniceconnectionstatechange = e => {

                let connectionState = this.localConnection.iceConnectionState
                if (connectionState !== 'connected') {
                    this.setState({
                        statusColor: 'orange',
                        status: connectionState
                    })
                }
            }

            this.localConnection.onnegotiationneeded = e =>
                this.localConnection.createOffer().then(d => {
                    this.localConnection.setLocalDescription(d)
                }).catch(this.log)


            setTimeout(() => { this.sendRequest(data) }, 1000);
        }
        catch (e) {
            alert(e)
        }
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
        if (this.sendChannel) {
            this.sendChannel.close();
            this.sendChannel = null;
        }

        if (this.localConnection) {
            this.localConnection.close();
            this.localConnection = null;
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
            this.setState({
                container: [],
                history: []
            })
        }
        else if (this.localConnection && this.sendChannel) {
            if (cmd === CMD_CLOSE) {
                this.close()
            }
            else {
                if (this.sendChannel && this.sendChannel.readyState === 'open') {
                    this.sendChannel.send(cmd + '\n')
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
            forms: this.getForms()
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

    getForms = () => (
        [
            { field: 'Request', label: 'Request', formType: 'Select', rules: { required: true }, visible: true, labelStyle: style.label, style: style.cmdLine, options: this.getOptions(this.requestTypes), value: this.request },
            { field: 'Container', label: 'Container', formType: 'Select', rules: { required: true }, visible: true, labelStyle: style.label, style: style.cmdLine, options: this.getOptions(this.containerIds), value: this.containerIds[0] },
            { field: 'Command', label: 'Command', formType: 'Input', rules: { required: true }, visible: this.request === 'Run Command' ? true : false, labelStyle: style.label, style: style.cmdLine },
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
                    form.visible = currentForm.value === 'Show Logs' ? false : true
                }
                if (form.field === 'LogOptions') {
                    form.visible = currentForm.value === 'Show Logs' ? true : false
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

    loadVMPage = () => {
	return <iframe title='VM' ref={this.vmPage} src={this.props.data.vm.url} style={{ width: '100%', height: '100%' }}></iframe>
    }

    render() {
        return (

            <div style={{ backgroundColor: 'black', height: '100%' }}>
                <Box display="flex" p={1}>
                    <Box p={1} flexGrow={1}>
                        <Image wrapped size='small' src='/assets/brand/logo_mex.svg' />
                    </Box>
                    <Box p={1} alignSelf="flex-center">
                        <Label color={this.state.statusColor} style={{ color: 'white', fontFamily: 'Inconsolata, monospace', marginRight: 10 }}>{this.state.status}</Label>
                    </Box>
                    <Box p={1}>
                        <div onClick={() => { this.onTerminalClose() }} style={{ cursor: 'pointer' }}>
                            <Label color='grey' style={{ color: 'white', fontFamily: 'Inconsolata, monospace', marginRight: 10 }}>{this.state.optionView ? 'CLOSE' : 'BACK'}</Label>
                        </div>
                    </Box>
                </Box>

                {
                    this.props.data.vm ?
                        this.loadVMPage()
                        :
                        this.containerIds.length > 0 ?
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
                                </div> : null
                }
            </div>)
    }

    componentDidMount() {
        if (this.vmPage && this.vmPage.current) {
            this.vmPage.current.focus()
        }
        this.setState({
            forms: this.getForms()
        })
    }


    componentWillUnmount() {
        this.close();
    }

}


const mapStateToProps = (state) => {

};
const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(MexTerminal));
