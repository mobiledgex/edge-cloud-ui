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

import React from "react";
import clsx from 'clsx';
import { Typography, Divider, makeStyles } from "@material-ui/core/";
import './style.css'

const useStyles = makeStyles({
    textColor: {
        color: '#273c43'
    },
    divider: {
        backgroundColor: '#AEAEAE',
        marginTop: 5,
        marginBottom: 5
    },
    section:{
        marginTop:15
    }
});



const Section = (props) => {
    const classes = useStyles();
    return (
        <Typography variant="h6" className={clsx(classes.textColor, classes.section)}>
            <b>{props.children}</b>
            <Divider className={classes.divider} />
        </Typography>
    )
}

export default Section