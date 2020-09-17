import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import bash from 'react-syntax-highlighter/dist/esm/languages/hljs/bash';
import allyDark from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import {copyData} from '../../utils/file_util'

import { Box, IconButton, Tooltip } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

SyntaxHighlighter.registerLanguage('yaml', yaml);
SyntaxHighlighter.registerLanguage('json', json);
SyntaxHighlighter.registerLanguage('bash', bash);

export const syntaxHighLighter = (language, data) => (
    <SyntaxHighlighter language={language} style={allyDark} className='yamlDiv'>
        {data}
    </SyntaxHighlighter>
)

export const codeHighLighter = (data) => (
    <Box component="div" display="inline">
        <code style={{ backgroundColor: '#2B2B2B', padding: 10 }}>{data}</code>
        <Tooltip title={'copy'} aria-label="copy">
            <IconButton onClick={(e) => copyData(data)}><FileCopyOutlinedIcon fontSize='small' /></IconButton>
        </Tooltip>
    </Box>
)