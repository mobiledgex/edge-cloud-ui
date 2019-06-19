import React from 'react';
import {Button, Divider, Table, Grid, Header, Image, Icon} from "semantic-ui-react";
import ContainerDimensions from 'react-container-dimensions';


const TableExampleCollapsing = () => (
    <Table basic='very' celled collapsing>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Employee</Table.HeaderCell>
                <Table.HeaderCell>Correct Guesses</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>
            <Table.Row>
                <Table.Cell>
                    <Header as='h4' image>
                        <Image src='/assets/images/avatar/small/lena.png' rounded size='mini' />
                        <Header.Content>
                            Lena
                            <Header.Subheader>Human Resources</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell>22</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    <Header as='h4' image>
                        <Image src='/assets/images/avatar/small/matthew.png' rounded size='mini' />
                        <Header.Content>
                            Matthew
                            <Header.Subheader>Fabric Design</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell>15</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    <Header as='h4' image>
                        <Image src='/assets/images/avatar/small/lindsay.png' rounded size='mini' />
                        <Header.Content>
                            Lindsay
                            <Header.Subheader>Entertainment</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell>12</Table.Cell>
            </Table.Row>
            <Table.Row>
                <Table.Cell>
                    <Header as='h4' image>
                        <Image src='/assets/images/avatar/small/mark.png' rounded size='mini' />
                        <Header.Content>
                            Mark
                            <Header.Subheader>Executive</Header.Subheader>
                        </Header.Content>
                    </Header>
                </Table.Cell>
                <Table.Cell>11</Table.Cell>
            </Table.Row>
        </Table.Body>
    </Table>
)

let _self = null;
export default class PageDetailViewer extends React.Component {
    constructor() {
        super();
        this.state = {
            listData:[],
            selected:{},
            open:false,
            dimmer:'',
            devOptionsOne:[],
            devOptionsTwo:[],
            devOptionsThree:[],
            devOptionsFour:[],
            devOptionsFive:[],
            dropdownValueOne:'',
            dropdownValueTwo:'',
            dropdownValueThree:'',
            dropdownValueFour:'',
            dropdownValueFive:'',
            cloudletResult:null,
            appResult:null,
            listOfDetail:null
        }
        _self = this;
    }

    componentDidMount() {

    }
    componentWillReceiveProps(nextProps, nextContext) {
        console.log('regist new item -- ', nextProps)

            let regKeys = [];
            let component = null;
            let data = [];
            if(nextProps.data){
                this.setState({listData:nextProps.data})
            }


    }
    makeList = (values, label, i) => (
        <Grid.Row columns={2} key={i}>
            <Grid.Column width={5} className='detail_item' style={{display:'flex', justifyContent:'flex-end'}}>
                <div>{label}</div>
            </Grid.Column>
            <Grid.Column width={11}>
                <div style={{wordWrap: 'break-word'}}>{(typeof values[label] === 'object')? JSON.stringify(values[label]):String(values[label])}</div>
            </Grid.Column>
            <Divider vertical></Divider>
        </Grid.Row>
    )

    makeTable = (values, label, i) => (
        (label !== 'Edit')?
        <Table.Row key={i}>
            <Table.Cell>
                <Header as='h4' image>
                    <Icon name={'dot'} />
                    <Header.Content>
                        {label}
                    </Header.Content>
                </Header>
            </Table.Cell>
            <Table.Cell>{(typeof values[label] === 'object')? JSON.stringify(values[label]):String(values[label])}</Table.Cell>
        </Table.Row> : null
    )

    setCloudletList = (operNm) => {
        let cl = [];
        _self.state.cloudletResult[operNm].map((oper, i) => {
            if(i === 0) _self.setState({dropdownValueThree: oper.CloudletName})
            cl.push({ key: i, value: oper.CloudletName, text: oper.CloudletName })
        })

        _self.setState({devOptionsThree: cl})
    }



    close() {
        this.setState({ open: false })
        this.props.close()
    }

    changeLocation(data) {
        let loc = '';
        if(data['CloudletLocation'].latitude && data['CloudletLocation'].longitude){
            loc = 'latitude : '+data['CloudletLocation'].latitude+', longitude : '+data['CloudletLocation'].longitude
            data['CloudletLocation'] = loc
        }
        return data
    }


    render() {
        let { listData } = this.state;
        let keys = listData ? Object.keys(listData) : [];
        return (
            <ContainerDimensions>
                {({width, height}) =>
                    <div style={{width: width, height: height-90, display: 'flex', overflowY: 'auto', overflowX: 'hidden', marginTop:20}}>
                        <Table celled collapsing style={{width:'100%', height:'100%'}}>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell><div style={{display:'flex', justifyContent:'center'}}>Subject</div></Table.HeaderCell>
                                    <Table.HeaderCell><div style={{display:'flex', justifyContent:'center'}}>Value</div></Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
                                {
                                    (keys.length) && keys.map((item, i) => this.makeTable(this.changeLocation(listData), item, i))
                                }
                            </Table.Body>
                        </Table>
                    </div>
                }
            </ContainerDimensions>

        )
    }
}


