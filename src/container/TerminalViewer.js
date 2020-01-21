
import React, { Component } from 'react';
import Terminal from '../hoc/terminal/mex-terminal'
import * as serviceMC from '../services/serviceMC'
import stripAnsi from 'strip-ansi'
import { Dialog, DialogActions, DialogContent, Button, Paper } from '@material-ui/core';


const CMD_HELP = 'help';
const CMD_CLEAR = 'clear';
const CMD_CLOSE = 'close';
const CMD_CONTAINER = 'container';

class MexTerminal extends Component {

    constructor(props) {
        super(props)
        console.log('Rahul1234', props.data.data)
        this.containerIds = props.data.data.Runtime.container_ids;
        this.state = ({
            success: false,
            history: [],
            path: '#',
            open: false,
            containerId: this.containerIds[0],
            cmd: '',
            optionView: true,
        })
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

    sendRequest = (data) => {
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
                newData += arr;
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
        this.setState({
            history: ['Connected Successfully']
        })
        var textDecoder = new TextDecoder("utf-8");
        var decodedText = textDecoder.decode(event.data);
        let arr = decodedText.replace(/\/ #/g, '');
        arr = stripAnsi(arr).trim();
        arr = this.pathExist(arr);
        if (arr.length > 0) {
            arr = this.state.path + '\t' + arr
            this.setState(preveState => ({
                success: true,
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
                this.close();
            }
            this.sendChannel.onopen = () => {
                //console.log('sendChannel has opened')
            }

            this.sendChannel.onmessage = e => { this.onRemoteMessage(e) }

            this.localConnection.oniceconnectionstatechange = e => {
                this.setState({
                    history: [this.localConnection.iceConnectionState]
                })
            }

            this.localConnection.onnegotiationneeded = e =>
                this.localConnection.createOffer().then(d => {
                    this.localConnection.setLocalDescription(d)
                }).catch(this.log)

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


    close = () => {
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
            history: ['Connection Closed']
        })
    }

    onEnter = (cmd) => {
        if (cmd === CMD_CLEAR) {
            this.setState({
                help: false,
                container: [],
                history: []
            })
        }
        else if (cmd === CMD_HELP) {
            this.setState({
                help: true
            })
        }
        else if (cmd === CMD_CONTAINER) {

        }
        else if (this.localConnection && this.sendChannel) {
            if (cmd === CMD_CLOSE) {
                this.close()
            }
            else {
                this.sendChannel.send(cmd + '\n')
            }
        }
        else {
            this.setState({
                history: ["Please wait connecting"]
            })
            this.openTerminal(cmd)
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
            <div style={{ backgroundColor: 'black', height: '100%' }}>
                {this.state.optionView ?
                        <Dialog open={this.state.optionView} BackdropProps={{ style: { backgroundColor: "transparent" } }} PaperProps={{ style: { backgroundColor: "transparent" } }}>
                            <Paper variant="outlined" style={{backgroundColor:'black', borderColor:'white', padding:20}}>
                            <DialogContent>
                                <label style={{ color: 'white', marginRight: 30 }}>CONTAINER</label>
                                <select onChange={this.onContainerSelect} value={this.state.containerId} style={{ marginRight: 20, color: 'white', borderColor: 'white', backgroundColor: 'black', width: 200, height: 40 }}>
                                    {
                                        this.containerIds.map((item, i) => {
                                            return <option key={i} value={item}>{item}</option>
                                        })
                                    }
                                </select>
                            </DialogContent>
                            <DialogContent>
                                <label style={{ color: 'white', marginRight: 30 }}>COMMAND</label>
                                <input value={this.state.cmd} onChange={this.onCmd} style={{ color: 'white', borderRight: 'none', borderLeft: 'none', borderTop: 'none', width: 200, height: 40, backgroundColor: 'black', marginRight: 20 }} />
                            </DialogContent>
                            <DialogActions>
                                <Button variant="outlined" style={{color:'white', borderColor:'white', marginTop:20}} onClick={this.connect}>CONNECT</Button>
                            </DialogActions>
                            </Paper>
                        </Dialog> : 
                <div style={{ paddingLeft: 20, paddingTop: 30, height:'100%' }}>
                        <Terminal open={this.state.open} close={this.close} path={this.state.path} onEnter={this.onEnter} history={this.state.history} />}
                </div>}
            </div>)
    }


    componentWillUnmount() {
        this.close();
    }

}

export default MexTerminal;