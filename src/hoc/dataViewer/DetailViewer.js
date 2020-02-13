import React from 'react';
import {Table } from 'semantic-ui-react'
import ReactJson from 'react-json-view';

const jsonViewProps = {
    name: null,
    theme: "monokai",
    collapsed: false,
    collapseStringsAfter: 15,
    onAdd: false,
    onEdit: false,
    onDelete: false,
    displayObjectSize: true,
    enableClipboard: true,
    indentWidth: 4,
    displayDataTypes: false,
    iconStyle: "triangle"
}
const subView = (layouts, dataList) => {
    return (
        dataList && dataList.length>0 ?
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
                        <Table.Row key={i}>{(
                            layouts.map((layout, j) => {
                                return (
                                    <Table.Cell key={j}>
                                        {layout.type === 'JSON' ? 
                                            <ReactJson src={data[layout.key]} {...jsonViewProps} /> : 
                                            data[layout.key]}
                                    </Table.Cell>)
                            }))
                        }
                        </Table.Row>)
                })}
            </Table.Body>
        </Table> : 
        'None'
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