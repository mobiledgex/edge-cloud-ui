/**
 * Copyright 2022 MobiledgeX, Inc
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Box, Card, CardContent, Dialog, Divider, Grid, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, Typography } from '@material-ui/core'
import React from 'react';
import PictureAsPdfOutlinedIcon from '@material-ui/icons/PictureAsPdfOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import './style.css'
import { generatePDF } from './pdf_generator';
import { customerInfo, invoiceInfo, statusAmount, amountSummary, itemKeys, cutomizeData } from './constant';

const sellerInfo = [
    { label: 'Name', field: 'name', header: true },
    // { label: 'Phone', field: 'phone' },
]

class Invoice extends React.Component {

    constructor(props) {
        super(props)
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
                            <p>{form.custom ? cutomizeData(form, data) : data[form.field]}</p>
                        </Grid>
                    </Grid>
            ))}
            <br />
        </Box>
    )

    renderSeller = (data) => {
        let info = data['seller']
        return (
            <div >
                {sellerInfo.map((form, i) => (
                    form.header ?
                        <img key={i} id='company_logo' src='/assets/brand/logo_small.png' alt="MobiledgeX" /> :
                        <p key={i}>{info[form.field]}</p>
                ))}
            </div>
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
                                        {key.custom ? cutomizeData(key, item) : item[key.serverField]}
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

    render() {
        const { data, close } = this.props
        return (
            <Dialog onClose={close} aria-labelledby="invoice" open={data !== undefined}  maxWidth='md'>
                {data ?
                    <Card>
                        <CardContent>
                            <Box display="flex" >
                                <Box flexGrow={1} p={1}>
                                    <Typography gutterBottom variant="h5" component="h4">
                                        Invoice
                                    </Typography>
                                </Box>
                                <Box>
                                    <Tooltip title={<strong style={{ fontSize: 13 }}>PDF</strong>}>
                                        <IconButton onClick={() => { generatePDF(data) }}><PictureAsPdfOutlinedIcon /></IconButton>
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
                            <table >
                                <tbody>
                                    <tr>
                                        <td valign="top" style={{ width: 300 }}>
                                            {this.renderSeller(data)}
                                        </td>
                                        <td style={{ width: 20 }}></td>
                                        <td valign="top" style={{ width: 300 }}>
                                            {this.renderInvoice(data)}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td valign="top" style={{ width: 300 }}>
                                            {this.renderCustomer(data)}
                                        </td>
                                        <td style={{ width: 20 }}></td>
                                        <td valign="top"style={{ width: 300 }}>
                                            <div className='invoice-status'>
                                                <Grid container >
                                                    <Grid item xs={4} className='invoice-status-left'>
                                                        <strong>{data['status'] ? data['status'].toUpperCase() : ''}</strong>
                                                    </Grid>
                                                    <Grid item xs={8} className='invoice-status-right'>
                                                        <strong>{statusAmount(data)}</strong>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <br />
                         
                            {this.renderItems(data)}
                        </CardContent>
                    </Card> : null}
            </Dialog>
        )
    }
}

export default Invoice