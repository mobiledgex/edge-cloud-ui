import React from 'react';
import { Header, Table, Item, Label, Icon, Image, Segment, Grid } from 'semantic-ui-react';
import * as d3 from 'd3';
import styles from './styles';

const ItemExampleDivided = (datas) => (
    <Item.Group divided style={{backbroundColor:'transparent'}}>
        <Item className>
            <Item.Content>
                <Grid textAlign='center' columns={2} divided>
                    <Grid.Row stretched>
                        <Grid.Column>
                            <Grid.Row><div style={{fontSize:20, height:30}}>온도</div></Grid.Row>
                            <Grid.Row>
                                <div style={{float:'left',width:'100%', fontSize:45, textAlign:'center'}}>
                                    {datas.datas.value.rows[1].value[0]}<span style={{position:'absolute', fontSize:20, textAlign:'left', color:'#6bcdff'}}>℃</span>
                                </div>
                            </Grid.Row>
                        </Grid.Column>
                        <Grid.Column>
                            <Grid.Row><div style={{fontSize:20, height:30}}>습도</div></Grid.Row>
                            <Grid.Row>
                                <div style={{float:'left',width:'100%', fontSize:45, textAlign:'center'}}>
                                    {datas.datas.value.rows[1].value[1]}<span style={{position:'absolute', fontSize:20, textAlign:'left', color:'#6bcdff'}}>%</span>
                                </div>
                            </Grid.Row>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Item.Content>
        </Item>

        <Item className="weatherTable">
            <Item.Content>

                <Grid columns={3}>
                    <Grid.Row style={{paddingTop:0}}>
                        <Grid.Column style={styles.reducePadding}>
                            <Segment.Group piled>
                                <Segment>풍속(m/s)</Segment>
                                <Segment>{datas.datas.value.rows[1].value[2]}</Segment>
                            </Segment.Group>
                        </Grid.Column>
                        <Grid.Column style={styles.reducePadding}>
                            <Segment.Group piled>
                                <Segment>풍향</Segment>
                                <Segment>{datas.datas.value.rows[1].value[3]}</Segment>
                            </Segment.Group>
                        </Grid.Column>
                        <Grid.Column style={styles.reducePadding}>
                            <Segment.Group piled>
                                <Segment>가시거리</Segment>
                                <Segment>{factoryCell(datas.datas.value.rows[1].value[4])}</Segment>
                            </Segment.Group>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </Item.Content>
        </Item>

    </Item.Group>
)


//text foramt    http://bl.ocks.org/mstanaland/6106487
const formatComma = d3.format(",");
const subHeader = (datas) => (

    <Table.Header>
      <Table.Row textAlign='center' className='cellasHeaderGray'>
        {datas.map((value) => (
            <Table.HeaderCell fullWidth={true}>{value}</Table.HeaderCell>
        ))}
      </Table.Row>
    </Table.Header>

)
const makeIcon = (icon, value) => (
    <Icon color={
        (value == '0') ? 'green' :
        (value == '1') ? 'yellow' :
        (value == '2') ? 'orange' :
        (value == '3') ? 'red' : 'green'
    } name={icon} size='large' />
)
const makeItemContent = (a, b) => (
    <Grid style={{margin:0, width:250}}>
        <Grid.Column  style={{padding:0, flex:1}}>
            <div style={{flex:1, height:70, lineHeight:'70px', backgroundColor:'#efefef', fontSize:22, color:'#3c3f4a', borderBottom:'1px solid rgba(0,0,0,0.2)'}}>{a}</div>
            <div style={{flex:1, height:85, lineHeight:'85px', backgroundColor:'#efefef'}}>{b}</div>
        </Grid.Column>
    </Grid>
)
const makeItemStyle = (value) => (
    (value <= 1 && value > 0.25)?'blue':(value <= 0.25 && value > 0.1)?'orange':(value <= 0.1 && value > 0.05)?'yellow':(value <= 0.05)?'red':null
)
const makeItemReduce = (value) => (
    (value >= 20)?'20km 이상':(value < 20 && value >= 10)?'10km 이상':(value < 1)?`${value}m`:`${value}km`
)
const setHeaderData = function (datas) {
    datas.unshift({title:'기상정보'})
    return datas;
}
const setCellData = function(items, datas) {
    var newDatas = [];
    newDatas = items.map((item, i) => (
        datas.map((data, j) => (
            {value:(data.value)?data.value.rows[1].value[i] : ''}
        ))
    ))
    return newDatas;
}
const factoryCell = (items) => (

    <div style={{color:makeItemStyle(items)}}>
        {makeItemReduce(items)}
    </div>
)

const trafficItemList = (datas) => (
    <Segment attached style={{backgroundColor:'white !important'}}>
        <ItemExampleDivided datas={datas} />
    </Segment>
)
const TableStatusBMobile = (props) => (

    <div className="tableA">
        {(props.title !== 'hidden') ?
        <Header
            size='huge'
            attached='top'
            className={'cellasHeaderDark'}
            style={{color:'#fff', backgroundColor:'#0061B6', height:50}}

        >
                {props.data.value.header1}
            <div className="speed_M" style={{}}>{(props.data) ? props.data.value.header2 : null}</div>
        </Header>
        : <span/>}

        {(props.data) ? trafficItemList(props.data) : <span>Loading...</span>}

    </div>

)

export default TableStatusBMobile;
