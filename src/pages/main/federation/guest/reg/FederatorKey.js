import React from 'react'
import { Button, Dialog, DialogActions, DialogContent } from '@material-ui/core'
import { codeHighLighter } from '../../../../../hoc/highLighter/highLighter'

export const FederationKey = (props) => {
    const { data, onClose } = props
    return (
        <Dialog keepMounted={false} open={Boolean(data)} onClose={onClose} aria-labelledby="profile" disableEscapeKeyDown={true} PaperProps={{
            style: {
                backgroundColor: '#202125',
            },
        }}>
            <DialogContent style={{ width: 500 }} style={{ fontSize: 12, color: '#AEAEAE' }}>
                {data ? <React.Fragment>
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
                </React.Fragment> : null}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} style={{ backgroundColor: 'rgba(118, 255, 3, 0.5)' }} size='small'>
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    )
}

export default FederationKey