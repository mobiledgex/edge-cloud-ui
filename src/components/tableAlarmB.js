import React, { Component } from 'react';
import { Header, Table, Container, Icon, Button } from 'semantic-ui-react';
import { ScaleLoader } from 'react-spinners';
//import Speech from 'speak-tts';
import AudioPlayer from '../components/audioPlayer';
import ScrollArea from 'react-scrollbar';
import styles from "./styles";


const headerColSizes = [1,2,2,2,4,2,2,2,2,2,2,2,2,2]

const makeCell = (datas, type, icon) => {
    if(datas){
        if(type == 'A') {

            if(datas.value) {
                return datas.value.map((value, i) => (
                    (i === 0 && value) ?
                        <Table.Cell  singleLine textAlign='center' width={1} style={{height:25}}><Icon color={
                            (value === '0' || value === 'info') ? 'green' :
                                (value === '1' || value === 'minor') ? 'yellow' :
                                    (value === '2' || value === 'major') ? 'orange' :
                                        (value === '3' || value === 'critical') ? 'red' : (value === '4' || value === 'down') ? 'grey' : 'blue'
                        } name={icon} size='mini' /></Table.Cell>
                        :

                        <Table.Cell singleLine textAlign='center' width={2} style={{height:25}}>{value}</Table.Cell>

                ))
            } else {
                return [0,1,2,3,4].map((item) => (
                    <Table.Cell singleLine textAlign='center' width={1} style={{height:25}}></Table.Cell>
                ))
            }


        } else if(type === 'B') {

            if(datas.value) {
                return datas.value.map((value, i) => (
                    (i === 0 && value) ?
                        <Table.Cell  singleLine textAlign='center' width={1} style={{height:25}}><Icon color={
                            (value === 'N') ? 'red' :
                                (value === 'Y') ? 'blue' : 'blue'
                        } name={icon} size='mini' /></Table.Cell>
                        :

                        <Table.Cell singleLine textAlign='center' width={2} style={{height:25}}>{value}</Table.Cell>

                ))
            } else {
                return [0,1,2,3,4].map((item) => (
                    <Table.Cell singleLine textAlign='center' width={1} style={{height:25}}></Table.Cell>
                ))
            }
        }


    } else {
        <Table.Cell textAlign='right'>{'Loading...'}</Table.Cell>
    }
}
const getTableRow = (datas, type) => {
    var rows = null;
    let dummy = {title:'', vlaue:['','','','','']};
    console.log('자료수집 == '+ JSON.stringify(datas))
    if(datas) {
        if(!datas.value.rows) datas.value.rows = [dummy];
        if(datas.value.rows.length < 5) datas.value.rows = datas.value.rows.concat([dummy,dummy,dummy,dummy,dummy,dummy,dummy]);
        rows = datas.value.rows.map( (datas, i) => (

            <Table.Row>
                {makeCell(datas, type, 'alarm')}
            </Table.Row>

        ));
    } else {
        rows = (<Table.Row>
            <Table.Cell textAlign='center'>Loading..</Table.Cell>
        </Table.Row>)
    }

    return rows;
}


const displayLoader = () => (
    <Container className='loadingBox'>
        <ScaleLoader
            color={'#185ea7'}
            loading={true}
        />
    </Container>
)
let count = 0;
class TableAlarmB extends Component {
    state = {
        data: null,
        soundToggle:true
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data) {
            console.log('차로 자료 데이터 받음 => => '+JSON.stringify(nextProps.data));
            this.setState({data:nextProps.data})
        }
    }
    getHeader = (datas) => (

            <Table.Header style={{height:30}}>

                <Table.Row>
                    {
                        (datas.value.header) ? datas.value.header.map((value, i) => (
                            <Table.HeaderCell singleLine width={headerColSizes[i]} fullWidth textAlign='center'  style={styles.topHeaderPlat}>{value}</Table.HeaderCell>
                        )) : null

                    }

                </Table.Row>

            </Table.Header>



    )

    trafficTable = (datas, type) => (

        <ScrollArea
            ref={ref => this.mother = ref}
            speed={0.8}
            className="area"
            contentClassName="content"
            horizontal={false}
            style={{height:(this.props.height) ? this.props.height : 100}}
        >
            <Table celled className='very-compact' attached size='small' style={{height:'200px'}}>
                {this.getHeader(datas)}

                {getTableRow(datas, type)}

            </Table>
        </ScrollArea>

    )
    soundONOFF() {
        this.setState({soundToggle: !this.state.soundToggle})
    }
    render () {
        return (
            <div className="tableA" style={{flex:1}}>

                <Header size='huge' attached='top' textAlign='center'>
                    {(this.props.title) ? this.props.title : 'No Title'}
                    <Button circular icon={(this.state.soundToggle) ? 'volume up' : 'volume off'} style={{right:10, position:'absolute'}} onClick={() => this.soundONOFF()} />
                </Header>
                <AudioPlayer aid={this.props.alarmId} data={this.state.data} volume={this.state.soundToggle}/>
                {(this.state.data) ?
                    this.trafficTable(this.state.data, this.props.type)
                    :
                    displayLoader()
                }
            </div>
        )
    }
}

export default TableAlarmB;
