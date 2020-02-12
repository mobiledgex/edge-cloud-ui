import React from 'react';
import {Table } from 'semantic-ui-react'

const subView = (layouts, dataList) => {
    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    {layouts.map((layout, i) => {
                        return <Table.HeaderCell key={i}>{layout.label}</Table.HeaderCell>
                    })}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {dataList.map((data, i) => {
                    return (
                        <Table.Row >{(
                            layouts.map((layout, j) => {
                                return (
                                    <Table.Cell key={j}>
                                        {data[layout.key]}
                                    </Table.Cell>)
                            }))
                        }
                        </Table.Row>)
                })}
            </Table.Body>
        </Table>
    )
}
const MexDetailViewer = (props) => {
    let detailData = props.detailData;
    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Key</Table.HeaderCell>
                    <Table.HeaderCell>Value</Table.HeaderCell>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {props.layouts.map((layout, i) => {
                    return(
                        detailData[layout.key]!== undefined ?
                        <Table.Row key={i}>
                            <Table.Cell>{layout.label}</Table.Cell>
                            <Table.Cell>
                                {layout.layouts ? subView(layout.layouts, detailData[layout.key]) : detailData[layout.key]}
                            </Table.Cell>
                        </Table.Row> : 
                        null
                        
                    )
                })}
            </Table.Body>
        </Table>
    )
}

export default MexDetailViewer;