import React from 'react';
import {Table, TableBody, TableCell, TableHead, TableRow} from '@material-ui/core';
import * as constant from '../../constant'
import {getUserRole} from '../../services/model/format';
import {syntaxHighLighter} from '../../hoc/highLighter/highLighter'
import {time} from '../../utils/date_util'

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

const getHighLighter = (language, data) => {
    return (
        <div style={{backgroundColor: 'grey', padding: 1, overflow:'auto', maxHeight:'50vh', maxWidth:'50vw', border:'1px solid #808080'}}>
            {syntaxHighLighter(language, data.toString())}
        </div>
    )
}

const getURL = (data) => {
    return (
        <a href={data} target="_blank">{data}</a>
    )
}

const getDate = (data, item) => {
    let date = item.date
    if (date.dataFormat === 'seconds') {
        data = data * 1000
    }
    return (
        time(date.format, data)
    )
}

const getArray = (dataList) => {
    let value = ''
    dataList.map((data, i) => {
        value = value + data
        value = value + (i !== dataList.length - 1 ? ', ' : '')
    })
    return value
}

const isArrayString = (item, data)=>
{
    return Array.isArray(data) && item.dataType === constant.TYPE_STRING
}

const getArrayRow = (id, item, dataList) => {
    return (
        <TableRow key={id}>
            <TableCell style={{ borderBottom: "none", verticalAlign: 'text-top', width: '20%' }}>{item.label}</TableCell>
            <TableCell style={{ borderBottom: "none" }}>
                <Table size='small'>
                    <TableBody>
                        {dataList.map((data, i) => {
                            return (
                                <TableRow key={i} style={{ backgroundColor: i % 2 === 0 ? '#1E2123' : 'transparent' }}>{(
                                    <TableCell style={{ borderBottom: "none" }}>
                                        <p style={{ wordBreak: 'break-all' }}>{data}</p>
                                    </TableCell>)
                                }
                                </TableRow>)
                        })}
                    </TableBody>
                </Table>
            </TableCell>
        </TableRow>
    )
}



const MexDetailViewer = (props) => {
    let detailData = props.detailData;

    const getData = (data, item) => {
        if (data !== undefined) {
            return (
                item.dataType === constant.TYPE_ARRAY ?
                    getArray(data) :
                    item.dataType === constant.TYPE_URL ?
                        getURL(data) :
                        item.dataType === constant.TYPE_DATE ?
                            getDate(data, item) :
                            item.dataType === constant.TYPE_JSON ?
                                getHighLighter('json', JSON.stringify(data, null, 1)) :
                                item.dataType === constant.TYPE_YAML ?
                                    getHighLighter('yaml', data.toString()) :
                                    <div style={{ wordBreak: 'break-all' }}>{item.customizedData ? item.customizedData(detailData, true) : data}</div>
            )
        }
    }
    
    
    const subView = (keys, dataList) => {
        return (
            <Table size='small'>
                {keys.length > 1 ? <TableHead>
                    <TableRow>
                        {keys.map((item, i) => {
                            return <TableCell key={i}>{item.label}</TableCell>
                        })}
                    </TableRow>
                </TableHead> : null}
                <TableBody>
                    {dataList.map((data, i) => {
                        return (
                            <TableRow key={i} style={{ backgroundColor: i % 2 === 0 ? '#1E2123' : 'transparent' }}>{(
                                keys.map((item, j) => {
                                    return (
                                        <TableCell key={j} style={{borderBottom: "none"}}>
                                            {getData(data[item.field], item)}
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
            <TableRow key={id}>
                <TableCell style={{borderBottom: "none", verticalAlign: 'text-top', width: '20%'}}>{item.label}</TableCell>
                <TableCell style={{borderBottom: "none"}}>
                    {getData(data, item)}
                </TableCell>
            </TableRow>
        )
    }

    return (
        <Table style={{width: '100%', backgroundColor: '#292c33', border: 'none'}}>
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
                                    isArrayString(item, data) ? getArrayRow(i, item, data) :
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
