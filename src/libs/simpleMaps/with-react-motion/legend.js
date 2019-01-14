import React from 'react';
import { Grid, List } from 'semantic-ui-react'
import * as d3 from 'd3';
import MaterialIcon, {colorPalette} from 'material-icons-react';


const itemContents = [{label:'Critical'},{label:'Major'},{label:'Minor'},{label:'Warning'},{label:'Normal'}]
const ChildrenItem = (props) => (
    itemContents.map((obj, i) => (
        <List.Item id={'itm_'+i}>
            <List.Content style={{display:'inline-block'}}>
                <MaterialIcon icon={(props[obj.label] === true)?'check_circle_outline':'radio_button_unchecked'} size={20} color={props.iconColor} />
            </List.Content>
            <List.Content style={{display:'inline-block', verticalAlign:'super', fontSize:'1em', marginLeft:'0.75em'}}>
                {obj.label}
            </List.Content>
        </List.Item>
    ))

)
export default class Legend extends React.Component {
    constructor() {
        super();
        this.selectedIcon = 'check_circle_outline';
        this.noneSelectIcon = 'radio_button_unchecked';
        this.state = {
            Critical:true,
            Major:true,
            Minor:true,
            Warning:true,
            Normal:true,
            itm_0:this.selectedIcon,
            itm_1:this.selectedIcon,
            itm_2:this.selectedIcon,
            itm_3:this.selectedIcon,
            itm_4:this.selectedIcon,
            itm_5:this.selectedIcon,
            iconColor:'rgba(255,255,255,1)'
        }

        this.stack = [];
    }
    componentDidMount(){

        d3.svg('/assets/worldmap/console_legend_health.svg').then((svg) => {
            const gElement = d3.select(svg).select('svg');
            d3.select('#legendCont').node().append(gElement.node());
        });


    }
    handleClickItem(item) {
        console.log('clicked item = ', item.target.innerText)
        let label = item.target.innerText;

        switch(label) {
            case 'Critical': this.setState({Critical:!this.state.Critical}); break;
            case 'Major': this.setState({Major:!this.state.Major}); break;
            case 'Minor': this.setState({Minor:!this.state.Minor}); break;
            case 'Warning': this.setState({Warning:!this.state.Warning}); break;
            case 'Normal': this.setState({Normal:!this.state.Normal}); break;
        }

        this.forceUpdate();


    }
    childrenItem=(states)=>(
        itemContents.map((obj, i) => (
            <List.Item id={'itm_'+i}>
                <List.Content style={{display:'inline-block'}}>
                    <MaterialIcon icon={states['itm_'+i]} size={20} color={states.iconColor} />
                </List.Content>
                <List.Content style={{display:'inline-block', fontSize:'1em'}}>
                    {obj.label}
                </List.Content>
            </List.Item>
        ))

    )
    render(){
        return (
            <Grid id="legendEl">
                <Grid.Row>
                    <div id="legendCont" style={{backgroundColor:'transparent', width:30, height:150}}></div>
                    <List animated style={{color:'rgba(255,255,255,0.8)', position:'absolute', width:120, marginLeft:5, marginTop:7}} onClick={this.handleClickItem.bind(this)}>
                        <ChildrenItem {...this.state}></ChildrenItem>
                    </List>
                </Grid.Row>
            </Grid>
        )
    }
}