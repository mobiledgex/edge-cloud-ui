import React from 'react';
import { Button, Dialog, DialogActions, DialogTitle, IconButton, List, ListItem, ListItemText, MenuItem, Switch, Tooltip } from '@material-ui/core';
import { FORMAT_FULL_DATE_TIME, time } from '../../../utils/date_util'
import { sendRequest } from '../../../services/model/serverData';
import { showBillingOrg, keys } from '../../../services/model/billingOrg';
import * as dateUtil from '../../../utils/date_util'
import LinearProgress from '@material-ui/core/LinearProgress';
import ReceiptOutlinedIcon from '@material-ui/icons/ReceiptOutlined';
import DescriptionOutlinedIcon from '@material-ui/icons/DescriptionOutlined';
import { fields } from '../../../services/model/format';
import { withRouter } from 'react-router';

const orgKeys = [
    { field: fields.name, label: 'Billing Org' },
    { field: fields.firstName, label: 'First Name' },
    { field: fields.lastName, label: 'Last Name' },
    { field: fields.email, label: 'Email' },
    { field: fields.createdAt, label: 'Created Date' },
]

class Profile extends React.Component {
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
        this.setState({ open: true })
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
            <IconButton onClick={() => { this.onInvoice(data) }}><DescriptionOutlinedIcon style={{ color: '#4caf50' }} /></IconButton>
        </Tooltip>
    )

    render() {
        const { open, loading, billingOrg } = this.state
        return (
            <React.Fragment>
                <MenuItem onClick={this.handleOpen}>
                    <ReceiptOutlinedIcon fontSize="small" style={{ marginRight: 15 }} />
                    <ListItemText primary="Billing" />
                </MenuItem>
                {billingOrg ? <Dialog open={open} onClose={this.handleClose} aria-labelledby="billing" disableEscapeKeyDown={true} disableBackdropClick={true}>
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

    fetchBillingOrg = async () => {
        let mc = await sendRequest(this, showBillingOrg(this))
        if (mc && mc.response && mc.response.status === 200) {
            let data = mc.response.data[0]
            data[fields.createdAt] = time(FORMAT_FULL_DATE_TIME, data[fields.createdAt])
            this.setState({ billingOrg: data })
        }
    }

    componentDidMount() {
        this.fetchBillingOrg()
    }
}

export default withRouter(Profile);
