import React, { useEffect, Fragment } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import { Button, Icon, IconButton, Picker } from '../../../../hoc/mexui';
import { Box, Divider, Grid, Input, Typography } from '@material-ui/core';
import uuid from 'uuid'
import Tags from './Tags'
import { timeRangeInMin } from '../../../../hoc/mexui/Picker';
import { DEFAULT_DURATION_MINUTES } from '../helper/constant';
import { useSelector } from 'react-redux';
import { redux_org } from '../../../../helper/reduxData';
import { fields } from '../../../../services/model/format';
import SelectMenu from '../../../../hoc/selectMenu/SelectMenu';
import { fetchObject, storeObject } from '../../../../helper/ls';
import { filterData } from '../../../../constant';
const FIXED_LIMIT = 5000

export const ACTION_FILTER = 101

const useStyles = makeStyles({
    list: {
        width: 400,
        padding: 5
    },
    fullList: {
        width: 'auto',
    },
    text: {
        color: '#CECECE',
        fontSize: 14,
    },
    color: {
        color: '#CECECE',
    }
});


const Filter = (props) => {
    const { type, filter } = props
    const classes = useStyles();
    const orgInfo = useSelector(state => state.organizationInfo.data)
    const [state, setState] = React.useState(false);
    const [limit, setLimit] = React.useState(25);
    const [org, setOrg] = React.useState(undefined);
    const [renderTags, setRenderTags] = React.useState([]);
    const [range, setRange] = React.useState(timeRangeInMin(DEFAULT_DURATION_MINUTES));
    const [tags, setTags] = React.useState({})

    useEffect(() => {
        if (state) {
            let filter = fetchObject(`${type}_logs`)
            if (filter) {
                setLimit(filter.limit ? filter.limit : 25)
                setOrg(filter.org)
                setTags(filter.tags ? filter.tags : [])
                setRange(filter.range ? filter.range : timeRangeInMin(DEFAULT_DURATION_MINUTES))
            }
        }
    }, [state]);

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState(open);
    };

    const onPickerChange = (range) => {
        setRange(range)
    }

    const handleLimit = (e) => {
        let limit = e.target.value.trim()
        setLimit(parseInt(limit));
    };

    const handleOrg = (value) => {
        if (value.length > 0) {
            setOrg(value[0][fields.organizationName])
        }
    }

    const setTagForms = () => {
        setRenderTags(x => [...x, uuid()])
    }

    const onTagsChange = (uuid, key, value) => {
        if (key) {
            setTags(x => {
                x[uuid] = { key, value }
                return x
            })
        }
    }

    const onDelete = (uuid) => {
        setRenderTags(x => {
            x = x.filter(tag => {
                return tag !== uuid
            })
            return x
        })

        setTags(x => {
            x[uuid] = undefined
            return x
        })
    }

    const onClose = (e) => {
        setState(false)
    }

    const onSubmit = () => {
        let filter = { range, limit, org }
        let tagIdList = Object.keys(tags)
        if (tagIdList.length > 0) {
            let customTags = {}
            tagIdList.map(id => {
                if (tags[id]) {
                    customTags[tags[id]['key']] = tags[id]['value']
                }
            })
            filter['tags'] = customTags
        }
        storeObject(`${type}_logs`, { ...filter, tags })
        if (limit >= FIXED_LIMIT) {
            return props.error('error', `limit must not exceed ${FIXED_LIMIT} !`)
        }
        props.onChange(ACTION_FILTER, filter)
        setState(false)
    }

    // const renderTooltip=()=>{
    //     return (
    //         <div style={{maxHeight:300, overflow:'auto'}}>
    //             <p>{time(FORMAT_FULL_DATE_TIME, range.from)} to {time(FORMAT_FULL_DATE_TIME, range.to)}</p>
    //             <p>Limit: {limit}</p>
    //         </div>
    //     )
    // }

    return (
        <Fragment>
            <IconButton tooltip={'Filter by date, tags and limit'} onClick={toggleDrawer(true)} style={{ marginRight: -20, marginTop: -1 }}><Icon style={{ color: 'rgba(118, 255, 3, 0.7)', fontSize: 24 }}>filter_list</Icon></IconButton>
            <Drawer anchor={'right'} open={state} onClose={toggleDrawer(false)}>
                <Fragment>
                    <div className={classes.list}>
                        <Box display='flex'>
                            <Box flexGrow={1} p={1}>
                                <Icon style={{ color: 'rgba(118, 255, 3, 0.7)' }}>filter_list</Icon>
                            </Box>
                            <Box>
                                <IconButton onClick={onClose}><Icon style={{ color: 'rgba(118, 255, 3, 0.7)' }}>close</Icon></IconButton>
                            </Box>
                        </Box>
                        <div style={{ padding: 15 }}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Typography variant='subtitle1' className={classes.text}>Time Range</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant='subtitle1' className={classes.text}>Limit</Typography>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={6}>
                                    <div style={{ marginTop: 7 }}></div>
                                    <Picker color='#CECECE' onChange={onPickerChange} defaultDuration={DEFAULT_DURATION_MINUTES} value={filter.range} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Input
                                        id="limit"
                                        value={limit}
                                        type="number"
                                        onChange={handleLimit}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        {
                            redux_org.isAdmin(orgInfo) && props.orgList ?
                            <div style={{padding: 5, border: '1px solid white', borderRadius: 5, margin:14 }}>
                            <SelectMenu search={true} clear={true} labelKey={fields.organizationName} labelWidth={300} dataList={props.orgList} placeholder='Select Organization' onChange={handleOrg} default={org}/>
                        </div> : null
                        }
                        <div>
                            <Box display="flex" p={1}>
                                <Box p={1} flexGrow={1}>
                                    <Typography variant='inherit' className={classes.text}>Tags</Typography>
                                </Box>
                                <Box >
                                    <IconButton onClick={setTagForms}>
                                        <Icon className={classes.color} outlined={true}>queue</Icon>
                                    </IconButton>
                                </Box>
                            </Box>
                            <Divider style={{ marginTop: -15, marginLeft: 15, marginRight: 15 }} />
                            <Grid container justify="space-around" style={{ padding: 15 }}>
                                {renderTags.map((id) => {
                                    return (
                                        <Tags key={id} onChange={onTagsChange} uuid={id} onDelete={onDelete} data={tags[id]} />
                                    )
                                })}
                            </Grid>
                            <br />
                            <div align={'right'} style={{ float: 'right' }}>
                                <Button onClick={onSubmit} style={{ backgroundColor: 'rgba(118, 255, 3, 0.5)' }}>Apply</Button>
                            </div>
                        </div>
                    </div>
                </Fragment>
            </Drawer>
        </Fragment>
    );
}

export default Filter