import { TableRow, TableCell} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { redux_org } from '../../helper/reduxData';

export const checkRole = (selectedOrg, form) => {
    let roles = form.roles
    let visible = true
    if (roles) {
        visible = false
        form.detailView = false
        if(roles.includes(redux_org.role(selectedOrg)) || roles.includes(redux_org.roleType(selectedOrg)))
        {
            visible = true
            form.detailView = true
        }
    }
    return visible
}

export const getComparator = (order, orderBy) => {
    return order === "desc"
        ? (a, b) => (a[orderBy] > b[orderBy] ? -1 : 1)
        : (a, b) => (a[orderBy] < b[orderBy] ? -1 : 1);
}

export const stableSort = (dataList, comparator, isGrouping) => {
    let array = isGrouping ? Object.keys(dataList) : dataList
    const stabilizedThis = array.map((key, index) => [key, index]);
    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
}

export const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: '#1E2123',
        }
    },
}))(TableRow);

export const StyledTableCell = withStyles((theme) => ({
    root: {
        maxWidth: 250,
        overflow: 'hidden',
        padding: '0 0 0 16px  !important',
        textOverflow: 'ellipsis',
        borderBottom: 'none',
        height: '50px !important'
    },
}))(TableCell);