import React from 'react';
import { Dialog, DialogContent, DialogTitle as MuiDialogTitle, Card, Button } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import cloneDeep from 'lodash/cloneDeep'
import { withStyles } from '@material-ui/styles';
import { syntaxHighLighter } from '../../../../hoc/highLighter/highLighter';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const jsonParse = (data) => {
    try {
        return JSON.parse(data)
    }
    catch (err) {
        return data
    }
}

const parseMultiJsonObject = (response)=>{
    let resList = response.split('\n')
    let formattedList = []
    resList.map(res => {
        try {
            formattedList.push(JSON.parse(res))
        }
        catch (e) {

        }
    })
    return formattedList
}

const jsonView = (data, position) => {
    let jsonObj = cloneDeep(data)
    if (jsonObj.request) {
        jsonObj.request = jsonParse(jsonObj.request)
    }

    if (jsonObj.response) {
        let response = jsonObj.response
        if (response.includes('\"') && response.includes('\n')) {
            jsonObj.response = parseMultiJsonObject(response)
        }
        else {
            jsonObj.response = jsonParse(jsonObj.response)
        }
    }

    if (position === 1) {
        jsonObj = jsonObj.request
    }
    else if (position === 2) {
        jsonObj = jsonObj.response
    }
    return (
        <div style={{ width: '100%', flexDirection: 'column' }}>
            {syntaxHighLighter('json', JSON.stringify(jsonObj !== undefined ? jsonObj : {}, null, 1))}
        </div>
    )
}

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: '16px 0',
    },
    closeButton: {
        position: 'absolute',
        right: theme.spacing(1),
        top: theme.spacing(1),
        color: theme.palette.grey[500],
    },
});

const DialogTitle = withStyles(styles)((props) => {
    const { children, classes, onClose } = props;
    return (
        <MuiDialogTitle className={classes.root}>
            {children}
            {onClose ? (
                <IconButton aria-label="close" onClick={onClose} className={classes.closeButton}>
                    <CloseIcon />
                </IconButton>
            ) : null}
        </MuiDialogTitle>
    );
});

const StyledTabs = withStyles((theme) => ({
    flexContainer: {
        borderBottom: '1px solid rgba(255,255,255,.7)'
    },
}))(Tabs);

const AuditDetailView = (props) => {
    const [viewIndex, setViewIndex] = React.useState(0)
    const [rawData, setRawData] = React.useState(undefined)

    const handleClose = () => {
        setViewIndex(0)
        setRawData(undefined)
    }

    const expansionPanelView = (position, data) => {
        return (
            <Card >
                {(data) ? jsonView(data, position) : null}
            </Card>
        )
    }

    const handleChangeTab = (e, newValue) => {
        setViewIndex(newValue);
    };

    const setAllView = (mtags) => {
        if (mtags && mtags['traceid']) {
            return mtags
        }
        return {}
    }

    const viewDetail = (data) => {
        let rawData = (data.mtags) ? setAllView(data.mtags) : {};
        setRawData(rawData)
    }

    return (
        <React.Fragment>
            <Button onClick={() => { viewDetail(props.data) }}>
                VIEW DETAIL
            </Button>
            <Dialog
                fullWidth={true}
                maxWidth={'lg'}
                open={rawData !== undefined}
                onClose={handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle onClose={handleClose}>
                    <StyledTabs
                        value={viewIndex}
                        onChange={handleChangeTab}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="Raw Viewer" />
                        <Tab label="Request" />
                        <Tab label="Response" />
                    </StyledTabs>
                </DialogTitle>
                <DialogContent>
                    {expansionPanelView(viewIndex, rawData)}
                </DialogContent>
            </Dialog>
        </React.Fragment>
    )
}

export default AuditDetailView