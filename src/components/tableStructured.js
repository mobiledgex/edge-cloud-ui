import React from 'react'
import { Header, Icon, Table } from 'semantic-ui-react'

//<Table.HeaderCell {...dynamicAttributes(value.multi.key, value.multi.value)}>{value.title}</Table.HeaderCell>
const factoryHeader = (props) => (
    <Table.Header>
        {props.map((data, i) => (
            <Table.Row>
                {data.value.map((value) => (
                    (value.multi) ? <Table.HeaderCell {...dynamicAttributes(value.multi.key, value.multi.value)}>{value.title}</Table.HeaderCell>
                : <Table.HeaderCell>{value.title}</Table.HeaderCell>
                ))}
            </Table.Row>

        ))}
    </Table.Header>
)
const lineBreak = (content) => (
    content.replace(/<\s*\/?\s*br\s*.*?>/g, "\n")
)
const factoryRows = (props) => (
    props.map((data, i) => (
        <Table.Row>
            {(data.title) ?
                <Table.Cell {...dynamicAttributes(data.title.multi.key, data.title.multi.value)}>
                    {lineBreak(data.title.title)}
                </Table.Cell>
            : null
            }

            {data.value.map((value) => (
                (value.multi) ? <Table.Cell {...dynamicAttributes(value.multi.key, value.multi.value)}>{value.title}</Table.Cell>
            : <Table.Cell>{value.title}</Table.Cell>
            ))}
        </Table.Row>

    ))
)
const dynamicAttributes = (attribute, value) => {
    let opts = {};
    if( typeof value !== 'undefined' && value !== null) {
        opts[attribute] = value;
        return opts;
    }
    return false;
}
//        <div>{JSON.stringify(datas)}</div>
const TableExampleStructured = (props) => (
    <div className="tableA">
        <Header size='huge' attached='top'>
            {props.title}
        </Header>
        <Table celled attached padded structured width={16} compact='very'>
            {(props.data) ? factoryHeader(props.data.header) : <span>Loading...</span>}
            <Table.Body>
                {(props.data) ? factoryRows(props.data.rows): <span>Loading...</span>}
            </Table.Body>
        </Table>
    </div>

)

export default TableExampleStructured
