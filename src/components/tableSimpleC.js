import React from 'react';
import { Header, Table, Rating, Dropdown } from 'semantic-ui-react';

const getTableRow = () => {

    var rows = data.map( (value, i) => (

        <Table.Row>
            <Table.Cell textAlign='right'>본관</Table.Cell>
            <Table.Cell textAlign='right'>안경미</Table.Cell>
            <Table.Cell textAlign='right'>i</Table.Cell>
            <Table.Cell textAlign='right'>안경미</Table.Cell>
            <Table.Cell textAlign='right'>i</Table.Cell>
            <Table.Cell textAlign='right'>안경미</Table.Cell>
            <Table.Cell textAlign='right'>i</Table.Cell>
            <Table.Cell textAlign='right'>안경미</Table.Cell>
        </Table.Row>

    ));

    return rows;
}
const stateOptions = [ { key: 'AL', value: 'AL', text: 'Alabama' }, { key: 'BB', value: 'BB', text: 'Blabama' }  ]
const getSelect = () => (
    <div><Dropdown width='80px' placeholder='State' search selection options={stateOptions} /></div>
)

const data = [] ;
for(var i=0; i<4; i++){
    data.push({i:"Name"+Math.random()*32});
}
const trafficTable = () => (
    <Table celled padded stretched className='very-compact' attached='middle'>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>구 분</Table.HeaderCell>
                <Table.HeaderCell>룸온도(%)</Table.HeaderCell>
                <Table.HeaderCell>룸습도(%)</Table.HeaderCell>
                <Table.HeaderCell>밧데리1온도</Table.HeaderCell>
                <Table.HeaderCell>밧데리2온도</Table.HeaderCell>
                <Table.HeaderCell>밧데리3온도</Table.HeaderCell>
                <Table.HeaderCell>밧데리4온도()</Table.HeaderCell>
                <Table.HeaderCell>전압</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {getTableRow()}
        </Table.Body>
    </Table>
)
class TableSimpleC extends React.Component {
    render() {
        return (
            <div className="tableA">
                <Header size='huge' attached='top'>
                    {this.props.title}
                </Header>

                {trafficTable()}

            </div>
        )
    }
}
TableSimpleC.defaultProps = {
    title: 'No Title'
}
export default TableSimpleC;
