import { CircularProgress, Typography } from '@material-ui/core'
import { Skeleton } from '@material-ui/lab'
import React, { useEffect } from 'react'
import Doughnut from '../../../../../hoc/charts/d3/doughnut/Doughnut'
import { localFields } from '../../../../../services/fields'
import { toFirstUpperCase } from '../../../../../utils/string_utils'

{/* <div className='total'>
                            <Total label='Cloudlet' data={total[localFields.cloudletName]} />
                            <Total label='Cluster Instances' data={total[localFields.clusterName]} />
                            <Total label='App Instances' data={total[localFields.appName]} />
                        </div> */}
const colors = { success: '#66BC6A', transient: '#D99E48', error: '#AE4140' }

const totalKeys = [
    { label: 'Cloudlet', field: localFields.cloudletName },
    { label: 'Cluster Instances', field: localFields.clusterName },
    { label: 'App Instances', field: localFields.appName },
]

const Total = (props) => {
    const { data } = props
    return (
        <div className='total'>
            {data ? totalKeys.map(totalKey => {
                let item = data[totalKey.field]
                let count = 0
                Object.keys(item).forEach(key => count = count + item[key])
                return (
                    <div key={totalKey.field} >
                        <div className='mex-card' style={{ height: '100%', padding: 10, paddingTop: 20 }} align={'center'}>
                            <Doughnut size={80} data={item} colors={colors} label={count} />
                            <div style={{ marginTop: 15 }}>
                                {Object.keys(colors).map(colorKey => {
                                    return (
                                        <div key={colorKey} align='center'>
                                            <div style={{ width: 108, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'left', fontWeight: 900, color: 'white' }}>
                                                <div style={{ width: 20, height: 5, backgroundColor: colors[colorKey] }}></div>
                                                <p>{`${toFirstUpperCase(colorKey)}: ${item[colorKey] ?? 0}`}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div style={{ marginTop: 8 }}>
                                    <Typography variant='overline'>{totalKey.label}</Typography>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }) : Object.keys(colors).map(colorKey=>{
                return <div key={colorKey} className='mex-card' style={{ display:'flex', alignItems:'center', height: '100%', justifyContent:'center' }} ><CircularProgress size={80} thickness={1}/></div>
            })}
        </div>

    )
}

export default Total