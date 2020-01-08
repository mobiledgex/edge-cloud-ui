import React, { Fragment } from "react";
import {Button, Form, Header, Message, List, Grid, Table} from "semantic-ui-react";
import { Field, reduxForm } from "redux-form";
import InsideListView from "../container/insideListView";
import * as servicePool from '../services/service_cloudlet_pool';
import './styles.css';

const validate = values => {
    const errors = {}
    if (!values.username) {
        errors.username = 'Required'
    } else if (values.username.length > 15) {
        errors.username = 'Must be 15 characters or less'
    }
    if (!values.email) {
        errors.email = 'Required'
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)) {
        errors.email = 'Invalid email address'
    }
    if (!values.age) {
        errors.age = 'Required'
    } else if (isNaN(Number(values.age))) {
        errors.age = 'Must be a number'
    } else if (Number(values.age) < 18) {
        errors.age = 'Sorry, you must be at least 18 years old'
    }
    return errors
}
let type = 'Developer';
let role = 'Manage'
const roles =
    {
        Developer: [
            { Flavor:'View', ClusterFlavor:'View', Users:'Manage', Cloudlets:'View', ClusterInst:'Manage', Apps:'Manage', AppInst:'Manage'},
            { Flavor:'View', ClusterFlavor:'View', Users:'View', Cloudlets:'View', ClusterInst:'Manage', Apps:'Manage', AppInst:'Manage'},
            { Flavor:'View', ClusterFlavor:'View', Users:'View', Cloudlets:'View', ClusterInst:'View', Apps:'View', AppInst:'View'}
        ],
        Operator: [
            { Flavor:'disabled', ClusterFlavor:'disabled', Users:'Manage', Cloudlets:'Manage', ClusterInst:'disabled', Apps:'disabled', AppInst:'disabled'},
            { Flavor:'disabled', ClusterFlavor:'disabled', Users:'View', Cloudlets:'View', ClusterInst:'Manage', Apps:'disabled', AppInst:'disabled'},
            { Flavor:'disabled', ClusterFlavor:'disabled', Users:'View', Cloudlets:'View', ClusterInst:'disabled', Apps:'disabled', AppInst:'disabled'},
        ]
    }



const makeRoleList = (selectedType, i) => (
    <List divided verticalAlign='middle'>
        <List.Item>
            <List.Content>
                {
                    Object.keys(roles[selectedType][i]).map((key) => (
                        <List.Header><div style={{color:((roles[selectedType][i][key] === 'Manage')?'rgba(136,221,0,.9)':'rgba(255,255,255,.6)')}}>{ key +" : "+ (roles[selectedType][i][key]) }</div></List.Header>
                    ))
                }

            </List.Content>
        </List.Item>
    </List>
)

const items = [
    {
        header: 'Manager',
        description: `Leverage agile frameworks to provide a robust synopsis \n\r for high level overviews.`,
        meta: 'ROI: 30%',
    },
    {
        header: 'Contributor',
        description: 'Bring to the table win-win survival strategies to ensure proactive domination.',
        meta: 'ROI: 34%',
    },
    {
        header: 'Viewer',
        description:
            'Capitalise on low hanging fruit to identify a ballpark value added activity to beta test.',
        meta: 'ROI: 27%',
    },
]

const renderCheckbox = field => (
    <Form.Checkbox
        checked={!!field.input.value}
        name={field.input.name}
        label={field.label}
        onChange={(e, { checked }) => field.input.onChange(checked)}
    />
);

const renderRadio = field => (
    <Form.Radio
        checked={field.input.value === field.radioValue}
        label={field.label}
        name={field.input.name}
        onChange={(e, { checked }) => field.input.onChange(field.radioValue)}
    />
);

const renderSelect = field => (
    <Form.Select
        label={field.label}
        name={field.input.name}
        onChange={(e, { value }) => field.input.onChange(value)}
        options={field.options}
        placeholder={field.placeholder}
        value={field.input.value}
    />
);

const renderTextArea = field => (
    <Form.TextArea
        {...field.input}
        label={field.label}
        placeholder={field.placeholder}
    />
);
const renderInput = field => (
    <Form.Input
        {...field.input}
        type={field.type}
        label={field.label}
        placeholder={field.placeholder}
    />
);

class SiteFourPoolThree extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            devData:[],
        };
        this.headerLayout = [1,1,1];
        this.hiddenKeys = [];
    }
    changeOrg = () => {
        this.props.changeOrg()
    }

    receiveResultShow = (result) => {
        console.log('20191231 result .. ', result.data)
        let createdState = [];
        if(result.data && result.data.length) {
            result.data.map((item) => {
                console.log('20191231 devdata -- ', item, ":", this.props.selectedData)
                if(item.Region === this.props.selectedData.region && item.CloudletPool === this.props.selectedData.poolName) {
                    createdState.push({region:item.Region, org:item.Org, pool:item.CloudletPool})
                }
            })
        }
        this.setState({devData:createdState})
    }

    componentDidMount(): void {
        console.log('20191231 props info --', this.props.selectedData)
        let store = localStorage.PROJECT_INIT ? JSON.parse(localStorage.PROJECT_INIT) : null
        this.setState({devData:[]})
        // TODO: 20200109 >>>>>>>>>>>>>>>>>>>>>>>>>>>>>
        servicePool.showOrgCloudletPool('showOrgCloudletPool',{token:store.userToken, params:null}, this.receiveResultShow)
    }
    makeTable = (data) => (
        data.map((item) =>(
            <Table.Row>
                <Table.Cell>{item.region}</Table.Cell>
                <Table.Cell>{item.org}</Table.Cell>
                <Table.Cell>{item.pool}</Table.Cell>
            </Table.Row>
        ))

    )

    render (){
        const { handleSubmit, reset, org, type } = this.props;
        const { devData } = this.state;
        console.log('20191231 devdata -- ', devData)
        return (
            <Fragment>
                <Grid>
                    <Grid.Column width={11}>
                            <Header className="newOrg3-1">{`Cloudlet Pool "`+ this.props.selectedData.poolName + `" has been created.`}</Header>

                                <Grid>
                                    <Grid.Row>
                                        {
                                            (type === 'Developer')?
                                                <Grid.Column>
                                                        <Table compact>
                                                            <Table.Header>
                                                                <Table.Row>
                                                                    <Table.HeaderCell>Region</Table.HeaderCell>
                                                                    <Table.HeaderCell>Linked Orgnization</Table.HeaderCell>
                                                                    <Table.HeaderCell>Cloudlet Pool</Table.HeaderCell>
                                                                </Table.Row>
                                                            </Table.Header>

                                                            <Table.Body>
                                                                {this.makeTable(devData)}
                                                            </Table.Body>
                                                        </Table>

                                                </Grid.Column>
                                                :
                                                <Grid.Column></Grid.Column>
                                        }

                                    </Grid.Row>
                                </Grid>
                                <Button className="newOrg3-4" onClick={this.changeOrg} type='submit' positive style={{width:'100%'}}>Check your Cloudlet Pool</Button>
                    </Grid.Column>
                </Grid>
            </Fragment>
        )
    } 
};

export default reduxForm({
    form: "orgaStepThree"
})(SiteFourPoolThree);
