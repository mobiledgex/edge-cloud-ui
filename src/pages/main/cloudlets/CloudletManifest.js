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

import React from 'react'
import { Card, Box, IconButton, Tooltip, Link } from '@material-ui/core'
import { syntaxHighLighter, codeHighLighter } from '../../../hoc/highLighter/highLighter'
import { downloadData } from '../../../utils/file_util'
import GetAppIcon from '@material-ui/icons/GetApp';
import CloseIcon from '@material-ui/icons/Close';
import yaml from 'yaml-js';

const CONTENT_SUB_TYPE = 'contentsubtype'
const CONTENT_TYPE = 'contenttype'
const CONTENT = 'content'
const TITLE = 'title'
const CODE = 'code'
const COMMAND = 'command'
const URL = 'url'
const BASH = 'bash'
const YAML = 'yaml'
const MANIFEST = 'manifest'
const MANIFEST_ITEMS = 'manifestitems'

const CloudletManifest = (props) => {
    const manifestArray = yaml.load(props.cloudletManifest[MANIFEST])[MANIFEST_ITEMS]

    const contentSubType = (manifest) => {
        if (manifest[CONTENT_SUB_TYPE]) {
            let content = manifest[CONTENT]
            return syntaxHighLighter(manifest[CONTENT_SUB_TYPE], content)
        }
    }

    const contentType = (manifest) => {
        if (manifest[CONTENT] && manifest[CONTENT_TYPE]) {
            let content = manifest[CONTENT]
            switch (manifest[CONTENT_TYPE]) {
                case URL:
                    return <Link href={content} target='_blank'><h4 style={{ color: '#77bd06', margin: 10 }}>{content}</h4></Link>
                case COMMAND:
                    return codeHighLighter(content)
                case CODE:
                    return (
                        <div style={{ padding: 1, overflow: 'auto', width: '70vw', maxHeight: '50vh' }}>
                            {contentSubType(manifest)}
                        </div>
                    )
                default:
                    return null
            }
        }
    }

    const fileExtension = (manifest) => {
        switch (manifest[CONTENT_SUB_TYPE]) {
            case YAML:
                return '.yml'
            case BASH:
                return '.sh'
            default:
                return '.txt'
        }
    }

    const titleAdditionalInfo = (manifest) => {
        if (manifest[CONTENT_TYPE]) {
            switch (manifest[CONTENT_TYPE]) {
                case CODE:
                    return (
                        <Tooltip title={'download'} aria-label="download">
                            <IconButton onClick={() => downloadData(`${props.fileName}${fileExtension(manifest)}`, manifest[CONTENT])}><GetAppIcon fontSize='small' /></IconButton>
                        </Tooltip>
                    )
                default:
                    return null
            }
        }
    }

    return (
        manifestArray && manifestArray.length > 0 ?
            <Card style={{ height: '100%', backgroundColor: '#2A2C33', overflowY: 'auto' }}>
                <div style={{ color: 'white' }}>
                    <Box display="flex" p={1}>
                        <Box p={1} flexGrow={1}>
                            <h2><b>Cloudlet Manifest</b></h2>
                        </Box>
                        <Box p={1}>
                            <IconButton onClick={() => props.onClose(true)}><CloseIcon /></IconButton>
                        </Box>
                    </Box>
                    <Box display="flex" p={1}>
                        <Box p={1} flexGrow={1}><h4><b>Perform the following steps to setup cloudlet</b></h4></Box>
                    </Box>
                    <br />
                    <ul style={{ listStyleType: 'decimal' }}>
                        {manifestArray.map((manifest, i) => {
                            return (
                                <li key={i} style={{ marginBottom: 30 }}>
                                    <h4>{manifest[TITLE]} {titleAdditionalInfo(manifest)}</h4>
                                    {contentType(manifest)}
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </Card> : null
    )
}

export default CloudletManifest