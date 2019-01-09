import React from 'react';
import { Header, Table, Rating, Dropdown, Container } from 'semantic-ui-react';
import * as d3 from 'd3';
import { ScaleLoader } from 'react-spinners';
//text foramt    http://bl.ocks.org/mstanaland/6106487
const formatComma = d3.format(",");

const topHeader = (datas) => (

    <Table.Header>
      <Table.Row textAlign='center' className='cellasHeaderGray' style={{fontSize:16}}>
        {datas.map((value) => (
            <Table.HeaderCell fullWidth={true}>{value}</Table.HeaderCell>
        ))}
      </Table.Row>
    </Table.Header>
)

const factoryCell = (datas) => (
    datas.map((data) => (
        <Table.Row>
            {data.value.map((value) => (
                <Table.Cell textAlign='right'><div style={{flexDirection:'row'}}><h2 style={{display:'inline-block'}}>{formatComma(value)}</h2><h3 style={{display:'inline-block'}}>{'(건)'}</h3></div></Table.Cell>
            ))}
        </Table.Row>
    ))
)

const trafficTable = (datas) => (
    <Table celled padded stretched attached='middle'>
        {topHeader(datas.value.header)}
        <Table.Body>
            {factoryCell(datas.value.rows)}
        </Table.Body>
    </Table>
)
const displayLoader = () => (

        <ScaleLoader
            color={'#185ea7'}
            loading={true}
        />

)
const TableStatusA = (props) => (

    <div className="tableA">
        {(props.title !== 'hidden') ?
        <Header size='huge' attached='top' className={'cellasHeaderDark'} style={{color:'#fff', backgroundColor:'#0061B6'}}>
            {props.title}
        </Header>
        : <span/>}

        {
            (props.data) ? trafficTable(props.data)
            :
            <Table celled padded stretched attached='middle'>
                <Table.Body>
                    <Table.Row>
                        <Table.Cell textAlign='center'>{displayLoader()}</Table.Cell>
                    </Table.Row>
                </Table.Body>
            </Table>
        }

    </div>

)

export default TableStatusA;
