import React from 'react';
import { Dialog, DialogContent, DialogTitle as MuiDialogTitle, Chip, Card } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from '@material-ui/icons/Close';
import cloneDeep from 'lodash/cloneDeep'
import { withStyles } from '@material-ui/styles';
import {syntaxHighLighter} from '../hoc/highLighter/highLighter';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import TableRow from "@material-ui/core/TableRow";

const jsonParse = (data) => {
    try {
        return JSON.parse(data)
    }
    catch (err) {
        return data
    }
}

const jsonView = (data, position) => {
    let jsonObj = cloneDeep(data)
    if (jsonObj.request) {
        jsonObj.request = jsonParse(jsonObj.request)
    }

    if (jsonObj.response) {
        jsonObj.response = jsonParse(jsonObj.response)
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

let _self = null;
export default class PopDetailViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            open: false,
            viewIndex: 0
        }
        _self = this;
    }

    componentDidMount() {
    }

    static getDerivedStateFromProps(props, state) {
        if (props.open) {
            return { open: props.open}
        }
        return null
    }

    close(mode) {
        this.setState({ open: false })
        this.props.close && this.props.close(mode)
    }

    handleClose = () => {
        this.setState({ open: false });
        this.props.close();
    }

    expansionPanelView = (position, data) => {
        return (
            <Card className="audit_popup_panel">
                {(data) ? jsonView(data, position) : null}
            </Card>
        )
    }

    getChipStyle = (position)=>
    {
        let color = this.state.viewIndex === position ? '#77BD06' :'#6F7074';
        return {backgroundColor: color, marginRight:5, fontSize:15}
    }

    handleChangeTab = (event, newValue) => {
        this.setState({viewIndex: newValue});
    };

    render() {
        return (
            <Dialog
                className="audit_popup"
                open={this.state.open}
                onClose={this.handleClose}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle onClose={this.handleClose}>
                    <StyledTabs
                        value={this.state.viewIndex}
                        onChange={this.handleChangeTab}
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="Raw Viewer" />
                        <Tab label="Request" />
                        <Tab label="Response" />
                    </StyledTabs>
                </DialogTitle>
                <DialogContent>
                    {this.expansionPanelView(this.state.viewIndex, this.props.rawViewData)}
                </DialogContent>
            </Dialog>
        )
    }
}
