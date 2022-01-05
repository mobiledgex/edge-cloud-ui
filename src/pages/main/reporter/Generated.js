import React from 'react';
import { connect } from 'react-redux';
import { Card, CardContent, Dialog, Divider, Grid, List, Typography, CircularProgress, Tooltip } from '@material-ui/core';
import { showGeneratedReports, downloadReport } from '../../../services/modules/reporter';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import PictureAsPdfOutlinedIcon from '@material-ui/icons/PictureAsPdfOutlined';
import { withStyles } from '@material-ui/styles';
import { redux_org } from '../../../helper/reduxData';
import { Select, IconButton, DialogTitle } from '../../../hoc/mexui'
import { NoData } from '../../../helper/formatter/ui'
import { FORMAT_FULL_DATE, time } from '../../../utils/date_util';
import { ICON_COLOR } from '../../../helper/constant/colors';

const OPEN = 0
const DOWNLOAD = 1

const styles = theme => ({
    buttonProgress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        marginTop: -12,
        marginLeft: -12,
    },
})

const keys = [
    { label: 'Operator' },
    { label: 'Reporter' },
    { label: 'Startime' },
    { label: 'Endtime' },
]

class Generated extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            reports: [],
            pdfLoading: undefined,
            loading: false,
            selectedOrg: undefined
        }
        this._isMounted = false
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    fetchReport = async (index, filename, action) => {
        let org = this.state.selectedOrg
        this.updateState({ pdfLoading: `${index}_${action}` })
        let mc = await downloadReport(this, { filename, org })
        if (mc && mc.response && mc.response.status === 200) {
            const blob = new Blob([mc.response.data], { type: 'application/pdf' })
            const objectUrl = window.URL.createObjectURL(blob)
            if (action === OPEN) {
                window.open(objectUrl, '_blank')
            }
            else {
                var downloadLink = document.createElement("a");
                downloadLink.href = objectUrl;
                downloadLink.download = filename
                document.body.appendChild(downloadLink);
                downloadLink.click();
                document.body.removeChild(downloadLink);
            }
        }
        this.updateState({ pdfLoading: undefined })
    }

    fetchReports = async (org) => {
        this.updateState({ loading: true })
        let mc = await showGeneratedReports(this, { org })
        if (mc && mc.response && mc.response.status === 200) {
            let reports = mc.response.data
            this.updateState({ reports })
        }
        this.updateState({ loading: false })
    }

    onOrgChange = (value) => {
        if (this._isMounted && value) {
            this.setState({ reports: [], selectedOrg: value }, () => {
                this.fetchReports(value)
            })
        }
        else {
            this.updateState({ reports: [], selectedOrg: undefined })
        }
    }

    renderFileDetails = (filename) => {
        const details = filename.split('/')
        if (details.length === 3) {
            const timerange = details[2].replace('.pdf', '')
            const intervals = timerange.split('_')
            if (intervals.length === 2) {
                details[2] = time(FORMAT_FULL_DATE, intervals[0])
                details[3] = time(FORMAT_FULL_DATE, intervals[1])
            }
        }
        return (
            <Grid container>
                {details.map((detail, i) => (
                    <Grid item xs={i > 1 ? 2 : 4} key={i}><Tooltip title={<strong style={{ fontSize: 13 }}>{detail}</strong>}><p style={{ textOverflow: 'ellipsis', overflow: 'hidden', width: '90%', whiteSpace: 'nowrap' }}>{detail}</p></Tooltip></Grid>
                ))}
            </Grid>
        )
    }
    render() {
        const { open, close, orgList } = this.props
        const { reports, loading, pdfLoading } = this.state
        return (
            <Dialog open={open}>
                <Card style={{ width: 600 }}>
                    <DialogTitle onClose={close} disabled={loading || pdfLoading !== undefined} label={'History'}>
                        {
                            redux_org.isAdmin(this) ?
                                <Select list={orgList} onChange={this.onOrgChange} search={true} placeholder={'Select Organization'} width={150} underline={true} />
                                : null
                        }
                    </DialogTitle>
                    {loading ?
                        <div align='center' style={{ padding: '70px 0', textAlign: 'center' }}>
                            <CircularProgress size={100} thickness={1} />
                            <Typography style={{ marginTop: 20, color: '#C4D3DC' }}>Please wait fetching data</Typography>
                        </div> :
                        <CardContent style={{ height: '30vh', overflowY: 'auto', overflowX: 'hidden' }}>
                            {
                                reports.length > 0 ?
                                    <List >
                                        <Grid container style={{ marginBottom: 5, paddingLeft: 5, paddingRight: 5 }}>
                                            <Grid item xs={10}>
                                                <Grid container>
                                                    {keys.map((key, i) => (
                                                        <Grid item xs={i > 1 ? 2 : 4} key={i}><b>{key.label}</b></Grid>
                                                    ))}
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Divider />
                                        {
                                            reports.map((filename, i) => (
                                                <Grid key={i} container style={{ alignItems: 'center', display: 'flex', marginBottom: -5, paddingLeft: 5, paddingRight: 5, backgroundColor: `${i % 2 === 0 ? '#1E2123' : '#292C33'}` }}>
                                                    <Grid item xs={10}>
                                                        {this.renderFileDetails(filename)}
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        {
                                                            <IconButton disabled={pdfLoading !== undefined} loading={pdfLoading === `${i}_${OPEN}`} tooltip='Open' onClick={() => { this.fetchReport(i, filename, OPEN) }}><PictureAsPdfOutlinedIcon style={{ color: ICON_COLOR }} /></IconButton>
                                                        }
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        {
                                                            <IconButton disabled={pdfLoading !== undefined} loading={pdfLoading === `${i}_${DOWNLOAD}`} tooltip='Download' onClick={() => { this.fetchReport(i, filename, DOWNLOAD) }}><CloudDownloadOutlinedIcon style={{ color: ICON_COLOR }} /></IconButton>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            ))
                                        }
                                    </List>
                                    : <NoData loading={loading} />
                            }
                        </CardContent>
                    }
                </Card>
            </Dialog>
        )
    }

    componentDidUpdate(preProps, preState) {
        if (this.props.open !== preProps.open && this.props.open) {
            if (redux_org.isOperator(this)) {
                this.fetchReports()
            }
        }
    }

    componentDidMount() {
        this._isMounted = true
    }

    componentWillUnmount() {
        this._isMounted = false
    }
}

const mapStateToProps = (state) => {
    return {
        organizationInfo: state.organizationInfo.data
    }
};

export default connect(mapStateToProps, null)(withStyles(styles)(Generated));