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

import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { CardHeader, Drawer } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import FilterListIcon from "@material-ui/icons/FilterList";
import CloseIcon from "@material-ui/icons/Close";

const useStyles = makeStyles({
    drawer: {
        position: "relative",
        marginLeft: "auto",
        "& .MuiBackdrop-root": {
            display: "none"
        },
        "& .MuiDrawer-paper": {
            width: props => props.show ? '80%' : '50%',
            position: "absolute",
            backgroundColor: '#2C2D34',
            height: props => props.height,
            transition: "none !important"
        }
    },
    iconColor: {
        color: '#CECECE'
    }
});

export default function BasicTable(props) {
    const { show, onClose } = props
    const [open, setOpen] = useState(false);
    const [height, setHeight] = useState(0);

    const classes = useStyles({ show, height });

    useEffect(() => {
        setOpen(show)
    }, [show]);

    useEffect(() => {
        if (!open && onClose) {
            onClose(false)
        }
    }, [open]);

    useEffect(() => {
        if (open) {
            setHeight(props.height);
        } else {
            setHeight(0);
        }
    }, [open]);

    return (
        <div className="tooltip" style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', right: 0 }}>
                <IconButton className={classes.iconColor} onClick={() => { setOpen(true) }} style={{ zIndex: 1 }}>
                    <FilterListIcon />
                </IconButton>
            </div>
            <Drawer
                open={open}
                className={classes.drawer}
                variant="persistent"
                anchor="right"
            >
                <CardHeader
                    action={
                        <IconButton onClick={() => { setOpen(false) }} className={classes.iconColor}>
                            <CloseIcon />
                        </IconButton>
                    } />
                <div align='center'>
                    {props.children}
                </div>
            </Drawer>
        </div>
    );
}