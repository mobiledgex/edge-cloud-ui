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

import { Box, Dialog, DialogContent, Divider, Typography } from '@material-ui/core'
import React from 'react'
import { IconButton, Icon } from '..'

const InfoDialog = (props) => {
    const { open, title, children, onClose, onCopy, note, maxWidth, style } = props
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
                        <IconButton tooltip={'Copy'} onClick={onCopy}><Icon outlined={true} size={17}>file_copy</Icon></IconButton>
                    </Box> : null
                }
                {
                    onClose ? <Box>
                        <IconButton tooltip={'Close'} onClick={onClose}><Icon>close</Icon></IconButton>
                    </Box> : null
                }
            </div>
            <Divider />
            <DialogContent>
                <div style={{ padding: 5 }}>
                    {children}
                    {
                        note ?
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