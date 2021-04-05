import { Box, Card, CardContent, Dialog, Divider, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@material-ui/core'
import React from 'react';
import { toFirstUpperCase } from '../../../../constant'
import PictureAsPdfOutlinedIcon from '@material-ui/icons/PictureAsPdfOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import './style.css'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

const invoiceInfo = [
    { label: 'Invoice', header: true },
    { label: 'Invoice Number', field: 'number' },
    { label: 'Issue Date', field: 'issueDate' },
    { label: 'Due Date', field: 'dueDate' }
]

const customerInfo = [
    { label: 'Bill To', header: true },
    { label: 'Name', field: 'first_name', custom: true },
    { label: 'Organization', field: 'organization' },
    { label: 'Email', field: 'email' }
]

const sellerInfo = [
    { label: 'Name', field: 'name', header: true },
    { label: 'Phone', field: 'phone' },
]

const amountSummary = [
    { label: 'Subtotal', field: 'subtotalAmount' },
    { label: 'Discounts', field: 'discountAmount' },
    { label: 'Tax', field: 'taxAmount' },
    { label: 'Total', field: 'totalAmount' },
]

const itemKeys = [
    { label: 'Item', serverField: 'title', visible: true, sub: 4 },
    { label: 'Quantity', serverField: 'quantity', visible: true },
    { field: 'unitPrice', label: 'Unit Price', serverField: 'unit_price', visible: true, custom: true },
    { field: 'amount', label: 'Amount', serverField: 'total_amount', visible: true, custom: true },
    { label: 'Description', serverField: 'description', visible: false },
    { label: 'Component Id', serverField: 'component_id', visible: false },
    { label: 'Discount Amount', serverField: 'discount_amount', visible: false },
    { label: 'Period Range End', serverField: 'period_range_end', visible: false },
    { label: 'Period Range Start', serverField: 'period_range_start', visible: false },
    { label: 'Price Point Id', serverField: 'price_point_id', visible: false },
    { label: 'Product ID', serverField: 'product_id', visible: false },
    { label: 'Product Price Point ID', serverField: 'product_price_point_id', visible: false },
    { label: 'Product Version', serverField: 'product_version', visible: false },
    { label: 'Subtotal Amount', serverField: 'subtotal_amount', visible: false },
    { label: 'Tax Amount', serverField: 'tax_amount', visible: false },
    { label: 'Tiered Unit Price', serverField: 'tiered_unit_price', visible: false },
    { label: 'UID', serverField: 'uid', visible: false },
]
class Invoice extends React.Component {

    constructor(props) {
        super(props)
    }

    cutomizeData = (form, data) => {
        if (form.field === 'first_name') {
            return `${data['first_name']} ${data['last_name']}`
        }
        else if (form.field === 'unitPrice' || form.field === 'amount') {
            return `$${data[form.serverField]}`
        }
    }

    renderLeft = (data, forms) => (
        <Box className="invoice-info-width">
            {forms.map((form, i) => (
                form.header ?
                    <React.Fragment key={i}>
                        <Divider />
                        <h4 className='invoice-info-header'>{form.label}</h4>
                        <Divider />
                        <br />
                    </React.Fragment> :
                    <Grid container key={i}>
                        <Grid item xs={4}>
                            <strong>{form.label}</strong>
                        </Grid>
                        <Grid item xs={8} className='invoice-info-result'>
                            <p>{form.custom ? this.cutomizeData(form, data) : data[form.field]}</p>
                        </Grid>
                    </Grid>
            ))}
            <br />
        </Box>
    )

    renderSeller = (data) => {
        let info = data['seller']
        return (
            <Box flexGrow={1} >
                {sellerInfo.map((form, i) => (
                    form.header ?
                        <Typography key={i} gutterBottom variant="h5" component="h2">
                            {info['name']}
                        </Typography> :
                        <p key={i}>{info[form.field]}</p>
                ))}
            </Box>
        )
    }

    renderInvoice = (data) => {
        return this.renderLeft(data, invoiceInfo)
    }

    renderCustomer = (data) => {
        return this.renderLeft(data['customer'], customerInfo)
    }

    renderItems = (data) => {
        let items = data['items']
        return (
            <TableContainer className='invoice-table-main' >
                <Table aria-label="list item table">
                    <TableHead>
                        <TableRow>
                            {itemKeys.map((item, i) => (
                                item.visible ? <TableCell key={i}>{item.label}</TableCell> : null
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item, i) => (
                            <TableRow key={i}>
                                {itemKeys.map((key, j) => (
                                    key.visible ? <TableCell key={`${i}_${j}`}>
                                        {key.custom ? this.cutomizeData(key, item) : item[key.serverField]}
                                        {key.sub ? <Typography variant="body2" color="textSecondary" component="p">
                                            {item[itemKeys[key.sub].serverField]}
                                        </Typography> : null}
                                    </TableCell>
                                        : null
                                ))}
                            </TableRow>
                        ))}
                        {amountSummary.map((summary, i) => (
                            <TableRow key={i}>
                                <TableCell colSpan={2} className='info-table-summary-cell-empty'></TableCell>
                                <TableCell><strong>{summary.label}</strong></TableCell>
                                <TableCell>{`$${data[summary.field]}`}</TableCell>
                            </TableRow>
                        ))}

                    </TableBody>
                </Table>
            </TableContainer>
        )
    }

    toPdf = () => {
        let element = document.querySelector("#invoice-details")
        let clonedElement = element.cloneNode(true)
        clonedElement.setAttribute('id', 'invoice-details-pdf')
        document.body.appendChild(clonedElement);
        html2canvas(clonedElement, { logging: false }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF();
            pdf.addImage(imgData, 'JPEG', 0, 0);
            pdf.setProperties({ title: 'test' })
            // pdf.save("download.pdf");
            window.open(pdf.output('bloburl', { filename: 'invoice.pdf' }), '_blank');
            document.body.removeChild(clonedElement)
        });
    }

    render() {
        const { data, close } = this.props
        return (
            <Dialog onClose={close} aria-labelledby="invoice" open={data !== undefined}>
                {data ?
                    <Card>
                        <CardContent>
                            <Box display="flex" >
                                <Box flexGrow={1} p={1}>
                                    <Typography gutterBottom variant="h5" component="h4">
                                        {`${toFirstUpperCase(data['collectionMethod'])} Collection`}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Tooltip title={<strong style={{ fontSize: 13 }}>PDF</strong>}>
                                        <IconButton onClick={this.toPdf}><PictureAsPdfOutlinedIcon /></IconButton>
                                    </Tooltip>
                                </Box>
                                <Box>
                                    <Tooltip title={<strong style={{ fontSize: 13 }}>Close</strong>}>
                                        <IconButton onClick={close}><CloseOutlinedIcon /></IconButton>
                                    </Tooltip>
                                </Box>
                            </Box>
                        </CardContent>
                        <Divider />
                        <CardContent id="invoice-details">
                            <Box display="flex" >
                                <Box flexGrow={1} >
                                    {this.renderSeller(data)}
                                </Box>
                                <Box className='invoice-info-width'>
                                    {this.renderInvoice(data)}
                                </Box>
                            </Box>
                            <br />
                            <Box display="flex">
                                <Box display="block" flexGrow={1}>
                                    {this.renderCustomer(data)}
                                </Box>
                                <Box className='invoice-info-width'>
                                    <div className='invoice-status'>
                                        <Grid container >
                                            <Grid item xs={4} className='invoice-status-left'>
                                                {/* <strong>{data['status'].toUpperCase()}</strong> */}
                                                <strong>PAID</strong>
                                            </Grid>
                                            <Grid item xs={8} className='invoice-status-right'>
                                                <strong>${data['paidAmount']} USD</strong>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Box>
                            </Box>
                            {this.renderItems(data)}
                        </CardContent>
                    </Card> : null}
            </Dialog>
        )
    }

    componentDidMount() {
    }

    componentWillUnmount() {

    }
}

export default Invoice