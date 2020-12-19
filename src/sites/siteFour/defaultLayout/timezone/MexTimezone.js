import React from 'react';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { FixedSizeList } from 'react-window';
import { Input, InputAdornment, Grid, makeStyles, Popover } from '@material-ui/core';
import { setMexTimezone } from '../../../../utils/sharedPreferences_util'
import SearchIcon from '@material-ui/icons/Search';
import cloneDeep from 'lodash/cloneDeep';
import { getMexTimezone } from '../../../../utils/sharedPreferences_util';
import MiniClockComponent from "./MiniClockComponent";
import AccessTimeOutlined from '@material-ui/icons/AccessTimeOutlined'


const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        margin: 'auto',
        maxWidth: 500,
    },
    img: {
        height: 50,
        margin: 'auto',
        display: 'block',
        maxWidth: '100%',
    },
}));


export default function MexTimezone(props) {
    const classes = useStyles();
    const timezones = cloneDeep(props.data)
    const [timezoneList, setTimezoneList] = React.useState(timezones)
    const [filterText, setFilterText] = React.useState('')
    const [anchorEl, setAnchorEl] = React.useState(null)

    const onFilterValue = (e) => {
        let filterText = e.target.value.toLowerCase()
        setFilterText(filterText)
        setTimezoneList(timezones.filter(info => {
            return info.toLowerCase().includes(filterText)
        }))
    }

    const onClose = () => {
        setTimezoneList(timezones)
        setFilterText('')
        setAnchorEl(null)
    }

    const selectTimezone = (index) => {
        let value = timezoneList[index]
        setMexTimezone(value)
        onClose()
    }

    const renderRow = (virtualProps) => {
        const { index, style } = virtualProps;
        return (
            <ListItem button onClick={() => selectTimezone(index)} style={style} key={index}>
                <ListItemText primary={timezoneList[index]} />
            </ListItem>
        );
    }

    const onHandleClick = (e) => {
        setAnchorEl(e.currentTarget)
    }

    const renderView = () => {
        return (
            <Grid container spacing={1}>
                <Grid item>
                    <AccessTimeOutlined className={classes.img} />
                </Grid>
                <Grid item xs={12} sm container>
                    <Grid item xs container direction="column">
                        <Grid item xs>
                            <div style={{ marginTop: 8, color: 'white', fontSize: 13 }}>
                                {getMexTimezone()}
                                <MiniClockComponent />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        )
    }

    return (
        <React.Fragment>
            <div style={{ backgroundColor: 'transparent', cursor: 'pointer' }} onClick={onHandleClick} aria-label="timezone" color="inherit">
                {renderView()}</div>
            <Popover
                id="event-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={onClose}
            >
                <div style={{ paddingLeft: 10, paddingRight: 10, paddingTop: 10 }}>
                    <Input
                        disableUnderline={true}
                        style={{ borderRadius: 5 }}
                        className='select_tree_search'
                        inputProps={{ style: { backgroundColor: '#1D2025', color: '#ACACAC', border: 'none' } }}
                        variant="outlined"
                        value={filterText}
                        startAdornment={
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        }
                        onChange={onFilterValue} />
                </div><div>
                    <br />
                    <FixedSizeList height={200} width={300} itemSize={35} itemCount={timezones.length}>
                        {renderRow}
                    </FixedSizeList>
                </div>
            </Popover>
        </React.Fragment>
    );
}