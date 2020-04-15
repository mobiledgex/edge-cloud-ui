import React from 'react';
import { Table } from 'semantic-ui-react'
import ReactJson from 'react-json-view';
import { Card } from '@material-ui/core';
import * as constant from '../../constant'
import * as JsonUtils from '../../utils/JsonUtil'

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
const getJson = (data, item) =>
{
   if(item.dataType === constant.TYPE_JSON_NEW_LINE)
   {
       data = JsonUtils.newLineToJsonObject(data)
   }
   return <ReactJson src={data} {...jsonViewProps} />
}
const subView = (keys, dataList) => {
    return (
        <Table celled>
            <Table.Header>
                <Table.Row>
                    {keys.map((item, i) => {
                        return <Table.HeaderCell key={i}>{item.label}</Table.HeaderCell>
                    })}
                </Table.Row>
            </Table.Header>
            <Table.Body>
                {dataList.map((data, i) => {
                    return (
                        <Table.Row key={i}>{(
                            keys.map((item, j) => {
                                return (
                                    <Table.Cell key={j}>
                                        {item.dataType === constant.TYPE_JSON || item.dataType === constant.TYPE_JSON_NEW_LINE ?
                                            getJson(data[item.field], item) :
                                            data[item.field]}
                                    </Table.Cell>)
                            }))
                        }
                        </Table.Row>)
                })}
            </Table.Body>
        </Table>
    )
}

const getRow = (id, item, data) => {
    return (
        <Table.Row key={id} verticalAlign='top'>
            <Table.Cell>{item.label}</Table.Cell>
            <Table.Cell>
                {item.dataType === constant.TYPE_JSON || item.dataType === constant.TYPE_JSON_NEW_LINE ?
                    getJson(data, item) :
                    item.customizedData ? item.customizedData(data, true) : data}
            </Table.Cell>
        </Table.Row>
    )
}

const MexDetailViewer = (props) => {
    let detailData = props.detailData;
    return (
        <Card style={{width:'100%', backgroundColor:'transparent', color:'white'}}>
            <Table celled style={{ width: '100%', backgroundColor: '#2A2C33', border: 'none'}}>
                {
                    (props.showHeader === undefined || props.showHeader) ?
                        <Table.Header>
                            <Table.Row>
                                <Table.HeaderCell>Key</Table.HeaderCell>
                                <Table.HeaderCell>Value</Table.HeaderCell>
                            </Table.Row>
                        </Table.Header> : null
                }
                <Table.Body>
                    {props.keys.map((item, i) => {
                        let data = detailData[item.field]
                        return (
                            (data !== undefined && (item.detailView === undefined || item.detailView))?
                                item.keys ?
                                    data.length > 0 ?
                                        getRow(i, item, subView(item.keys, data)) : null
                                    :
                                    getRow(i, item, data) :
                                null

                        )
                    })}
                </Table.Body>
            </Table>
            
        </Card>
    )
}

export default MexDetailViewer;