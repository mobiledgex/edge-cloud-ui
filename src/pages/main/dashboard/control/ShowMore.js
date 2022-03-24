import React from 'react'
import { Chip, Divider, Grid } from '@material-ui/core'
import { Header1 } from '../../../../hoc/mexui/headers/Header1'
import Resources from './total/Resources'
import clsx from 'clsx'
import { toFirstUpperCase } from '../../../../utils/string_utils'
import { keys as cloudletKeys } from '../../../../services/modules/cloudlet'


const Cloudlet = (props) => {
    const { data } = props
    return (
        data ? <div>
            {cloudletKeys().map(key => (
                key.dvisible ? <h5 key={key.field}><b>{`${key.label}:`}</b> {` ${data[key.field]}`}</h5> : null
            ))}
        </div> : null
    )
}

const ShowMore = (props) => {
    const { data, resources } = props
    const { header, name, alert } = data
    return (
        (data.data || resources) ? <div className={clsx('content2', 'mex-card')}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, paddingLeft: 10 }}>
                <Header1 size={14}>{`${header}`}</Header1>
                {alert ?
                    <Chip label={toFirstUpperCase(alert.type)} size='small' style={{ fontWeight:900, backgroundColor: alert.color }} />
                    : null}
            </div>
            <Divider />
            <div style={{ padding: 10 }}>
                <Grid container>
                    <Grid item xs={6}>
                        <h5><b>Name:</b>{` ${toFirstUpperCase(name)}`}</h5>
                        <Cloudlet data={data.data}/>
                    </Grid>

                    <Grid item xs={6}>
                        {resources ? <div style={{ padding: 10 }}>
                            <Resources data={resources}></Resources>
                        </div> : null
                        }
                    </Grid>
                </Grid>
            </div>
        </div> : null
    )
}

export default ShowMore