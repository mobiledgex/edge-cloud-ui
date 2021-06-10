import React from 'react';
import { connect } from 'react-redux';
import { Box, Card, CardContent, Dialog, Divider, Grid, List, Typography, CircularProgress } from '@material-ui/core';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import { showGeneratedReports, downloadReport } from '../../../services/model/reporter';
import CloudDownloadOutlinedIcon from '@material-ui/icons/CloudDownloadOutlined';
import PictureAsPdfOutlinedIcon from '@material-ui/icons/PictureAsPdfOutlined';
import { withStyles } from '@material-ui/styles';
import IconButton from '../../../hoc/mexui/IconButton'
import { lightGreen } from '@material-ui/core/colors';
import { redux_org } from '../../../helper/reduxData';
import { Select } from '../../../hoc/mexui'
import { NoData } from '../../../helper/formatter/ui'
import { FORMAT_FULL_DATE, time } from '../../../utils/date_util';

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
            loading: false
        }
        this._isMounted = false
    }

    updateState = (data) => {
        if (this._isMounted) {
            this.setState({ ...data })
        }
    }

    fetchReport = async (index, filename, action) => {
        this.updateState({ pdfLoading: `${index}_${action}` })
        let mc = await downloadReport(this, { filename })
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
        let mc = await showGeneratedReports(this, { organizationName: org })
        if (mc && mc.response && mc.response.status === 200) {
            let reports = mc.response.data
            this.updateState({ reports })
        }
        this.updateState({ loading: false })
    }

    onOrgChange = (value) => {
        if (this._isMounted && value) {
            this.setState({ reports: [] }, () => {
                this.fetchReports(value)
            })
        }
        else {
            this.updateState({ reports: [] })
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
                    <Grid item xs={2} key={i}>{detail}</Grid>
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
                    <div style={{ padding: '10px 5px 0px 10px' }}>
                        <Box display="flex" >
                            <Box flexGrow={1}>
                                <Typography gutterBottom variant="h5" component="h4" style={{ color: lightGreen['A700'], alignItems: 'center' }}>
                                    History
                                </Typography>
                            </Box>
                            {
                                redux_org.isAdmin(this) ? <Box>
                                    <div style={{ marginTop: 5 }}>
                                        <Select list={orgList} onChange={this.onOrgChange} search={true} placeholder={'Select Organization'} underline={true} />
                                    </div>
                                </Box> : null
                            }
                            <Box>
                                <IconButton style={{ marginTop: -16 }} tooltip='Close' onClick={close} disabled={loading || pdfLoading !== undefined}><CloseOutlinedIcon style={{ color: lightGreen['A700'] }} /></IconButton>
                            </Box>
                        </Box>
                    </div>
                    <Divider />
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
                                                        <Grid item xs={2} key={i}><b>{key.label}</b></Grid>
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
                                                            <IconButton disabled={pdfLoading !== undefined} loading={pdfLoading === `${i}_${OPEN}`} tooltip='Open' onClick={() => { this.fetchReport(i, filename, OPEN) }}><PictureAsPdfOutlinedIcon style={{ color: lightGreen['A700'] }} /></IconButton>
                                                        }
                                                    </Grid>
                                                    <Grid item xs={1}>
                                                        {
                                                            <IconButton disabled={pdfLoading !== undefined} loading={pdfLoading === `${i}_${DOWNLOAD}`} tooltip='Download' onClick={() => { this.fetchReport(i, filename, DOWNLOAD) }}><CloudDownloadOutlinedIcon style={{ color: lightGreen['A700'] }} /></IconButton>
                                                        }
                                                    </Grid>
                                                </Grid>
                                            ))
                                        }
                                    </List>
                                    : <NoData />
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