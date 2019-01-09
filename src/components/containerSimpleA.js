import React from 'react';
import { Header, Table, Rating, Dropdown, Segment } from 'semantic-ui-react';

const getTableRow = () => {

    var rows = data.map( (value, i) => (

        <Table.Row>
            <Table.Cell textAlign='right'>i</Table.Cell>
            <Table.Cell textAlign='right'>i</Table.Cell>
            <Table.Cell textAlign='right'>i</Table.Cell>
            <Table.Cell textAlign='right'>i</Table.Cell>
            <Table.Cell textAlign='right'>i</Table.Cell>
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
const data = [] ;
for(var i=0; i<4; i++){
    data.push({i:"Name"+Math.random()*32});
}
const container = () => (
    <Table attached>{getTableRow()}</Table>
)
class ContainerSimpleA extends React.Component {
    render() {
        return (
            <div className="tableA">
                {(this.props.title !== 'hidden') ?
                <Header size='huge' attached='top'>
                    {this.props.title}
                </Header>
                : <span/>}

                {container()}

            </div>
        )
    }
}
ContainerSimpleA.defaultProps = {
    title: 'No Title'
}
export default ContainerSimpleA;
