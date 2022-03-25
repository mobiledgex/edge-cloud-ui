import { makeStyles } from '@material-ui/core'
import React, { useEffect } from 'react'

const HOUR = 'H'
const MINUTE = 'M'
const SECOND = 'S'

const useStyles = makeStyles(theme=>({
    root:{
        display: 'flex', 
        alignItems: 'center', 
        gap: 20
    },
    customTimerMain :{
        display:'flex',
        alignItems:'center',
        gap:5
    },
    customTimerLabel:{
        fontWeight: 900, 
        color:'#A5A5A6'
    }
}))

const CustomInput = (props) => {
    const { min, max, label, onChange, value } = props
    const classes = useStyles()
    //onKeyDown={(e) => { !(e.keyCode === 38 || e.keyCode === 40) && e.preventDefault(); }}
    return (
        <div className={classes.customTimerMain}>
            <input type='number' value={value} min={min} max={max} onChange={(e) => onChange(e.target.value, label)} style={{ width: 70, height: 35, backgroundColor: '#16181D', color: '#A5A5A6', border: '0.02em solid #44464A' }} />
            <label className={classes.customTimerLabel}>{label}</label>
        </div>
    )
}

const fetchValue = (value, label, preLabel) => {
    const index = value.indexOf(label)
    const preIndex = preLabel ? (value.indexOf(preLabel) + 1) : 0
    return index >= 0 ? value.substring(preIndex, index) : '0'
}

const MexTimeCounter = (props) => {
    const classes = useStyles()
    let form = props.form;
    const [time, setTime] = React.useState(form.value ? form.value : form.default);

    const onChange = (value, label)=>{
        const indexH = time.indexOf('h')
        const indexM = time.indexOf('m')
        const indexS = time.indexOf('s')
        let h = indexH >= 0 ? time.substring(0, indexH) : 0
        let m = indexM >= 0 ? time.substring(indexH + 1, indexM) : 0
        let s = indexS >= 0 ? time.substring(indexM + 1, indexS) : 0
        if (label === HOUR) {
            h = value
        }
        else if (label === MINUTE) {
            m = value
        }
        else if (label === SECOND) {
            s = value
        }
        setTime(`${h > 0 ? h:0}h${m > 0 ? m:0}m${s > 0 ? s:0}s`)
    }

    useEffect(() => {
        props.onChange(form, time)
    }, [time]);

    const getForms = () => (
        <div className={classes.root}>
            <CustomInput value={fetchValue(time, 'h')} min={0} label={HOUR} onChange={onChange} />
            <CustomInput value={fetchValue(time, 'm', 'h')} min={0} label={MINUTE} onChange={onChange} />
            <CustomInput value={fetchValue(time, 's', 'm')} min={0} label={SECOND} onChange={onChange} />
        </div>
    )

    return (
        form ? getForms() : null
    )
}

export default MexTimeCounter
