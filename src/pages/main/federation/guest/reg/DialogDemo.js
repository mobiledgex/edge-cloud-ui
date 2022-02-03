import { Dialog, DialogContent, DialogTitle, Divider } from '@material-ui/core'
import React from 'react'

const DialogDemo = (props) => {
    const { open, title, children, onClose } = props
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby={`dialog`} disableEscapeKeyDown={true} maxWidth={'md'}>
            <DialogTitle id={title}>
                <div style={{ float: "left", display: 'inline-block' }}>
                    <h3 style={{ fontWeight: 700 }}>{title}</h3>
                </div>
            </DialogTitle>
            <Divider/>
            <DialogContent>
                {children}
            </DialogContent>
        </Dialog>
    )
}

export default DialogDemo