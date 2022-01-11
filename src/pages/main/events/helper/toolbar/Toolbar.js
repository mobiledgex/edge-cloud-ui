import React, { useEffect } from 'react'
import { Box, Typography, Card, LinearProgress } from '@material-ui/core';
import Help from '../Help'
import { lightGreen } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import { Icon, IconButton, Picker } from '../../../../../hoc/mexui';
import { DEFAULT_DURATION_MINUTES } from '../constant';
import SearchFilter from '../../../../../hoc/filter/SearchFilter';
import { useSelector } from 'react-redux';
import { redux_org } from '../../../../../helper/reduxData';
import { fields } from '../../../../../services/model/format';
import SelectMenu from '../../../../../hoc/selectMenu/SelectMenu';
import './style.css'
import { ICON_COLOR } from '../../../../../helper/constant/colors';

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
    const [range, setRange] = React.useState(filter && filter.range ? filter.range : undefined)

    const onPickerChange = (range) => {
        setRange(range)
        props.onChange(ACTION_PICKER, range)
    }

    useEffect(() => {
        setRange(filter && filter.range ? filter.range : undefined)
    }, [filter]);

    return (
        <React.Fragment>
            {loading ? <LinearProgress /> : null}
            <Card style={{ height: 50, marginBottom: 2 }}>
                <Box display="flex">
                    <Box p={1} flexGrow={1}>
                        <Typography gutterBottom variant="h5" component="h4" style={{ display: 'flex', alignItems: 'center', color: lightGreen['A700'] }}>
                            <Icon outline={true}>book</Icon><label style={{ marginLeft: 10 }}>{header}</label>
                        </Typography>
                    </Box>
                    {children}
                    <Box p={1.1}>
                        {
                            redux_org.isAdmin(orgInfo) && orgList ?
                                <div className='calendar-dropdown-select'>
                                    <SelectMenu color='rgba(118, 255, 3, 0.7)' search={true} labelKey={fields.organizationName} dataList={orgList} placeholder='Select Organization' onChange={(value) => onChange(ACTION_ORG, value)} />
                                </div> : null
                        }
                    </Box>
                    <Box p={1.1}>
                        <Picker onChange={onPickerChange} defaultDuration={DEFAULT_DURATION_MINUTES} value={range}/>
                    </Box>
                    <Box>
                        <SearchFilter onFilter={(value) => { onChange(ACION_SEARCH, value) }} ref={searchfilter} compact={true} style={{ marginTop: 7, marginLeft: 8 }} />
                    </Box>
                    <Box>
                        <IconButton tooltip={'Refresh data'} onClick={() => { onChange(ACTION_REFRESH) }}>
                            <Icon color={ICON_COLOR}>refresh</Icon>
                        </IconButton>
                    </Box>
                    {tip ? <Box>
                        <Help data={tip} color={ICON_COLOR} />
                    </Box> : null}
                    <Box>
                        <IconButton tooltip={'Close'} onClick={() => { onChange(ACTION_CLOSE) }}>
                            <CloseIcon className={classes.icon_color} />
                        </IconButton>
                    </Box>
                </Box>
            </Card>
        </React.Fragment >
    )
      
}

export default LeftView