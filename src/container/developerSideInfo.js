import React, { StyleSheet } from 'react';
import {
    Button,
    Checkbox,
    Grid,
    Header,
    Icon,
    Image,
    Menu,
    Segment,
    Sidebar, Label, Dropdown
} from 'semantic-ui-react';
import MaterialIcon from 'material-icons-react';
import CPUMEMUsage from '../container/usage/cupmemory';
import NetworkInOutSimple from '../components/network/networkInoutSimple';
import HighCharts from '../charts/highChart';
import BBLineChart from '../charts/bbLineChart';

let dataOptions = [ { key: 'af', value: 'af', text: 'Disk W/R' },{ key: 'af2', value: 'af2', text: 'Networ I/O' } ]
const VerticalSidebar = ({ animation, direction, visible, gotoNext }) => (
    <Sidebar
        as={Menu}
        animation={animation}
        direction={direction}
        icon='labeled'
        vertical
        visible={visible}
        className='main_sidebar'
    >
        <Grid style={{margin:10}}>
            <Grid.Row>
                <Header>
                    <Header.Content onClick={gotoNext}>
                        Barcelona MWC Deutsche Telecom
                        <MaterialIcon icon={'arrow_forward'} />
                    </Header.Content>
                </Header>
            </Grid.Row>
            {/* 이벤트 시스템 알럿 시스로그*/}
            <Grid.Row columns={4}>
                <Grid.Column>
                    <Label>
                        103
                        <Label.Detail>Event</Label.Detail>
                        <MaterialIcon icon={'chevron_right'} size={32} />
                    </Label>
                </Grid.Column>
                <Grid.Column>
                    <Label>
                        79
                        <Label.Detail>System</Label.Detail>
                        <MaterialIcon icon={'chevron_right'} size={32} />
                    </Label>
                </Grid.Column>
                <Grid.Column>
                    <Label>
                        72
                        <Label.Detail>Alert</Label.Detail>
                        <MaterialIcon icon={'chevron_right'} size={32} />
                    </Label>
                </Grid.Column>
                <Grid.Column>
                    <Label>
                        63
                        <Label.Detail>Syslog</Label.Detail>
                        <MaterialIcon icon={'chevron_right'} size={32} />
                    </Label>
                </Grid.Column>
            </Grid.Row>
            {/* hit count for second */}
            <Grid.Row columns={2}>
                <Grid.Column className='category'>
                    <div className='value'>0.0135</div>
                    <div className='unit'>per sec</div>
                    <div className='label'>Rate of RegisterClient API</div>
                </Grid.Column>
                <Grid.Column className='category'>
                    <div className='value'></div>
                    <div className='label'></div>
                </Grid.Column>
            </Grid.Row>

            <Grid.Row columns={2}>
                <Grid.Column className='category'>
                    <div className='value'>32,159</div>
                    <div className='label'>Current Connection</div>
                </Grid.Column>
                <Grid.Column className='category'>
                    <div className='value'>1.5267</div>
                    <div className='unit'>sec</div>
                    <div className='label'>Average Connection</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column className='category'>
                    <div className='value'>3.7356</div>
                    <div className='unit'>sec</div>
                    <div className='label'>Up Time</div>
                </Grid.Column>
                <Grid.Column  className='category'>
                    <div className='value'>2.0648</div>
                    <div className='unit'>sec</div>
                    <div className='label'>Down Time</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column className='category'>
                    <div className='value'>0.5378</div>
                    <div className='unit'>per sec</div>
                    <div className='label'>Rate of Find Cloudlet API</div>
                </Grid.Column>
                <Grid.Column className='category'>
                    <div className='value'>77</div>
                    <div className='label'>Total Number of Find Cloudlet API</div>
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column className='category'>
                    <div className='value'>1.2845</div>
                    <div className='unit'>per sec</div>
                    <div className='label'>Rate of Location Verify API</div>
                </Grid.Column>
                <Grid.Column className='category'>
                    <div className='value'>28,875</div>
                    <div className='label'>Total Number of Location Verify API</div>
                </Grid.Column>
            </Grid.Row>
            {/* cpu memory usage */}
            <Grid.Row columns={3}>
                <Grid.Column>
                    <CPUMEMUsage label="CPU" value={78}></CPUMEMUsage>
                </Grid.Column>
                <Grid.Column>
                    <CPUMEMUsage label="MEMORY" value={74}></CPUMEMUsage>
                </Grid.Column>
                <Grid.Column>
                    <CPUMEMUsage label="FILESYSTEM" value={82}></CPUMEMUsage>
                </Grid.Column>
            </Grid.Row>
            {/*Network I/O*/}
            <Grid.Row columns={1}>
                <Grid.Column width={8}>
                    <Dropdown placeholder='Network I/O' fluid search selection options={dataOptions} />
                </Grid.Column>
            </Grid.Row>
            <Grid.Row columns={2}>
                <Grid.Column width={5}>
                    <Grid.Row>
                        <NetworkInOutSimple type="in" colors={['#22cccc','#22cccc']} title="Network In" value="448.64" unit="MB">></NetworkInOutSimple>
                        <NetworkInOutSimple type="out" colors={['#6699ff','#6699ff']} title="Network Out" value="312.04" unit="MB">></NetworkInOutSimple>
                    </Grid.Row>
                </Grid.Column>
                <Grid.Column width={11}>
                    {/*<HighCharts chart="line" style={{height:'100%'}}/>*/}
                    <BBLineChart/>
                </Grid.Column>
            </Grid.Row>
        </Grid>
    </Sidebar>
)

let _self = null;
export default class DeveloperSideInfo extends React.Component {

    state = {
        animation: 'overlay',
        direction: 'right',
        dimmed: false,
        visible: false,
    }
    constructor() {
        super();
        _self = this;

    }

    componentWillReceiveProps(nextProps) {
        if(nextProps) {
            this.setState({visible:(nextProps.sideVisible) ? true : false});
        }
    }
    handleClickBtn() {
        console.log('handle click button', _self.props)
        _self.props.gotoNext();
    }


    render() {
        const { animation, dimmed, direction, visible } = this.state
        const vertical = direction === 'bottom' || direction === 'top'

        return (
            <div>
                <VerticalSidebar animation={animation} direction={direction} visible={visible} gotoNext={this.handleClickBtn} />
            </div>
        )
    }
}
