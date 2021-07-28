import React from 'react';
import { useSelector, useDispatch } from "react-redux";
import { IconButton, ListItem, ListItemText, Popover } from '@material-ui/core';
import { fields } from '../../../services/model/format';
import BusinessIcon from '@material-ui/icons/Business';
import { FixedSizeList } from 'react-window';
import { organizationInfo, privateAccess, loadingSpinner } from '../../../actions';
import { perpetual } from '../../../helper/constant';
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
        localStorage.setItem(perpetual.LS_ORGANIZATION_INFO, JSON.stringify(role))
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
                <IconButton disabled={orgInfo && orgInfo[fields.isAdmin]} style={{ marginTop: 4 }} onClick={(e) => { setAnchorEl(e.currentTarget) }}>
                    <BusinessIcon fontSize='default' />&nbsp;
                        <h5>
                        {orgInfo ? orgInfo[fields.organizationName] : 'Select Organization'}
                    </h5>
                </IconButton>
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