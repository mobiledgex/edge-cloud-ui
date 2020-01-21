
import React, { Component } from 'react';
import Terminal from '../hoc/terminal/mex-terminal'
import * as serviceMC from '../services/serviceMC'
import stripAnsi from 'strip-ansi'
import { Button, Paper } from '@material-ui/core';

const CMD_CLEAR = 'clear';
const CMD_CLOSE = 'close';

class MexTerminal extends Component {

    constructor(props) {
        super(props)
        this.containerIds = [];
        if(props.data.data.Runtime.container_ids)
        {
            this.containerIds = props.data.data.Runtime.container_ids;
        }
        this.state = ({
            success: false,
            history: [],
            path: '#',
            open: false,
            containerId: (this.containerIds.length>0 ? this.containerIds[0] : ''),
            cmd: '',
            optionView: true,
        })
        this.success=false;
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
                newData += arr;
            }
            else {
                this.setState(prevState=>({
                    path: arr
                }))
            }
            return null;
        })
        return newData;
    }

    onRemoteMessage = (event) => {

        if(!this.success)
        {
            this.success = true;
            this.setState({
                history: ['Connected Successfully']
            })
        }
        var textDecoder = new TextDecoder("utf-8");
        var decodedText = textDecoder.decode(event.data);
        let arr = decodedText.replace(/\/ #/g, '');
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
                this.setState({
                    history: [this.localConnection.iceConnectionState]
                })
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
            path:'#',
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
            this.containerIds.length>0 ?
            <div style={{ backgroundColor: 'black', height: '100%' }}>
                {this.state.optionView ?
                    <div style={{lineHeight:50, height:300, textAlign:"center"}}>
                    <div open={this.state.optionView} onClose={this.onDialogClose} style={{lineHeight:1.5,display:'inline-block', verticalAlign:"middle"}}>
                        <Paper variant="outlined" style={{ backgroundColor: 'black', borderColor: 'white', padding: 20 }}>
                            <div>
                                <label style={{ color: 'white', marginRight: 30 }}>CONTAINER</label>
                                <select onChange={this.onContainerSelect} value={this.state.containerId} style={{ marginRight: 20, color: 'white', borderColor: 'white', backgroundColor: 'black', width: 200, height: 30 }}>
                                    {
                                        this.containerIds.map((item, i) => {
                                            return <option key={i} value={item}>{item}</option>
                                        })
                                    }
                                </select>
                            </div>
                            <div>
                                <label style={{ color: 'white', marginRight: 30 }}>COMMAND</label>
                                <input value={this.state.cmd} onChange={this.onCmd} style={{ color: 'white', borderRight: 'none', borderLeft: 'none', borderTop: 'none', width: 200, height: 40, backgroundColor: 'black', marginRight: 20 }} />
                            </div>
                            <div>
                                <Button variant="outlined" style={{ color: 'white', borderColor: 'white', marginTop: 20 }} onClick={this.connect}>CONNECT</Button>
                            </div>
                        </Paper>
                    </div>
                  </div>
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