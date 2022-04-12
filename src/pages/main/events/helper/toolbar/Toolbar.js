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

import React, { useEffect } from 'react'
import { Box, Typography, Card } from '@material-ui/core';
import Help from '../Help'
import { lightGreen } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { Icon, IconButton, Picker } from '../../../../../hoc/mexui';
import { DEFAULT_DURATION_MINUTES } from '../constant';
import SearchFilter from '../../../../../hoc/filter/SearchFilter';
import { useSelector } from 'react-redux';
import { redux_org } from '../../../../../helper/reduxData';
import { localFields } from '../../../../../services/fields';
import SelectMenu from '../../../../../hoc/selectMenu/SelectMenu';
import { ICON_COLOR } from '../../../../../helper/constant/colors';
import LinearProgress from '../../../../../hoc/loader/LinearProgress';
import './style.css'

export const ACION_SEARCH = 0
export const ACTION_PICKER = 1
export const ACTION_REFRESH = 2
export const ACTION_CLOSE = 3
export const ACTION_ORG = 4

const useStyles = makeStyles((theme) => ({
    tabIndicator: { backgroundColor: '#FFF' },
    icon_color: { color: lightGreen['A700'] }
}));

const LeftView = (props) => {
    const classes = useStyles()
    const { onChange, loading, orgList, header, tip, children, filter } = props
    const orgInfo = useSelector(state => state.organizationInfo.data)
    const searchfilter = React.useRef(null)
    const [range, setRange] = React.useState(filter?.range)

    const onPickerChange = (range) => {
        setRange(range)
        props.onChange(ACTION_PICKER, range)
    }

    useEffect(() => {
        setRange(filter?.range)
    }, [filter?.range]);

    return (
        <React.Fragment>
            {loading ? <LinearProgress /> : null}
            <Card>
                <Box display="flex">
                    <Box p={1} flexGrow={1}>
                        <Typography gutterBottom variant="h5" component="h4" style={{ display: 'flex', alignItems: 'center', color: lightGreen['A700'] }}>
                            <Icon outline={true}>book</Icon><label style={{ marginLeft: 10 }}>{header}</label>
                        </Typography>
                    </Box>
                    <Box>
                        <div style={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                            {children}
                            {
                                redux_org.isAdmin(orgInfo) && orgList ?
                                    <div className='calendar-dropdown-select'>
                                        <SelectMenu color='rgba(118, 255, 3, 0.7)' search={true} labelKey={localFields.organizationName} dataList={orgList} placeholder='Select Organization' onChange={(value) => onChange(ACTION_ORG, value)} />
                                    </div> : null
                            }

                            <Picker onChange={onPickerChange} defaultDuration={DEFAULT_DURATION_MINUTES} value={range} />
                            <div style={{width:15}}></div>
                            <SearchFilter onFilter={(value) => { onChange(ACION_SEARCH, value) }} ref={searchfilter} compact={true} />
                            <IconButton tooltip={'Refresh data'} onClick={() => { onChange(ACTION_REFRESH) }}>
                                <Icon color={ICON_COLOR}>refresh</Icon>
                            </IconButton>
                            {tip ? <Help data={tip} color={ICON_COLOR} /> : null}


                            <IconButton tooltip={'Close'} onClick={() => { onChange(ACTION_CLOSE) }}>
                                <CloseIcon className={classes.icon_color} />
                            </IconButton>

                        </div>
                    </Box>
                </Box>
            </Card>
        </React.Fragment >
    )

}

export default LeftView