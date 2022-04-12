/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import React, { useEffect } from 'react'
import { Chip, Divider, Grid, makeStyles } from '@material-ui/core'
import { Header1 } from '../../../../hoc/mexui/headers/Header1'
import Resources from './total/Resources'
import clsx from 'clsx'
import { toFirstUpperCase } from '../../../../utils/string_utils'
import { keys as cloudletKeys } from '../../../../services/modules/cloudlet'
import { keys as clusterInstKeys } from '../../../../services/modules/clusterInst'
import { keys as appInstKeys } from '../../../../services/modules/appInst'
import { localFields } from '../../../../services/fields'
import { NoData } from '../../../../helper/formatter/ui'


const useStyles = makeStyles(theme => (
    {
        header: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            paddingLeft: 10
        },
        headerChip: {
            fontWeight: 900,
            backgroundColor: props => props.alertColor
        },
        content: {
            lineHeight: 2,
        },
        main: {
            padding: 20
        },
        resources: {
            padding: 10
        }
    }
))

const Content = (props) => {
    const { data, keys } = props
    const classes = useStyles()
    return (
        data && keys ? <div>
            {keys.map(key => (
                key.dvisible && data[key.field] ? <h5 className={classes.content} key={key.field}><b>{`${key.label}:`}&nbsp;</b> {` ${data[key.field]}`}</h5> : null
            ))}
        </div> : null
    )
}

const ShowMore = (props) => {
    const { data, resources, loading } = props
    const [keys, setKeys] = React.useState(undefined)
    const { header, name, alert } = data
    const classes = useStyles({ alertColor: alert?.color })
    useEffect(() => {
        const keys = data.field === localFields.cloudletName ?
            cloudletKeys() : data.field === localFields.clusterName ?
                clusterInstKeys() : data.field === localFields.appName ?
                    appInstKeys() : null
        setKeys(keys)
    }, [data]);
    return (
        keys ? <div className={clsx('content2', 'mex-card')}>
            <div className={classes.header}>
                <Header1 size={14}>{`${header}`}</Header1>
                {alert?.field ?
                    <Chip label={`${toFirstUpperCase(alert.type)}${alert.value ? `: ${alert.value}` : ''}`} size='small' className={classes.headerChip} />
                    : null}
            </div>
            <Divider />
            <div className={classes.main}>
                <Grid container>
                    <Grid item xs={6}>
                        <h5><b>Name:</b>{` ${name}`}</h5>
                        <Content data={data.data} keys={keys} />
                    </Grid>

                    <Grid item xs={6}>
                        {resources ? <div className={classes.resources}>
                            <Resources data={resources}></Resources>
                        </div> : <NoData loading={loading} title={'Fetching metric data from server'} result={'Metric data not found'} />
                        }
                    </Grid>
                </Grid>
            </div>
        </div> : null
    )
}

export default ShowMore