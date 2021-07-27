import React, { useEffect } from 'react'

const HOUR = 'hour'
const MINUTE = 'min'
const SECOND = 'sec'

const CustomInput = (props) => {
    const { min, max, label, onChange, value } = props
    //onKeyDown={(e) => { !(e.keyCode === 38 || e.keyCode === 40) && e.preventDefault(); }}
    return (
        <React.Fragment>
            <input type='number' value={value} min={min} max={max} onChange={(e) => onChange(e.target.value, label)} style={{ verticalAlign: 'middle', width: 80, height: 35, marginRight: 5, backgroundColor: '#16181D', color: '#A5A5A6', border: '0.02em solid #44464A' }}/>
            <label style={{ fontWeight: 400, marginRight: 5, color:'#A5A5A6' }}>{label}</label>
        </React.Fragment>
    )
}

const fetchValue = (value, label, preLabel) => {
    const index = value.indexOf(label)
    const preIndex = preLabel ? (value.indexOf(preLabel) + 1) : 0
    return index >= 0 ? value.substring(preIndex, index) : ''
}

const MexDate = (props) => {
    let form = props.form;
    const [time, setTime] = React.useState(form.value ? form.value : '0s');


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
        setTime(`${h > 0 ? `${h}h` : ''}${m > 0 ? `${m}m` : ''}${s > 0 ? `${s}s` : ''}`)
    }

    useEffect(() => {
        props.onChange(form, time)
    }, [time]);

    const getForms = () => (
        <div style={{ display: 'inline-block' }}>
            <CustomInput value={fetchValue(time, 'h')} min={0} max={24} label={HOUR} onChange={onChange} />
            <CustomInput value={fetchValue(time, 'm', 'h')} min={0} max={60} label={MINUTE} onChange={onChange} />
            <CustomInput value={fetchValue(time, 's', 'm')} min={0} max={60} label={SECOND} onChange={onChange} />
        </div>
    )

    return (
        form ? getForms() : null
    )
}

export default MexDate
