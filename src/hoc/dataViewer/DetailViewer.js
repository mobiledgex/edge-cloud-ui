import React from 'react';
import ReactJson from 'react-json-view';
import {Table, TableHead, TableRow, TableBody, TableCell} from '@material-ui/core';
import * as constant from '../../constant'
import * as JsonUtils from '../../utils/JsonUtil'
import {getUserRole} from '../../services/model/format';
import SyntaxHighlighter from 'react-syntax-highlighter';
import allyDark from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';

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

const checkRole = (form) => {
    let roles = form.roles
    if (roles) {
        let visible = false
        for (let i = 0; i < roles.length; i++) {
            let role = roles[i]
            if (role === getUserRole()) {
                visible = true
                break;
            }
        }
        return visible
    }
    return true
}

const getJson = (data, item) => {
    try {
        if (item.dataType === constant.TYPE_YAML) {
            data = JsonUtils.YAMLtoJSON(data)
        }
        return <ReactJson src={data} {...jsonViewProps} />
    } catch (e) {
        return data
    }
}
const subView = (keys, dataList) => {
    return (
        <Table size='small'>
            <TableHead>
                <TableRow>
                    {keys.map((item, i) => {
                        return <TableCell key={i}>{item.label}</TableCell>
                    })}
                </TableRow>
            </TableHead>
            <TableBody>
                {dataList.map((data, i) => {
                    return (
                        <TableRow key={i} style={{backgroundColor: i % 2 === 0 ? '#1E2123' : 'transparent'}}>{(
                            keys.map((item, j) => {
                                return (
                                    <TableCell key={j} style={{borderBottom: "none"}}>
                                        {item.dataType === constant.TYPE_JSON || item.dataType === constant.TYPE_YAML ?
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

    function renderDeploymentManifestByType(manifestDeploymentData, item) {
        if (item.dataType === constant.TYPE_JSON) {
            return getJson(manifestDeploymentData, item)
        } else {//@DESC:YAML TYPE
            return (
                <div
                    style={{
                        backgroundColor: 'grey', padding: 1,
                    }}
                >
                    <SyntaxHighlighter language="yaml" style={allyDark}>
                        {manifestDeploymentData.toString()}
                    </SyntaxHighlighter>
                </div>
            )
        }
    }

    return (
        <TableRow key={id}>
            <TableCell style={{borderBottom: "none", verticalAlign: 'text-top', width: '20%'}}>{item.label}</TableCell>
            <TableCell style={{borderBottom: "none"}}>
                {item.dataType === constant.TYPE_JSON || item.dataType === constant.TYPE_YAML ?
                    renderDeploymentManifestByType(data, item)
                    :
                    <p style={{wordBreak: 'break-all'}}>{item.customizedData ? item.customizedData(data, true) : data}</p>
                }
            </TableCell>
        </TableRow>
    )
}

const MexDetailViewer = (props) => {
    let detailData = props.detailData;
    return (
        <Table style={{width: '100%', backgroundColor: '#2A2C33', border: 'none'}}>
            <TableBody>
                {props.keys.map((item, i) => {
                    let data = detailData[item.field]
                    return (
                        checkRole(item) ?
                            (data !== undefined && (item.detailView === undefined || item.detailView)) ?
                                item.keys ?
                                    data.length > 0 ?
                                        getRow(i, item, subView(item.keys, data)) : null
                                    :
                                    getRow(i, item, data) :
                                null
                            : null
                    )
                })}
            </TableBody>
        </Table>
    )
}

export default MexDetailViewer;
