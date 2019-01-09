import React, { Component } from 'react';
import { Grid, Header, Segment, Table, Icon, Card } from 'semantic-ui-react';
import { ScaleLoader } from 'react-spinners';
import ScrollArea from 'react-scrollbar';
import moment from 'moment';
import * as service from "../services/service_fms_temtemo";
import TableUpsBattery from '../components/tableUpsBattery';
import EnvironmentStatus from '../container/envrmentStatus';

const centersFMS = (props) => (
    <div>
        <Table attached='top'  style={{height:30}}>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>{props.thyName}</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        </Table>
        <div></div>
        <Table singleLine compact style={{padding:0}}>
            <Table.Header>
                <Table.Row>
                    {props.header.map((header, i) => (
                        <Table.HeaderCell key={i} width={2}>{props.columns[header]}</Table.HeaderCell>
                    ))}
                </Table.Row>
            </Table.Header>

            <Table.Body>
                <Table.Row>
                    {props.rows[0].value.map((vl, i) => (
                        <Table.Cell key={i}>{vl + ((i === 0) ? ' ℃' : (i === 1) ? ' %' : '')}</Table.Cell>
                    ))}
                </Table.Row>
            </Table.Body>
        </Table>


        <Table attached='top' className='scrollList'>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell width={5} >발생시각</Table.HeaderCell>
                    <Table.HeaderCell >알람명</Table.HeaderCell>
                    <Table.HeaderCell width={3} >상태</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
        </Table>

        <ScrollArea
                    speed={0.8}
                    className="area"
                    contentClassName="content"
                    horizontal={false}
                    style={{height:70}}
                    >


            <Table attached='bottom' compact style={{padding:0}}>
                <Table.Body>
                    {(props.status) ? props.status.map((state,i) => (
                        <Table.Row key={i}>
                            <Table.Cell width={5}>{ (Object.keys(state)[0] === 'null') ? '': moment(state[Object.keys(state)[1]]).format('YYYY-MM-DD hh:mm') }</Table.Cell>
                            <Table.Cell>{ props.statusKeys[Object.keys(state)[0]] }</Table.Cell>
                            <Table.Cell width={3}>
                            { (Object.keys(state)[0] === 'null') ? <Icon name="circle" style={{color:'black'}}/>: (state[Object.keys(state)[0]] === 1) ? <Icon name="circle" style={{color:'red'}}/> : <Icon name="circle" style={{color:'#00a0eb'}} />}
                            { (Object.keys(state)[0] === 'null') ? '': (state[Object.keys(state)[0]] === 1) ? '심각' :'관리' }</Table.Cell>
                        </Table.Row>
                    )) :
                    [0,1,2].map(() => (
                        <Table.Row>
                            <Table.Cell>-</Table.Cell>
                            <Table.Cell>-</Table.Cell>
                            <Table.Cell>-</Table.Cell>
                        </Table.Row>
                        ))
                    }

                </Table.Body>
            </Table>
      </ScrollArea>
    </div>
)

let self = null;
class PageSeven extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            dataTHE:null,
            dataUPS:null,
            dataStatus:null
        }
        self = this;
    }

    componentDidMount() {
        //if(this.props && this.props.data) this.props.data = {};
        console.log('did mount pageOne...')
        self = this;

        //환경감시
        service.getUpsStatusInfos('upsStatusInfos',1, self.receiveDataStatus, 60);
        //황온항습기
        service.getThermoHygrostatInfos('thermoHygrostatInfos',1, self.receiveData, 60);
        //ups battery
        service.getUpsBatteryStatusInfos('upsBatteryStatusInfos',1, self.receiveDataUPS, 60);

    }
    receiveData(result) {
        self.setState({dataTHE:result})
    }
    receiveDataUPS(result) {
        self.setState({dataUPS:result})
    }
    receiveDataStatus(result) {
        self.setState({dataStatus:result})
    }
    render() {
        let { dataTHE, dataStatus, dataUPS } = this.state;
        return (

            <Grid className='transp'>
                <Grid.Row columns={2} stretched>
                    <Grid.Column className='fmsLeftPan' width={5}>
                        <Segment className='nblue'>
                            <Header as='h2'>항온항습기 모니터링</Header>
                            <Grid>

                                {(dataTHE) ?
                                    dataTHE.map((data, i)=> (
                                        <Grid.Row key={i} style={(i === 0) ? {paddingTop:0} : {}}>
                                            <Grid.Column>{centersFMS(data.value)}</Grid.Column>
                                        </Grid.Row>
                                    ))

                                    :

                                    <ScaleLoader
                                        color={'#123abc'}
                                        loading={true}
                                    />
                                }
                            </Grid>
                        </Segment>
                    </Grid.Column>
                    <Grid.Column style={{flex:'auto'}} width={11}>
                        <Segment className='nblue'>
                            <Header as='h2'>환경감시 모니터링</Header>
                            <EnvironmentStatus data={dataStatus} />
                        </Segment>
                        <Segment className='nblue'  style={{marginTop:0}}>
                            <Header as='h2'>UPS 배터리 모니터링</Header>
                            <TableUpsBattery data={dataUPS} />
                        </Segment>
                    </Grid.Column>
                </Grid.Row>

            </Grid>

        )
    }

};
export default PageSeven;
