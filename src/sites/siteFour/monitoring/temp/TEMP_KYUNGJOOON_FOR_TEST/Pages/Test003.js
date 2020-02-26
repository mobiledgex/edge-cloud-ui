import 'react-hot-loader'
//import darkTheme from '@ant-design/dark-theme';
import {Button, DatePicker, Select} from "antd";
import * as React from 'react';
import {hot} from "react-hot-loader/root";

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


                    <Button type="warning">Primary</Button>
                    <Button type="danger">Primary</Button>

                    <div>sdlkf</div>
                    <div>sdlkf</div>
                    <div>sdlkf</div>
                    <Button type="danger">Primary</Button>
                    <Button type="danger">Primary</Button>





                </div>
            );
        };
    }
)

