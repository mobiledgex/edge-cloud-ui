import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import allyDark from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import {copyData} from '../../utils/file_util'

import { IconButton, Tooltip } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import { Icon } from '../mexui';

SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);

export const syntaxHighLighter = (language, data) => (
    <SyntaxHighlighter language={language} style={allyDark} className='yamlDiv'>
        {data}
    </SyntaxHighlighter>
)

export const codeHighLighter = (data) => (
    <div style={{ width: '100%', backgroundColor: '#2B2B2B', borderRadius: 1, position: 'relative', color: '#E8E8E8' }}>
        <div style={{ overflowY: 'auto', maxHeight: 200 }}>
            <div style={{ width: '93%', padding: 12 }}>
                <code style={{ wordBreak: 'break-all' }}>{data}</code>
            </div>
        </div>
        <div style={{ position: 'absolute', right: 7, top: 5 }}>
            <Tooltip title={'copy'} aria-label="copy">
                <div style={{ cursor: 'pointer' }} onClick={(e) => copyData(data)}><Icon outlined={true} size={15}>file_copy</Icon></div>
            </Tooltip>
        </div>
    </div>
)