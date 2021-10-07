import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { ListItem, ListItemText, Popover, Button, Tooltip } from '@material-ui/core';
import { fields } from '../../../services/model/format';
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
                <ListItemText primary={roles[index][fields.organizationName]} secondary={roles[index][fields.role]} />
            </ListItem>
        );
    }
    return (
        <React.Fragment>
            {
                <Tooltip title={<strong style={{ fontSize: 13 }}>Organization</strong>}>
                    <span>
                        <Button disabled={orgInfo && orgInfo[fields.isAdmin]} style={{ marginTop: 4, textTransform: 'none', height: 30, marginTop: 12 }} onClick={(e) => { setAnchorEl(e.currentTarget) }} tooltip='Organization'>
                            <BusinessIcon fontSize='medium' />&nbsp;
                            <h5>
                                {orgInfo ? orgInfo[fields.organizationName] : 'Select Organization'}
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