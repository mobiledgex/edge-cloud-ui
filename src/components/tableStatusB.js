import React from 'react';
import { Header, Table, Rating, Dropdown, Icon } from 'semantic-ui-react';
import * as d3 from 'd3';

import { ScaleLoader } from 'react-spinners';
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
const factoryCell = (datas) => (
    datas.map((data, i) => (
        <Table.Row textAlign='center'>
            {data.value.map((value, j) => (
                <Table.Cell><h1>{(i == 0) ? makeIcon(value, 0) : value}</h1></Table.Cell>
            ))}
        </Table.Row>
    ))

)
const trafficTable = (datas) => (
    <Table celled padded stretched attached='middle' className='tableA'>
        {subHeader(datas.value.header)}
        <Table.Body>
            {factoryCell(datas.value.rows)}
        </Table.Body>
    </Table>
)
const TableStatusB = (props) => (

    <div className="tableA">
        {(props.title !== 'hidden') ?
        <Header size='huge' attached='top' className={'cellasHeaderDark'} style={{color:'#fff', backgroundColor:'#0061B6'}}>
            {props.title}
            <div className="speed" style={{}}>{(props.data) ? props.data.value.header2 : null}</div>
        </Header>
        : <span/>}

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

export default TableStatusB;
