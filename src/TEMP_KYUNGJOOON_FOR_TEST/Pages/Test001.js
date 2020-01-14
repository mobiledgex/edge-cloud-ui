import * as React from 'react';
import {CircularProgress} from "@material-ui/core";
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import {Button} from "antd";
import {Dropdown} from "semantic-ui-react";
import {REGIONS_OPTIONS} from "../../shared/Constants";
import {Styles} from "../../sites/siteFour/monitoring/PageMonitoringService";

type Props = {};
type State = {
    loading: boolean,
    results: any,
};

export class Test001 extends React.Component<Props, State> {

    state = {
        loading: false,
        results: [],
        index: 0,
    }

    async componentDidMount(): void {
    }


    render() {
        return (
            <div style={{color: 'white'}}>


                <Button title={'slkdfsldkflks'} value={'00001'} onClick={() => {
                    this.setState({
                        index: 0,
                    })
                }}>
                    recve byte
                </Button>
                <Button title={'slkdfsldkflks'} value={'00001'} onClick={() => {
                    this.setState({
                        index: 1,
                    })
                }}>
                    send byte
                </Button>

                <Dropdown
                    placeholder='REGION'
                    selection
                    options={[
                        {
                            text: 'RECV', value: 0,
                        },
                        {
                            text: 'SEND', value: 1,
                        },

                    ]}
                    defaultValue={0}
                    onChange={async (e, {value}) => {

                        this.setState({
                            index: value,
                        })

                    }}
                    value={this.state.currentRegion}
                    style={Styles.dropDown}
                />

                <Tabs selectedIndex={this.state.index}>
                    {/* <TabList>
                        <Tab>Title 1</Tab>
                        <Tab>Title 2</Tab>
                    </TabList>*/}

                    <TabPanel style={{color: 'white'}}>
                        <h2 style={{color: 'white'}}>Any adsfsdfasdfasdfasdf 1</h2>
                    </TabPanel>
                    <TabPanel style={{color: 'white'}}>
                        <h2 style={{color: 'white'}}>Any adsfsdfasdfasdfasdf 2</h2>
                    </TabPanel>
                </Tabs>

            </div>
        );
    };
};
