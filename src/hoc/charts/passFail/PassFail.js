import React from 'react'
import { ImageList, ImageListItem, makeStyles } from '@material-ui/core';
import { currentDate, subtractDays } from '../../../utils/date_util';
import moment from 'moment';

const useStyles = makeStyles((theme) => ({
    bar: {
        backgroundImage: props => `linear-gradient(105deg, #C94744 0%, #C94744 ${props.level}%, transparent ${props.level}%)`,
        background: '#42A36D',
        height:'inherit',
        display:'flex',
        alignItems:'center',
        cursor:'pointer',
        fontWeight:900,
        justifyContent: 'center',
        '&:hover':{
            background:'#FFF'
        }
    }
}));

const PassFailBar = (props) => {
    const { children, level } = props
    const classes = useStyles({ level })
    return (
        <div className={classes.bar}>
            {children}
        </div>
    )
}

let a = currentDate()
let b = subtractDays(35, a).toString()
let nlist = []
for (var m = moment(b); m.isBefore(a); m.add(1, 'days')) {
    nlist.push({date:m.format('MMM DD'), l:10});
}

const PassFail = (props) => {
    return (
        <React.Fragment>
            <ImageList cols={6} rowHeight={35} gap={3} >
                {nlist.map((item, i) => (
                    <ImageListItem key={item.date}><PassFailBar level={Math.floor(Math.random() * 100)}>{item.date}</PassFailBar></ImageListItem>
                ))}
            </ImageList>
        </React.Fragment>

    )
}

export default PassFail