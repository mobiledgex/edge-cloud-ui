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

import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import MexTimezone from './timezone/MexTimezone'
import HelpMenu from './help/HelpMenu'
import Notifications from '../notifications/Notifications'
import UserMenu from '../userSetting/UserMenu';
import Organization from './Organization'

const useStyles = makeStyles(theme => ({
    grow: {
        flexGrow: 1,
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
        },
        marginRight: 5
    }
}));

const Header = (props) => {
    const classes = useStyles();
    return (
        <React.Fragment>
            <div className={classes.grow} />
            <div className={classes.sectionDesktop}>
                <MexTimezone />
                <Organization />
                <HelpMenu />
                <Notifications />
                <UserMenu />
            </div>
        </React.Fragment>
    );
}

export default Header
