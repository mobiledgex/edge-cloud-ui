import React from 'react';
import BasicTooltipTrigger from 'react-popper-tooltip';
import 'react-popper-tooltip/dist/styles.css';

const TooltipF = ({tooltip, children, hideArrow, ...props}) => (
    <BasicTooltipTrigger followCursor hideArrow tooltip="Hello, Cursor!">

    </BasicTooltipTrigger>
);

export default TooltipF;