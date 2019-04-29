import React from 'react';
import { Header, Table, Rating, Dropdown, Icon, Grid } from 'semantic-ui-react';
import * as d3 from 'd3';

import { ScaleLoader } from 'react-spinners';
//text foramt    http://bl.ocks.org/mstanaland/6106487
const formatComma = d3.format(",");

const subHeader = (datas) => (

    <Table.Header>
      <Table.Row textAlign='center' className='bridgeName' style={{fontSize:24}}>
        {datas.map((item) => (
            <Table.HeaderCell fullWidth={true} height={95}><div>{(item.value)?item.value.header1:item.title}</div><div>{(item.value)?item.value.header2:null}</div></Table.HeaderCell>
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
const factoryCell = (headers, cellDatas, items) => (
    headers.map((dataTitle, i) => (
        <Table.Row textAlign='center'>
            {cellDatas[i].map((data, j) => (
                <Table.Cell style={{padding:0}}><div style={{fontSize:28, flex:1, color:(items[i].indexOf('find') > -1)?makeItemStyle(data.value):null}}>{(j == 0) ? makeItemContent(dataTitle, makeIcon(items[i], 0)) : (items[i].indexOf('find') > -1)?makeItemReduce(data.value):data.value}</div></Table.Cell>
            ))}
        </Table.Row>
    ))

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
const trafficTable = (datas) => (
    <Table striped stretched attached='middle' className='tableB'>
        {subHeader(setHeaderData(datas))}
        <Table.Body>
            {factoryCell(datas[1].value.header, setCellData(datas[1].value.header, datas), datas[1].value.rows[0].value)}
        </Table.Body>
    </Table>
)
const TableStatusC = (props) => (

    <div className="tableB">


        {(props.data) ? trafficTable(props.data)
            : <div className="loadingBox">
                <ScaleLoader
                    color={'#185ea7'}
                    loading={true}
                />
              </div>
        }

    </div>

)

export default TableStatusC;
