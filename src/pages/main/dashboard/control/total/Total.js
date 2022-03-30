import { Typography } from '@material-ui/core'
import React from 'react'
import Doughnut from '../../../../../hoc/charts/d3/doughnut/Doughnut'
import { localFields } from '../../../../../services/fields'
import { toFirstUpperCase } from '../../../../../utils/string_utils'
import LinearProgress from '../../../../../hoc/loader/LinearProgress'
import { isEmpty } from '../../../../../utils/json_util'

const colors = { success: '#66BC6A', transient: '#D99E48', error: '#AE4140' }

const totalKeys = [
    { label: 'Cloudlet', field: localFields.cloudletName },
    { label: 'Cluster Instances', field: localFields.clusterName },
    { label: 'App Instances', field: localFields.appName },
]

const Total = (props) => {
    const { data, loading } = props
    return (
        <div className='total'>
            {!isEmpty(data) ? totalKeys.map(totalKey => {
                let item = data[totalKey.field]
                let count = 0
                item && Object.keys(item).forEach(key => count = count + item[key])
                return (
                    <div key={totalKey.field} >
                        <div className='mex-card' style={{ height: '100%' }} align={'center'}>
                            {loading ? <LinearProgress /> : null}
                            <div style={{ padding: 10, paddingTop: 20 }}>
                                <Doughnut size={80} data={item} colors={colors} label={count} />
                                <div style={{ marginTop: 15 }}>
                                    {Object.keys(colors).map(colorKey => {
                                        return (
                                            <div key={colorKey} align='center'>
                                                <div style={{ width: 108, display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'left', fontWeight: 900, color: 'white' }}>
                                                    <div style={{ width: 20, height: 5, backgroundColor: colors[colorKey] }}></div>
                                                    <p>{`${toFirstUpperCase(colorKey)}: ${item ? item[colorKey] ?? 0 : 0}`}</p>
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
                    </div>
                )
            }) : Object.keys(colors).map(colorKey => {
                return <div key={colorKey} className='mex-card' >{loading ? <LinearProgress /> : null}</div>
            })}
        </div>

    )
}

export default Total