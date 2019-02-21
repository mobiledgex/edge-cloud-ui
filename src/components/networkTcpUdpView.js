import React from 'react';
import { Grid } from 'semantic-ui-react';
import NetworkTrafficIO from './networkTrafficIO';
import NetworkTrafficIOLabel from './networkTrafficIOLabel';


const leftRows = [
    {label:'Cluster-A:1001', in:1231, out:1342},
    {label:'Cluster-A:1002', in:956, out:864},
    {label:'Cluster-B:2601', in:758, out:711},
    {label:'Cluster-D:3023', in:321, out:386},
    {label:'Cluster-E:5001', in:95, out:72}
    ]
export default class NetworkTcpUdpView extends React.Component {
    constructor() {
        super();
        this.state = {
            trafficData: [],
            maxInData:null,
            maxOutData:null
        }
    }
    componentDidMount() {
        // if(leftRows) {
        //     let inArray = [];
        //     let outArray = [];
        //     leftRows.map((obj, i) => {
        //         inArray.push(obj.in);
        //         outArray.push(obj.out);
        //     })
        //     this.setState({maxInData:Math.max(...inArray), maxOutData:Math.max(...outArray)})
        //     let self = this;
        //     setTimeout(()=>self.setState({trafficData:leftRows}),500);
        // }

        //


        //

    }

    componentWillReceiveProps(nextProps, nextContext) {

        //{clusterName:'',tcp:{tcpConns:'', tcpRetrans:''}, udp:{udpRecv:'', udpRecvErr:'', udpSend:''}};
        let inArray = [];
        let outArray = [];

        let netType = nextProps.activeIndex;

        let _inoutData = []
        if(nextProps.listData.length) {
            nextProps.listData.map((obj, i) => {
                let item = {label:'', in:0.00, out:0.00};
                if(netType === 'tcp'){
                    outArray.push(obj.tcp.tcpConns);
                    inArray.push(obj.tcp.tcpRetrans);

                    item.label = obj.clusterName;
                    item.out = obj.tcp.tcpConns;
                    item.in = obj.tcp.tcpRetrans;
                } else {
                    outArray.push(obj.udp.udpRecv);
                    inArray.push(obj.udp.udpRecvErr);

                    item.label = obj.clusterName;
                    item.out = obj.udp.udpRecv;
                    item.in = obj.udp.udpSend;
                }

                _inoutData.push(item);
            })
        }
        //console.log('activeIndex activeIndex activeIndex activeIndex---', nextProps.activeIndex, inArray, outArray)
        this.setState({maxInData:Math.max(...inArray), maxOutData:Math.max(...outArray)})
        let self = this;
        setTimeout(()=>self.setState({trafficData:_inoutData}),500);

    }

    makeRow = (item, i) => (
        <Grid.Row key={'itm_'+i} columns={3} className='traffic_list'>
            <Grid.Column>
                <NetworkTrafficIO cId="In" direction="reverse" gId={i} data={item.in} maxData={ this.state.maxInData }/>
            </Grid.Column>
            <Grid.Column width={3}>
                <NetworkTrafficIOLabel data={item}/>
            </Grid.Column>
            <Grid.Column>
                <NetworkTrafficIO cId="Out" direction="normal" gId={i} data={item.out} maxData={ this.state.maxOutData }/>
            </Grid.Column>
        </Grid.Row>
    )


    render() {
        return (
            <Grid>
                <Grid.Row columns={3} className='panel_sub_title'>
                    <Grid.Column>Input</Grid.Column>
                    <Grid.Column width={2}></Grid.Column>
                    <Grid.Column>Output</Grid.Column>
                </Grid.Row>
                {(this.state.trafficData.length > 0)? this.state.trafficData.map((item, i) => this.makeRow(item, i)):null}
            </Grid>
        )
    }
}
