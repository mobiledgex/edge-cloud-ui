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