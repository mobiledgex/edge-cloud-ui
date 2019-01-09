import React from 'react';
import { List, Image, Header, Button, Table, Menu, Icon } from 'semantic-ui-react';
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
    {"w":19,"h":20,"x":0,"y":0,"i":"0","moved":false,"static":false, "title":"Developer"},
]

class DeveloperListView extends React.Component {
    constructor(props) {
        super(props);
        this.onHandleClick = this.onHandleClick.bind(this);
        const layout = this.generateLayout();
        this.state = { layout };
        this.dummyData = [
            {Index:'110', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'109', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'108', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'107', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'106', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'105', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'104', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'103', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'102', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''},
            {Index:'101', DeveloperName:'Mobiledgex SDK Demo', UserName:'bruce', Address:'000 Nowhere Street, Gaineville, FL 32604', Email:'empty@xxx.com',Edit:''}
        ]
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
                {this.TableExampleVeryBasic()}
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
    TableExampleVeryBasic = () => (
        <Table basic='very' striped>
            <Table.Header>
                <Table.Row>
                    <Table.HeaderCell textAlign='center'>Index</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Developer Name</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>User Name</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Address</Table.HeaderCell>
                    <Table.HeaderCell textAlign='center'>Email</Table.HeaderCell>
                    <Table.HeaderCell width={3}  textAlign='center'>Edit</Table.HeaderCell>
                </Table.Row>
            </Table.Header>

            <Table.Body>
                {
                    this.dummyData.map((item, i) => (
                        <Table.Row>
                            {Object.keys(item).map((value) => (
                                (value === 'Edit')?
                                    <Table.Cell style={{display:'flex', flexDirection:'row', justifyContent:'center'}}>
                                        <Button>Delete</Button>
                                        <Button color='teal'>Add</Button>
                                    </Table.Cell>
                                :
                                    <Table.Cell textAlign='center'>{item[value]}</Table.Cell>
                            ))}
                        </Table.Row>
                    ))
                }
            </Table.Body>
            <Table.Footer>
                <Table.Row>
                    <Table.HeaderCell inverted>
                        <Menu floated='center' pagination>
                            <Menu.Item as='a' icon>
                                <Icon name='chevron left' />
                            </Menu.Item>
                            <Menu.Item as='a'>1</Menu.Item>
                            <Menu.Item as='a'>2</Menu.Item>
                            <Menu.Item as='a'>3</Menu.Item>
                            <Menu.Item as='a'>4</Menu.Item>
                            <Menu.Item as='a' icon>
                                <Icon name='chevron right' />
                            </Menu.Item>
                        </Menu>
                    </Table.HeaderCell>
                </Table.Row>
            </Table.Footer>
        </Table>
    )

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

export default connect(null, mapDispatchProps)(DeveloperListView);


