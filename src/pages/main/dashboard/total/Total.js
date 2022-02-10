import { Typography } from '@material-ui/core'
import React from 'react'
import Doughnut from '../../../../hoc/charts/d3/doughnut/Doughnut'

const Total = (props) => {
    const { label } = props
    return (
        <div className='mex-card' style={{ height: 150, padding: 10 }} align={'center'}>
            <Doughnut size={80} />
            <div style={{ marginTop: 15 }}>
                <strong style={{ fontSize: 15, color: '#FFF', display: 'block', lineHeight: 0.2 }}>30</strong>
                <Typography variant='overline'>{label}</Typography>
            </div>
        </div>
    )
}

export default Total