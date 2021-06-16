import React from 'react';
import { useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableHead, TableRow } from '@material-ui/core';
import { syntaxHighLighter } from '../../hoc/highLighter/highLighter'
import { time } from '../../utils/date_util'
import {redux_org} from '../../helper/reduxData'
import { perpetual } from '../../helper/constant';

const checkRole = (selectedRole, form) => {
    return form.roles ? form.roles.includes(selectedRole) : true   
}

const getHighLighter = (language, data) => {
    return (
        <div style={{ backgroundColor: 'grey', padding: 1, overflow: 'auto', maxHeight: '50vh', maxWidth: '50vw', border: '1px solid #808080' }}>
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

const isArrayString = (item, data) => {
    return Array.isArray(data) && item.dataType === perpetual.TYPE_STRING
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
    const orgInfo = useSelector(state => state.organizationInfo.data)
    let detailData = props.detailData;

    const getData = (info, item) => {
        let data = info[item.field]
        if (data !== undefined) {
            return (
                item.dataType === perpetual.TYPE_ARRAY ?
                    getArray(data) :
                    item.dataType === perpetual.TYPE_URL ?
                        getURL(data) :
                        item.dataType === perpetual.TYPE_DATE ?
                            getDate(data, item) :
                            item.dataType === perpetual.TYPE_JSON ?
                                getHighLighter('json', JSON.stringify(data, null, 1)) :
                                item.dataType === perpetual.TYPE_YAML ?
                                    getHighLighter('yaml', data.toString()) :
                                    <div style={{ wordBreak: 'break-all' }}>{item.format ? props.formatData(item, info, true) : data}</div>
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
                                        <TableCell key={j} style={{ borderBottom: "none" }}>
                                            {getData(data, item)}
                                        </TableCell>)
                                }))
                            }
                            </TableRow>)
                    })}
                </TableBody>
            </Table>
        )
    }

    const getRow = (id, item, info, subView) => {
        return (
            <TableRow key={id}>
                <TableCell style={{ borderBottom: "none", verticalAlign: 'text-top', width: '20%' }}>{item.label}</TableCell>
                <TableCell style={{ borderBottom: "none" }}>
                    {subView ? info : getData(info, item)}
                </TableCell>
            </TableRow>
        )
    }

    return (
        <Table style={{ width: '100%', backgroundColor: '#292c33', border: 'none' }}>
            <TableBody>
                {props.keys.map((item, i) => {
                    let data = detailData[item.field]
                    return (
                        checkRole(redux_org.role(orgInfo), item) ?
                            (data !== undefined && (item.detailView === undefined || item.detailView)) ?
                                item.keys ?
                                    data.length > 0 ?
                                        getRow(i, item, subView(item.keys, data), true) : null
                                    :
                                    isArrayString(item, data) ? getArrayRow(i, item, data) :
                                        getRow(i, item, detailData) :
                                null
                            : null
                    )
                })}
            </TableBody>
        </Table>
    )
}

export default MexDetailViewer;
