import React, { Fragment } from "react";

import {Button, Form, Grid, Header, Item, Popup, Icon, Input} from "semantic-ui-react";
import { Transfer } from 'antd';
import { Field, reduxForm, change,stopSubmit, initialize, reset } from "redux-form";
import * as serviceMC from '../services/serviceMC';
import SankeyDiagram from '../charts/plotly/SankeyDiagram';
import DualListBox from 'react-dual-listbox';
import './styles.css';
//import './react_dualist.css'
import '../css/components/dualListbox/react-dual-listbox.css';
import '../css/main.less';

const makeOption =(options)=> {

    let newOptions = options.sort(

        function(a, b) {
            if (a.toLowerCase() < b.toLowerCase()) return -1;
            if (a.toLowerCase() > b.toLowerCase()) return 1;
            return 0;
        }
    );

    return (

        newOptions.map((value) => (
            {key: value, text: value, value: value}
        ))

    )

};

const renderSelect = field => (
    <div>
        <Form.Select
            label={field.label}
            name={field.input.name}
            onChange={(e, { value }) => field.input.onChange(value)}
            options={makeOption(field.options)}
            placeholder={field.placeholder}
            value={field.input.value}
        />
        {field.error && <span className="text-danger">{field.error}</span>}
    </div>
);

const renderInputNum = field => (
    <Form.Field
        {...field.input}
        type={field.type}
        // placeholder={field.placeholder}
    >
        <label>{field.label}</label>
        <Input type="number" onChange={(e)=>{if(e.target.value == 0 || e.target.value < 0) e.target.value = null}}></Input>
    </Form.Field>
);
const renderInput = field => (
    <div>
        <Form.Input
            {...field.input}
            type={field.type}
            label={field.label}
            readOnly={field.readOnly}
            placeholder={field.placeholder}
        />
        {field.error && <span className="text-danger">{field.error}</span>}
    </div>
);
const renderInputCluster = field => (
    <div>
        <Form.Input
            {...field.input}
            type={field.type}
            label={field.label}
            placeholder={'Please use numbers and English letters only'}
            onChange={(e, { value }) => {
                const reg = /^[0-9a-zA-Z][-0-9a-zA-Z.]*$/;
                if(reg.test(value) || value == ''){
                    field.input.onChange(value)
                }
            }}
        />
        {field.error && <span className="text-danger">{field.error}</span>}
    </div>
);
const renderInputDisabled = field => (
    <Form.Input
        {...field.input}
        type={field.type}
        label={field.label}
        placeholder={field.placeholder}
        disabled
    />
);

const renderTextArea = field => (
    <div>
    <Form.TextArea
        {...field.input}
        label={field.label}
        rows={field.row}
        // placeholder={field.placeholder}
    />
    {/* {field.error && <span className="text-danger">{field.error}</span>} */}
    </div>
);


const renderDropDown = field => (
    <div>
        <Form.Dropdown
            placeholder={field.placeholder}
            fluid
            multiple
            selection
            options={makeOption(field.options)}
            onChange={(e, { value }) => field.input.onChange(value)}
        />
        {field.error && <span className="text-danger">{field.error}</span>}
    </div>
);
const renderLocationInput = ({ input, placeholder, change, type, error, initialValue }) => (
    <div>
        <Form.Field
            {...input}
            type={type}
        >
            <Input fluid type="text"
                   onChange={change}
                   value={initialValue}
                   placeholder={placeholder}
                   ></Input>
        </Form.Field>
        {error && <span className="text-danger">{error}</span>}
    </div>

);
const options = [
    { value: 'one', label: 'Option One' },
    { value: 'two', label: 'Option Two' },
];


const renderDualListInput = (self,data) => (
    <DualListBox
        // style={{width:500}}
        icons={{
            moveLeft: <Icon name="angle left" />,
            moveAllLeft: [
                <Icon key={0} name="angle double left" />,
            ],
            moveRight: <Icon name="angle right" />,
            moveAllRight: [
                <Icon key={0} name="angle double right" />,
            ],
            moveDown: <span className="fa fa-chevron-down" />,
            moveUp: <span className="fa fa-chevron-up" />,
        }}
        canFilter
        options={self.getListData(data)}
        selected={self.state.selected}
        onChange={self.onChangeDualList}
    />

);

/** If we use the ANT ui should be use this */
const renderDualListBox = (self, data) => (
    <Transfer
        dataSource={self.getMock(data)}
        showSearch
        filterOption={self.filterOption}
        targetKeys={self.state.targetKeys}
        onSelectChange={self.handleSelectChange}
        onChange={self.handleChange}
        onSearch={self.handleSearch}
        render={item => item.title}
    />
)
const renderLinkedDiagram = (self, data) => (
    <SankeyDiagram size={{width:800, height:500}}></SankeyDiagram>
)
//<div style={{display:'none', visible:'hidden'}}>
const renderInputInvisible = field => (
    <div>
        <Form.Input
            {...field.input}
            type={field.type}
            label={field.label}
            placeholder={field.placeholder}
        />
    </div>
);

const style = {
    borderRadius: 0,
    opacity: 0.7,
    padding:'2em'
}

class SiteFourCreateFormDefault extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            typeValue:'',
            data:null,
            regKey:null,
            fieldKeys:null,
            dataInit:false,
            portArray:['item'],
            orgArr:[],
            ipAccessValue:[],
            deployTypeDocker:false,
            selected: [],
            _mockData: [],
            targetKeys: [],
            invisibleValue:[],
            submitButton:'Create',
        };

    }

    // data.map((dt) => {
    handleInitialize(data) {
        const initData = [];
        data.Latitude = '';
        data.Longitude = '';
        if(data.length){

        } else {
            this.props.initialize(data);

        }

    }
    onChangeDualList = (selected) => {
        console.log("20200110 " + selected)
        this.setState({ selected });
        this.props.dispatch(change('createAppFormDefault', 'invisibleField', JSON.stringify(selected)));
    }
    /**
     * code by @inki 20191220
     * add dual list box use ANT
     * **/
    getMock = (data) => {

        const targetKeys = [];
        const mockData = [];

        this._mockData = data;
        if(data.length) {
            data.map((item, i) => {

                const data = {
                    key: i.toString(),
                    title: item['cloudlet'],
                    description: item['cloudlet'],
                    chosen: 0,
                };
                if (data.chosen) {
                    targetKeys.push(data.key);
                }
                mockData.push(data)

            })
        }
        return mockData;
    };

    getListData = (datas) => {
        const listData = [];

        if(datas.length) {
            datas.map((item, i) => {
                const data = {
                    value: i,
                    label: item['cloudlet']
                }
                listData.push(data)
            })
        }
        return listData;
    }

    getSelectedListData = (data, pId, regKeys, fieldKeys, selectListData) => {
        if(regKeys && regKeys.length > 0) {
            regKeys.map((key) => {
                if(fieldKeys[pId][key]){
                    if(fieldKeys[pId][key]['type'] === 'renderDualListBox'){
                        if(data[key].length) {
                            data[key].map((item, i) => {
                                const data = {
                                    value: i,
                                    label: item['cloudlet']
                                }
                                if(selectListData){
                                    selectListData.map((selectItem, j) => {
                                        if(selectItem === data.label){
                                            this.state.selected[j] = data.value
                                        }
                                    })
                                }
                            })
                        }
                    }
                }
            })
        }
    }

    filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;


    handleChange = (nextTargetKeys, direction, moveKeys) => {
        this.setState({ targetKeys: nextTargetKeys });

        console.log('targetKeys: ', nextTargetKeys);
        console.log('direction: ', direction);
        console.log('moveKeys: ', moveKeys);
        let selected = [];
        moveKeys.map((data) => {
            selected.push(this._mockData[parseInt(data)])
        })
        /**
        you would dispatch() the change(form:String, field:String, value:String) action creator:
         **/
        this.props.dispatch(change('createAppFormDefault', 'invisibleField', JSON.stringify(selected)));
    };

    handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
        this.setState({ selectedKeys: [...sourceSelectedKeys, ...targetSelectedKeys] });

        console.log('sourceSelectedKeys: ', sourceSelectedKeys);
        console.log('targetSelectedKeys: ', targetSelectedKeys);
    };

    handleSearch = (dir, value) => {
        console.log('search:', dir, value);
    };

    /** end ANT **/

    componentDidMount() {
        if(this.props.data && this.props.data.data && this.props.data.data.length){
            let keys = Object.keys(this.props.data.data[0])
            this.setState({data:this.props.data.data[0], regKeys:keys, fieldKeys:this.props.data.keys, pId:this.props.pId})
            if(!this.state.dataInit){
                this.handleInitialize(this.props.data.data[0]);
                this.setState({dataInit:true})
            }
        }
        if(this.props.getUserRole == 'AdminManager') {
            let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
            serviceMC.sendRequest(this,{token:store ? store.userToken : 'null', method:serviceMC.getEP().SHOW_ORG}, this.receiveResult)
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.data && nextProps.data.data && nextProps.data.data.length){
            let keys = Object.keys(nextProps.data.data[0])
            this.setState({data:nextProps.data.data[0], regKeys:keys, fieldKeys:nextProps.data.keys, pId:nextProps.pId})
            // submitSucceeded 초기화
            if(this.props.toggleSubmit) {
                this.props.dispatch(stopSubmit('createAppFormDefault',{}))
            }
            if(!this.state.dataInit){
                this.handleInitialize(nextProps.data.data[0]);
                this.setState({dataInit:true})
            }
            let self = this;
            setTimeout(() => {
                self.setState({data:nextProps.data.data[0], regKeys:keys, fieldKeys:nextProps.data.keys, pId:nextProps.pId})
            }, 5000)
            this.getSelectedListData(nextProps.data.data[0], nextProps.pId, keys, nextProps.data.keys, nextProps.selectListData)
        }
        if(nextProps.editMode) this.setState({submitButton:'Update'})
    }

    getLabel (key, pId) {
        return (this.state.fieldKeys && this.state.fieldKeys[pId][key]) ? this.state.fieldKeys[pId][key]['label'] : null
    }
    getNecessary (key, pId) {
        return (this.state.fieldKeys && this.state.fieldKeys[pId][key]) ? this.state.fieldKeys[pId][key]['necessary'] ? ' *':'' : null
    }

    getHelpPopup =(value)=> (
        <Popup
            trigger={<Icon name='question circle outline' size='large' style={{lineHeight:'unset', margin:'10px 0'}} />}
            content={value}
            style={style}
            inverted
        />
    )
    onHandleSubmit=(result,dispatch)=> {
        
        this.props.handleSubmit();
    }
    onFormState=(a,b)=> {
        alert('onForm state',a,b)
    }
    onHandleChange(key,value,c){
        console.log("onChangeFormState111",key,":::",value)
        if(key === 'Region'){
            this.props.onChangeState(key,value)
        } else if(key === 'OrganizationName') {
            this.props.onChangeState(key,value)
        } else if(key === 'DeploymentType') {
            if(value == 'Docker') {
                this.setState({ipAccessValue:['Dedicated']})
                this.setState({deployTypeDocker:true})
            } else if(value == 'Kubernetes') {
                this.setState({ipAccessValue:['Dedicated','Shared']})
                this.setState({deployTypeDocker:false})
            }
            this.props.clusterHide(value);
            this.props.onChangeState(key,value)
        } else {
            if(key === 'NumberOfNode') this.props.clusterHide('Kubernetes');
            this.props.onChangeState(key,value)
        }
    }

    handleRegionChange = (e) => {
        alert(e)
        this.props.getOptionData(e)
        //this.props.dispatch(reset('createAppFormDefault'));
    }

    AddPorts = (e) => {
        e.preventDefault();
        this.setState({portArray:this.state.portArray.concat('item')})
    }
    RemovePorts = (e) => {
        let arr = this.state.portArray;
        if(arr.length > 1) {
            arr.pop()
        }
        this.setState({portArray:arr});
    }
    receiveResult = (mcRequest) => {
        if (mcRequest) {
            if (mcRequest.response) {
                let response = mcRequest.response;
                let arr = [];
                response.data.map((item, i) => {
                    if ((localStorage.selectMenu == 'Cluster Instances' && item.Type === 'developer') || (localStorage.selectMenu == 'Cloudlets' && item.Type === 'operator')) {
                        arr.push(item.Organization);
                    }
                })
                this.setState({ orgArr: arr });
            }
        }
    }

    cancelClick = (e) => {
        e.preventDefault();
        let siteNum = 0;
        console.log("cancelClickddd",e,":::",this.props)
        if(localStorage.selectMenu == 'Cloudlets') siteNum = 2
        else if(localStorage.selectMenu == 'Cluster Instances') siteNum = 4
        else if(localStorage.selectMenu == 'Cloudlet Pool') siteNum = 7
        this.props.gotoUrl(siteNum)
    }

    render (){
        const {  dimmer, selected, longLoc, latLoc, type, pId, getUserRole, handleChangeLong, handleChangeLat } = this.props;
        const { data, regKeys, fieldKeys } = this.state;
        let cType = (type)?type.substring(0,1).toUpperCase() + type.substring(1):'';
        let disableLabel = true;
        if(fieldKeys && fieldKeys.length && ( fieldKeys[0]['poolName'] || fieldKeys[0]['CloudletPool'] )) {
            disableLabel = false;
        }

        return (
            <Item className='content create-org' style={{margin:'0 auto', maxWidth:1200}}>
                {(disableLabel)?<Header style={{borderBottom:'1px solid rgba(255,255,255,0.1)'}}>Settings</Header>:null}
                <Fragment >
                    <Form onSubmit={this.onHandleSubmit} getformstate={this.onFormState} className={"fieldForm"} >
                        <Form.Group widths="equal" style={{flexDirection:'column', marginLeft:10, marginRight:10, alignContent:'space-around'}}>
                            <Grid columns={2}>
                                {
                                    (regKeys && regKeys.length > 0) ?
                                        regKeys.map((key, i) => (

                                            (this.getLabel(key, pId))?

                                                (fieldKeys[pId][key]['type'] === 'InvisibleField') ?

                                                    <div key={i} style={ {opacity:0, position:'absolute', left:-9999, zIndex:-999}}>
                                                        <Field
                                                            component={renderInputInvisible}
                                                            value={this.state.invisibleValue}
                                                            initialValue={this.state.invisibleValue}
                                                            placeholder={this.state.invisibleValue}
                                                            name={key}
                                                        />
                                                    </div>
                                                :
                                                (!this.state.deployTypeDocker || (key !== 'NumberOfMaster' && key !== 'NumberOfNode')) ?
                                                <Grid.Row columns={3} key={i} className={'cloudletReg'+i}>

                                                    <Grid.Column width={4} className='detail_item'>
                                                        <div>{this.getLabel(key, pId)}{this.getNecessary(key, pId)}</div>
                                                    </Grid.Column>
                                                    <Grid.Column width={11}>
                                                        {
                                                            (fieldKeys[pId][key]['type'] === 'RenderSelect') ?
                                                            <Field
                                                                component={renderSelect}
                                                                placeholder={'Select '+fieldKeys[pId][key]['label'] }
                                                                value={data[key]}
                                                                options={(fieldKeys[pId][key]['label'] !== 'IP Access') ? fieldKeys[pId][key]['items'] : this.state.ipAccessValue}
                                                                name={key}
                                                                onChange={(e)=>this.onHandleChange(key,e,data[key])}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderInputNum') ?
                                                            <Field
                                                                component={renderInputNum}
                                                                value={data[key]}
                                                                name={key}
                                                                onChange={(e)=>this.onHandleChange(key,e,data[key])}
                                                            />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderDropDown') ?
                                                            <Field
                                                                placeholder={'Select '+fieldKeys[pId][key]['label'] }
                                                                component={renderDropDown}
                                                                options={fieldKeys[pId][key]['items']}
                                                                name={key}
                                                                onChange={(e)=>this.onHandleChange(key,e,data[key])}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}
                                                            />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderInputDisabled') ?
                                                                (getUserRole == 'AdminManager' && (fieldKeys[pId][key]['label'] === 'Organization Name' || fieldKeys[pId][key]['label'] === 'Operator Name')) ?
                                                                    <Field
                                                                        component={renderSelect}
                                                                        placeholder={(fieldKeys[pId][key]['label'] === 'Organization Name')?'Select Organization Name':'Select Operator'}
                                                                        options={this.state.orgArr}
                                                                        name={key}
                                                                        error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                                :
                                                                    <Field
                                                                        disabled
                                                                        component={renderInputDisabled}
                                                                        type="input"
                                                                        name={key}
                                                                        value={data[key]}
                                                                        />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderInputCluster') ?
                                                            <Field
                                                                component={renderInputCluster}
                                                                type="input"
                                                                name={key}
                                                                value={data[key]}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'CloudletLocation') ?
                                                            <Grid>
                                                                <Grid.Row columns={2}>
                                                                    <Grid.Column><span>Latitude</span>
                                                                        <Field ref={latLoc} name='Latitude' component={renderLocationInput} placeholder={'-90 ~ 90'}
                                                                                                            change={handleChangeLat} error={(this.props.validError.indexOf('Latitude') !== -1)?'Required':this.props.latError}
                                                                                                            initialValue={this.props.regionInfo.lat}
                                                                        />
                                                                        </Grid.Column>
                                                                    <Grid.Column><span>Longitude</span>
                                                                        <Field ref={longLoc} name='Longitude' component={renderLocationInput} placeholder={'-180 ~ 180'}
                                                                                                            change={handleChangeLong} error={(this.props.validError.indexOf('Longitude') !== -1)?'Required':this.props.longError}
                                                                                                            initialValue={this.props.regionInfo.long}
                                                                        />
                                                                        </Grid.Column>
                                                                </Grid.Row>
                                                            </Grid>
                                                            :


                                                            (fieldKeys[pId][key]['type'] === 'RenderDualListBox') ?
                                                            <Grid>
                                                                <Grid.Row className={'renderDualListBox'}>
                                                                    {renderDualListBox(this, data[key])}
                                                                </Grid.Row>
                                                            </Grid>
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderLinkedDiagram') ?
                                                                <Grid>
                                                                    <Grid.Row className={'RenderLinkedDiagram'}>
                                                                        {renderLinkedDiagram(this, data[key])}
                                                                    </Grid.Row>
                                                                </Grid>
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'RenderTextArea') ?
                                                            <Field
                                                                component={renderTextArea}
                                                                row = {4}
                                                                value={data[key]}
                                                                name={key}
                                                            />
                                                            :
                                                            (fieldKeys[pId][key]['type'] === 'InvisibleField') ?
                                                                <div style={ {opacity:0, position:'absolute', left:-9999, zIndex:-999}}>
                                                                    <Field
                                                                        component={renderInputInvisible}
                                                                        value={this.state.invisibleValue}
                                                                        initialValue={this.state.invisibleValue}
                                                                        placeholder={this.state.invisibleValue}
                                                                        name={key}
                                                                    />
                                                                </div>
                                                            :
                                                            <Field
                                                                component={renderInput}
                                                                type="input"
                                                                value={data[key]}
                                                                name={key}
                                                                readOnly={fieldKeys[pId][key]['readOnly']}
                                                                onChange={(e)=>this.onHandleChange(key,e.target.value)}
                                                                error={(this.props.validError.indexOf(key) !== -1)?'Required':''}/>
                                                        }
                                                    </Grid.Column>
                                                    <Grid.Column width={1}>
                                                    {(fieldKeys[pId][key] && fieldKeys[pId][key]['tip']) ? this.getHelpPopup(fieldKeys[pId][key]['tip']):null}

                                                    </Grid.Column>
                                                </Grid.Row>
                                                :
                                                null
                                            : null
                                        ))
                                        : ''
                                }
                            </Grid>
                        </Form.Group>
                        <Form.Group className={"submitButtonGroup orgButton"} id={"submitButtonGroup"} inline style={{flexDirection:'row', marginLeft:10, marginRight:10}}>
                            <Form.Group inline>
                                {/*<Button onClick={()=>this.onHandleReset()}>Reset</Button>*/}
                                <span style={{marginRight:'1em'}}>
                                    {(this.props.stepTwo)?
                                        <Button>
                                            Skip
                                        </Button>
                                        :
                                        <Button onClick={this.cancelClick}>
                                            Cancel
                                        </Button>
                                    }

                                </span>
                                {
                                    (this.props.stepTwo)?
                                        <Button
                                            primary
                                            positive
                                            icon='checkmark'
                                            labelPosition='right'
                                            content="Submit"
                                        /> :
                                        <Button
                                            primary
                                            positive
                                            icon='checkmark'
                                            labelPosition='right'
                                            content={this.state.submitButton}
                                        />
                                }
                            </Form.Group>

                        </Form.Group>
                    </Form>
                </Fragment>
            </Item>
        )

    }
};

export default reduxForm({
    form: "createAppFormDefault",
    enableReinitialize: true,
    onSubmitSuccess (result, dispatch) {
        setTimeout(() => dispatch( reset( "createAppFormDefault" ) ), 1000 );
    }
})(SiteFourCreateFormDefault);
