import React from 'react';
import {Button, Divider, Modal, Grid} from "semantic-ui-react";
import * as moment from 'moment';
import {ExpansionPanel, ExpansionPanelDetails, ExpansionPanelSummary, Step, StepLabel} from "@material-ui/core";
import ReactJson from "react-json-view";


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


    render() {
        return (
            <Modal size={'small'} open={this.state.open}>
                <Modal.Header>Detail</Modal.Header>
                <Modal.Content>
                    <ExpansionPanel square expanded={this.state.expanded === 0} onChange={this.handleExpandedChange(0)}>
                        <ExpansionPanelSummary
                            id="panel1a-header"
                        >
                            RAW Viewer
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {(this.props.rawViewData) ? jsonView(this.props.rawViewData, this) : null}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel square expanded={this.state.expanded === 1} onChange={this.handleExpandedChange(1)}>
                        <ExpansionPanelSummary
                            id="panel1a-header"
                        >
                            Request
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {(this.props.requestData) ? jsonView(this.props.requestData, this) : null}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>

                    <ExpansionPanel square expanded={this.state.expanded === 2} onChange={this.handleExpandedChange(2)}>
                        <ExpansionPanelSummary
                            id="panel1a-header"
                        >
                            Response
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            {(this.props.responseData) ? jsonView(this.props.responseData, this) : null}
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </Modal.Content>
                <Modal.Actions>
                    <Button onClick={() => this.close()}>
                        Close
                    </Button>
                </Modal.Actions>
            </Modal>
        )
    }
}


