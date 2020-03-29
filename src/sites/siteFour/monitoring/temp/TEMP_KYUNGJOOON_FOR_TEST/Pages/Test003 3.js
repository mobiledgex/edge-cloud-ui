// @flow

import 'react-hot-loader'
//import darkTheme from '@ant-design/dark-theme';
import {Button, Select, Timeline, TimePicker, DatePicker} from "antd";
import * as React from 'react';
import {hot} from "react-hot-loader/root";
import {withRouter} from "react-router-dom";
import moment from "moment";

const {RangePicker} = DatePicker;

const {Option} = Select;

type Props = {};
type State = {};

export default hot(
    class Test003 extends React.Component<Props, State> {
        render() {
            return (
                <div style={{flex: 1, margin: 100}}>
                    <Button type="primary">Primary</Button>
                    <Button type="primary">Primary</Button>
                    <Button type="primary">Primary</Button>


                    <br/>
                    <Button type="waring">Primary</Button>
                    <br/>
                    <Button type="waring">Primary</Button>
                    <br/>
                    <Button type="waring">Primary</Button>
                    <br/>
                    <Button type="waring">Primary</Button>
                    <br/>
                    <Button type="waring">고경준 천재님이십니디ㅏsdflksdlkf</Button>

                    <br/>
                    <Button type="waring">고경준 천재님이십니디ㅏsdflksdlkf</Button>
                    <br/>
                    <Button type="waring">고경준 천재님이십니디ㅏsdflksdlkf</Button>
                    <br/>
                    <Button type="waring">고경준 천재님이십니디ㅏsdflksdlkf</Button>

                    <Button type="danger">고경준 천1212121lkf</Button><br/>
                    <Button type="danger">고경준 천1212121lkf</Button><br/>
                    <Button type="danger">고경준 천1212121lkf</Button><br/>

                    <Button type="waring">고경준 천1212121lkf</Button><br/>
                    <Button type="waring">고경준 천1212121lkf</Button><br/>
                    <Button type="waring">고경준 천1212121lkf</Button><br/>



                    <Button type="waring">고경준 천재님이십니디ㅏsdflksdlkf</Button><br/>
                    <Button type="waring">고경준 천재님이십니디ㅏsdflksdlkf</Button><br/>
                    <Button type="waring">고경준 천재님이십니디ㅏsdflksdlkf</Button><br/>

                    <Button type="waring">고경준 천재님이십니디ㅏsdflksdlkf</Button>


                    <Button type="waring">고경준 천재님이십니디ㅏsdflksdlkf</Button>
                    <Button type="waring">고경준 천재님이십니디ㅏsdflksdlkf</Button>


                    <Select defaultValue="lucy" style={{width: 120}} onChange={() => {
                        alert('sdlfksdlfk')
                    }}>
                        <Option value="jack">Jack</Option>
                        <Option value="lucy">Lucy</Option>
                        <Option value="disabled" disabled>
                            Disabled
                        </Option>
                        <Option value="Yiminghe">yiminghe</Option>
                    </Select>
                    <Select defaultValue="lucy" style={{width: 120}} disabled>
                        <Option value="lucy">Lucy</Option>
                    </Select>
                    <Button type="primary">Primary</Button>
                    <Button>Default</Button>
                    <Button type="dashed">Dashed</Button>
                    <Button type="danger">Danger</Button>
                    <Button type="link">Link</Button>
                    <br/>
                    <br/>
                    <br/>
                    <br/>
                    <Timeline>
                        <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                        <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                        <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                        <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item>
                    </Timeline>,
                    <div>
                        <TimePicker use12Hours onChange={() => {
                            alert('sdlfk')
                        }}/>
                        <TimePicker use12Hours format="h:mm:ss A" onChange={() => {
                            alert('sdlfk')
                        }}/>
                        <TimePicker use12Hours format="h:mm a" onChange={() => {
                            alert('sdlfk')
                        }}/>
                    </div>,
                    <RangePicker
                        ranges={{
                            Today: [moment(), moment()],
                            'This Month': [moment().startOf('month'), moment().endOf('month')],
                        }}
                        showTime
                        format="YYYY/MM/DD HH:mm:ss"
                        onChange={() => {
                            //alert('sdlfk')
                        }}
                    />
                </div>
            );
        };
    }
)

