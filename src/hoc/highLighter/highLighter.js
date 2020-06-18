import React from 'react';
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import yaml from 'react-syntax-highlighter/dist/esm/languages/hljs/yaml';
import allyDark from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import {copyData} from '../../utils/fileUtil'

import { Box, IconButton, Tooltip } from '@material-ui/core';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';

SyntaxHighlighter.registerLanguage('yaml', yaml);

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