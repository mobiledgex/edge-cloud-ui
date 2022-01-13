import React from 'react'
import { Paper, Tabs, Tab, Box } from '@material-ui/core';
import Help from '../helper/Help'
import { lightGreen } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';
import RefreshIcon from '@material-ui/icons/Refresh';
import { makeStyles } from '@material-ui/styles';
import { Icon, IconButton, Picker } from '../../../../hoc/mexui';
import { DEFAULT_DURATION_MINUTES } from './constant';
import SearchFilter from '../../../../hoc/filter/SearchFilter';
import { ICON_COLOR } from '../../../../helper/constant/colors';

export const ACION_SEARCH = 0
export const ACTION_PICKER = 1
export const ACTION_REFRESH = 2
export const ACTION_CLOSE = 3
export const ACTION_TAB = 4

const tip = [
    <code>Default view is day</code>,
    <code>Click <RefreshIcon /> icon to reset the calendar to current date based on view</code>,
    <code>Click on <i>Year, Month, Day or Hour</i> to change calendar view</code>,
    <code>User can also click on displayed date mentioned next to the usagelog column to change the calendar view from hour to day to month to year and viceversa, where top row emulates hour to year and bottom row emulates year to hour </code>
]

const useStyles = makeStyles((theme) => ({
    tabIndicator: { backgroundColor: '#FFF' },
    icon_color: { color: lightGreen['A700'] },
    action: { position: 'absolute', right: 10, top: 3 }
}));

const LeftView = (props) => {
    const classes = useStyles()
    const { data, onChange, children } = props
    const [value, setValue] = React.useState(0)
    const [range, setRange] = React.useState(undefined)

    const searchfilter = React.useRef(null)

    const onTabChange = (value) => {
        setValue(value)
        if (searchfilter.current) {
            searchfilter.current.onClear()
        }
        props.onChange(ACTION_TAB, value)
    }

    const onPickerChange = (range) => {
        setRange(range)
        props.onChange(ACTION_PICKER, range)
    }

    return (
        <React.Fragment>
            <Paper square>
                <Tabs
                    TabIndicatorProps={{
                        className: classes.tabIndicator
                    }}
                    value={value}
                    onChange={(e, value) => onTabChange(value)}
                    variant="fullWidth">
                    {data.map((label) => {
                        return <Tab key={label} label={label} />
                    })}
                </Tabs>
                <div className={classes.action}>
                    <Box display="flex">
                        <Box flexGrow={1}></Box>
                        <Box p={1.1}>
                            <Picker onChange={onPickerChange} defaultDuration={DEFAULT_DURATION_MINUTES} value={range}/>
                        </Box>
                        <Box>
                            <IconButton tooltip={'Refresh data'} onClick={() => { onChange(ACTION_REFRESH) }}>
                                <Icon color={ICON_COLOR}>refresh</Icon>
                            </IconButton>
                        </Box>
                        <Box>
                            <Help data={tip} color={ICON_COLOR} />
                        </Box>
                        <Box>
                            <IconButton tooltip={'Close'} onClick={() => { onChange(ACTION_CLOSE) }}>
                                <CloseIcon className={classes.icon_color} />
                            </IconButton>
                        </Box>
                    </Box>
                </div>
            </Paper>
            <div align={'center'} style={{ marginTop: 10, marginBottom: 10 }}>
                <SearchFilter style={{ width: '93%' }} onFilter={(value) => { onChange(ACION_SEARCH, value) }} ref={searchfilter} clear={true}/>
            </div>
            {children}
        </React.Fragment >
    )
}

export default LeftView