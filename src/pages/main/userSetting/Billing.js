import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import * as actions from '../../../actions';
import { Button, Dialog, DialogActions, DialogTitle, IconButton, List, ListItem, ListItemText, MenuItem, Tooltip } from '@material-ui/core';
import { FORMAT_FULL_DATE_TIME, time } from '../../../utils/date_util'
import { showBillingOrg, keys } from '../../../services/modules/billingorg';
import LinearProgress from '@material-ui/core/LinearProgress';
import PaymentOutlinedIcon from '@material-ui/icons/PaymentOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { localFields } from '../../../services/fields';
import { operators } from '../../../helper/constant';
import { redux_org } from '../../../helper/reduxData';
import cloneDeep from 'lodash/cloneDeep';
import { service } from '../../../services';
import { ICON_COLOR } from '../../../helper/constant/colors';

const orgKeys = [
    { field: localFields.name, label: 'Billing Org' },
    { field: localFields.firstName, label: 'First Name' },
    { field: localFields.lastName, label: 'Last Name' },
    { field: localFields.email, label: 'Email' },
    { field: localFields.createdAt, label: 'Created Date' },
]

class Billing extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            billingOrg: undefined,
            open: false,
            isOTP: false,
            OTPData: undefined,
            loading: false
        }
        this.keys = keys()
    }

    handleOpen = () => {
        if(this.state.billingOrg)
        {
            this.setState({ open: true })
        }
        else
        {
            this.props.handleAlertInfo('error', 'Billing info not found') 
        }
        this.props.onClose()
    }

    handleClose = () => {
        this.setState({ open: false })
    }

    renderRow = (index, key, data) => {
        let label = key.label
        let value = data[key.field]
        return (
            <ListItem key={index}>
                <div style={{ minWidth: 200, marginRight: 10 }}>
                    <h5>{label}</h5>
                </div>
                <div>
                    <h5> {value}</h5>
                </div>
            </ListItem>
        );
    }

    onInvoice = (data) => {
        this.handleClose()
        this.props.history.push({
            pathname: '/main/invoices',
            state: { data }
        });
    }

    renderInvoice = (data) => (
        <Tooltip title={<strong style={{ fontSize: 13 }}>Invoices</strong>}>
            <IconButton onClick={() => { this.onInvoice(data) }}><DescriptionOutlinedIcon style={{ color: ICON_COLOR }} /></IconButton>
        </Tooltip>
    )

    onDialogClose = (event, reason) => {
        if (reason !== 'backdropClick') {
            this.handleClose()
        }
    }

    render() {
        const { open, loading, billingOrg } = this.state
        return (
            <React.Fragment>
                <MenuItem onClick={this.handleOpen}>
                    <PaymentOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />
                    <ListItemText primary="Billing" />
                </MenuItem>
                {billingOrg ? <Dialog open={open} onClose={this.onDialogClose} aria-labelledby="billing" disableEscapeKeyDown={true}>
                    {loading ? <LinearProgress /> : null}
                    <DialogTitle id="billing">
                        <div style={{ float: "left", display: 'inline-block' }}>
                            <h3 style={{ fontWeight: 700 }}>Billing</h3>
                        </div>
                        <div style={{ float: "right", display: 'inline-block', marginTop: -8 }}>
                            {this.renderInvoice(billingOrg)}
                        </div>
                    </DialogTitle>
                    <List style={{ marginLeft: 10 }}>
                        {
                            orgKeys.map((key, i) => {
                                return this.renderRow(i, key, billingOrg)
                            })
                        }
                    </List>
                    <DialogActions>
                        <Button onClick={this.handleClose} style={{ backgroundColor: 'rgba(118, 255, 3, 0.7)' }} size='small'>
                            Close
                        </Button>
                    </DialogActions>
                </Dialog> : null}
            </React.Fragment>
        )
    }

    setManagedOrg = () => {
        this.setState({ billingOrg: undefined }, () => {
            if (redux_org.nonAdminOrg(this) && this.billingOrgList) {
                this.billingOrgList.map(billingOrg => {
                    if (redux_org.nonAdminOrg(this) === billingOrg[localFields.name]) {
                        let data = cloneDeep(billingOrg)
                        data[localFields.createdAt] = time(FORMAT_FULL_DATE_TIME, data[localFields.createdAt])
                        this.setState({ billingOrg: data })
                    }
                })
            }
        })
    }

    componentDidUpdate(preProps, preState) {
        if (!operators.equal(preProps.organizationInfo, this.props.organizationInfo)) {
            this.setManagedOrg()
        }
    }

    fetchBillingOrg = async () => {
        let mc = await service.authSyncRequest(this, showBillingOrg(this))
        if (mc && mc.response && mc.response.status === 200) {
            this.billingOrgList = mc.response.data
            this.setManagedOrg()
        }
    }

    componentDidMount() {
        this.fetchBillingOrg()
    }
}

const mapDispatchProps = (dispatch) => {
    return {
        handleAlertInfo: (mode, msg) => { dispatch(actions.alertInfo(mode, msg)) }
    };
};

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};
export default withRouter(connect(mapStateToProps, mapDispatchProps)(Billing));
