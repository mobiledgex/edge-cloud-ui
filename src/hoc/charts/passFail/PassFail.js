import React, { useEffect } from 'react'
import { ImageList, ImageListItem, makeStyles, Popover, Tooltip, Typography } from '@material-ui/core';
import { addDays, FORMAT_FULL_DATE, FORMAT_FULL_DATE_TIME, FORMAT_MMM_DD, subtractDays } from '../../../utils/date_util';
import { Popup } from '../../mexui';

const useStyles = makeStyles((theme) => ({
    bar: {
        backgroundImage: props => `linear-gradient(105deg, #C94744 0%, #C94744 ${props.level}%, transparent ${props.level}%)`,
        background: '#42A36D',
        height:'inherit',
        display:'flex',
        alignItems:'center',
        cursor: 'pointer',
        fontWeight:900,
        justifyContent: 'center',
    },
    barDisabled: {
        background: 'gray',
        height:'inherit',
        display:'flex',
        alignItems:'center',
        fontWeight:900,
        justifyContent: 'center',
    }
}));

const PassFailBar = (props) => {
    const { children, data, properties } = props
    const { level, disabled } = data
    const classes = useStyles({ level, disabled })
    return (
        <div className={disabled ? classes.barDisabled : classes.bar} {...properties} >
            {children}
        </div>
    )
}

const PassFail = (props) => {
    const { range, logs } = props
    const [dateList, setDateList] = React.useState(undefined)
    const [anchorEl, setAnchorEl] = React.useState(undefined)

    useEffect(() => {
            const { endtime } = range
            let endRange = addDays(3, endtime)
            let startRange = subtractDays(36, endRange)
            let statusList = []
            for (let m = startRange; m.isBefore(endRange); m.add(1, 'days')) {
                let date = m.format(FORMAT_MMM_DD)
                let status = {} 
                status.date = date
                status.fullDate = m.format(FORMAT_FULL_DATE)
                status.disabled = true
                status.level = 0
                let data = logs && logs[date]
                if (data) {
                    status.disabled = false
                    status.level = (data.failed / data.total) * 100
                    status.total = data.total
                    status.failed = data.failed
                }
                statusList.push(status);
            }
            setDateList(statusList)
    }, [logs]);

    const handlePopoverClose = ()=>{
        setAnchorEl(undefined)
    }

    const handlePopoverOpen = (e, data) => {
        if (!data.disabled) {
            setAnchorEl({target:e.currentTarget, data})
        }
    }

    const onBlock = (data)=>{
        props.onClick(data.fullDate)
    }

    return (
        <React.Fragment>
            <ImageList cols={6} rowHeight={35} gap={3} >
                {dateList?.map((item) => {
                    return (
                        <ImageListItem key={item.date}><PassFailBar data={item} properties={{ onClick: () => { onBlock(item) }, onMouseEnter: (e) => { handlePopoverOpen(e, item) }, onMouseLeave: handlePopoverClose }}>{item.date}</PassFailBar></ImageListItem>
                    )
                })}
            </ImageList>
            <Popup anchorEl={anchorEl && anchorEl.target}>
                {
                    anchorEl ? <React.Fragment>
                        <p>{`Total Request : ${anchorEl.data.total}`}</p>
                        <p>{`Request Failed : ${anchorEl.data.failed}`}</p>
                    </React.Fragment> : null
                }
            </Popup>
        </React.Fragment>

    )
}

export default PassFail