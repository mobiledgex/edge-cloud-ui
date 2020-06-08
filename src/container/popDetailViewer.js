import React from 'react';
import { Dialog, DialogContent, DialogTitle as MuiDialogTitle, Chip, Card } from "@material-ui/core";
import IconButton from "@material-ui/core/IconButton";
import { Light as SyntaxHighlighter } from 'react-syntax-highlighter';
import json from 'react-syntax-highlighter/dist/esm/languages/hljs/json';
import allyDark from 'react-syntax-highlighter/dist/esm/styles/hljs/a11y-dark';
import CloseIcon from '@material-ui/icons/Close';
import cloneDeep from 'lodash/cloneDeep'
import { withStyles } from '@material-ui/styles';
SyntaxHighlighter.registerLanguage('json', json);

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
            <SyntaxHighlighter language="json" style={allyDark}>
                {JSON.stringify(jsonObj, null, 1)}
            </SyntaxHighlighter>
        </div>
    )
}

const styles = (theme) => ({
    root: {
        margin: 0,
        padding: theme.spacing(2),
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

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.open) {
            this.setState({ open: nextProps.open});
        }
    }

    close(mode) {
        this.setState({ open: false })
        this.props.close && this.props.close(mode)
    }

    handleOpen = () => {
        this.setState({ open: true });
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
        let color = this.state.viewIndex === position ? '#77BD06' :'#6F7074'
        return {backgroundColor: color, marginRight:5}
    }

    render() {
        return (
            <Dialog
                className="audit_popup"
                open={this.state.open}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                aria-labelledby="draggable-dialog-title"
                style={{ zIndex: 1901 }} // It should be higher than Audit Timeline Popup(= z-index:1900)
            >
                <DialogTitle onClose={this.handleClose}>
                    <Chip label="Raw Viewer" onClick={() => this.setState({ viewIndex: 0 })} style={this.getChipStyle(0)}/>
                    <Chip label="Request" onClick={() => this.setState({ viewIndex: 1 })} style={this.getChipStyle(1)}/>
                    <Chip label="Response" onClick={() => this.setState({ viewIndex: 2 })} style={this.getChipStyle(2)}/>
                </DialogTitle>
                <DialogContent>
                    {this.expansionPanelView(this.state.viewIndex, this.props.rawViewData)}
                </DialogContent>
            </Dialog>
        )
    }
}