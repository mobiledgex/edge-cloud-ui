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
import { useSelector, useDispatch } from "react-redux";
import { ListItem, ListItemText, Popover, Button, Tooltip } from '@material-ui/core';
import { localFields } from '../../../services/fields';
import BusinessIcon from '@material-ui/icons/Business';
import { FixedSizeList } from 'react-window';
import { organizationInfo, privateAccess, loadingSpinner } from '../../../actions';
import { redux_org } from '../../../helper/reduxData';
import { validatePrivateAccess } from '../../../constant';

const Organization = (props) => {
    const orgInfo = useSelector(state => state.organizationInfo.data)
    const roles = useSelector(state => state.roleInfo.role)
    const [anchorEl, setAnchorEl] = React.useState(null)
    const dispatch = useDispatch();

    const onSelect = async (role) => {
        setAnchorEl(null)
        dispatch(privateAccess(undefined))
        if (redux_org.isOperator(role)) {
            dispatch(loadingSpinner(true))
            dispatch(privateAccess(await validatePrivateAccess(undefined, role)))
            dispatch(loadingSpinner(false))
        }
        dispatch(organizationInfo(role))
    }

    const renderRow = (virtualProps) => {
        const { index, style } = virtualProps;
        return (
            <ListItem button style={style} key={index} onClick={()=>{onSelect(roles[index])}}>
                <ListItemText primary={roles[index][localFields.organizationName]} secondary={roles[index][localFields.role]} />
            </ListItem>
        );
    }
    return (
        <React.Fragment>
            {
                <Tooltip title={<strong style={{ fontSize: 13 }}>Organization</strong>}>
                    <span>
                        <Button disabled={orgInfo && orgInfo[localFields.isAdmin]} style={{ marginTop: 4, textTransform: 'none', height: 30, marginTop: 12 }} onClick={(e) => { setAnchorEl(e.currentTarget) }} tooltip='Organization'>
                            <BusinessIcon fontSize='medium' />&nbsp;
                            <h5>
                                {orgInfo ? orgInfo[localFields.organizationName] : 'Select Organization'}
                            </h5>
                        </Button>
                    </span>
                </Tooltip>
            }
            <Popover
                id="event-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
            >
                <FixedSizeList height={200} width={300} itemSize={50} itemCount={roles.length}>
                    {renderRow}
                </FixedSizeList>
            </Popover>
        </React.Fragment>
    )
}

export default Organization