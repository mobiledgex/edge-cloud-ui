import { Typography } from '@material-ui/core'
import React, { useEffect } from 'react'
import Doughnut from '../../../../hoc/charts/d3/doughnut/Doughnut'

const Total = (props) => {
    const { label, data } = props
    const [count, setCount] = React.useState(0)

    useEffect(() => {
        let count = 0
        Object.keys(data).forEach(key => count = count + data[key])
        setCount(count)
    }, [data]);

    return (
        <div className='mex-card' style={{ height: 150, padding: 10 }} align={'center'}>
            <Doughnut size={80} data={data} />
            <div style={{ marginTop: 15 }}>
                <strong style={{ fontSize: 15, color: '#FFF', display: 'block', lineHeight: 0.2 }}>{count}</strong>
                <Typography variant='overline'>{label}</Typography>
            </div>
        </div>
    )
}

export default Total