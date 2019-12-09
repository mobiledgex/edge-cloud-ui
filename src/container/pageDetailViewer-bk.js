import React from 'react';
import {Button, Divider, Table, Grid, Header, Image, Icon} from "semantic-ui-react";
import ContainerDimensions from 'react-container-dimensions';
import * as moment from 'moment';
import ReactJson from 'react-json-view'
import TimeSeries from '../charts/plotly/timeseries';

const TableExampleCollapsing = () => (
    <Table basic='very' celled collapsing>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Employee</Table.HeaderCell>
                <Table.HeaderCell>Correct Guesses</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>
            <Table.Row>
                <Table.Cell>
                    <Header as='h4' image>
                        <Image src='/assets/images/avatar/small/lena.png' rounded size='mini' />
                        <Header.Content>
                            Lena
                            <Header.Subheader>Human Resources</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell>22</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    <Header as='h4' image>
                        <Image src='/assets/images/avatar/small/matthew.png' rounded size='mini' />
                        <Header.Content>
                            Matthew
                            <Header.Subheader>Fabric Design</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell>15</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    <Header as='h4' image>
                        <Image src='/assets/images/avatar/small/lindsay.png' rounded size='mini' />
                        <Header.Content>
                            Lindsay
                            <Header.Subheader>Entertainment</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell>12</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    <Header as='h4' image>
                        <Image src='/assets/images/avatar/small/mark.png' rounded size='mini' />
                        <Header.Content>
                            Mark
                            <Header.Subheader>Executive</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell>11</Table.Cell>
            </Table.Row>
        </Table.Body>
    </Table>
)

const _status = {
    "0" : "Tracked State Unknown",
    "1" : "Not Present",
    "2" : "Create Requested",
    "3" : "Creating",
    "4" : "Create Error",
    "5" : "Ready",
    "6" : "Update Requested",
    "7" : "Updating",
    "8" : "Update Error",
    "9" : "Delete Requested",
    "10" : "Deleting",
    "11" : "Delete Error",
    "12" : "Delete Prepare",
    "13" : "CRM Init"
}
const _liveness = {
    "1" : "Static",
    "2" : "Dynamic"
}

let _self = null;
export default class PageDetailViewerBk extends React.Component {
    constructor() {
        super();
        this.state = {
            listData:[],
            selected:{},
            open:false,
            dimmer:'',
            devOptionsOne:[],
            devOptionsTwo:[],
            devOptionsThree:[],
            devOptionsFour:[],
            devOptionsFive:[],
            dropdownValueOne:'',
            dropdownValueTwo:'',
            dropdownValueThree:'',
            dropdownValueFour:'',
            dropdownValueFive:'',
            cloudletResult:null,
            appResult:null,
            listOfDetail:null,
            timeseriesDataCPUMEM:[
                [0,1,2,3,4,5],[2,3,4,5,6,7]
            ],
            timeseriesCPUMEM:[
                ["2010-01-01 12:38:22", "2011-01-01 05:22:48", "2012-01-01 12:00:01", "2013-01-01 23:22:00", "2014-01-01 24:00:00", "2015-01-01 23:59:59"]
            ],
            dataLabel:['CPU', 'MEM'],
            timeseriesDataNET:[
                [0,1,2,3,4,5],[2,3,4,5,6,7]
            ],
            timeseriesNET:[
                ["2010-01-01 12:38:22", "2011-01-01 05:22:48", "2012-01-01 12:00:01", "2013-01-01 23:22:00", "2014-01-01 24:00:00", "2015-01-01 23:59:59"]
            ],
        }
        _self = this;

        this.jsonViewProps = {
            name:null,
            theme: "monokai",
            collapsed: false,
            collapseStringsAfter: 15,
            onAdd: false,
            onEdit: false,
            onDelete: false,
            displayObjectSize: false,
            enableClipboard: true,
            indentWidth: 4,
            displayDataTypes: false,
            iconStyle: "triangle"
        }
    }

    componentDidMount() {

    }
    componentWillReceiveProps(nextProps, nextContext) {

            let regKeys = [];
            let component = null;
            let data = [];
            if(nextProps.data){
                this.setState({listData:nextProps.data})
            }


    }
    makeList = (values, label, i) => (
        <Grid.Row columns={2} key={i}>
            <Grid.Column width={5} className='detail_item' style={{display:'flex', justifyContent:'flex-end'}}>
                <div>{label}</div>
            </Grid.Column>
            <Grid.Column width={11}>
                <div style={{wordWrap: 'break-word'}}>{(typeof values[label] === 'object')? JSON.stringify(values[label]):String(values[label])}</div>
            </Grid.Column>
            <Divider vertical></Divider>
        </Grid.Row>
    )
    jsonView = (jsonObj) => (
        <ReactJson src={jsonObj} {...this.jsonViewProps} />
    )

    makeUTC = (time) => (
        moment.unix( time.replace('seconds : ', '') ).utc().format('YYYY-MM-DD HH:mm:ss') + ' UTC'
    )

    makeTable = (values, label, i) => (
        (label !== 'Edit')?
        <Table.Row key={i}>
            <Table.Cell>
                <Header as='h4' image>
                    <Icon name={'dot'} />
                    <Header.Content>
                        {(label == 'CloudletName')?'Cloudlet Name'
                        :(label == 'CloudletLocation')?'Cloudlet Location'
                        :(label == 'Ip_support')?'IP Support'
                        :(label == 'Num_dynamic_ips')?'Number of Dynamic IPs' /* Cloudlets */
                        :(label == 'ClusterName')?'Cluster Name'
                        :(label == 'OrganizationName')?'Organization Name'
                        :(label == 'IpAccess')?'IP Access' /* Cluster Inst */
                        :(label == 'Mapped_port')?'Mapped Port' /* Cluster Inst */

                        :label}
                    </Header.Content>
                </Header>
            </Table.Cell>
            <Table.Cell onClick = {() => console.log('label@@@@',values)}>
                {(label === 'Ip_support' && String(values[label]) == '1')?'Static'
                :(label === 'Ip_support' && String(values[label]) == '2')?'Dynamic' /* Cloudlets */
                :(label === 'IpAccess' && String(values[label]) == '1')?'Dedicated'
                :(label === 'IpAccess' && String(values[label]) == '3')?'Shared' /* Cluster Inst */
                :(label === 'Created')? String( this.makeUTC(values[label]) )
                :(label === 'State')? _status[values[label]]
                :(label === 'Deployment' && String(values[label]) == 'docker')?'Docker'
                :(label === 'Deployment' && String(values[label]) == 'kubernetes')?'Kubernetes'
                :(label === 'Liveness')? _liveness[values[label]]
                :(typeof values[label] === 'object')? this.jsonView(values[label])
                :String(values[label])}
            </Table.Cell>
        </Table.Row> : null
    )

    setCloudletList = (operNm) => {
        let cl = [];
        _self.state.cloudletResult[operNm].map((oper, i) => {
            if(i === 0) _self.setState({dropdownValueThree: oper.CloudletName})
            cl.push({ key: i, value: oper.CloudletName, text: oper.CloudletName })
        })

        _self.setState({devOptionsThree: cl})
    }



    close() {
        this.setState({ open: false })
        this.props.close()
    }

    changeLocation(data) {
        // let loc = '';
        // if(data['CloudletLocation'].latitude && data['CloudletLocation'].longitude){
        //     loc = 'Latitude : '+data['CloudletLocation'].latitude+ ', Longitude : '+data['CloudletLocation'].longitude
        //     data['CloudletLocation'] = loc
        // }
        return data
    }


    render() {
        let { listData } = this.state;
        let keys = listData ? Object.keys(listData) : [];
        return (
            <ContainerDimensions>
                {({width, height}) =>
                    <div style={{width: width, height: height-90, display: 'flex', overflowY: 'auto', overflowX: 'hidden', marginTop:20}}>
                        <Grid style={{width:width, backgroundColor:'#0d0e13', borderRadius:5}}>

                                <Grid.Row>
                                    <Table celled collapsing style={{width:'100%'}}>
                                        <Table.Header>
                                            <Table.Row>
                                                <Table.HeaderCell width={6}><div style={{display:'flex', justifyContent:'center'}}>Subject</div></Table.HeaderCell>
                                                <Table.HeaderCell width={10}><div style={{display:'flex', justifyContent:'center'}}>Value</div></Table.HeaderCell>
                                            </Table.Row>
                                        </Table.Header>
                                        <Table.Body>
                                            {
                                                (keys.length) && keys.map((item, i) => this.makeTable(this.changeLocation(listData), item, i))
                                            }
                                        </Table.Body>
                                    </Table>

                                </Grid.Row>
                                {/*<Grid.Row style={{height:500, backgroundColor:'#252525'}}>*/}
                                    {/*<TimeSeries style={{width:'100%', height:400}} chartData={this.state.timeseriesDataCPUMEM} series={this.state.timeseriesCPUMEM} margin={10} label={this.state.dataLabel} yRange={[0.001, 0.009]} y2Position={0.94}></TimeSeries>*/}
                                {/*</Grid.Row>*/}

                        </Grid>
                    </div>
                }
            </ContainerDimensions>

        )
    }
}


