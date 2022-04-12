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

import React, { useEffect, useRef } from 'react'
import { makeStyles } from '@material-ui/core'
import clsx from 'clsx'
import { MexIcon } from '../../../../../helper/formatter/ui'
import './style.css'
const useStyles = makeStyles(theme => (
    {
        resources: {
            display: 'grid',
            gridTemplateColumns: 'auto auto',
            columnGap: 10
        },
        content: {
            marginBottom: 10,
            padding: 10,
            display: 'flex',
            alignItems: 'center'
        },
        label: {
            fontWeight: 900,
            fontSize: 13,
            marginTop:5
        }
    }
))

const Resources = (props) => {
    const { data } = props
    const classes = useStyles()
    const graph = useRef(null);

    useEffect(() => {
        const circlechart = graph.current;
        const circleElements = circlechart.childNodes;
    
        let angle = 360 - 90;
        let dangle = 360 / circleElements.length;
    
        for (let circle of circleElements) {
          angle += dangle;
          circle.style.transform = `rotate(${angle}deg) translate(${circlechart.clientWidth /
            2.3}px) rotate(-${angle}deg)`;
        }
      }, []);

      
    return (
        <div className="circlechart" ref={graph}>
            {
                Object.keys(data).map((key, i) => {
                    let item = data[key]
                    return (
                        item.label ? <div key={key} className={clsx('mex-card', 'circle')} >
                            <div align='center'>
                                <MexIcon name={item.icon ?? 'ip_icon.svg'} />
                                <h4 className={classes.label}>{`${item.label} - ${item.value}`}</h4>
                            </div>
                        </div> : null
                    )
                })
            }
        </div>
    )
}
export default Resources