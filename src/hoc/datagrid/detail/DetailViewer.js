import React from 'react';
import { useSelector } from "react-redux";
import { Table, TableBody, TableCell, TableHead, TableRow, Divider, makeStyles, Card } from '@material-ui/core';
import { syntaxHighLighter } from '../../highLighter/highLighter'
import { time } from '../../../utils/date_util'
import { redux_org } from '../../../helper/reduxData'
import { perpetual } from '../../../helper/constant';
import clsx from 'clsx';

const useStyles = makeStyles((theme) => ({
    container: {
        height: 'calc(100vh - 109px)',
        backgroundColor: '#292c33',
        borderRadius: 5,
        overflowY: 'auto',
        marginTop: 5
    },
    compactcontainer: {
        maxHeight: 'calc(100vh - 109px)',
        backgroundColor: '#292c33',
        borderRadius: 5,
        overflowY: 'auto',
        marginTop: 5
    },
    table_row: {
        '&:hover': {
            backgroundColor: '#181a1f',
            boxShadow: '0px 2px 8px #181a1f'
        }
    },
    main_label: {
        marginLeft: 10
    },
    table_cell_label: {
        borderBottom: "none",
        verticalAlign: 'text-top',
        width: '20%'
    },
    table_cell_value: {
        borderBottom: "none"
    },
    textColor: {
        color: '#E8E8E8'
    },
    bottomBorder: {
        borderBottom: 'none'
    }
}));

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

const getArrayRow = (id, item, dataList, classes) => {
    return (
        <TableRow key={id}>
            <TableCell className={classes.table_cell_label}><strong className={clsx(classes.main_label, classes.textColor)}>{item.label}</strong></TableCell>
            <TableCell className={classes.table_cell_value}>
                <Table size='small'>
                    <TableBody>
                        {dataList.map((data, i) => {
                            return (
                                <TableRow key={i} style={{ backgroundColor: i % 2 === 0 ? '#181a1f' : 'transparent' }}>{(
                                    <TableCell className={classes.bottomBorder}>
                                         <strong className={classes.textColor}>{data}</strong>
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
    const { compact } = props
    const classes = useStyles()
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

    const subView = (keys, parentData, dataList) => {
        const { detailAction } = props
        return (
            <Table size='small'>
                {keys.length > 1 ? <TableHead>
                    <TableRow>
                        {
                            keys.map((item, i) => {
                                const visible = item.roles ? item.roles.includes(redux_org.roleType(orgInfo)) : true
                                return visible ? <TableCell key={i}><strong className={classes.textColor}>{item.label}</strong></TableCell> : null
                            })
                        }
                        {detailAction ? <TableCell></TableCell> : null}
                    </TableRow>
                </TableHead> : null}
                <TableBody>
                    {dataList.map((data, i) => {
                        return (
                            <TableRow key={i} style={{ backgroundColor: i % 2 === 0 ? '#181a1f' : 'transparent' }}>{(
                                keys.map((item, j) => {
                                    const visible = item.roles ? item.roles.includes(redux_org.roleType(orgInfo)) : true
                                    return (
                                        visible ? <TableCell key={j} className={classes.bottomBorder}>
                                            <strong className={classes.textColor}>{getData(data, item)}</strong>
                                        </TableCell> : null
                                    )
                                }))
                            }
                                {detailAction ? <TableCell className={classes.bottomBorder}>{detailAction({ ...parentData, ...data })}</TableCell> : null}
                            </TableRow>)
                    })}
                </TableBody>
            </Table>
        )
    }

    const getRow = (id, item, info, subView) => {
        return (
            <TableRow key={id} className={subView ? '' : classes.table_row}>
                <TableCell className={classes.table_cell_label}><strong className={clsx(classes.main_label, classes.textColor)}>{item.label}</strong></TableCell>
                <TableCell className={classes.table_cell_value}>
                    <strong className={classes.textColor}>{subView ? info : getData(info, item)}</strong>
                </TableCell>
            </TableRow>
        )
    }

    return (
        <React.Fragment>
            <Divider />
            <Card className={compact ? classes.compactcontainer : classes.container}>
                <Table >
                    <TableBody>
                        {props.keys.map((item, i) => {
                            let data = detailData[item.field]
                            return (
                                checkRole(redux_org.role(orgInfo), item) ?
                                    (data !== undefined && (item.detailView === undefined || item.detailView)) ?
                                        item.keys ?
                                            data.length > 0 ?
                                                getRow(i, item, subView(item.keys, detailData, data), true) : null
                                            :
                                            isArrayString(item, data) ? getArrayRow(i, item, data, classes) :
                                                getRow(i, item, detailData) :
                                        null
                                    : null
                            )
                        })}
                    </TableBody>
                </Table>
                {props.children}
            </Card>
        </React.Fragment>
    )
}

export default MexDetailViewer;
