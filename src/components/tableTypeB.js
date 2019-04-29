import React from 'react';
import { Header, Table, Rating, Dropdown } from 'semantic-ui-react';

const getTableRow = () => {

    var rows = data.map( (value, i) => (
    (i == 0) ?
        <Table.Row className='cellasHeader'>
            <Table.Cell textAlign='center' singleLine>구분</Table.Cell>
            <Table.Cell textAlign='center'>현금</Table.Cell>
            <Table.Cell textAlign='center'>하이패스</Table.Cell>
            <Table.Cell textAlign='center'>전자카드</Table.Cell>
            <Table.Cell textAlign='center'>교통카트</Table.Cell>
            <Table.Cell textAlign='center'>기타</Table.Cell>
            <Table.Cell textAlign='center'>합계</Table.Cell>
        </Table.Row>
    : (i == 5) ?
        <Table.Row green>
            <Table.Cell className="green" textAlign='right'>전년월평균</Table.Cell>
            <Table.Cell className="green" textAlign='right'>12,345</Table.Cell>
            <Table.Cell className="green" textAlign='right'>12,345</Table.Cell>
            <Table.Cell className="green" textAlign='right'>12,345</Table.Cell>
            <Table.Cell className="green" textAlign='right'>12,345</Table.Cell>
            <Table.Cell className="green" textAlign='right'>12,345</Table.Cell>
            <Table.Cell className="green" textAlign='right'>12,345</Table.Cell>
        </Table.Row>
    : (i == 6) ?
        <Table.Row>
            <Table.Cell className='sky' textAlign='right'>평균</Table.Cell>
            <Table.Cell className='sky' textAlign='right'>2,345</Table.Cell>
            <Table.Cell className='sky' textAlign='right'>2,345</Table.Cell>
            <Table.Cell className='sky' textAlign='right'>2,345</Table.Cell>
            <Table.Cell className='sky' textAlign='right'>2,345</Table.Cell>
            <Table.Cell className='sky' textAlign='right'>2,345</Table.Cell>
            <Table.Cell className='sky' textAlign='right'>2,345</Table.Cell>
        </Table.Row>
    :
        <Table.Row>
            <Table.Cell textAlign='right'>인천공항</Table.Cell>
            <Table.Cell textAlign='right'>2,345</Table.Cell>
            <Table.Cell textAlign='right'>2,345</Table.Cell>
            <Table.Cell textAlign='right'>2,345</Table.Cell>
            <Table.Cell textAlign='right'>2,345</Table.Cell>
            <Table.Cell textAlign='right'>2,345</Table.Cell>
            <Table.Cell textAlign='right'>2,345</Table.Cell>
        </Table.Row>
    ));

    return rows;
}
const stateOptions = [ { key: 'AL', value: 'AL', text: 'Alabama' }, { key: 'BB', value: 'BB', text: 'Blabama' }  ]
const getSelect = () => (
    <div><Dropdown width='80px' placeholder='State' search selection options={stateOptions} /></div>
)
const footer =() => (
    <Table.Footer attached="bottom">
        <Table.Row>
            <Table.HeaderCell textAlign='right'>평균<br/><div>test</div></Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>{getSelect()}</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>2,345</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>2,345</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>2,345</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>2,345</Table.HeaderCell>
            <Table.HeaderCell textAlign='right'>2,345</Table.HeaderCell>
        </Table.Row>
    </Table.Footer>
)
const data = [1,2,3,4,5,6,7];
const trafficTable = () => (
    <Table celled padded stretched className='very-compact' attached='middle'>
        <Table.Body>
            {getTableRow()}
        </Table.Body>
    </Table>
)
class TableTrafficMountB extends React.Component {
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
TableTrafficMountB.defaultProps = {
    title: 'No Title'
}
export default TableTrafficMountB;
