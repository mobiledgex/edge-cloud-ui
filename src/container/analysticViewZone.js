import React from 'react';
import { Segment, Image, Header } from 'semantic-ui-react';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import CPUMEMListView from './usage/cpumemoryListView';
import NetworkIOView from '../components/networkIOView';
import DailyReportView from '../components/dailyReportView';
import NetworkTrafficIOView from '../components/networkTrafficIOView';
import SelectFromTo from '../components/selectFromTo';

import './styles.css';

const ReactGridLayout = WidthProvider(RGL);


const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 13;
var layout = [
    {"w":6,"h":14,"x":0,"y":0,"i":"0","moved":false,"static":false, "title":"Cluster Health"},
    {"w":6,"h":14,"x":6,"y":0,"i":"1","moved":false,"static":false, "title":"Application Statistics"},
    {"w":6,"h":8,"x":0,"y":15,"i":"2","moved":false,"static":false, "title":"Daily Report"},
    {"w":6,"h":8,"x":6,"y":15,"i":"3","moved":false,"static":false, "title":"Top 5 Interface Traffic"}];

class AnalysticViewZone extends React.Component {
    constructor(props) {
        super(props);
        this.onHandleClick = this.onHandleClick.bind(this);
        const layout = this.generateLayout();
        this.state = { layout };
    }

    onHandleClick = function(e, data) {
        this.props.handleChangeSite(data.children.props.to)
    }

    makeHeader_noChild =(title)=> (
        <Header className='panel_title'>{title}</Header>
    )
    makeHeader_date =(title)=> (
        <Header className='panel_title' style={{display:'flex',flexDirection:'row'}}>
            <div style={{display:'flex', flexGrow:3}}>{title}</div>
            <SelectFromTo style={{display:'flex', alignSelf:'flex-end'}}></SelectFromTo>
        </Header>
    )
    makeHeader_select =(title)=> (
        <Header className='panel_title'>{title}</Header>
    )

    generateDOM() {

        return layout.map((item, i) => (
            <div className="round_panel" key={i}>
                {
                    (i === 1)? this.makeHeader_date(item.title) :
                        (i === 2)? this.makeHeader_select(item.title) : this.makeHeader_noChild(item.title)
                }
                {(i === 0)? <CPUMEMListView></CPUMEMListView>
                    : (i === 1)? <NetworkIOView />
                    : (i === 2)? <DailyReportView />
                    : (i === 3)? <NetworkTrafficIOView></NetworkTrafficIOView>
                    : <span>{item.i}</span>}
            </div>
        ))
    }

    generateLayout() {
        const p = this.props;

        return layout
    }

    onLayoutChange(layout) {
        //this.props.onLayoutChange(layout);
        console.log('changed layout = ', JSON.stringify(layout))
    }

    render() {
        return (
            <ReactGridLayout
                layout={this.state.layout}
                onLayoutChange={this.onLayoutChange}
                {...this.props}
            >
                {this.generateDOM()}
            </ReactGridLayout>
        );
    }
    static defaultProps = {
        className: "layout",
        items: 20,
        rowHeight: 30,
        cols: 12,
        width: 1600
    };
}


const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},

    };
};

export default connect(null, mapDispatchProps)(AnalysticViewZone);


