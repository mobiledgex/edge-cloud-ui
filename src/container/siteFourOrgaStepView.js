import React from 'react';
import { Item, Step, Icon, Modal, Grid, Header, Button, Table, Menu, Input, Divider, Container } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as actions from '../actions';
import RGL, { WidthProvider } from "react-grid-layout";
import SelectFromTo from '../components/selectFromTo';
import RegistNewItem from './registNewItem';
import PopDetailViewer from './popDetailViewer';
import PopUserViewer from './popUserViewer';
import './styles.css';
import ContainerDimensions from 'react-container-dimensions'
import _ from "lodash";
import * as reducer from '../utils'
import MaterialIcon from "material-icons-react";
import SiteFourOrgaOne from "./siteFourOrgaStepOne";
import SiteFourOrgaTwo from "./siteFourOrgaStepTwo";
import SiteFourOrgaThree from "./siteFourOrgaStepThree";
const ReactGridLayout = WidthProvider(RGL);


const headerStyle = {
    backgroundImage: 'url()'
}
var horizon = 6;
var vertical = 20;
var layout = [
    {"w":19,"h":20,"x":0,"y":0,"minW":19,"minH":20,"maxW":19,"maxH":20,"i":"0","moved":false,"static":false, "title":"Developer"},
    // {"w":19,"h":20,"x":0,"y":0,"minW":8,"minH":7,"i":"0","moved":false,"static":false, "title":"Developer"}, //resize

]
const stepData = [
    {
        step:"Step 1",
        description:"Create your organization"
    },
    {
        step:"Step 2",
        description:"Add User"
    },
    {
        step:"Step 3",
        description:"Review your Organization"
    },
]

class SiteFourOrgaStepView extends React.Component {
    constructor(props) {
        super(props);

        const layout = this.generateLayout();
        this.state = {
            layout,
            open: false,
            openDetail:false,
            dimmer:false,
            activeItem:'',
            dummyData : [],
            detailViewData:null,
            selected:{},
            openUser:false,
            step:1,
            typeOperator:'Developer',
            orgaName:''
        };

    }


    onHandleClick(dim, data) {
        console.log('on handle click == ', data)
        this.setState({ dimmer:dim, open: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }
    onHandleClicAdd(dim, data) {
        console.log('on handle click == ', data)
        this.setState({ dimmer:dim, open: true, selected:data })
        //this.props.handleChangeSite(data.children.props.to)
    }

    show = (dim) => this.setState({ dimmer:dim, openDetail: true })
    close = () => {
        this.setState({ open: false })
        this.props.handleInjectDeveloper(null)
    }
    closeDetail = () => {
        this.setState({ openDetail: false })
    }
    closeUser = () => {
        this.setState({ openUser: false })
    }
    stepChange(num) {
        let stepNum = num+1;
        this.setState({step:stepNum})
    }

    onChangeActive(num) {
        if(this.state.step == num+1){
            return true;
        } else {
            return false;
        }
    }

    nextstep = (num) => {
        this.setState({step:num})
    }
    changeOrg = () => {
        this.props.history.push({
            pathname: '/site4',
            search: 'pg=0'
        });
        this.props.history.location.search = 'pg=0';
        this.props.handleChangeSite({mainPath:'/site4', subPath: 'pg=0'})
        // this.props.handleChangeSite({mainPath:"/site4", subPath: "pg=0"});
    }

    makeSteps = () => (

        <Item className='content create-org' style={{margin:'30px auto 0px auto', maxWidth:1200}}>
            <div className='content_title' style={{padding:'0px 0px 10px 0'}}>Create new Organization</div>

            <Step.Group stackable='tablet' style={{width:'100%'}}>
                {
                    stepData.map((item,i) => (
                        <Step active={this.onChangeActive(i)} key={i} >
                            <Icon name='info circle' />
                            <Step.Content>
                                <Step.Title>{item.step}</Step.Title>
                                <Step.Description>{item.description}</Step.Description>
                            </Step.Content>
                        </Step>
                    ))
                }
            </Step.Group>

            {
                (this.state.step ==1) ? <SiteFourOrgaOne changeOrg={this.changeOrg} onSubmit={() => console.log('Form was submitted')} type={this.state.typeOperator}></SiteFourOrgaOne> :
                    (this.state.step ==2) ? <SiteFourOrgaTwo nextstep={this.nextstep} onSubmit={() => console.log('Form was submitted')} type={this.state.typeOperator} org={this.state.orgaName}></SiteFourOrgaTwo> :
                        (this.state.step ==3) ? <SiteFourOrgaThree changeOrg={this.changeOrg} onSubmit={() => console.log('Form was submitted')} type={this.state.typeOperator}></SiteFourOrgaThree> : null
            }

        </Item>
    )


    generateDOM(open, dimmer, width, height, hideHeader) {

        return layout.map((item, i) => (

            (i === 0)?
                <div className="round_panel" key={i} style={{ width:width, minWidth:720, height:height, display:'flex', flexDirection:'column'}} >
                    <div className="grid_table" style={{width:'100%', height:height, overflowY:'auto'}}>
                        {this.makeSteps()}

                    </div>
                </div>
                :
                <div className="round_panel" key={i} style={{ width:width, height:height, display:'flex', flexDirection:'column'}} >
                    <div style={{width:'100%', height:'100%', overflowY:'auto'}}>
                        Map viewer
                    </div>
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


    componentWillReceiveProps(nextProps, nextContext) {
                console.log('nextProps22...', nextProps.stateForm)
        if(nextProps.accountInfo){
            this.setState({ dimmer:'blurring', open: true })
        }
        if(nextProps.devData) {
            this.setState({dummyData:nextProps.devData})
        }
        if(nextProps.stateForm && nextProps.stateForm.submitSucceeded){
            this.setState({typeOperator:(nextProps.stateForm.values) ? nextProps.stateForm.values.type:this.state.typeOperator})
            this.setState({orgaName:(nextProps.stateForm.values) ? nextProps.stateForm.values.name:this.state.orgaName})
        }

        this.setState({step:nextProps.stepMove})
    }

    render() {
        const { open, dimmer } = this.state;
        const { hideHeader } = this.props;
        return (
            <ContainerDimensions>
                { ({ width, height }) =>
                    <div style={{width:width, height:height, display:'flex', overflowY:'auto', overflowX:'hidden'}}>
                        <RegistNewItem data={this.state.dummyData} dimmer={this.state.dimmer} open={this.state.open} selected={this.state.selected} close={this.close}/>
                        <ReactGridLayout
                            draggableHandle
                            layout={this.state.layout}
                            onLayoutChange={this.onLayoutChange}
                            {...this.props}
                            style={{width:width, height:height-20}}
                        >
                            {this.generateDOM(open, dimmer, width, height, hideHeader)}
                        </ReactGridLayout>
                        <PopDetailViewer data={this.state.detailViewData} dimmer={false} open={this.state.openDetail} close={this.closeDetail}></PopDetailViewer>
                        <PopUserViewer data={this.state.detailViewData} dimmer={false} open={this.state.openUser} close={this.closeUser}></PopUserViewer>
                    </div>
                }
            </ContainerDimensions>

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

const mapStateToProps = (state) => {
    let account = state.registryAccount.account;
    let dimm =  state.btnMnmt;
    console.log('SiteFourOrgaStepView state redux -- ', state)

    let accountInfo = account ? account + Math.random()*10000 : null;
    let dimmInfo = dimm ? dimm : null;

    let stateForm = (state.form)?state.form.orgaStepOne:{};

    return {
        accountInfo,
        dimmInfo,
        stateForm
    }

    // return (dimm) ? {
    //     dimmInfo : dimm
    // } : (account)? {
    //     accountInfo: account + Math.random()*10000
    // } : null;
};
const mapDispatchProps = (dispatch) => {
    return {
        handleChangeSite: (data) => { dispatch(actions.changeSite(data))},
        handleInjectDeveloper: (data) => { dispatch(actions.registDeveloper(data))},
        handleChangeComputeItem: (data) => { dispatch(actions.computeItem(data))}
    };
};

export default withRouter(connect(mapStateToProps, mapDispatchProps)(SiteFourOrgaStepView));
