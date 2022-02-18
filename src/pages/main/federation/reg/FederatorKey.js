import React, { useEffect } from 'react'
import { Grid, Typography } from '@material-ui/core'
import { InfoDialog } from '../../../../hoc/mexui'
import { fields } from '../../../../services'
import { showFederator } from '../../../../services/modules/federation'
import { showAuthSyncRequest } from '../../../../services/service'
import { copyData } from '../../../../utils/file_util'

const keys = [
    { label: 'Operator Name', field: fields.operatorName },
    { label: 'Country Code', field: fields.countryCode },
    { label: 'Federation ID', field: fields.federationId },
    { label: 'Federation Address', field: fields.federationAddr },
    { label: 'API Key', field: fields.apiKey }
]

export const FederationKey = (props) => {
    const { data, onClose } = props
    const [value, setValue] = React.useState(undefined)
    const [loading, setLoading] = React.useState(true)

    const fetchFederator = async () => {
        if (Boolean(data)) {
            let dataList = await showAuthSyncRequest(this, showFederator(this, data, true))
            setLoading(false)
            if (dataList && dataList.length > 0) {
                let temp = dataList[0]
                let fedAddrs = temp[fields.federationAddr].split(':')
                if (fedAddrs && fedAddrs.length === 2) {
                    temp[fields.federationAddr] = `${window.location.protocol}//${window.location.hostname}:${fedAddrs[1]}`
                }
                setValue({ ...temp, apiKey: data.federationAPIKey })
            }

        }
    }

    useEffect(() => {
        fetchFederator()
    }, [Boolean(data)]);

    const onCopy = ()=>{
        let data = ''
        keys.forEach(key=>{
            data = data + `${key.label}:${value[key.field]}\n`
        })
        copyData(data, true)
    }

    return (
        <InfoDialog open={Boolean(data)} maxWidth='sm' title={'Federator Details'} onCopy={onCopy} onClose={onClose} loading={loading} note={'Make sure to copy your API key now. You won\'t be able to see it again!'}>
            {
                data && value ? <React.Fragment >
                    <Typography variant='body1' style={{color:'#727888'}}>Please share below details with the partner operator</Typography>
                    <br/>
                    <Grid container spacing={2}>
                        {keys.map(key => (
                            <React.Fragment key={key.field}>
                                <Grid xs={6} item><strong style={{color:'#CECECE'}}>{key.label}</strong></Grid><Grid xs={6} item><strong style={{color:'#CECECE'}}>{value[key.field]}</strong></Grid>
                            </React.Fragment>
                        ))}
                    </Grid>
                </React.Fragment > : null}
        </InfoDialog >
    )
}

export default FederationKey