import React from 'react';
import ReactJson from 'react-json-view';
import { Card, Table, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core';
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
        <Table size='small'>
            <TableHead>
                <TableRow>
                    {keys.map((item, i) => {
                        return <TableCell style={{ borderBottom: "none" }} key={i}>{item.label}</TableCell>
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {dataList.map((data, i) => {
                    return (
                        <TableRow key={i}>{(
                            keys.map((item, j) => {
                                return (
                                    <TableCell key={j} style={{ borderBottom: "none" }}>
                                        {item.dataType === constant.TYPE_JSON || item.dataType === constant.TYPE_JSON_NEW_LINE ?
                                            getJson(data[item.field], item) :
                                            data[item.field]}
                                    </TableCell>)
                            }))
                        }
                        </TableRow>)
                })}
            </TableBody>
        </Table>
    )
}

const getRow = (id, item, data) => {
    return (
        <TableRow key={id} verticalAlign='top'>
            <TableCell style={{ borderBottom: "none" }}>{item.label}</TableCell>
            <TableCell style={{ borderBottom: "none" }}>
                {item.dataType === constant.TYPE_JSON || item.dataType === constant.TYPE_JSON_NEW_LINE ?
                    getJson(data, item) :
                    item.customizedData ? item.customizedData(data, true) : data}
            </TableCell>
        </TableRow>
    )
}

const MexDetailViewer = (props) => {
    let detailData = props.detailData;
    return (
        <Table celled style={{ width: '100%', backgroundColor: '#2A2C33', border: 'none'}}>
                <TableBody>
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
                </TableBody>
            </Table>
    )
}

export default MexDetailViewer;