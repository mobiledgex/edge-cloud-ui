import React from 'react'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { MexIcon } from '../../../../../helper/formatter/ui'

const useStyles = makeStyles(theme => (
    {
        resources: {
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            columnGap: 10
        },
        content: {
            marginBottom: 10,
            padding: 10,
            display: 'flex',
            alignItems: 'center'
        },
        label: {
            fontWeight: 900,
            fontSize: 13,
            marginTop:5
        }
    }
))

const Resources = (props) => {
    const { data } = props
    const classes = useStyles()
    return (
        <div className={classes.resources}>
            {
                Object.keys(data).map((key) => {
                    let item = data[key]
                    return (
                        item.label ? <div key={key} className={clsx('mex-card', classes.content)} >
                            <MexIcon name={item.icon ?? 'ip_icon.svg'} />
                            <h4 className={classes.label}>{`${item.label} - ${item.value}`}</h4>
                        </div> : null
                    )
                })
            }
        </div>
    )
}
export default Resources