import { Box, Dialog, DialogContent, DialogTitle, Divider, LinearProgress, Typography } from '@material-ui/core'
import React from 'react'
import { IconButton, Icon } from '..'

const InfoDialog = (props) => {
    const { open, title, children, onClose, onCopy, note, maxWidth, style, loading } = props
    const dialogStyle = style ? style : {}
    return (
        <Dialog open={open} onClose={onClose} aria-labelledby={`dialog`} disableEscapeKeyDown={true} maxWidth={maxWidth ? maxWidth : 'md'} PaperProps={{
            style: style ? style : {
                ...dialogStyle,
                backgroundColor: '#202125',
            },
        }}>
            <div style={{ display: 'flex', alignItems: 'center', padding: 10 }} >
                <Box flexGrow={1}>
                    <h3 style={{ fontWeight: 700 }}>{title}</h3>
                </Box>
                {
                    onCopy ? <Box>
                        <IconButton tooltip={'Copy'} onClick={onCopy}><Icon outlined={true}  size={17}>file_copy</Icon></IconButton>
                    </Box> : null
                }
                {
                    onClose ? <Box>
                        <IconButton tooltip={'Close'} onClick={onClose}><Icon>close</Icon></IconButton>
                    </Box> : null
                }
            </div>
            <Divider />
            {loading ? <LinearProgress/> : null}
            <DialogContent>
                <div style={{ padding: 5 }}>
                    {children}
                    {
                        !loading && note ?
                            <Typography style={{ color: '#FFC107', marginTop: 20, fontSize: 13 }}>
                                <strong>Note</strong>: {note}
                            </Typography> : null
                    }
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default InfoDialog