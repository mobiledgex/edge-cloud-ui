import React from 'react'
import { codeHighLighter } from '../../../../hoc/highLighter/highLighter'
import { InfoDialog } from '../../../../hoc/mexui'

export const FederationKey = (props) => {
    const { data, onClose } = props
    return (
        <InfoDialog open={Boolean(data)} title={'Federation ID & API Key'} onClose={onClose} note={'Make sure to copy your API key now. You won\'t be able to see it again!'}>
            {
                data ? <React.Fragment >
                    <div >
                        <p style={{ fontSize: 16, fontWeight: 900 }}>Federation ID</p>
                        <strong variant='caption'>Globally unique string used to identify the federation with partner operator</strong>
                        <br /><br />
                        <div id="federationID">{codeHighLighter(data.federationId)}</div>
                    </div>
                    <br />
                    <div>
                        <p style={{ fontSize: 16, fontWeight: 900 }}>API Key</p>
                        <strong variant='caption'>One-time generated key used for authenticating federation requests from partner operator</strong>
                        <br /><br />
                        <div style={{ display: 'flex', alignItems: 'center' }}>{codeHighLighter(data.federationAPIKey)}</div>
                    </div>
                </React.Fragment > : null}
        </InfoDialog >
    )
}

export default FederationKey