import React from 'react'
import { Grid, Typography } from '@material-ui/core'
import { InfoDialog } from '../../../../hoc/mexui'
import { localFields } from "../../../../services/fields";
import { copyData } from '../../../../utils/file_util'

const keys = [
    { label: 'Operator Name', field: localFields.operatorName },
    { label: 'Country Code', field: localFields.countryCode },
    { label: 'Federation ID', field: localFields.federationId },
    { label: 'Federation Address', field: localFields.federationAddr },
    { label: 'API Key', field: localFields.apiKey }
]

export const FederationKey = (props) => {
    const { data, onClose } = props

    const onCopy = ()=>{
        let text = ''
        keys.forEach(key=>{
            text = text + `${key.label}:${data[key.field]}\n`
        })
        copyData(text)
    }

    return (
        <InfoDialog open={Boolean(data)} maxWidth='sm' title={'Federator Details'} onCopy={onCopy} onClose={onClose} note={'Make sure to copy your API key now. You won\'t be able to see it again!'}>
            {
                data ? <React.Fragment >
                    <Typography variant='body1' style={{color:'#727888'}}>Please share below details with the partner operator</Typography>
                    <br/>
                    <Grid container spacing={2}>
                        {keys.map(key => (
                            <React.Fragment key={key.field}>
                                <Grid xs={6} item><strong style={{color:'#CECECE'}}>{key.label}</strong></Grid><Grid xs={6} item><strong style={{color:'#CECECE'}}>{data[key.field]}</strong></Grid>
                            </React.Fragment>
                        ))}
                    </Grid>
                </React.Fragment > : null}
        </InfoDialog >
    )
}

export default FederationKey