import React, { Fragment } from "react";
import {
    Button,
    Form,
    Item,
    Message,
    Divider,
    Modal,
    List,
    Grid,
    Card,
    Dropdown,
    Input,
    Popup,
    Icon
} from "semantic-ui-react";
import { Field, reduxForm, initialize, change, reset } from "redux-form";
import MaterialIcon from "../sites/siteFour_page_createOrga";
import './styles.css';
import EditMap from '../libs/simpleMaps/with-react-motion/editMap';


const renderSelect = field => (
    <Form.Select
        name={field.input.name}
        onChange={(e, { value }) => field.input.onChange(value)}
        //onChange={field.input.change}
        options={field.options}
        placeholder={field.placeholder}
        value={field.value}
        fluid
    />
);
const renderInputNum = field => (
    <Form.Field
        {...field.input}
        type={field.type}
        // placeholder={field.placeholder}
    >
        <label>{field.label}</label>
        <Input fluid type="number"></Input>
    </Form.Field>
);


const renderInput = field => (
    <div>
         <Form.Input
            {...field.input}
            type={field.type}
            placeholder={field.placeholder}
            disabled={field.disabled}
            fluid
        />
    </div>
   
);

const renderLocationInput = field => (
    <div>
        <Form.Field
            {...field.input}
            type={field.type}
            placeholder={field.placeholder}
            //value={field.value}
        >
            <Input fluid type="number"
                   onChange={field.change}
                   placeholder={field.placeholder}></Input>
        </Form.Field>
        {/* <Form.Input*/}
        {/*    {...field.input}*/}
        {/*    type={field.type}*/}
        {/*    placeholder={field.placeholder}*/}
        {/*    onChange={field.change}*/}
        {/*    //value={field.value}*/}
        {/*    fluid*/}
        {/*/>*/}
    </div>
   
);

class registNewInput extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            typeValue:'',
            cloudletLong:"",
            cloudletLat:"",
            regionStatic:[
                {key: 1, value: "US", text: "US"},
                {key: 2, value: "EU", text: "EU"}
            ],
            ipAccessStatic:[
                {key: 0, value: "0", text: "IpAccessUnknown"},
                {key: 1, value: "1", text: "IpAccessDedicated"},
                {key: 2, value: "2", text: "IpAccessDedicatedOrShared"},
                {key: 3, value: "3", text: "IpAccessShared"}
            ],
            Ip_support:[
                {key: 0, value: 0, text: "IPSupportUnknown"},
                {key: 1, value: 1, text: "IPSupportStatic"},
                {key: 2, value: 2, text: "IPSupportDynamic"}
            ]
        };

    }

    getHelpPopup =(key)=> (
        <Popup
            trigger={<Icon name='question circle outline' size='large' style={{lineHeight: '38px'}}/>}
            content=
                {(key=='CloudletName')? 'Name of the cloudlet'
                    :(key=='OperatorName')? 'Company or Organization name of the operator'
                        :(key=='CloudletLocation')? 'Latitude: Latitude in WGS 84 coordinates, Longitude: Longitude in WGS 84 coordinates'
                            :(key=='Ip_support')?
                                'IpSupport indicates the type of public IP support provided by the Cloudlet. Static IP support indicates a set of static public IPs are available for use, and managed by the Controller. Dynamic indicates the Cloudlet uses a DHCP server to provide public IP addresses, and the controller has no control over which IPs are assigned.\n' +
                                '\n' +
                                'IP_SUPPORT_UNKNOWN: Unknown IP support\n' +
                                'IP_SUPPORT_STATIC: Static IP addresses are provided to and managed by Controller\n' +
                                'IP_SUPPORT_DYNAMIC: IP addresses are dynamically provided by an Operator\'s DHCP server'
                                :(key=='Num_dynamic_ips')? 'Number of dynamic IPs available for dynamic IP support'
                                    : key
                }
            // content={this.state.tip}
            // style={style}
            inverted
        />
    )

    handleInitialize = () => {
        if(this.props.defaultValue){
            const initData = {
                "OrganizationName": this.props.defaultValue.Organization
            };
            this.props.initialize(initData);
        }
    }
    
    handleRegionChange = (e) => {
        this.props.getOptionData(e)
        this.props.dispatch(reset('registNewInput'));
    }

    componentDidMount() {
        this.handleInitialize();
    }

    componentWillReceiveProps(nextProps) {        
        console.log("nextProps@@",nextProps)
        if(nextProps.locationLong || nextProps.locationLat){
            this.props.dispatch(change('registNewInput', 'Latitude', nextProps.locationLat));
            this.props.dispatch(change('registNewInput', 'Longitude', nextProps.locationLong));
        } else {
            this.props.dispatch(change('registNewInput', 'Latitude', null));
            this.props.dispatch(change('registNewInput', 'Longitude', null));

        }
    }

    render() {
        const { handleSubmit, data, dimmer, selected, regKeys,open, close, option, value, change, longLoc, latLoc, zoomIn, zoomOut, resetMap, locationLongLat, resetLocation, handleChangeLong, handleChangeLat, locationLong, locationLat } = this.props;
        // this.changeCloudLoc(cloudLoc);
        
        return (
            <Fragment>
                <Form onSubmit={handleSubmit} className={"fieldForm"}>
                    <Form.Group>
                        <Modal style={{width:1200}} open={open} onClose={close}>
                            <Modal.Header>Settings</Modal.Header>
                            <Modal.Content>
                                <div style={{display:'flex', flexDirection:'row', width:'100%'}}>
                                    <Grid divided style={{width:800}}>
                                    {
                                        (data.length > 0)?
                                        regKeys.map((key, i)=>(
                                            <Grid.Row key={i} columns={3}>
                                                <Grid.Column width={5} className='detail_item'>
                                                    <div>
                                                        {(key === 'CloudletName')?'Cloudlet Name'
                                                            :(key === 'OperatorName')?'Operator Name'
                                                                :(key === 'CloudletLocation')?'Cloudlet Location'
                                                                    :(key === 'Ip_support')?'Ip Support'
                                                                        :(key === 'Num_dynamic_ips')?'Num Dynamic Ips'
                                                                            :key}
                                                    </div>
                                                </Grid.Column>
                                                <Grid.Column width={9}>
                                                {
                                                    (key === 'Operator')?
                                                    <Field component={renderSelect} placeholder='Select Operator' name='Operator' options={option[0]} value={value[0]} />
                                                    : (key === 'OrganizationName')?
                                                        (this.props.defaultValue) ?
                                                            <Field component={renderInput} type="input" name='OrganizationName' disabled={true} />
                                                        :
                                                            <Field component={renderSelect} placeholder='Select Organization Name' name='OrganizationName' options={option[1]} />
                                                    : (key === 'Cloudlet')?
                                                    <Field component={renderSelect} placeholder='Select Cloudlet' name='Cloudlet' options={this.props.cloudArr} value={value[2]} />
                                                    : (key === 'Region')?
                                                    <Field component={renderSelect} placeholder='Select Region' name='Region' options={this.state.regionStatic} onChange={this.handleRegionChange} />
                                                    : (key === 'Version')?
                                                    <Field component={renderSelect} placeholder='Select Version' name='Version' options={option[4]} value={value[4]} change={change[4]}/>
                                                    : (key === 'ClusterInst')?
                                                    <Field component={renderSelect} placeholder='Select Cluster Inst' name='ClusterInst' options={option[5]} value={value[5]} change={change[5]}/>
                                                    : (key === 'Type')?
                                                    <Field component={renderSelect} placeholder='Select Type' name='Type' options={option[6]} value={value[6]} change={change[6]}/>
                                                    : (key === 'Role')?
                                                    <Field component={renderSelect} placeholder='Select Role' name='DeveloperName' options={option[7]} value={value[7]} change={change[7]}/>
                                                    : (key === 'Flavor')?
                                                    <Field component={renderSelect} placeholder='Select Flavor' name='Flavor' options={option[8]} value={value[8]} />
                                                    : (key === 'IpAccess')?
                                                    <Field component={renderSelect} placeholder='Select Ip Access' name='IpAccess' options={this.state.ipAccessStatic} />
                                                    : (key === 'Ip_support')?
                                                    <Field component={renderSelect} placeholder='Select Ip Support' name='IpSupport' options={this.state.Ip_support} />
                                                    : (key === 'CloudletLocation')?
                                                    <Grid>
                                                        <Grid.Row columns={2}>
                                                            <Grid.Column><span>Latitude</span><Field ref={latLoc} name='Latitude' component={renderLocationInput} placeholder={(dimmer === 'blurring')? '' : (selected[key]) ? selected[key].latitude : null } change={handleChangeLat} /></Grid.Column>
                                                            <Grid.Column><span>Longitude</span><Field ref={longLoc} name='Longitude' component={renderLocationInput} placeholder={(dimmer === 'blurring')? '' : (selected[key]) ? selected[key].longitude : null } change={handleChangeLong} /></Grid.Column>
                                                        </Grid.Row>
                                                    </Grid>
                                                    : (key === 'Num_dynamic_ips')?
                                                    <Field component={renderInputNum} type="input" name={key} placeholder={(dimmer === 'blurring')? '' : selected[key] } />
                                                    :
                                                    <Field component={renderInput} type="input" name={key} placeholder={(dimmer === 'blurring')? '' : selected[key] } />
                                                }
                                                </Grid.Column>
                                                <Grid.Column width={2}>
                                                    {this.getHelpPopup(key)}
                                                </Grid.Column>
                                                <Divider vertical></Divider>
                                            </Grid.Row>
                                        ))
                                        :''
                                    }
                                    </Grid>
                                    <Grid style={{marginTop:0, marginLeft:20, marginRight:10, width:'100%'}}>
                                        <Grid.Row style={{paddingTop:0, width:'100%'}}>
                                            <EditMap zoomIn={zoomIn} zoomOut={zoomOut} resetMap={resetMap} locationLongLat={locationLongLat} resetLocation={resetLocation} ></EditMap>
                                        </Grid.Row>
                                    </Grid>
                                </div>
                            </Modal.Content>
                            <Modal.Actions>
                                <Button onClick={close}>
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleSubmit}
                                    positive
                                    icon='checkmark'
                                    labelPosition='right'
                                    content="Save"
                                    type="submit"
                                />
                            </Modal.Actions>
                        </Modal>
                    </Form.Group>
                </Form>
            </Fragment>
            
                
        );
    }
    
};

export default reduxForm({
    form: "registNewInput",
    enableReinitialize: true
})(registNewInput);
