import { IconButton } from '@material-ui/core';
import React from 'react'
import { Icon } from '../mexui'
import './style.css'

let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

const sliderMouseDown = (e, maxHeight, selector) => {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;

        let block = document.querySelector(`.${selector}`)
        const height = block.offsetHeight + e.clientY - pos4;
        if (height > 0 && height <= maxHeight) {
            block.style.height = height + 'px';
            pos3 = e.clientX;
            pos4 = e.clientY;
        }
    }

    function closeDragElement() {
        /* stop moving when mouse button is released:*/
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

const SliderButton = (props) => {
    const {height, selector} = props
    return (
        <div className='slider'>
            <IconButton onMouseDown={(e) => { sliderMouseDown(e, height, selector) }} >
                <Icon style={{ color: 'white' }}>drag_handle</Icon>
            </IconButton>
        </div>
    )
}

export default SliderButton