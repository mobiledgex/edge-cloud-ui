
import React, { Component } from 'react';
import Terminal from '../hoc/terminal/mexTerminal'
import * as serviceMC from '../services/serviceMC'
import stripAnsi from 'strip-ansi'
import Options from '../hoc/terminal/options/terminalOptions'


const CMD_CLEAR = 'clear';
const CMD_CLOSE = 'close';

class MexTerminal extends Component {

    constructor(props) {
        super(props)
        this.containerIds = [];
        if (props.data.data.Runtime.container_ids) {
            this.containerIds = props.data.data.Runtime.container_ids;
        }
        this.state = ({
            success: false,
            history: [],
            path: '#',
            open: false,
            containerId: (this.containerIds.length > 0 ? this.containerIds[0] : ''),
            cmd: '',
            optionView: true,
        })
        this.success = false;
        this.localConnection = null;
        this.sendChannel = null;

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

    sendRequest = () => {
        const { Region, OrganizationName, AppName, Version, ClusterInst, Cloudlet, Operator } = this.props.data.data;
        let data = {
            Region: Region,
            ExecRequest:
            {
                app_inst_key:
                {
                    app_key:
                    {
                        developer_key: { name: OrganizationName },
                        name: AppName,
                        version: Version
                    },
                    cluster_inst_key:
                    {
                        cluster_key: { name: ClusterInst },
                        cloudlet_key: { operator_key: { name: Operator }, name: Cloudlet },
                        developer: OrganizationName
                    }
                },
                container_id: this.state.containerId,
                command: this.state.cmd,
                offer: JSON.stringify(this.localConnection.localDescription)
            }
        }

        let store = JSON.parse(localStorage.PROJECT_INIT);
        let token = store ? store.userToken : 'null';
        let requestData = {
            token: token,
            method: serviceMC.getEP().RUN_COMMAND,
            data: data
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

    onRemoteMessage = (event) => {

        if (!this.success) {
            this.success = true;
            this.setState({
                history: ['Connected Successfully']
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

    openTerminal = () => {
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
                //this.close();
            }
            this.sendChannel.onopen = () => {

            }

            this.sendChannel.onmessage = e => { this.onRemoteMessage(e) }

            this.localConnection.oniceconnectionstatechange = e => {

                let connectionState = this.localConnection.iceConnectionState
                if(connectionState !== 'connected')
                {
                    this.setState({
                        history: [connectionState]
                    })
                }
            }

            this.localConnection.onnegotiationneeded = e =>
                this.localConnection.createOffer().then(d => {
                    this.localConnection.setLocalDescription(d)
                }).catch(this.log)


            setTimeout(() => { this.sendRequest() }, 1000);
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
            path: '#',
            history: ['Connection Closed']
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
                this.sendChannel.send(cmd + '\n')
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

    connect = () => {
        this.setState({
            history: ["Please wait connecting"],
            optionView: false
        })
        this.openTerminal()
    }



    render() {
        return (
            this.containerIds.length > 0 ?
                <div style={{ backgroundColor: 'black', height: '100%' }}>
                    {this.state.optionView ?
                        <Options
                            connect={this.connect}
                            onCmd={this.onCmd}
                            onContainerSelect={this.onContainerSelect}
                            containerIds={this.containerIds}
                            containerId={this.state.containerId}
                            cmd={this.state.cmd} />
                        :
                        <div style={{ paddingLeft: 20, paddingTop: 30, height: '100%' }}>
                            <Terminal open={this.state.open} close={this.close} path={this.state.path} onEnter={this.onEnter} history={this.state.history} />
                        </div>
                    }
                </div> : 'Container not found')
    }


    componentWillUnmount() {
        this.close();
    }

}

export default MexTerminal;