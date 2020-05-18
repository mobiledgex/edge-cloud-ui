import React from 'react';
import {Button, Divider, Modal, Grid} from "semantic-ui-react";
import * as moment from 'moment';
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Dialog, DialogTitle, DialogContent, DialogActions, Paper} from "@material-ui/core";
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ReactJson from "react-json-view";
import Draggable from "react-draggable";
import IconButton from "@material-ui/core/IconButton";


const jsonView = (jsonObj, self) => {
    return <ReactJson src={jsonObj} {...self.jsonViewProps} style={{ width: '100%' }} />
}
let _self = null;
export default class PopDetailViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            open:false,
            dimmer:'',
            expanded: 0
        }
        this.jsonViewProps = {
            name: null,
            theme: "monokai",
            collapsed: false,
            collapseStringsAfter: 15,
            onAdd: false,
            onEdit: false,
            onDelete: false,
            displayObjectSize: true,
            enableClipboard: true,
            indentWidth: 4,
            displayDataTypes: false,
            iconStyle: "triangle"
        }

        _self = this;
    }

    componentDidMount() {
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if(nextProps.open) {
            this.setState({open:nextProps.open, dimmer:nextProps.dimmer});
        }
    }

    handleExpandedChange = (panel) => (event, newExpanded) => {
        this.setState({expanded: newExpanded ? panel : false});
    };

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

    paperComponent(props) {
        return (
            <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
                <Paper {...props} />
            </Draggable>
        );
    }

    render() {
        return (
            <Dialog
                className="audit_popup"
                open={this.state.open}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                PaperComponent={this.paperComponent}
                aria-labelledby="draggable-dialog-title"
                style={{zIndex: 1901}} // It should be higher than Audit Timeline Popup(= z-index:1900)
            >
                <DialogTitle className="audit_popup_title" style={{ cursor: 'move' }} id="draggable-dialog-title">
                    Detail
                </DialogTitle>
                <DialogContent>
                    <ExpansionPanel className="audit_popup_panel" square expanded={this.state.expanded === 0} onChange={this.handleExpandedChange(0)}>
                        <ExpansionPanelSummary
                            className="audit_popup_panel_header"
                            id="panel1a-header"
                        >
                            <div>RAW Viewer</div>
                            {this.state.expanded === 0 ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {(this.props.rawViewData) ? jsonView(this.props.rawViewData, this) : null}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel className="audit_popup_panel"  square expanded={this.state.expanded === 1} onChange={this.handleExpandedChange(1)}>
                        <ExpansionPanelSummary
                            id="panel1a-header"
                        >
                            <div>Request</div>
                            <div>{this.state.expanded === 1 ? <ExpandLessIcon/> : <ExpandMoreIcon/>}</div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {(this.props.requestData) ? jsonView(this.props.requestData, this) : null}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel className="audit_popup_panel"  square expanded={this.state.expanded === 2} onChange={this.handleExpandedChange(2)}>
                        <ExpansionPanelSummary
                            id="panel1a-header"
                        >
                            <div>Response</div>
                            <div>{this.state.expanded === 2 ? <ExpandLessIcon/> : <ExpandMoreIcon/>}</div>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {(this.props.responseData) ? jsonView(this.props.responseData, this) : null}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </DialogContent>
                <DialogActions>
                    <IconButton onClick={this.handleClose} >
                        CLOSE
                    </IconButton>
                    {/*<Button autoFocus onClick={this.handleClose} color="primary">*/}
                    {/*    Cancel*/}
                    {/*</Button>*/}
                </DialogActions>
            </Dialog>
            // <Modal size={'small'} open={this.state.open} allowMultiple={true}>
            //     <Modal.Header>Detail</Modal.Header>
            //     <Modal.Content>
            //         <ExpansionPanel square expanded={this.state.expanded === 0} onChange={this.handleExpandedChange(0)}>
            //             <ExpansionPanelSummary
            //                 id="panel1a-header"
            //             >
            //                 RAW Viewer
            //             </ExpansionPanelSummary>
            //             <ExpansionPanelDetails>
            //                 {(this.props.rawViewData) ? jsonView(this.props.rawViewData, this) : null}
            //             </ExpansionPanelDetails>
            //         </ExpansionPanel>
            //
            //         <ExpansionPanel square expanded={this.state.expanded === 1} onChange={this.handleExpandedChange(1)}>
            //             <ExpansionPanelSummary
            //                 id="panel1a-header"
            //             >
            //                 Request
            //             </ExpansionPanelSummary>
            //             <ExpansionPanelDetails>
            //                 {(this.props.requestData) ? jsonView(this.props.requestData, this) : null}
            //             </ExpansionPanelDetails>
            //         </ExpansionPanel>
            //
            //         <ExpansionPanel square expanded={this.state.expanded === 2} onChange={this.handleExpandedChange(2)}>
            //             <ExpansionPanelSummary
            //                 id="panel1a-header"
            //             >
            //                 Response
            //             </ExpansionPanelSummary>
            //             <ExpansionPanelDetails>
            //                 {(this.props.responseData) ? jsonView(this.props.responseData, this) : null}
            //             </ExpansionPanelDetails>
            //         </ExpansionPanel>
            //     </Modal.Content>
            //     <Modal.Actions>
            //         <Button onClick={() => this.close()}>
            //             Close
            //         </Button>
            //     </Modal.Actions>
            // </Modal>
        )
    }
}


