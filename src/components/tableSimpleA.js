import React from 'react';
import { Header, Table, Rating, Dropdown } from 'semantic-ui-react';

const getTableRow = (data) => {

    var rows = data.map( (value, i) => (

        <Table.Row>
            <Table.Cell textAlign='right'>{i}</Table.Cell>
            <Table.Cell textAlign='right'>안경미</Table.Cell>
            <Table.Cell textAlign='right'>{i}</Table.Cell>
            <Table.Cell textAlign='right'>안경미</Table.Cell>
        </Table.Row>

    ));

    return rows;
}

/*
<Table.Row>
    <Table.Cell textAlign='right'>{datas.title}</Table.Cell>
</Table.Row>
i == 0
<Table.Row>
    <Table.Cell>
i == 1
<Table.Cell>
..
i == 5
</Table.Row>
<Table.Row>
    <Table.Cell>
i == 6

*/
let templist = [];
const getValue =(datas, k, i) => {
    let columnCnt = 4;


    return (datas[i]) ? datas[i][k] : '';

}
let rowCnt = 0;
const trafficTable = (props) => (
    <Table celled padded stretched className='very-compact' attached='middle'>
        <Table.Body>
            {props.value.map((datas, i) => (
                (i%2 === 0) ?
                    <Table.Row>
                        <Table.Cell textAlign='right'>{getValue(props.value, 'title', i)}</Table.Cell>
                        <Table.Cell textAlign='right'>{getValue(props.value, 'value', i)}</Table.Cell>
                        <Table.Cell textAlign='right'>{getValue(props.value, 'title', i+1)}</Table.Cell>
                        <Table.Cell textAlign='right'>{getValue(props.value, 'value', i+1)}</Table.Cell>
                    </Table.Row>
                :
                null
            ))}
        </Table.Body>
    </Table>
)
const TableSimpleA = (props) => (

        <div className="tableA">
            {(props.title !== 'hidden') ?
                <div as='h1' attached='top' style={{color:'#fff',backgroundColor:'#000000', padding:'3px'}}>
                    {props.title}
                </div>
            : <span/>}

            {(props.data) ? trafficTable(props.data) : <span>Loading...</span>}

        </div>

)

export default TableSimpleA;
